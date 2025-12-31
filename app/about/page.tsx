"use client";

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Sparkles, Zap, Shield, Users } from "lucide-react"
import { useTheme } from "@/components/theme-context"

export default function AboutPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <main className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isLight ? "bg-gradient-to-b from-[#e8dfd4] via-[#f5f0e8] to-[#fef3e2]" : "bg-[#0a0e1a]"
    }`}>
      <Navbar />
      <div className="flex-1 pt-20 sm:pt-24 pb-12 sm:pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-16">
            <h1 className={`text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 ${isLight ? "text-gray-900" : "text-white"}`}>About NexoraAI</h1>
            <p className={`text-base sm:text-xl max-w-2xl mx-auto ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Empowering creativity and productivity with cutting-edge AI technology
            </p>
          </div>

          {/* Mission */}
          <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-8 sm:mb-12 border transition-colors duration-300 ${
            isLight 
              ? "bg-white border-gray-200" 
              : "bg-gradient-to-b from-[#1a1f3a] to-[#0f1229] border-gray-700"
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>Our Mission</h2>
            <p className={`leading-relaxed text-sm sm:text-base ${isLight ? "text-gray-600" : "text-gray-300"}`}>
              At NexoraAI, we believe that artificial intelligence should be accessible to everyone. 
              Our mission is to democratize AI technology by providing powerful, easy-to-use tools 
              that help individuals and businesses unlock their full potential. Whether you're writing 
              content, analyzing documents, or seeking creative inspiration, NexoraAI is here to assist.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className={`rounded-2xl p-5 sm:p-6 border transition-colors duration-300 ${
              isLight ? "bg-white border-gray-200" : "bg-[#1a1f3a]/50 border-gray-700"
            }`}>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${
                isLight ? "bg-orange-100" : "bg-blue-500/20"
              }`}>
                <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 ${isLight ? "text-orange-500" : "text-blue-400"}`} />
              </div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>Advanced AI Models</h3>
              <p className={`text-sm sm:text-base ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                Powered by state-of-the-art language models to deliver accurate and creative results.
              </p>
            </div>

            <div className={`rounded-2xl p-5 sm:p-6 border transition-colors duration-300 ${
              isLight ? "bg-white border-gray-200" : "bg-[#1a1f3a]/50 border-gray-700"
            }`}>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${
                isLight ? "bg-purple-100" : "bg-purple-500/20"
              }`}>
                <Zap className={`w-5 h-5 sm:w-6 sm:h-6 ${isLight ? "text-purple-500" : "text-purple-400"}`} />
              </div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>Lightning Fast</h3>
              <p className={`text-sm sm:text-base ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                Get instant responses and results without waiting. Speed meets quality.
              </p>
            </div>

            <div className={`rounded-2xl p-5 sm:p-6 border transition-colors duration-300 ${
              isLight ? "bg-white border-gray-200" : "bg-[#1a1f3a]/50 border-gray-700"
            }`}>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${
                isLight ? "bg-green-100" : "bg-green-500/20"
              }`}>
                <Shield className={`w-5 h-5 sm:w-6 sm:h-6 ${isLight ? "text-green-500" : "text-green-400"}`} />
              </div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>Secure & Private</h3>
              <p className={`text-sm sm:text-base ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                Your data is protected with enterprise-grade security. We never share your information.
              </p>
            </div>

            <div className={`rounded-2xl p-5 sm:p-6 border transition-colors duration-300 ${
              isLight ? "bg-white border-gray-200" : "bg-[#1a1f3a]/50 border-gray-700"
            }`}>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${
                isLight ? "bg-orange-100" : "bg-orange-500/20"
              }`}>
                <Users className={`w-5 h-5 sm:w-6 sm:h-6 ${isLight ? "text-orange-500" : "text-orange-400"}`} />
              </div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>User-Centric Design</h3>
              <p className={`text-sm sm:text-base ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                Built with users in mind. Intuitive interface that anyone can use effectively.
              </p>
            </div>
          </div>

          {/* Team */}
          <div className="text-center">
            <h2 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>Built with ❤️</h2>
            <p className={`text-sm sm:text-base ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              NexoraAI is developed by passionate developers committed to making AI accessible for everyone.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
