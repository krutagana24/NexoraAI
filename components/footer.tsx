"use client";

import { useTheme } from "./theme-context";

export default function Footer() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <footer className={`border-t py-8 transition-colors duration-300 ${
      isLight 
        ? "border-gray-200 bg-white/50" 
        : "border-[#1e293b] bg-[#0a0e1a]"
    }`}>
      <div className={`text-center ${isLight ? "text-gray-600" : "text-gray-400"}`}>
        © 2025 NexoraAI. All rights reserved.
      </div>
    </footer>
  )
}
