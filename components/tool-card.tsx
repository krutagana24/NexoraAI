"use client";

import Link from "next/link";
import { PenTool, Mail, MessageSquare, Image, Code, FileText, FileCheck } from "lucide-react";

export default function ToolCard({ title, description, tool, icon }) {
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
    <div className="p-6 bg-[#0f1629] rounded-2xl border border-[#1e293b] shadow-lg flex flex-col items-center text-center gap-4 w-full h-full min-h-[220px]">
      
      {/* ICON */}
      <div className="w-12 h-12 rounded-xl bg-[#1a2744] flex items-center justify-center">
        <Icon className="w-6 h-6 text-[#38bdf8]" />
      </div>

      {/* TITLE */}
      <h3 className="text-xl font-semibold text-white">{title}</h3>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-400">{description}</p>

      {/* BUTTON — ROUTING */}
      <Link
        href={`/${tool}`}
        className="mt-auto w-full py-3 bg-[#0f1629] border border-[#2a3f5f] rounded-xl text-[#38bdf8] hover:bg-[#1a2744] transition text-center block"
      >
        Use Tool
      </Link>
    </div>
  );
}
