"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, ChevronDown, Copy, Check } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function CodeAssistant() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [task, setTask] = useState("generate");
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const taskRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const tasks = [
    { value: "generate", label: "Generate" },
    { value: "debug", label: "Debug" },
    { value: "explain", label: "Explain" },
    { value: "optimize", label: "Optimize" },
  ];

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "typescript", label: "TypeScript" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (taskRef.current && !taskRef.current.contains(e.target as Node)) setTaskOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  async function handleSubmit() {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: `[${tasks.find(t => t.value === task)?.label} - ${languages.find(l => l.value === language)?.label}] ${input}` };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/code-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: currentInput, language, task }),
      });
      const data = await response.json();
      const aiMessage = { role: "assistant", content: data.error ? `Error: ${data.error}` : data.result };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Failed to process request. Please try again." }]);
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
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4 text-center">What code do you need help with?</h1>
            <p className="text-gray-400 text-center">Generate, debug, explain, or optimize code</p>
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
                    <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed font-mono text-sm">{msg.content}</pre>
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
              {/* Task Dropdown */}
              <div ref={taskRef} className="relative">
                <button
                  onClick={() => { setTaskOpen(!taskOpen); setLangOpen(false); }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#1a2744] rounded-full text-sm hover:bg-[#243352] text-white"
                >
                  {tasks.find(t => t.value === task)?.label}
                  <ChevronDown className={`w-4 h-4 transition ${taskOpen ? "rotate-180" : ""}`} />
                </button>
                {taskOpen && (
                  <div className="absolute bottom-full left-0 mb-2 bg-[#0f1629] border border-[#1e293b] rounded-xl py-1 min-w-[120px] shadow-xl">
                    {tasks.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => { setTask(t.value); setTaskOpen(false); }}
                        className={`w-full text-left px-4 py-2 hover:bg-[#1a2744] ${task === t.value ? "text-[#38bdf8]" : "text-white"}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Dropdown */}
              <div ref={langRef} className="relative">
                <button
                  onClick={() => { setLangOpen(!langOpen); setTaskOpen(false); }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#1a2744] rounded-full text-sm hover:bg-[#243352] text-white"
                >
                  {languages.find(l => l.value === language)?.label}
                  <ChevronDown className={`w-4 h-4 transition ${langOpen ? "rotate-180" : ""}`} />
                </button>
                {langOpen && (
                  <div className="absolute bottom-full left-0 mb-2 bg-[#0f1629] border border-[#1e293b] rounded-xl py-1 min-w-[130px] shadow-xl">
                    {languages.map((l) => (
                      <button
                        key={l.value}
                        onClick={() => { setLanguage(l.value); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2 hover:bg-[#1a2744] ${language === l.value ? "text-[#38bdf8]" : "text-white"}`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <input
                className="flex-1 bg-transparent py-2 px-2 outline-none text-white placeholder-gray-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={task === "generate" ? "Describe what code you want..." : "Paste your code or describe the issue..."}
                disabled={isLoading}
              />
              
              <button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className={`p-2 rounded-full transition ${
                  input.trim() ? "bg-[#5865F2] text-white hover:bg-[#4752c4]" : "bg-[#1a2744] text-gray-600"
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
