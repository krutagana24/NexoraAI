"use client";

import { useTheme } from "./theme-context";

export default function AboutSection() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section id="about" className="py-16 sm:py-20 px-4 sm:px-6 scroll-mt-24">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 ${isLight ? "text-gray-900" : "text-white"}`}>
          What is NexoraAI?
        </h2>
        <p className={`text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
          NexoraAI is your all-in-one AI-powered platform designed to boost your productivity. 
          Whether you need to write blogs, generate professional emails, analyze images, 
          summarize documents, or get coding help — NexoraAI has you covered.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mt-8 sm:mt-12">
          <div className={`p-5 sm:p-6 rounded-2xl border transition-colors duration-300 ${
            isLight ? "bg-white border-gray-200" : "bg-[#0f1629] border-[#1e293b]"
          }`}>
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🚀</div>
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>Fast & Efficient</h3>
            <p className={`text-sm sm:text-base ${isLight ? "text-gray-600" : "text-gray-400"}`}>Get instant AI-powered results in seconds, not minutes.</p>
          </div>
          <div className={`p-5 sm:p-6 rounded-2xl border transition-colors duration-300 ${
            isLight ? "bg-white border-gray-200" : "bg-[#0f1629] border-[#1e293b]"
          }`}>
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>Accurate Results</h3>
            <p className={`text-sm sm:text-base ${isLight ? "text-gray-600" : "text-gray-400"}`}>Powered by advanced AI models for high-quality outputs.</p>
          </div>
          <div className={`p-5 sm:p-6 rounded-2xl border transition-colors duration-300 ${
            isLight ? "bg-white border-gray-200" : "bg-[#0f1629] border-[#1e293b]"
          }`}>
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💡</div>
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>Easy to Use</h3>
            <p className={`text-sm sm:text-base ${isLight ? "text-gray-600" : "text-gray-400"}`}>Simple interface designed for everyone, no tech skills needed.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
