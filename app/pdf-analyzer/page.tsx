"use client";

import { useState, useRef } from "react";
import { ArrowUp, X, FileText, Copy, Check } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function PDFAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{type: string; content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setMessages([]);
    setAnalyzed(false);
    
    if (selectedFile) {
      analyzeFile(selectedFile);
    }
  }

  function removeFile() {
    setFile(null);
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

  async function analyzeFile(selectedFile: File) {
    setIsLoading(true);
    setMessages([{ type: "file", content: selectedFile.name }]);

    try {
      const formData = new FormData();
      formData.append("pdf", selectedFile);

      const response = await fetch("/api/pdf-analyzer", { method: "POST", body: formData });
      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { type: "error", content: data.error }]);
      } else {
        setMessages(prev => [...prev, { type: "analysis", content: data.result }]);
        setAnalyzed(true);
      }
    } catch (error) {
      setMessages(prev => [...prev, { type: "error", content: "Failed to analyze PDF. Please try again." }]);
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
      formData.append("pdf", file);
      formData.append("question", userQuestion);

      const response = await fetch("/api/pdf-analyzer", { method: "POST", body: formData });
      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { type: "error", content: data.error }]);
      } else {
        setMessages(prev => [...prev, { type: "answer", content: data.result }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { type: "error", content: "Failed to get answer. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0e1a] flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20 pb-4 px-4 flex flex-col max-w-4xl mx-auto w-full">
        {messages.length === 0 && !isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4 text-center">Upload a PDF to analyze</h1>
            <p className="text-gray-400 text-center">I'll read and summarize the key content for you</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.type === "file" && (
                  <div className="flex justify-end mb-4">
                    <div className="flex items-center gap-2 bg-[#2a3548] px-4 py-2 rounded-xl">
                      <FileText className="w-5 h-5 text-orange-500" />
                      <span className="text-sm text-white">{msg.content}</span>
                      <button onClick={removeFile} className="ml-2 hover:bg-gray-600 rounded-full p-1">
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                )}
                
                {msg.type === "question" && (
                  <div className="flex justify-end">
                    <div className="bg-[#2a3548] text-white px-4 py-2 rounded-2xl max-w-[80%]">
                      {msg.content}
                    </div>
                  </div>
                )}
                
                {(msg.type === "analysis" || msg.type === "answer") && (
                  <div className="flex justify-start">
                    <div className="bg-[#0f1629] border border-[#1e293b] rounded-2xl p-5 max-w-full w-full">
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => copyToClipboard(msg.content)}
                          className="text-gray-400 hover:text-white transition p-1"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
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
          <input type="file" ref={fileInputRef} accept=".pdf" onChange={handleFileChange} className="hidden" />
          <div className="bg-[#0f1629] border border-[#1e293b] rounded-full px-4 py-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1a2744] rounded-full hover:bg-[#243352] transition text-sm"
              >
                <FileText className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300 text-sm">{file ? "Change" : "Upload"}</span>
              </button>
              
              <input
                className="flex-1 bg-transparent py-2 px-2 outline-none text-white placeholder-gray-500"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={analyzed ? "Ask about this PDF..." : "Upload a PDF first..."}
                disabled={isLoading || !analyzed}
              />
              
              <button
                onClick={askQuestion}
                disabled={isLoading || !analyzed || !question.trim()}
                className={`p-2 rounded-full transition ${
                  analyzed && question.trim() ? "bg-[#5865F2] text-white hover:bg-[#4752c4]" : "bg-[#1a2744] text-gray-600"
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
