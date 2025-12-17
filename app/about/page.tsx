import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Sparkles, Zap, Shield, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">About NexoraAI</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Empowering creativity and productivity with cutting-edge AI technology
            </p>
          </div>

          {/* Mission */}
          <div className="bg-gradient-to-b from-[#1a1f3a] to-[#0f1229] border border-gray-700 rounded-3xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              At NexoraAI, we believe that artificial intelligence should be accessible to everyone. 
              Our mission is to democratize AI technology by providing powerful, easy-to-use tools 
              that help individuals and businesses unlock their full potential. Whether you're writing 
              content, analyzing documents, or seeking creative inspiration, NexoraAI is here to assist.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[#1a1f3a]/50 border border-gray-700 rounded-2xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Advanced AI Models</h3>
              <p className="text-gray-400">
                Powered by state-of-the-art language models to deliver accurate and creative results.
              </p>
            </div>

            <div className="bg-[#1a1f3a]/50 border border-gray-700 rounded-2xl p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-400">
                Get instant responses and results without waiting. Speed meets quality.
              </p>
            </div>

            <div className="bg-[#1a1f3a]/50 border border-gray-700 rounded-2xl p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-gray-400">
                Your data is protected with enterprise-grade security. We never share your information.
              </p>
            </div>

            <div className="bg-[#1a1f3a]/50 border border-gray-700 rounded-2xl p-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">User-Centric Design</h3>
              <p className="text-gray-400">
                Built with users in mind. Intuitive interface that anyone can use effectively.
              </p>
            </div>
          </div>

          {/* Team */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Built with ❤️</h2>
            <p className="text-gray-400">
              NexoraAI is developed by passionate developers committed to making AI accessible for everyone.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
