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
    <div id="tools" className="px-4 sm:px-6 py-10 max-w-6xl mx-auto scroll-mt-20">
      {/* Top Row - 4 tools */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {topTools.map((item) => (
          <ToolCard key={item.id} {...item} />
        ))}
      </div>
      
      {/* Bottom Row - 3 tools centered below */}
      <div className="mt-3 sm:mt-6">
        {/* Mobile layout */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:hidden">
          {bottomTools.map((item, index) => (
            <div key={item.id} className={index === 2 ? "col-span-2 mx-auto w-full max-w-[calc(50%-0.375rem)]" : ""}>
              <ToolCard {...item} />
            </div>
          ))}
        </div>
        
        {/* Desktop layout - 3 cards centered */}
        <div className="hidden lg:flex justify-center gap-6">
          <div className="w-[calc(25%-1.125rem)]">
            <ToolCard {...bottomTools[0]} />
          </div>
          <div className="w-[calc(25%-1.125rem)]">
            <ToolCard {...bottomTools[1]} />
          </div>
          <div className="w-[calc(25%-1.125rem)]">
            <ToolCard {...bottomTools[2]} />
          </div>
        </div>
      </div>
    </div>
  )
}
