"use client";

import { useState } from "react";
import Link from "next/link";
import type { Activity, Discipline } from "@/types/portfolio-hierarchy";
import type { DeveloperProject } from "@/types/dev-project";
import {
  buildBreadcrumbs,
  contentHref,
} from "@/lib/portfolio-hierarchy";
import { HierarchyBreadcrumb } from "@/components/portfolio/hierarchy-breadcrumb";
import { DevProjectModal } from "@/components/dev-project/dev-project-modal";

interface ActivityContentsClientProps {
  discipline: Discipline;
  activity: Activity;
  /** Full developer projects keyed by id (for modal). Optional for non-dev activities. */
  projectsById?: Record<string, DeveloperProject>;
}

export function ActivityContentsClient({
  discipline,
  activity,
  projectsById = {},
}: ActivityContentsClientProps) {
  const breadcrumbs = buildBreadcrumbs({ discipline, activity });
  const [selectedProject, setSelectedProject] = useState<DeveloperProject | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-black/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <HierarchyBreadcrumb items={breadcrumbs} />
          <Link
            href="/"
            className="text-[10px] font-bold uppercase tracking-widest bg-black text-white rounded-full px-4 py-2 hover:bg-gray-800 transition-all"
          >
            Home
          </Link>
        </div>
      </nav>

      <div className="border-b border-black/10">
        <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-6xl">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
            {discipline.name}
          </p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter">
            {activity.name}
          </h1>
          {activity.description && (
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
              {activity.description}
            </p>
          )}
          {activity.links && activity.links.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {activity.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800"
                >
                  {link.label} →
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 max-w-6xl">
        {activity.contents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Contents for {activity.name} are coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {activity.contents.map((content) => {
              const project =
                content.projectId != null ? projectsById[content.projectId] : undefined;
              const href = contentHref(discipline.id, activity.slug, content.slug);

              return (
                <div
                  key={content.id}
                  role={project ? "button" : undefined}
                  tabIndex={project ? 0 : undefined}
                  onClick={() => {
                    if (project) setSelectedProject(project);
                  }}
                  onKeyDown={(e) => {
                    if (project && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      setSelectedProject(project);
                    }
                  }}
                  className="group border border-black/10 rounded-xl sm:rounded-2xl overflow-hidden hover:border-black/30 hover:shadow-xl transition-all cursor-pointer"
                >
                  {content.mainVisualUrl && (
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      <img
                        src={content.mainVisualUrl}
                        alt={content.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4 sm:p-6">
                    <h2 className="text-base sm:text-xl font-black uppercase tracking-tight mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
                      {content.name}
                    </h2>
                    {content.description && (
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {content.description}
                      </p>
                    )}
                    <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-400 group-hover:text-black transition-colors">
                        View Details →
                      </span>
                      <Link
                        href={href}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                      >
                        Permalink
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
