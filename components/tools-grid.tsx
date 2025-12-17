"use client"

import { PenTool, Mail, MessageSquare, Image, Code, FileText, FileCheck } from "lucide-react"
import ToolCard from "./tool-card"

const topTools = [
  { id: 1, title: "Blog Writer", description: "Generate blogs instantly", tool: "blog-writer", icon: "pen" },
  { id: 2, title: "Email Writer", description: "Write professional emails", tool: "email-writer", icon: "mail" },
  { id: 3, title: "AI Chat", description: "Chat with AI • Web search available", tool: "ai-chat", icon: "chat" },
  { id: 4, title: "Image Analyzer", description: "Analyze images with AI", tool: "image-analyzer", icon: "image" },
];

const bottomTools = [
  { id: 5, title: "Code Assistant", description: "Generate, debug and explain code", tool: "code-assistant", icon: "code" },
  { id: 6, title: "Text Summarizer", description: "Summarize articles and documents", tool: "text-summarizer", icon: "text" },
  { id: 7, title: "PDF Analyzer", description: "Analyze and summarize PDF documents", tool: "pdf-analyzer", icon: "pdf" },
];

export default function ToolsGrid() {
  return (
    <div id="tools" className="px-6 py-10 max-w-6xl mx-auto scroll-mt-20">
      {/* Top Row - 4 tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {topTools.map((item) => (
          <ToolCard key={item.id} {...item} />
        ))}
      </div>
      
      {/* Bottom Row - 3 tools centered with same card width */}
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        {bottomTools.map((item) => (
          <div key={item.id} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]">
            <ToolCard {...item} />
          </div>
        ))}
      </div>
    </div>
  )
}
