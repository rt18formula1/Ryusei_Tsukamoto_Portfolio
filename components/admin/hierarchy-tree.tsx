"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDisciplines } from "@/lib/portfolio-hierarchy";
import { getDevProjects, type DbDevProject } from "@/lib/supabase-queries";
import type { Discipline, Activity, HierarchyContent } from "@/types/portfolio-hierarchy";

function ContentNode({ content }: { content: HierarchyContent }) {
  return (
    <div className="flex items-center gap-2 pl-12 py-1.5">
      <span className="text-gray-300">├──</span>
      <Link
        href={`/admin/projects/${content.projectId || content.id}`}
        className="text-sm font-bold text-gray-700 hover:text-black hover:underline"
      >
        {content.name}
      </Link>
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
        {content.type}
      </span>
    </div>
  );
}

function ActivityNode({ activity }: { activity: Activity }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 pl-6 py-1.5 w-full text-left hover:bg-black/5 rounded-lg transition-colors"
      >
        <span className="text-xs text-gray-400 w-4">{expanded ? "▼" : "▶"}</span>
        <span className="text-sm font-bold">{activity.name}</span>
        <span className="text-[10px] text-gray-400">
          {activity.contents.length} content{activity.contents.length !== 1 ? "s" : ""}
        </span>
      </button>
      {expanded && (
        <div>
          {activity.contents.map((c) => (
            <ContentNode key={c.id} content={c} />
          ))}
          {activity.contents.length === 0 && (
            <p className="pl-16 py-1 text-xs text-gray-300">No content</p>
          )}
        </div>
      )}
    </div>
  );
}

function DisciplineNode({
  discipline,
  devProjects,
}: {
  discipline: Discipline;
  devProjects: DbDevProject[];
}) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="border border-black/10 rounded-xl mb-3 bg-white">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 p-4 w-full text-left hover:bg-black/5 rounded-xl transition-colors"
      >
        <span className="text-xs text-gray-400 w-4">{expanded ? "▼" : "▶"}</span>
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: discipline.color }}
        />
        <span className="text-base font-black uppercase">{discipline.name}</span>
        <span className="text-[10px] text-gray-400">
          {discipline.activities.length} activit{discipline.activities.length !== 1 ? "ies" : "y"}
        </span>
      </button>
      {expanded && (
        <div className="pb-3">
          {discipline.activities.map((a) => (
            <ActivityNode key={a.id} activity={a} />
          ))}
          {discipline.activities.length === 0 && (
            <p className="pl-12 py-2 text-xs text-gray-300">No activities</p>
          )}
        </div>
      )}
    </div>
  );
}

export function HierarchyTree() {
  const disciplines = getDisciplines();
  const [devProjects, setDevProjects] = useState<DbDevProject[]>([]);

  useEffect(() => {
    getDevProjects().then(setDevProjects);
  }, []);

  return (
    <div>
      {disciplines.map((d) => (
        <DisciplineNode key={d.id} discipline={d} devProjects={devProjects} />
      ))}
    </div>
  );
}
