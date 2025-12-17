"use client";

import { useState } from "react";
import { ArrowUp, Copy, Check } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function BlogWriter() {
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateBlog();
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateBlog = async () => {
    if (!topic.trim() || loading) return;
    
    const userMessage = { role: "user", content: topic };
    setMessages(prev => [...prev, userMessage]);
    setTopic("");
    setLoading(true);

    const response = await fetch("/api/blog-writer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    const data = await response.json();
    const aiMessage = { role: "assistant", content: data.result };
    setMessages(prev => [...prev, aiMessage]);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0a0e1a] flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20 pb-4 px-4 flex flex-col max-w-4xl mx-auto w-full">
        
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4 text-center">What blog do you want to write?</h1>
            <p className="text-gray-400 text-center">Enter a topic and I'll generate a blog post for you</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "user" ? (
                  <div className="bg-[#2a3548] text-white px-4 py-2 rounded-2xl max-w-[80%]">
                    {msg.content}
                  </div>
                ) : (
                  <div className="bg-[#0f1629] border border-[#1e293b] rounded-2xl p-5 max-w-full w-full">
                    <div className="flex justify-end mb-2">
                      <button
                        onClick={() => copyToClipboard(msg.content)}
                        className="text-gray-400 hover:text-white transition p-1"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">{msg.content}</p>
                  </div>
                )}
              </div>
            ))}
            {loading && (
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
          <div className="bg-[#0f1629] border border-[#1e293b] rounded-full px-4 py-2">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 bg-transparent py-2 px-2 outline-none text-white placeholder-gray-500"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter a topic for your blog..."
                disabled={loading}
              />
              <button
                onClick={generateBlog}
                disabled={loading || !topic.trim()}
                className={`p-2 rounded-full transition ${
                  topic.trim() ? "bg-[#5865F2] text-white hover:bg-[#4752c4]" : "bg-[#1a2744] text-gray-600"
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
