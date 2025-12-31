"use client";

import { useState, useRef } from "react";
import { ArrowUp, X, ImageIcon, Copy, Check } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useTheme } from "@/components/theme-context";

export default function ImageAnalyzer() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{type: string; content: string; image?: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setMessages([]);
    setAnalyzed(false);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setPreview(imageData);
        analyzeImage(selectedFile, imageData);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }

  function removeImage() {
    setFile(null);
    setPreview(null);
    setMessages([]);
    setAnalyzed(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  }

  async function analyzeImage(selectedFile: File, imageData: string) {
    setIsLoading(true);
    setMessages([{ type: "image", content: "", image: imageData }]);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("prompt", "Describe this image in detail.");

      const response = await fetch("/api/image-analyzer", { method: "POST", body: formData });
      const data = await response.json();

      if (data.error) {
        setMessages(prev => [...prev, { type: "error", content: data.error }]);
      } else {
        setMessages(prev => [...prev, { type: "analysis", content: data.result }]);
        setAnalyzed(true);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { type: "error", content: "Failed to analyze image: " + err.message }]);
    } finally {
      setIsLoading(false);
    }
  }

  async function askQuestion() {
    if (!file || !question.trim() || isLoading) return;

    const userQuestion = question;
    setQuestion("");
    setMessages(prev => [...prev, { type: "question", content: userQuestion }]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("prompt", userQuestion);

      const response = await fetch("/api/image-analyzer", { method: "POST", body: formData });
      const data = await response.json();

      if (data.error) {
        setMessages(prev => [...prev, { type: "error", content: data.error }]);
      } else {
        setMessages(prev => [...prev, { type: "answer", content: data.result }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { type: "error", content: "Failed to get answer." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={`min-h-screen flex flex-col overflow-x-hidden transition-colors duration-300 ${
      isLight ? "bg-gradient-to-b from-[#e8dfd4] via-[#f5f0e8] to-[#fef3e2]" : "bg-[#0a0e1a]"
    }`}>
      <Navbar />
      <div className="flex-1 pt-20 pb-4 px-4 flex flex-col max-w-4xl mx-auto w-full overflow-x-hidden">
        {messages.length === 0 && !isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className={`text-3xl md:text-4xl font-semibold mb-4 text-center ${isLight ? "text-gray-900" : "text-white"}`}>Upload an image to analyze</h1>
            <p className={`text-center ${isLight ? "text-gray-600" : "text-gray-400"}`}>I'll describe what I see in detail</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.type === "image" && msg.image && (
                  <div className="flex justify-end mb-4">
                    <div className="relative">
                      <img src={msg.image} alt="Uploaded" className="max-h-48 rounded-xl" />
                      <button onClick={removeImage} className="absolute -top-2 -right-2 bg-gray-700 rounded-full p-1 hover:bg-gray-600">
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                )}
                
                {msg.type === "question" && (
                  <div className="flex justify-end">
                    <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                      isLight ? "bg-orange-100 text-gray-900" : "bg-[#2a3548] text-white"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                )}
                
                {(msg.type === "analysis" || msg.type === "answer") && (
                  <div className="flex justify-start">
                    <div className={`rounded-2xl p-5 max-w-full w-full border ${
                      isLight ? "bg-white border-gray-200" : "bg-[#0f1629] border-[#1e293b]"
                    }`}>
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => copyToClipboard(msg.content)}
                          className={`p-1 transition ${isLight ? "text-gray-400 hover:text-gray-900" : "text-gray-400 hover:text-white"}`}
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className={`whitespace-pre-wrap leading-relaxed prose max-w-none ${
                        isLight ? "text-gray-700 prose-gray" : "text-gray-300 prose-invert"
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                )}
                
                {msg.type === "error" && (
                  <div className="bg-red-900/30 border border-red-500 rounded-2xl p-4">
                    <p className="text-red-300">{msg.content}</p>
                  </div>
                )}
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
          <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
          <div className={`rounded-2xl sm:rounded-full px-3 sm:px-4 py-2 border transition-colors duration-300 ${
            isLight ? "bg-white border-gray-200" : "bg-[#0f1629] border-[#1e293b]"
          }`}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full transition text-xs sm:text-sm ${
                  isLight ? "bg-gray-100 hover:bg-gray-200" : "bg-[#1a2744] hover:bg-[#243352]"
                }`}
              >
                <ImageIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${isLight ? "text-gray-500" : "text-gray-400"}`} />
                <span className={`${isLight ? "text-gray-700" : "text-gray-300"}`}>{file ? "Change" : "Upload"}</span>
              </button>

              <input
                className={`flex-1 min-w-0 bg-transparent py-2 px-1 sm:px-2 outline-none text-sm sm:text-base ${
                  isLight ? "text-gray-900 placeholder-gray-400" : "text-white placeholder-gray-500"
                }`}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={analyzed ? "Ask about this image..." : "Upload an image first..."}
                disabled={isLoading || !analyzed}
              />

              <button
                onClick={askQuestion}
                disabled={isLoading || !analyzed || !question.trim()}
                className={`p-1.5 sm:p-2 rounded-full transition flex-shrink-0 ${
                  analyzed && question.trim() 
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
