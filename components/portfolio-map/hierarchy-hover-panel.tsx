"use client";

import Link from "next/link";
import type { Discipline } from "@/types/portfolio-hierarchy";
import type { DisciplineId } from "@/types/portfolio-map";
import { disciplineHref, activityHref, contentHref } from "@/lib/portfolio-hierarchy";

export function HierarchyHoverPanel({ discipline }: { discipline: Discipline | null }) {
  if (!discipline) return null;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-10 max-h-[45%] overflow-y-auto border-t-2 bg-white/95 px-4 py-4 backdrop-blur-md sm:px-8 sm:py-5"
      style={{ borderTopColor: discipline.color }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: discipline.color }} />
          <h3 className="text-sm font-black uppercase tracking-tight text-black sm:text-base">
            {discipline.name}
          </h3>
          <Link
            href={disciplineHref(discipline.id as DisciplineId)}
            className="ml-auto text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black"
          >
            View all →
          </Link>
        </div>

        {discipline.activities.length === 0 ? (
          <p className="py-1 text-xs text-black/35">No activities yet.</p>
        ) : (
          <div className="space-y-3">
            {discipline.activities.map((activity) => (
              <div key={activity.id}>
                <Link
                  href={activityHref(discipline.id as DisciplineId, activity.slug)}
                  className="text-xs font-bold uppercase tracking-wider text-black/70 hover:text-black"
                >
                  {activity.name}
                </Link>
                {activity.contents.length > 0 && (
                  <ul className="mt-1.5 space-y-1 border-l border-black/10 pl-3">
                    {activity.contents.map((content) => (
                      <li key={content.id}>
                        <Link
                          href={contentHref(discipline.id as DisciplineId, activity.slug, content.slug)}
                          className="text-xs text-black/55 hover:text-black"
                        >
                          {content.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
