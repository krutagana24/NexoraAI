"use client";

import Link from "next/link";
import { PenTool, Mail, MessageSquare, Image, Code, FileText, FileCheck } from "lucide-react";
import { useTheme } from "./theme-context";

export default function ToolCard({ title, description, tool, icon }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  const icons = {
    pen: PenTool,
    mail: Mail,
    chat: MessageSquare,
    image: Image,
    code: Code,
    text: FileText,
    pdf: FileCheck,
  };

  const Icon = icons[icon];

  return (
    <div className={`p-4 sm:p-6 rounded-2xl border shadow-lg flex flex-col items-center text-center gap-2 sm:gap-4 w-full h-full min-h-[180px] sm:min-h-[220px] transition-colors duration-300 ${
      isLight 
        ? "bg-white border-gray-200" 
        : "bg-[#0f1629] border-[#1e293b]"
    }`}>
      
      {/* ICON */}
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
        isLight ? "bg-orange-100" : "bg-[#1a2744]"
      }`}>
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isLight ? "text-orange-500" : "text-[#38bdf8]"}`} />
      </div>

      {/* TITLE */}
      <h3 className={`text-base sm:text-xl font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>{title}</h3>

      {/* DESCRIPTION */}
      <p className={`text-xs sm:text-sm line-clamp-2 ${isLight ? "text-gray-600" : "text-gray-400"}`}>{description}</p>

      {/* BUTTON — ROUTING */}
      <Link
        href={`/${tool}`}
        className={`mt-auto w-full py-2 sm:py-3 rounded-xl transition text-center block text-sm sm:text-base ${
          isLight 
            ? "bg-white border border-orange-200 text-orange-500 hover:bg-orange-50" 
            : "bg-[#0f1629] border border-[#2a3f5f] text-[#38bdf8] hover:bg-[#1a2744]"
        }`}
      >
        Use Tool
      </Link>
    </div>
  );
}
