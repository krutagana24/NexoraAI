"use client";

import { useState, useEffect } from "react";
import { ArrowUp, Copy, Check } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useTheme } from "@/components/theme-context";

export default function BlogWriter() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("nexora_current_user");
    if (user) {
      const parsed = JSON.parse(user);
      const id = parsed.id || parsed._id || parsed.email;
      setUserId(id);
    }
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateBlog();
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

  const generateBlog = async () => {
    if (!topic.trim() || loading) return;
    
    const user = localStorage.getItem("nexora_current_user");
    const currentUserId = user ? (JSON.parse(user).id || JSON.parse(user)._id || JSON.parse(user).email) : null;
    
    const userMessage = { role: "user", content: topic };
    setMessages(prev => [...prev, userMessage]);
    const currentTopic = topic;
    setTopic("");
    setLoading(true);

    const response = await fetch("/api/blog-writer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: currentTopic }),
    });

    const data = await response.json();
    const aiMessage = { role: "assistant", content: data.result };
    setMessages(prev => [...prev, aiMessage]);
    
    if (currentUserId && data.result) {
      try {
        await fetch("/api/history/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId, title: currentTopic, content: data.result }),
        });
      } catch (error) {
        console.error("Failed to save blog:", error);
      }
    }
    setLoading(false);
  };

  return (
    <main className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isLight ? "bg-gradient-to-b from-[#e8dfd4] via-[#f5f0e8] to-[#fef3e2]" : "bg-[#0a0e1a]"
    }`}>
      <Navbar />
      <div className="flex-1 pt-20 pb-4 px-4 flex flex-col max-w-4xl mx-auto w-full">
        
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className={`text-3xl md:text-4xl font-semibold mb-4 text-center ${isLight ? "text-gray-900" : "text-white"}`}>What blog do you want to write?</h1>
            <p className={`text-center ${isLight ? "text-gray-600" : "text-gray-400"}`}>Enter a topic and I'll generate a blog post for you</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "user" ? (
                  <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                    isLight ? "bg-orange-100 text-gray-900" : "bg-[#2a3548] text-white"
                  }`}>
                    {msg.content}
                  </div>
                ) : (
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
                    <p className={`whitespace-pre-wrap leading-relaxed ${isLight ? "text-gray-700" : "text-gray-300"}`}>{msg.content}</p>
                  </div>
                )}
              </div>
            ))}
            {loading && (
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
          <div className={`rounded-2xl sm:rounded-full px-3 sm:px-4 py-2 border transition-colors duration-300 ${
            isLight ? "bg-white border-gray-200" : "bg-[#0f1629] border-[#1e293b]"
          }`}>
            <div className="flex items-center gap-2">
              <input
                className={`flex-1 min-w-0 bg-transparent py-2 px-1 sm:px-2 outline-none text-sm sm:text-base ${
                  isLight ? "text-gray-900 placeholder-gray-400" : "text-white placeholder-gray-500"
                }`}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter a topic for your blog..."
                disabled={loading}
              />
              <button
                onClick={generateBlog}
                disabled={loading || !topic.trim()}
                className={`p-1.5 sm:p-2 rounded-full transition flex-shrink-0 ${
                  topic.trim() 
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
