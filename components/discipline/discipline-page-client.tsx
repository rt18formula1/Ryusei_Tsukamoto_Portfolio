"use client";

import { DisciplineId } from "@/types/portfolio-map";
import {
  getDiscipline,
  buildBreadcrumbs,
} from "@/lib/portfolio-hierarchy";
import { HierarchyBreadcrumb } from "@/components/portfolio/hierarchy-breadcrumb";
import { DisciplineActivitiesClient } from "@/components/discipline/discipline-activities-client";
import Link from "next/link";

interface DisciplinePageClientProps {
  disciplineId: DisciplineId;
}

export function DisciplinePageClient({ disciplineId }: DisciplinePageClientProps) {
  const discipline = getDiscipline(disciplineId);

  if (!discipline) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Discipline not found</p>
      </div>
    );
  }

  // Developer (and any discipline with activities) uses shared hierarchy UI
  if (discipline.activities.length > 0) {
    return <DisciplineActivitiesClient discipline={discipline} />;
  }

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
        <div className="text-center py-20">
          <p className="text-gray-500">{discipline.name} content is coming soon.</p>
        </div>
      </div>
    </div>
  );
}
