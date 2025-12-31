"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { ChevronDown, PenTool, Mail, MessageSquare, Image, Code, FileText, FileCheck, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { useTheme } from "./theme-context"

const tools = [
  { name: "Blog Writer", href: "/blog-writer", icon: PenTool, description: "Generate blogs instantly" },
  { name: "Email Writer", href: "/email-writer", icon: Mail, description: "Write professional emails" },
  { name: "AI Chat", href: "/ai-chat", icon: MessageSquare, description: "Chat with AI" },
  { name: "Image Analyzer", href: "/image-analyzer", icon: Image, description: "Analyze images with AI" },
  { name: "Code Assistant", href: "/code-assistant", icon: Code, description: "Generate and debug code" },
  { name: "Text Summarizer", href: "/text-summarizer", icon: FileText, description: "Summarize documents" },
  { name: "PDF Analyzer", href: "/pdf-analyzer", icon: FileCheck, description: "Analyze PDF files" },
]

export default function Navbar() {
  const { data: session } = useSession()
  const { theme, toggleTheme } = useTheme()
  const [toolsOpen, setToolsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === "/"
  const isLight = theme === "light"

  useEffect(() => {
    const checkUser = () => {
      // Check NextAuth session first
      if (session?.user) {
        setUser({
          name: session.user.name || "User",
          email: session.user.email || "",
          image: session.user.image || "",
          provider: "oauth"
        })
        return
      }
      // Fall back to localStorage
      const currentUser = localStorage.getItem("nexora_current_user")
      if (currentUser) {
        setUser(JSON.parse(currentUser))
      } else {
        setUser(null)
      }
    }
    checkUser()
    window.addEventListener("storage", checkUser)
    return () => window.removeEventListener("storage", checkUser)
  }, [pathname, session])

  const handleLogout = async () => {
    // Clear localStorage
    localStorage.removeItem("nexora_current_user")
    setUser(null)
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
    
    // Sign out from NextAuth if session exists
    if (session) {
      await signOut({ callbackUrl: "/" })
    } else {
      router.push("/")
      window.location.reload()
    }
  }

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U"
  }

  return (
    <div className="fixed top-3 left-3 right-3 z-50">
      <nav className={`max-w-6xl mx-auto rounded-full shadow-2xl px-5 border transition-colors duration-300 ${
        isLight 
          ? "bg-white/90 backdrop-blur-md border-gray-200" 
          : "bg-gradient-to-r from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] border-gray-800"
      }`}>
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-lg ${
              isLight 
                ? "bg-gradient-to-br from-orange-500 to-orange-600" 
                : "bg-gradient-to-br from-blue-500 to-purple-600"
            }`}>
              <span className="text-white font-bold text-base">N</span>
            </div>
            <span className={`font-bold text-base ${
              isLight 
                ? "bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent" 
                : "bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            }`}>NexoraAI</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className={`${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-300 hover:text-white"} transition-colors text-sm`}>
              Home
            </Link>
            
            {/* Tools Dropdown */}
            <div className="relative">
              {isHomePage ? (
                <a href="/#tools" className={`${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-300 hover:text-white"} transition-colors text-sm`}>
                  Tools
                </a>
              ) : (
                <button
                  onClick={() => setToolsOpen(!toolsOpen)}
                  className={`flex items-center gap-1 ${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-300 hover:text-white"} transition-colors text-sm`}
                >
                  Tools
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
                </button>
              )}
              
              {toolsOpen && !isHomePage && (
                <div 
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-5 w-64 rounded-2xl shadow-2xl py-2 backdrop-blur-xl border ${
                    isLight 
                      ? "bg-white border-gray-200" 
                      : "bg-gradient-to-b from-[#1a1f3a] to-[#0f1229] border-gray-700"
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className={`flex items-center gap-3 px-4 py-2.5 transition-colors mx-2 rounded-xl ${
                        isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                      }`}
                      onClick={() => setToolsOpen(false)}
                    >
                      <tool.icon className={`w-4 h-4 ${isLight ? "text-orange-500" : "text-blue-400"}`} />
                      <div>
                        <div className={`font-medium text-sm ${isLight ? "text-gray-800" : "text-white"}`}>{tool.name}</div>
                        <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>{tool.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className={`${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-300 hover:text-white"} transition-colors text-sm`}>
              About
            </Link>
            <Link href="/contact" className={`${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-300 hover:text-white"} transition-colors text-sm`}>
              Contact
            </Link>
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`w-6 h-6 rounded-full transition-all duration-300 border-2 ${
                    isLight 
                      ? "bg-gradient-to-br from-[#0a0e1a] to-[#1a1f3a] border-gray-600 hover:from-[#0f1629] hover:to-[#252d4a]" 
                      : "bg-gradient-to-br from-[#f5f0e8] to-[#e8dfd4] border-orange-200 hover:from-[#ebe5db] hover:to-[#ddd4c8]"
                  }`}
                  title={isLight ? "Switch to dark mode" : "Switch to light mode"}
                />

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-2 rounded-full pl-3 pr-2 py-1.5 transition-colors ${
                      isLight 
                        ? "bg-gray-100 hover:bg-gray-200" 
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    <span className={`text-sm font-medium ${isLight ? "text-gray-800" : "text-white"}`}>My Workspace</span>
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{getInitial(user.name)}</span>
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div 
                      className={`absolute top-full right-0 mt-3 w-56 rounded-2xl shadow-2xl py-2 border ${
                        isLight 
                          ? "bg-white border-gray-200" 
                          : "bg-gradient-to-b from-[#1a1f3a] to-[#0f1229] border-gray-700"
                      }`}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <div className={`px-4 py-3 border-b ${isLight ? "border-gray-200" : "border-gray-700"}`}>
                        <p className={`font-medium ${isLight ? "text-gray-800" : "text-white"}`}>{user.name}</p>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-red-400 ${
                          isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`w-6 h-6 rounded-full transition-all duration-300 border-2 ${
                    isLight 
                      ? "bg-gradient-to-br from-[#0a0e1a] to-[#1a1f3a] border-gray-600 hover:from-[#0f1629] hover:to-[#252d4a]" 
                      : "bg-gradient-to-br from-[#f5f0e8] to-[#e8dfd4] border-orange-200 hover:from-[#ebe5db] hover:to-[#ddd4c8]"
                  }`}
                  title={isLight ? "Switch to dark mode" : "Switch to light mode"}
                />
                <Link href="/auth" className={`px-4 py-1.5 rounded-full font-medium transition-all shadow-lg hover:shadow-xl text-sm ${
                  isLight 
                    ? "bg-gray-900 hover:bg-gray-800 text-white" 
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                }`}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`w-6 h-6 rounded-full transition-all duration-300 border-2 ${
                isLight 
                  ? "bg-gradient-to-br from-[#0a0e1a] to-[#1a1f3a] border-gray-600" 
                  : "bg-gradient-to-br from-[#f5f0e8] to-[#e8dfd4] border-orange-200"
              }`}
            />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isLight ? "hover:bg-gray-100" : "hover:bg-white/10"
              }`}
            >
              {mobileMenuOpen ? (
                <X className={`w-5 h-5 ${isLight ? "text-gray-800" : "text-white"}`} />
              ) : (
                <Menu className={`w-5 h-5 ${isLight ? "text-gray-800" : "text-white"}`} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden mt-2 rounded-2xl shadow-2xl border overflow-hidden ${
          isLight 
            ? "bg-white/95 backdrop-blur-md border-gray-200" 
            : "bg-[#0f1629]/95 backdrop-blur-md border-gray-800"
        }`}>
          <div className="p-4 space-y-2">
            <Link 
              href="/" 
              className={`block px-4 py-2.5 rounded-xl transition-colors ${
                isLight ? "hover:bg-gray-100 text-gray-800" : "hover:bg-white/5 text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {/* Tools Section */}
            <div className={`px-4 py-2 ${isLight ? "text-gray-500" : "text-gray-400"} text-sm font-medium`}>
              Tools
            </div>
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
                  isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <tool.icon className={`w-4 h-4 ${isLight ? "text-orange-500" : "text-blue-400"}`} />
                <span className={isLight ? "text-gray-800" : "text-white"}>{tool.name}</span>
              </Link>
            ))}
            
            <div className={`border-t my-2 ${isLight ? "border-gray-200" : "border-gray-700"}`}></div>
            
            <Link 
              href="/about" 
              className={`block px-4 py-2.5 rounded-xl transition-colors ${
                isLight ? "hover:bg-gray-100 text-gray-800" : "hover:bg-white/5 text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`block px-4 py-2.5 rounded-xl transition-colors ${
                isLight ? "hover:bg-gray-100 text-gray-800" : "hover:bg-white/5 text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {/* User Section */}
            {user ? (
              <>
                <div className={`border-t my-2 ${isLight ? "border-gray-200" : "border-gray-700"}`}></div>
                <div className={`px-4 py-3 ${isLight ? "bg-gray-50" : "bg-white/5"} rounded-xl`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{getInitial(user.name)}</span>
                    </div>
                    <div>
                      <p className={`font-medium ${isLight ? "text-gray-800" : "text-white"}`}>{user.name}</p>
                      <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>{user.email}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-red-400 ${
                    isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <div className={`border-t my-2 ${isLight ? "border-gray-200" : "border-gray-700"}`}></div>
                <Link 
                  href="/auth" 
                  className={`block text-center px-4 py-3 rounded-xl font-medium transition-all ${
                    isLight 
                      ? "bg-gray-900 text-white hover:bg-gray-800" 
                      : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
