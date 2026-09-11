"use client";

import { useState } from "react";
import { DeveloperProject } from "@/types/dev-project";
import { DevProjectModal } from "./dev-project-modal";

interface DeveloperProjectListProps {
  projects: DeveloperProject[];
}

export function DeveloperProjectList({ projects }: DeveloperProjectListProps) {
  const [selectedProject, setSelectedProject] = useState<DeveloperProject | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-black/10 bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 max-w-6xl">
          <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <a
              href="/"
              className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
            >
              ← Home
            </a>
            <span className="text-gray-300">/</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-black">
              Developer
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Developer Projects
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
            Full-stack web applications, automation pipelines, and software tools built with Next.js, TypeScript, Supabase, and Cloudflare.
          </p>
        </div>
      </div>

      {/* Project List */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group border border-black/10 rounded-xl sm:rounded-2xl overflow-hidden hover:border-black/30 hover:shadow-xl transition-all cursor-pointer"
            >
              {/* Main Visual */}
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                <img
                  src={project.mainVisualUrl}
                  alt={project.projectName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <h2 className="text-base sm:text-xl font-black uppercase tracking-tight mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
                  {project.projectName}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {project.shortDescription}
                </p>
                <div className="mt-3 sm:mt-4 flex items-center text-[10px] sm:text-xs font-bold text-gray-400 group-hover:text-black transition-colors">
                  View Details →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <DevProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
