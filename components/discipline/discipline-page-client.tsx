"use client";

import { DisciplineId } from "@/types/portfolio-map";

const DISCIPLINES: Record<DisciplineId, { label: string; description: string; color: string }> = {
  developer: {
    label: "Developer",
    description: "Full-stack web applications, automation pipelines, and software tools built with Next.js, TypeScript, Supabase, and Cloudflare.",
    color: "#2563eb",
  },
  illustrator: {
    label: "Illustrator",
    description: "Digital illustrations, graphic art, and visual content focusing on Formula 1, motorsport moments, and creative graphics.",
    color: "#7c3aed",
  },
  musician: {
    label: "Musician",
    description: "Sound design, music composition, and audio content production.",
    color: "#db2777",
  },
  blogger: {
    label: "Blogger",
    description: "Technical articles, development logs, design notes, and analytical writings on note and technical blogs.",
    color: "#059669",
  },
  investor: {
    label: "Investor",
    description: "Market research and investment activities in tech sectors, growth companies, and emerging markets.",
    color: "#d97706",
  },
};

interface DisciplinePageClientProps {
  disciplineId: DisciplineId;
}

export function DisciplinePageClient({ disciplineId }: DisciplinePageClientProps) {
  const discipline = DISCIPLINES[disciplineId];

  if (!discipline) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Discipline not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-black/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600">
            <a href="/" className="hover:text-black transition-colors">HOME</a>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-black">{discipline.label.toUpperCase()}</span>
          </div>
          <a
            href="/"
            className="text-[10px] font-bold uppercase tracking-widest bg-black text-white rounded-full px-4 py-2 hover:bg-gray-800 transition-all"
          >
            Home
          </a>
        </div>
      </nav>

      {/* Header */}
      <div className="border-b border-black/10">
        <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: discipline.color }}
            />
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              {discipline.label}
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl text-lg">
            {discipline.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-6xl">
        {disciplineId === "developer" ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">Developer projects are available at</p>
            <a
              href="/portfolio/dev"
              className="inline-block text-lg font-black uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors"
            >
              /portfolio/dev →
            </a>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">
              {discipline.label} content is coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
