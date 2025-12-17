import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import ToolsGrid from "@/components/tools-grid"
import AboutSection from "@/components/about-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
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
