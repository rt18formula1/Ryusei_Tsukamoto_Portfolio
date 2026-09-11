"use client";

import Link from "next/link";
import type { Discipline } from "@/types/portfolio-hierarchy";
import { activityHref, buildBreadcrumbs } from "@/lib/portfolio-hierarchy";
import { HierarchyBreadcrumb } from "@/components/portfolio/hierarchy-breadcrumb";

interface DisciplineActivitiesClientProps {
  discipline: Discipline;
}

export function DisciplineActivitiesClient({ discipline }: DisciplineActivitiesClientProps) {
  const breadcrumbs = buildBreadcrumbs({ discipline });

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
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: discipline.color }}
            />
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              {discipline.name}
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl text-lg">{discipline.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-6xl">
        {discipline.activities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">{discipline.name} content is coming soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
              Activities
            </h2>
            {discipline.activities.map((activity) => (
              <Link
                key={activity.id}
                href={activityHref(discipline.id, activity.slug)}
                className="block group border border-black/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-black/30 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black tracking-tight group-hover:text-blue-600 transition-colors">
                      {activity.name}
                    </h3>
                    {activity.description && (
                      <p className="mt-2 text-sm text-gray-600 max-w-2xl">
                        {activity.description}
                      </p>
                    )}
                    <p className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400">
                      {activity.contents.length > 0
                        ? `${activity.contents.length} item${activity.contents.length === 1 ? "" : "s"}`
                        : "No contents yet"}
                    </p>
                  </div>
                  <span className="text-gray-300 text-xl group-hover:text-black transition-colors shrink-0">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
