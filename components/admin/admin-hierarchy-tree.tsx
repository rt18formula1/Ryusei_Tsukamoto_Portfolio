"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  FolderGit2,
  Layers,
  Sparkles,
  ExternalLink,
  MoveVertical,
  CheckCircle2,
} from "lucide-react";
import type { PortfolioHierarchy, Discipline, Activity, HierarchyContent } from "@/types/portfolio-hierarchy";
import type { DbDevProject } from "@/lib/supabase-queries";

interface AdminHierarchyTreeProps {
  hierarchy: PortfolioHierarchy;
  dbProjects: DbDevProject[];
  onEditProject: (project?: DbDevProject) => void;
  onEditActivity: (activity: Activity) => void;
  onEditDiscipline: (discipline: Discipline) => void;
  onAddActivity: (disciplineId: string) => void;
  onAddProjectToActivity: (activityId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

export function AdminHierarchyTree({
  hierarchy,
  dbProjects,
  onEditProject,
  onEditActivity,
  onEditDiscipline,
  onAddActivity,
  onAddProjectToActivity,
  onDeleteProject,
}: AdminHierarchyTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    developer: true,
    "rt18-dev": true,
    illustrator: true,
    "rt18-formula1": true,
    musician: true,
    blogger: false,
    investor: false,
  });

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.28em] text-black/35">
            Hierarchy Management
          </p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-black sm:text-3xl">
            Portfolio Tree
          </h1>
          <p className="mt-1 text-xs text-black/50">
            Discipline → Activity / Brand → Project の階層構造を一元管理します。
          </p>
        </div>
      </div>

      {/* Interactive Tree Box */}
      <div className="rounded-3xl border border-black/8 bg-white p-5 sm:p-7 shadow-sm">
        {/* Root Node */}
        <div className="mb-4 flex items-center justify-between border-b border-black/8 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white text-[11px] font-black">
              R
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-black">
                RYUSEI TSUKAMOTO (Portfolio Root)
              </span>
              <span className="ml-2 rounded-full bg-black/5 px-2 py-0.5 text-[9px] font-bold text-black/50 uppercase">
                5 Disciplines
              </span>
            </div>
          </div>
        </div>

        {/* Disciplines List */}
        <div className="space-y-3">
          {hierarchy.disciplines.map((discipline) => {
            const isExpanded = expandedNodes[discipline.id] ?? false;
            return (
              <div
                key={discipline.id}
                className="rounded-2xl border border-black/6 bg-[#fafaf9] overflow-hidden transition"
              >
                {/* Discipline Header Row */}
                <div className="flex items-center justify-between p-3.5 sm:px-4">
                  <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <button
                      onClick={() => toggleExpand(discipline.id)}
                      className="rounded p-1 text-black/40 hover:bg-black/5 hover:text-black focus:outline-none"
                      aria-label="Toggle node"
                    >
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: discipline.color }}
                    />
                    <span className="truncate text-xs font-black uppercase tracking-wider text-black sm:text-sm">
                      {discipline.name}
                    </span>
                    <span className="rounded-md bg-white border border-black/10 px-2 py-0.5 text-[10px] font-semibold text-black/50">
                      {discipline.activities.length} Activities
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onEditDiscipline(discipline)}
                      className="rounded-lg p-1.5 text-black/40 hover:bg-black/5 hover:text-black"
                      title="Edit discipline"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onAddActivity(discipline.id)}
                      className="flex items-center gap-1 rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-[11px] font-bold text-black hover:bg-black hover:text-white transition"
                    >
                      <Plus size={12} />
                      <span className="hidden sm:inline">Add Activity</span>
                    </button>
                  </div>
                </div>

                {/* Activities Sub-Tree */}
                {isExpanded && (
                  <div className="border-t border-black/6 bg-white px-4 py-3 pl-8 sm:pl-10 space-y-3">
                    {discipline.activities.length === 0 ? (
                      <p className="py-2 text-[11px] text-black/35 italic">
                        No activities registered under {discipline.name}.
                      </p>
                    ) : (
                      discipline.activities.map((activity) => {
                        const isActExpanded = expandedNodes[activity.id] ?? true;
                        return (
                          <div
                            key={activity.id}
                            className="rounded-xl border border-black/6 bg-[#fbfbfa] p-3 transition"
                          >
                            {/* Activity Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex min-w-0 flex-1 items-center gap-2">
                                <button
                                  onClick={() => toggleExpand(activity.id)}
                                  className="rounded p-0.5 text-black/40 hover:bg-black/5"
                                >
                                  {isActExpanded ? (
                                    <ChevronDown size={14} />
                                  ) : (
                                    <ChevronRight size={14} />
                                  )}
                                </button>
                                <Sparkles size={14} className="text-purple-600 shrink-0" />
                                <span className="truncate text-xs font-bold text-black">
                                  {activity.name}
                                </span>
                                <span className="rounded bg-black/5 px-1.5 py-0.5 text-[9px] font-medium text-black/45">
                                  /{activity.slug}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => onEditActivity(activity)}
                                  className="rounded p-1 text-black/40 hover:bg-black/5 hover:text-black"
                                  title="Edit activity"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => onAddProjectToActivity(activity.id)}
                                  className="flex items-center gap-1 rounded-md border border-black/10 bg-white px-2 py-1 text-[10px] font-bold text-black hover:bg-black hover:text-white transition"
                                >
                                  <Plus size={11} />
                                  <span>Add Project</span>
                                </button>
                              </div>
                            </div>

                            {/* Projects Sub-Tree */}
                            {isActExpanded && (
                              <div className="mt-2.5 space-y-1.5 border-l-2 border-black/10 pl-4">
                                {activity.contents.length === 0 ? (
                                  <p className="py-1 text-[10px] text-black/35">
                                    No project contents yet.
                                  </p>
                                ) : (
                                  activity.contents.map((content) => {
                                    const matchingDb = dbProjects.find(
                                      (p) => p.id === (content.projectId || content.id)
                                    );
                                    return (
                                      <div
                                        key={content.id}
                                        className="group flex items-center justify-between rounded-lg bg-white border border-black/5 p-2 transition hover:border-black/20"
                                      >
                                        <div
                                          onClick={() => onEditProject(matchingDb)}
                                          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2"
                                        >
                                          <FolderGit2
                                            size={13}
                                            className="text-black/40 group-hover:text-black shrink-0"
                                          />
                                          <span className="truncate text-xs font-semibold text-black">
                                            {content.name}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button
                                            onClick={() => onEditProject(matchingDb)}
                                            className="rounded p-1 text-black/40 hover:bg-black/5 hover:text-black"
                                            title="Edit project"
                                          >
                                            <Edit2 size={12} />
                                          </button>
                                          <button
                                            onClick={() => {
                                              if (
                                                window.confirm(
                                                  `「${content.name}」を削除しますか？`
                                                )
                                              ) {
                                                onDeleteProject(content.projectId || content.id);
                                              }
                                            }}
                                            className="rounded p-1 text-black/40 hover:bg-red-50 hover:text-red-600"
                                            title="Delete project"
                                          >
                                            <Trash2 size={12} />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
