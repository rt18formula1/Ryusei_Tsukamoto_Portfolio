"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import type { HierarchyContent } from "@/types/portfolio-hierarchy";

interface AdminProjectListProps {
  projects: HierarchyContent[];
  onEdit: (project: HierarchyContent) => void;
  onDelete: (projectId: string) => void;
  onCreate: () => void;
  activityId?: string;
}

export function AdminProjectList({
  projects,
  onEdit,
  onDelete,
  onCreate,
  activityId,
}: AdminProjectListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterVisibility, setFilterVisibility] = useState<"all" | "visible" | "hidden">("all");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || project.type === filterType;
    const matchesVisibility =
      filterVisibility === "all" ||
      (filterVisibility === "visible" && project.visible) ||
      (filterVisibility === "hidden" && !project.visible);
    return matchesSearch && matchesType && matchesVisibility;
  });

  const CONTENT_TYPES = ["project", "artwork", "work", "article", "research"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
            Project List
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-black">
            Projects ({filteredProjects.length})
          </h2>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-black/80"
        >
          <Plus size={14} />
          <span>New Project</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-xl border border-black/10 pl-9 pr-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30"
        >
          <option value="all">All Types</option>
          {CONTENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={filterVisibility}
          onChange={(e) => setFilterVisibility(e.target.value as "all" | "visible" | "hidden")}
          className="rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30"
        >
          <option value="all">All Status</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      {/* Project List */}
      <div className="rounded-3xl border border-black/8 bg-white shadow-sm overflow-hidden">
        {filteredProjects.length === 0 ? (
          <div className="p-8 text-center text-xs text-black/40">
            No projects found
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-black/5">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-black/60 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-black/60 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-black/60 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-black/60 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-bold text-black/60 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} className="border-t border-black/5 hover:bg-black/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {project.mainVisualUrl && (
                        <div className="h-10 w-10 rounded-lg bg-black/5 overflow-hidden">
                          <img
                            src={project.mainVisualUrl}
                            alt={project.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-black">{project.name}</div>
                        {project.description && (
                          <div className="text-[10px] text-black/40 mt-0.5 line-clamp-1">
                            {project.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-black/60">{project.slug}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-black/5 px-2 py-0.5 text-[10px] font-bold text-black/70 capitalize">
                      {project.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        project.visible
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {project.visible ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(project)}
                        className="p-1.5 rounded-lg hover:bg-black/5 text-black/60 hover:text-black"
                        aria-label="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(project.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-black/60 hover:text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
