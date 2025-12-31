"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useTheme } from "./theme-context"

export default function Hero() {
  const { data: session, status } = useSession()
  const { theme } = useTheme()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const isLight = theme === "light"

  useEffect(() => {
    const checkUser = () => {
      // Check NextAuth session first
      if (session?.user) {
        setIsLoggedIn(true)
        setUserName(session.user.name?.split(' ')[0] || "User")
        setIsLoading(false)
        return
      }
      
      // Fall back to localStorage
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
    }

    // Wait for session to load
    if (status !== "loading") {
      checkUser()
    }

    // Listen for storage changes (when user logs in/out)
    window.addEventListener("storage", checkUser)
    
    return () => {
      window.removeEventListener("storage", checkUser)
    }
  }, [session, status])

  if (isLoading || status === "loading") {
    return (
      <section id="home" className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 sm:mb-8 inline-block">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs sm:text-sm font-medium">
              Powered by Advanced AI
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6">
            Your Personal AI Assistant
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
            Write blogs, generate emails, analyze images, and answer anything.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="home" className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-6 sm:mb-8 inline-block">
          <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
            isLight 
              ? "bg-orange-100 border border-orange-200 text-orange-600" 
              : "bg-accent/10 border border-accent/20 text-accent"
          }`}>
            Powered by Advanced AI
          </span>
        </div>

        <h1 className={`text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight ${
          isLight ? "text-gray-900" : "text-foreground"
        }`}>
          {isLoggedIn ? `Welcome back, ${userName}!` : "Your Personal AI Assistant"}
        </h1>

        <p className={`text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto px-4 ${
          isLight ? "text-gray-600" : "text-muted-foreground"
        }`}>
          {isLoggedIn 
            ? "Ready to continue? Explore our AI tools and boost your productivity."
            : "Write blogs, generate emails, analyze images, and answer anything. All in one powerful AI platform."
          }
        </p>

        {isLoggedIn ? (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/ai-chat" className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold transition-colors text-sm sm:text-base ${
              isLight 
                ? "bg-orange-500 hover:bg-orange-600 text-white" 
                : "bg-[#5865F2] hover:bg-[#4752c4] text-white"
            }`}>
              Start Chatting
            </Link>
            <a href="#tools" className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold transition-colors text-sm sm:text-base ${
              isLight 
                ? "border border-gray-300 hover:bg-gray-100 text-gray-800" 
                : "border border-gray-600 hover:bg-white/5 text-white"
            }`}>
              Explore Tools
            </a>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/auth" className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold transition-colors text-sm sm:text-base ${
              isLight 
                ? "bg-orange-500 hover:bg-orange-600 text-white" 
                : "bg-[#5865F2] hover:bg-[#4752c4] text-white"
            }`}>
              Start Free Trial
            </Link>
            <a href="#tools" className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold transition-colors text-sm sm:text-base ${
              isLight 
                ? "border border-gray-300 hover:bg-gray-100 text-gray-800" 
                : "border border-gray-600 hover:bg-white/5 text-white"
            }`}>
              View Demo
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
