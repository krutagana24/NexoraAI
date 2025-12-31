"use client";

import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import ToolsGrid from "@/components/tools-grid"
import AboutSection from "@/components/about-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import { useTheme } from "@/components/theme-context"

export default function Home() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <main className={`min-h-screen transition-colors duration-300 ${
      isLight ? "bg-gradient-to-b from-[#e8dfd4] via-[#f5f0e8] to-[#fef3e2]" : "bg-[#0a0e1a]"
    }`}>
      <Navbar />
      <div className="pt-20">
        <Hero />
        <ToolsGrid />
        <AboutSection />
        <ContactSection />
      </div>
      <Footer />
    </main>
  );
}
