"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Mail, MapPin, Phone, Send, CheckCircle, Linkedin } from "lucide-react"

export default function ContactPage() {
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
    <main className="min-h-screen bg-[#0a0e1a] flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-3xl mx-auto w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-gray-400">Have questions? We'd love to hear from you.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Info Box */}
            <div className="bg-[#0f1629] border border-[#1e293b] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-5">Get in Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-gray-400 text-sm">krutagna2495@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Location</p>
                    <p className="text-gray-400 text-xs">Gujarat, India</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Phone</p>
                    <p className="text-gray-400 text-xs">+91 8320212225</p>
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
                    <p className="text-white text-sm font-medium">LinkedIn</p>
                    <p className="text-gray-400 text-xs">Connect with me</p>
                  </div>
                </a>

                <a 
                  href="https://vercel.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 22.525H0l12-21.05 12 21.05z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Vercel</p>
                    <p className="text-gray-400 text-xs">Deployed on Vercel</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Contact Form Box */}
            <div className="bg-[#0f1629] border border-[#1e293b] rounded-2xl p-6">
              {sent ? (
                <div className="text-center py-10">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">Message Sent!</h3>
                  <p className="text-gray-400 text-sm">We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0a0e1a] border border-[#2a3548] rounded-lg py-2 px-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0a0e1a] border border-[#2a3548] rounded-lg py-2 px-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="w-full bg-[#0a0e1a] border border-[#2a3548] rounded-lg py-2 px-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                      placeholder="Your message..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
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
