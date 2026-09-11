"use client";

export function ProfilePageClient() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-black/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600">
            <a href="/" className="hover:text-black transition-colors">HOME</a>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-black">PROFILE</span>
          </div>
          <a
            href="/"
            className="text-[10px] font-bold uppercase tracking-widest bg-black text-white rounded-full px-4 py-2 hover:bg-gray-800 transition-all"
          >
            Home
          </a>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-6xl">
        <div className="text-center py-20">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
            Ryusei Tsukamoto
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
            Multi-discipline creator and developer working across software development, illustration, music, writing, and investment research.
          </p>
          <div className="space-y-4">
            <div className="border border-black/10 rounded-2xl p-6 max-w-md mx-auto">
              <h2 className="text-lg font-black uppercase tracking-tight mb-3">Contact</h2>
              <p className="text-gray-500 text-sm">Contact information coming soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
