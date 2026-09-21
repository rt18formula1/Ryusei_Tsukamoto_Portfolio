"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2 } from "lucide-react";
import type { Activity, DisciplineId } from "@/types/portfolio-hierarchy";

interface AdminActivityListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
  onCreate: () => void;
  disciplineFilter?: DisciplineId;
}

const DISCIPLINE_LABELS: Record<DisciplineId, string> = {
  developer: "DEVELOPER",
  illustrator: "ILLUSTRATOR",
  musician: "MUSICIAN",
  blogger: "BLOGGER",
  investor: "INVESTOR",
};

export function AdminActivityList({
  activities,
  onEdit,
  onDelete,
  onCreate,
  disciplineFilter,
}: AdminActivityListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDiscipline, setFilterDiscipline] = useState<DisciplineId | "all">(
    disciplineFilter || "all"
  );

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiscipline =
      filterDiscipline === "all" || activity.disciplineId === filterDiscipline;
    return matchesSearch && matchesDiscipline;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="rounded-md bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 uppercase tracking-wider">
            Activity List
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-black">
            Activities ({filteredActivities.length})
          </h2>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-black/80"
        >
          <Plus size={14} />
          <span>New Activity</span>
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
            placeholder="Search activities..."
            className="w-full rounded-xl border border-black/10 pl-9 pr-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30"
          />
        </div>
        <select
          value={filterDiscipline}
          onChange={(e) => setFilterDiscipline(e.target.value as DisciplineId | "all")}
          className="rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30"
        >
          <option value="all">All Disciplines</option>
          {Object.entries(DISCIPLINE_LABELS).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Activity List */}
      <div className="rounded-3xl border border-black/8 bg-white shadow-sm overflow-hidden">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-xs text-black/40">
            No activities found
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
                  Discipline
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
              {filteredActivities.map((activity) => (
                <tr key={activity.id} className="border-t border-black/5 hover:bg-black/[0.02]">
                  <td className="px-4 py-3">
                    <div className="text-xs font-bold text-black">{activity.name}</div>
                    {activity.description && (
                      <div className="text-[10px] text-black/40 mt-0.5 line-clamp-1">
                        {activity.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-black/60">{activity.slug}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-black/5 px-2 py-0.5 text-[10px] font-bold text-black/70">
                      {DISCIPLINE_LABELS[activity.disciplineId]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        activity.visible
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {activity.visible ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(activity)}
                        className="p-1.5 rounded-lg hover:bg-black/5 text-black/60 hover:text-black"
                        aria-label="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(activity.id)}
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
