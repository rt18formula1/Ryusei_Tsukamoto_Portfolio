"use client";

import { useState } from "react";
import { DeveloperProject } from "@/types/dev-project";
import { DevProjectModal } from "@/components/dev-project/dev-project-modal";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";

interface DevProjectDetailClientProps {
  project: DeveloperProject;
}

export function DevProjectDetailClient({ project }: DevProjectDetailClientProps) {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-12">
          <Link
            href="/portfolio/developer/rt18-dev"
            className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to rt18_dev
          </Link>
        </div>

        {/* Hero card — click to open modal */}
        <div
          onClick={() => setModalOpen(true)}
          className="group cursor-pointer rounded-3xl overflow-hidden border border-black/10 shadow-xl hover:shadow-2xl transition-all"
        >
          <div className="aspect-video bg-gray-100 relative overflow-hidden">
            <img
              src={project.mainVisualUrl}
              alt={project.projectName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="bg-white px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                View Details
              </span>
            </div>
          </div>
          <div className="p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              {project.projectName}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              {project.shortDescription}
            </p>
          </div>
        </div>

        {/* Quick info pills */}
        <div className="flex flex-wrap gap-3 mt-8 mb-4">
          {project.information.flatMap(cat =>
            cat.category === "GENERAL" ? cat.items.map((item, i) => (
              <span
                key={i}
                className="px-4 py-2 border border-black/10 rounded-full text-xs font-bold bg-gray-50"
              >
                <span className="text-gray-400 mr-2">{item.label}</span>
                {Array.isArray(item.value) ? item.value.join(", ") : String(item.value)}
              </span>
            )) : []
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setModalOpen(true)}
            className="px-8 py-3 bg-black text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-colors"
          >
            View Full Details
          </button>
          <Link
            href={`/portfolio/dev/${project.id}/print`}
            target="_blank"
            className="px-8 py-3 border border-black/20 rounded-full text-sm font-bold hover:border-black/60 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Print / PDF
          </Link>
        </div>
      </main>
      <SiteFooter />

      <DevProjectModal
        project={project}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
