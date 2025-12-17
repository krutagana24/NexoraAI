"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check immediately on mount
    const currentUser = localStorage.getItem("nexora_current_user")
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        setIsLoggedIn(true)
        setUserName(user.name?.split(' ')[0] || "User")
      } catch {
        setIsLoggedIn(false)
        setUserName("")
      }
    } else {
      setIsLoggedIn(false)
      setUserName("")
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 inline-block">
            <span className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-medium">
              Powered by Advanced AI
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            Your Personal AI Assistant
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Write blogs, generate emails, analyze images, and answer anything.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8 inline-block">
          <span className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-medium">
            Powered by Advanced AI
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          {isLoggedIn ? `Welcome back, ${userName}!` : "Your Personal AI Assistant"}
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
          {isLoggedIn 
            ? "Ready to continue? Explore our AI tools and boost your productivity."
            : "Write blogs, generate emails, analyze images, and answer anything. All in one powerful AI platform."
          }
        </p>

        {isLoggedIn ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ai-chat" className="bg-[#5865F2] hover:bg-[#4752c4] text-white px-8 py-3.5 rounded-xl font-semibold transition-colors">
              Start Chatting
            </Link>
            <a href="#tools" className="border border-gray-600 hover:bg-white/5 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors">
              Explore Tools
            </a>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth" className="bg-[#5865F2] hover:bg-[#4752c4] text-white px-8 py-3.5 rounded-xl font-semibold transition-colors">
              Start Free Trial
            </Link>
            <a href="#tools" className="border border-gray-600 hover:bg-white/5 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors">
              View Demo
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
