"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ArrowUp, Plus, X, Copy, Check } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useTheme } from "@/components/theme-context";

export default function AIChat() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const user = localStorage.getItem("nexora_current_user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserId(parsed.id || parsed.email);
    }
  }, []);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function removeImage() {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for mobile/non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  async function sendMessage() {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    setIsLoading(true);
    const userMessage = input;
    const userImage = imagePreview;
    setInput("");

    const conversationHistory = messages.flatMap((msg) => [
      { role: "user", content: msg.user },
      { role: "assistant", content: msg.bot },
    ]);

    try {
      let endpoint = webSearchEnabled ? "/api/web-search" : "/api/ai-chat";
      let response;

      if (selectedImage && !webSearchEnabled) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("prompt", userMessage || "Describe this image in detail.");
        
        response = await fetch("/api/image-analyzer", {
          method: "POST",
          body: formData,
        });
        removeImage();
      } else {
        response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: userMessage, messages: conversationHistory }),
        });
      }

      const data = await response.json();
      const botResponse = data.error ? `Error: ${data.error}` : data.result;
      setMessages((prev) => [
        ...prev,
        { user: userMessage, bot: botResponse, sources: data.sources || [], isWebSearch: webSearchEnabled, image: userImage },
      ]);
      // Save to database
      const user = localStorage.getItem("nexora_current_user");
      const currentUserId = user ? (JSON.parse(user).id || JSON.parse(user)._id || JSON.parse(user).email) : null;
      if (currentUserId && botResponse) {
        try {
          await fetch("/api/history/chats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: currentUserId, message: userMessage, role: "user" }),
          });
          await fetch("/api/history/chats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: currentUserId, message: botResponse, role: "assistant" }),
          });
        } catch (err) {
          console.error("Failed to save chat:", err);
        }
      }
    } catch (error) {
      const errorMsg = "Failed to get response. Please try again.";
      setMessages((prev) => [
        ...prev,
        { user: userMessage, bot: errorMsg, sources: [], isWebSearch: webSearchEnabled, image: userImage },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <main className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isLight ? "bg-gradient-to-b from-[#e8dfd4] via-[#f5f0e8] to-[#fef3e2]" : "bg-[#0a0e1a]"
    }`}>
      <Navbar />
      <div className="flex-1 pt-20 pb-4 px-4 flex flex-col max-w-4xl mx-auto w-full">
        {!hasMessages ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className={`text-3xl md:text-4xl font-semibold mb-4 text-center ${isLight ? "text-gray-900" : "text-white"}`}>What can I help with?</h1>
            <p className={`text-center ${isLight ? "text-gray-600" : "text-gray-400"}`}>Ask me anything or enable web search for real-time info</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-end">
                  <div className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                    isLight ? "bg-orange-100" : "bg-[#2a3548]"
                  }`}>
                    {msg.image && <img src={msg.image} alt="Uploaded" className="max-w-[200px] rounded-lg mb-2" />}
                    <p className={isLight ? "text-gray-900" : "text-white"}>{msg.user}</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className={`px-5 py-4 rounded-2xl max-w-full w-full border ${
                    isLight ? "bg-white border-gray-200" : "bg-[#0f1629] border-[#1e293b]"
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      {msg.isWebSearch && (
                        <span className={`inline-flex items-center gap-1 text-xs ${isLight ? "text-orange-500" : "text-blue-400"}`}>
                          <Globe className="w-3 h-3" /> Searched the web
                        </span>
                      )}
                      <button
                        onClick={() => copyToClipboard(msg.bot)}
                        className={`p-1 ml-auto transition ${isLight ? "text-gray-400 hover:text-gray-900" : "text-gray-400 hover:text-white"}`}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className={`whitespace-pre-wrap leading-relaxed ${isLight ? "text-gray-700" : "text-gray-300"}`}>{msg.bot}</p>
                    {msg.sources?.length > 0 && (
                      <div className={`mt-3 pt-3 border-t ${isLight ? "border-gray-200" : "border-[#2a3548]"}`}>
                        <p className={`text-xs mb-2 ${isLight ? "text-gray-500" : "text-gray-500"}`}>Sources:</p>
                        {msg.sources.map((source: any, idx: number) => (
                          <a key={idx} href={source.url} target="_blank" rel="noopener noreferrer" className={`text-xs hover:underline block ${isLight ? "text-orange-500" : "text-blue-400"}`}>
                            {source.title || source.url}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`rounded-2xl p-5 border ${
                  isLight ? "bg-white border-gray-200" : "bg-[#0f1629] border-[#1e293b]"
                }`}>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="w-full">
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img src={imagePreview} alt="Preview" className="h-16 sm:h-20 rounded-lg" />
              <button onClick={removeImage} className="absolute -top-2 -right-2 bg-gray-700 rounded-full p-1 hover:bg-gray-600">
                <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </button>
            </div>
          )}
          
          <div className={`rounded-2xl sm:rounded-full px-3 sm:px-4 py-2 border transition-colors duration-300 ${
            isLight ? "bg-white border-gray-200" : "bg-[#0f1629] border-[#1e293b]"
          }`}>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <button
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm transition ${
                  webSearchEnabled 
                    ? isLight ? "bg-orange-500 text-white" : "bg-[#5865F2] text-white" 
                    : isLight ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "bg-[#1a2744] text-gray-400 hover:bg-[#243352]"
                }`}
              >
                <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
              
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageSelect} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className={`p-1.5 sm:p-2 rounded-full transition ${
                isLight ? "hover:bg-gray-100" : "hover:bg-[#1a2744]"
              }`} title="Add image">
                <Plus className={`w-4 h-4 sm:w-5 sm:h-5 ${isLight ? "text-gray-500" : "text-gray-400"}`} />
              </button>
              
              <input
                className={`flex-1 min-w-0 bg-transparent py-2 px-1 sm:px-2 outline-none text-sm sm:text-base ${
                  isLight ? "text-gray-900 placeholder-gray-400" : "text-white placeholder-gray-500"
                }`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={webSearchEnabled ? "Search the web..." : "Message NexoraAI..."}
                disabled={isLoading}
              />
              
              <button
                onClick={sendMessage}
                disabled={isLoading || (!input.trim() && !selectedImage)}
                className={`p-1.5 sm:p-2 rounded-full transition flex-shrink-0 ${
                  input.trim() || selectedImage 
                    ? isLight ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-[#5865F2] text-white hover:bg-[#4752c4]" 
                    : isLight ? "bg-gray-100 text-gray-400" : "bg-[#1a2744] text-gray-600"
                } disabled:cursor-not-allowed`}
              >
                <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
