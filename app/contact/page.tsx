"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Mail, MapPin, Phone, Send, CheckCircle, Linkedin } from "lucide-react"
import { useTheme } from "@/components/theme-context"

export default function ContactPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return
    setSent(true)
    setName("")
    setEmail("")
    setMessage("")
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <main className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isLight ? "bg-gradient-to-b from-[#e8dfd4] via-[#f5f0e8] to-[#fef3e2]" : "bg-[#0a0e1a]"
    }`}>
      <Navbar />
      <div className="flex-1 pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 flex items-center justify-center">
        <div className="max-w-3xl mx-auto w-full">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className={`text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>Contact Us</h1>
            <p className={`text-sm sm:text-base ${isLight ? "text-gray-600" : "text-gray-400"}`}>Have questions? We'd love to hear from you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Contact Info Box */}
            <div className={`rounded-2xl p-5 sm:p-6 border transition-colors duration-300 ${
              isLight ? "bg-white border-gray-200" : "bg-[#0f1629] border-[#1e293b]"
            }`}>
              <h2 className={`text-base sm:text-lg font-bold mb-4 sm:mb-5 ${isLight ? "text-gray-900" : "text-white"}`}>Get in Touch</h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                    isLight ? "bg-orange-100" : "bg-blue-500/20"
                  }`}>
                    <Mail className={`w-4 h-4 sm:w-5 sm:h-5 ${isLight ? "text-orange-500" : "text-blue-400"}`} />
                  </div>
                  <div>
                    <p className={`text-sm sm:text-base font-medium ${isLight ? "text-gray-900" : "text-white"}`}>Email</p>
                    <p className={`text-xs sm:text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>krutagna2495@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isLight ? "bg-purple-100" : "bg-purple-500/20"
                  }`}>
                    <MapPin className={`w-4 h-4 ${isLight ? "text-purple-500" : "text-purple-400"}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>Location</p>
                    <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>Gujarat, India</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isLight ? "bg-green-100" : "bg-green-500/20"
                  }`}>
                    <Phone className={`w-4 h-4 ${isLight ? "text-green-500" : "text-green-400"}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>Phone</p>
                    <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>+91 8320212225</p>
                  </div>
                </div>

                <a 
                  href="https://www.linkedin.com/in/krutagana-patel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <div className="w-9 h-9 bg-[#0077b5]/20 rounded-lg flex items-center justify-center">
                    <Linkedin className="w-4 h-4 text-[#0077b5]" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>LinkedIn</p>
                    <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>Connect with me</p>
                  </div>
                </a>

                <a 
                  href="https://vercel.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isLight ? "bg-gray-100" : "bg-white/10"
                  }`}>
                    <svg className={`w-4 h-4 ${isLight ? "text-gray-900" : "text-white"}`} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 22.525H0l12-21.05 12 21.05z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>Vercel</p>
                    <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>Deployed on Vercel</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Contact Form Box */}
            <div className={`rounded-2xl p-5 sm:p-6 border transition-colors duration-300 ${
              isLight ? "bg-white border-gray-200" : "bg-[#0f1629] border-[#1e293b]"
            }`}>
              {sent ? (
                <div className="text-center py-8 sm:py-10">
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto mb-3" />
                  <h3 className={`text-base sm:text-lg font-bold mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>Message Sent!</h3>
                  <p className={`text-xs sm:text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className={`block text-xs sm:text-sm mb-1 sm:mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full rounded-lg py-2 px-3 text-sm focus:outline-none transition-colors ${
                        isLight 
                          ? "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500" 
                          : "bg-[#0a0e1a] border border-[#2a3548] text-white placeholder-gray-500 focus:border-blue-500"
                      }`}
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-xs mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-lg py-2 px-3 text-sm focus:outline-none transition-colors ${
                        isLight 
                          ? "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500" 
                          : "bg-[#0a0e1a] border border-[#2a3548] text-white placeholder-gray-500 focus:border-blue-500"
                      }`}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-xs mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className={`w-full rounded-lg py-2 px-3 text-sm focus:outline-none resize-none transition-colors ${
                        isLight 
                          ? "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500" 
                          : "bg-[#0a0e1a] border border-[#2a3548] text-white placeholder-gray-500 focus:border-blue-500"
                      }`}
                      placeholder="Your message..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm ${
                      isLight 
                        ? "bg-orange-500 hover:bg-orange-600 text-white" 
                        : "bg-[#5865F2] hover:bg-[#4752c4] text-white"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
