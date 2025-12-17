export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-6 scroll-mt-24">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          What is NexoraAI?
        </h2>
        <p className="text-lg text-gray-400 leading-relaxed mb-8">
          NexoraAI is your all-in-one AI-powered platform designed to boost your productivity. 
          Whether you need to write blogs, generate professional emails, analyze images, 
          summarize documents, or get coding help — NexoraAI has you covered.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="p-6 bg-[#0f1629] rounded-2xl border border-[#1e293b]">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-white mb-2">Fast & Efficient</h3>
            <p className="text-gray-400">Get instant AI-powered results in seconds, not minutes.</p>
          </div>
          <div className="p-6 bg-[#0f1629] rounded-2xl border border-[#1e293b]">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">Accurate Results</h3>
            <p className="text-gray-400">Powered by advanced AI models for high-quality outputs.</p>
          </div>
          <div className="p-6 bg-[#0f1629] rounded-2xl border border-[#1e293b]">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-semibold text-white mb-2">Easy to Use</h3>
            <p className="text-gray-400">Simple interface designed for everyone, no tech skills needed.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
