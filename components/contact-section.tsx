"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { useTheme } from "./theme-context";

export default function ContactSection() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <section id="contact" className="py-16 sm:py-20 px-4 sm:px-6 scroll-mt-20">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className={`text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>Contact Us</h2>
        <p className={`mb-6 sm:mb-8 text-sm sm:text-base ${isLight ? "text-gray-600" : "text-gray-400"}`}>Have questions or feedback? We'd love to hear from you.</p>

        {sent ? (
          <div className="bg-green-900/30 border border-green-500 p-3 sm:p-4 rounded-2xl sm:rounded-full text-green-300 text-sm sm:text-base">
            Message sent! We'll get back to you soon.
          </div>
        ) : (
          <div className={`rounded-2xl sm:rounded-full px-3 sm:px-4 py-2 border transition-colors duration-300 ${
            isLight ? "bg-white border-gray-200" : "bg-[#0f1629] border-[#1e293b]"
          }`}>
            <div className="flex items-center gap-2">
              <input
                className={`flex-1 min-w-0 bg-transparent py-2 px-1 sm:px-2 outline-none text-sm sm:text-base ${
                  isLight ? "text-gray-900 placeholder-gray-400" : "text-white placeholder-gray-500"
                }`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Your message..."
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className={`p-1.5 sm:p-2 rounded-full transition flex-shrink-0 ${
                  message.trim() 
                    ? isLight 
                      ? "bg-orange-500 text-white hover:bg-orange-600" 
                      : "bg-[#5865F2] text-white hover:bg-[#4752c4]" 
                    : isLight 
                      ? "bg-gray-100 text-gray-400" 
                      : "bg-[#1a2744] text-gray-600"
                } disabled:cursor-not-allowed`}
              >
                <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
