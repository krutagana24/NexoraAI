"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, ChevronDown, Copy, Check } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useTheme } from "@/components/theme-context";

export default function CodeAssistant() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [task, setTask] = useState("generate");
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const taskRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = localStorage.getItem("nexora_current_user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserId(parsed.id || parsed._id || parsed.email);
    }
  }, []);

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
      const codeResult = data.error ? `Error: ${data.error}` : data.result;
      const aiMessage = { role: "assistant", content: codeResult };
      setMessages(prev => [...prev, aiMessage]);
      if (!data.error) {
        const user = localStorage.getItem("nexora_current_user");
        const currentUserId = user ? (JSON.parse(user).id || JSON.parse(user)._id || JSON.parse(user).email) : null;
        if (currentUserId) {
          try {
            await fetch("/api/history/codes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: currentUserId, prompt: currentInput, code: codeResult, language }),
            });
          } catch (err) {
            console.error("Failed to save code:", err);
          }
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Failed to process request. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isLight ? "bg-gradient-to-b from-[#e8dfd4] via-[#f5f0e8] to-[#fef3e2]" : "bg-[#0a0e1a]"
    }`}>
      <Navbar />
      <div className="flex-1 pt-20 pb-4 px-4 flex flex-col max-w-4xl mx-auto w-full">
        
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className={`text-3xl md:text-4xl font-semibold mb-4 text-center ${isLight ? "text-gray-900" : "text-white"}`}>What code do you need help with?</h1>
            <p className={`text-center ${isLight ? "text-gray-600" : "text-gray-400"}`}>Generate, debug, explain, or optimize code</p>
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
                    <pre className={`whitespace-pre-wrap leading-relaxed font-mono text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>{msg.content}</pre>
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
          <div className={`rounded-2xl sm:rounded-full px-3 sm:px-4 py-2 border transition-colors duration-300 ${
            isLight ? "bg-white border-gray-200" : "bg-[#0f1629] border-[#1e293b]"
          }`}>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              {/* Task Dropdown */}
              <div ref={taskRef} className="relative">
                <button
                  onClick={() => { setTaskOpen(!taskOpen); setLangOpen(false); }}
                  className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm ${
                    isLight 
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-900" 
                      : "bg-[#1a2744] hover:bg-[#243352] text-white"
                  }`}
                >
                  {tasks.find(t => t.value === task)?.label}
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition ${taskOpen ? "rotate-180" : ""}`} />
                </button>
                {taskOpen && (
                  <div className={`absolute bottom-full left-0 mb-2 rounded-xl py-1 min-w-[100px] sm:min-w-[120px] shadow-xl border z-10 ${
                    isLight ? "bg-white border-gray-200" : "bg-[#0f1629] border-[#1e293b]"
                  }`}>
                    {tasks.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => { setTask(t.value); setTaskOpen(false); }}
                        className={`w-full text-left px-3 sm:px-4 py-2 text-sm ${
                          isLight ? "hover:bg-gray-100" : "hover:bg-[#1a2744]"
                        } ${task === t.value 
                          ? isLight ? "text-orange-500" : "text-[#38bdf8]" 
                          : isLight ? "text-gray-900" : "text-white"
                        }`}
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
                  className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm ${
                    isLight 
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-900" 
                      : "bg-[#1a2744] hover:bg-[#243352] text-white"
                  }`}
                >
                  <span className="hidden sm:inline">{languages.find(l => l.value === language)?.label}</span>
                  <span className="sm:hidden">{languages.find(l => l.value === language)?.label.slice(0, 4)}</span>
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition ${langOpen ? "rotate-180" : ""}`} />
                </button>
                {langOpen && (
                  <div className={`absolute bottom-full left-0 mb-2 rounded-xl py-1 min-w-[110px] sm:min-w-[130px] shadow-xl border z-10 ${
                    isLight ? "bg-white border-gray-200" : "bg-[#0f1629] border-[#1e293b]"
                  }`}>
                    {languages.map((l) => (
                      <button
                        key={l.value}
                        onClick={() => { setLanguage(l.value); setLangOpen(false); }}
                        className={`w-full text-left px-3 sm:px-4 py-2 text-sm ${
                          isLight ? "hover:bg-gray-100" : "hover:bg-[#1a2744]"
                        } ${language === l.value 
                          ? isLight ? "text-orange-500" : "text-[#38bdf8]" 
                          : isLight ? "text-gray-900" : "text-white"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <input
                className={`flex-1 min-w-0 bg-transparent py-2 px-2 outline-none text-sm sm:text-base ${
                  isLight ? "text-gray-900 placeholder-gray-400" : "text-white placeholder-gray-500"
                }`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={task === "generate" ? "Describe what code you want..." : "Paste your code or describe the issue..."}
                disabled={isLoading}
              />
              
              <button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className={`p-2 rounded-full transition flex-shrink-0 ${
                  input.trim() 
                    ? isLight ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-[#5865F2] text-white hover:bg-[#4752c4]" 
                    : isLight ? "bg-gray-100 text-gray-400" : "bg-[#1a2744] text-gray-600"
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
