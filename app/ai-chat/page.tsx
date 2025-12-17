"use client";

import { useState, useRef } from "react";
import { Globe, ArrowUp, Plus, X, Copy, Check } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function AIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      setMessages((prev) => [
        ...prev,
        { user: userMessage, bot: data.error ? `Error: ${data.error}` : data.result, sources: data.sources || [], isWebSearch: webSearchEnabled, image: userImage },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { user: userMessage, bot: "Failed to get response. Please try again.", sources: [], isWebSearch: webSearchEnabled, image: userImage },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <main className="min-h-screen bg-[#0a0e1a] flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20 pb-4 px-4 flex flex-col max-w-4xl mx-auto w-full">
        {!hasMessages ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4 text-center">What can I help with?</h1>
            <p className="text-gray-400 text-center">Ask me anything or enable web search for real-time info</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-[#2a3548] px-4 py-3 rounded-2xl max-w-[80%]">
                    {msg.image && <img src={msg.image} alt="Uploaded" className="max-w-[200px] rounded-lg mb-2" />}
                    <p className="text-white">{msg.user}</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-[#0f1629] border border-[#1e293b] px-5 py-4 rounded-2xl max-w-full w-full">
                    <div className="flex justify-between items-start mb-2">
                      {msg.isWebSearch && (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-400">
                          <Globe className="w-3 h-3" /> Searched the web
                        </span>
                      )}
                      <button
                        onClick={() => copyToClipboard(msg.bot)}
                        className="text-gray-400 hover:text-white transition p-1 ml-auto"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">{msg.bot}</p>
                    {msg.sources?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#2a3548]">
                        <p className="text-xs text-gray-500 mb-2">Sources:</p>
                        {msg.sources.map((source: any, idx: number) => (
                          <a key={idx} href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline block">
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
                <div className="bg-[#0f1629] border border-[#1e293b] rounded-2xl p-5">
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
              <img src={imagePreview} alt="Preview" className="h-20 rounded-lg" />
              <button onClick={removeImage} className="absolute -top-2 -right-2 bg-gray-700 rounded-full p-1 hover:bg-gray-600">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
          
          <div className="bg-[#0f1629] border border-[#1e293b] rounded-full px-4 py-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition ${
                  webSearchEnabled ? "bg-[#5865F2] text-white" : "bg-[#1a2744] text-gray-400 hover:bg-[#243352]"
                }`}
              >
                <Globe className="w-4 h-4" />
                Search
              </button>
              
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageSelect} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full hover:bg-[#1a2744] transition" title="Add image">
                <Plus className="w-5 h-5 text-gray-400" />
              </button>
              
              <input
                className="flex-1 bg-transparent py-2 px-2 outline-none text-white placeholder-gray-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={webSearchEnabled ? "Search the web..." : "Message NexoraAI..."}
                disabled={isLoading}
              />
              
              <button
                onClick={sendMessage}
                disabled={isLoading || (!input.trim() && !selectedImage)}
                className={`p-2 rounded-full transition ${
                  input.trim() || selectedImage ? "bg-[#5865F2] text-white hover:bg-[#4752c4]" : "bg-[#1a2744] text-gray-600"
                } disabled:cursor-not-allowed`}
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
