"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ContactSection() {
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
    <section id="contact" className="py-20 px-6 scroll-mt-20">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Contact Us</h2>
        <p className="text-gray-400 mb-8">Have questions or feedback? We'd love to hear from you.</p>

        {sent ? (
          <div className="bg-green-900/30 border border-green-500 p-4 rounded-full text-green-300">
            Message sent! We'll get back to you soon.
          </div>
        ) : (
          <div className="bg-[#0f1629] border border-[#1e293b] rounded-full px-4 py-2">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 bg-transparent py-2 px-2 outline-none text-white placeholder-gray-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Your message..."
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className={`p-2 rounded-full transition ${
                  message.trim() ? "bg-[#5865F2] text-white hover:bg-[#4752c4]" : "bg-[#1a2744] text-gray-600"
                } disabled:cursor-not-allowed`}
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
