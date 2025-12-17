"use client";

import { useState } from "react";
import { ArrowUp, Copy, Check } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function TextSummarizer() {
  const [text, setText] = useState("");
  const [length, setLength] = useState("medium");
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSummarize();
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  async function handleSummarize() {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    const currentText = text;
    setText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/text-summarizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentText, length }),
      });
      const data = await response.json();
      const aiMessage = { role: "assistant", content: data.error ? `Error: ${data.error}` : data.result };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Failed to summarize. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0e1a] flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20 pb-4 px-4 flex flex-col max-w-4xl mx-auto w-full">
        
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4 text-center">What text do you want to summarize?</h1>
            <p className="text-gray-400 text-center">Paste your text and I'll create a summary for you</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "user" ? (
                  <div className="bg-[#2a3548] text-white px-4 py-2 rounded-2xl max-w-[80%]">
                    <p className="line-clamp-3">{msg.content}</p>
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
          <div className="bg-[#0f1629] border border-[#1e293b] rounded-full px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {["short", "medium", "long"].map((len) => (
                  <button
                    key={len}
                    onClick={() => setLength(len)}
                    className={`px-3 py-1.5 rounded-full text-sm transition capitalize ${
                      length === len ? "bg-[#5865F2] text-white" : "bg-[#1a2744] text-gray-400 hover:bg-[#243352]"
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
              
              <input
                className="flex-1 bg-transparent py-2 px-2 outline-none text-white placeholder-gray-500"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste your text here..."
                disabled={isLoading}
              />
              
              <button
                onClick={handleSummarize}
                disabled={isLoading || !text.trim()}
                className={`p-2 rounded-full transition ${
                  text.trim() ? "bg-[#5865F2] text-white hover:bg-[#4752c4]" : "bg-[#1a2744] text-gray-600"
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
