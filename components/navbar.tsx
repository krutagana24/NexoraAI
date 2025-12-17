"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, PenTool, Mail, MessageSquare, Image, Code, FileText, FileCheck, Bell, LogOut } from "lucide-react"
import Link from "next/link"

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
  const [toolsOpen, setToolsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === "/"

  useEffect(() => {
    const checkUser = () => {
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
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("nexora_current_user")
    setUser(null)
    setUserMenuOpen(false)
    router.push("/")
    window.location.reload()
  }

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U"
  }

  return (
    <div className="fixed top-3 left-3 right-3 z-50">
      <nav className="max-w-6xl mx-auto bg-gradient-to-r from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] rounded-full shadow-2xl px-5 border border-gray-800">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-base">N</span>
            </div>
            <span className="font-bold text-base bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">NexoraAI</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
              Home
            </Link>
            
            {/* Tools Dropdown */}
            <div className="relative">
              {isHomePage ? (
                <a href="/#tools" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Tools
                </a>
              ) : (
                <button
                  onClick={() => setToolsOpen(!toolsOpen)}
                  className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Tools
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
                </button>
              )}
              
              {toolsOpen && !isHomePage && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-5 w-64 bg-gradient-to-b from-[#1a1f3a] to-[#0f1229] border border-gray-700 rounded-2xl shadow-2xl py-2 backdrop-blur-xl"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors mx-2 rounded-xl"
                      onClick={() => setToolsOpen(false)}
                    >
                      <tool.icon className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="text-white font-medium text-sm">{tool.name}</div>
                        <div className="text-xs text-gray-400">{tool.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
              About
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
              Contact
            </Link>
          </div>

          {/* Right Side - Auth or User Profile */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full pl-3 pr-2 py-1.5 transition-colors"
                >
                  <span className="text-sm text-white font-medium hidden sm:block">My Workspace</span>
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{getInitial(user.name)}</span>
                  </div>
                </button>

                {userMenuOpen && (
                  <div 
                    className="absolute top-full right-0 mt-3 w-56 bg-gradient-to-b from-[#1a1f3a] to-[#0f1229] border border-gray-700 rounded-2xl shadow-2xl py-2"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link href="/auth" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-1.5 rounded-full font-medium transition-all shadow-lg hover:shadow-xl text-sm">
              Get Started
            </Link>
          )}
        </div>
      </nav>
    </div>
  )
}
