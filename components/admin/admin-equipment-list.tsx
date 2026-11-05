"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Wrench,
  ChevronRight,
} from "lucide-react";
import type { DbEquipmentSection } from "@/lib/supabase-queries";
import type { DisciplineId } from "@/types/portfolio-map";

interface AdminEquipmentListProps {
  disciplineId?: DisciplineId;
  onEdit: (section: DbEquipmentSection) => void;
  onCreate: () => void;
  onDelete: (id: string) => Promise<void>;
}

const DISCIPLINE_COLORS: Record<string, string> = {
  developer: "bg-blue-100 text-blue-700 border-blue-200",
  musician: "bg-purple-100 text-purple-700 border-purple-200",
  illustrator: "bg-pink-100 text-pink-700 border-pink-200",
  photographer: "bg-amber-100 text-amber-700 border-amber-200",
  blogger: "bg-green-100 text-green-700 border-green-200",
  investor: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export function AdminEquipmentList({
  disciplineId,
  onEdit,
  onCreate,
  onDelete,
}: AdminEquipmentListProps) {
  const [sections, setSections] = useState<DbEquipmentSection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, [disciplineId]);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const { getAdminEquipmentSectionsAction } = await import("@/lib/admin-actions");
      const data = await getAdminEquipmentSectionsAction(disciplineId);
      setSections(data);
    } catch (error) {
      console.error("Failed to fetch equipment sections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このセクションを削除しますか？関連するアイテムも削除されます。")) return;
    await onDelete(id);
    setSections(sections.filter((s) => s.id !== id));
  };

  const filteredSections = sections.filter(
    (section) =>
      section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedSections = filteredSections.reduce((acc, section) => {
    if (!acc[section.discipline_id]) {
      acc[section.discipline_id] = [];
    }
    acc[section.discipline_id].push(section);
    return acc;
  }, {} as Record<string, DbEquipmentSection[]>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <Wrench size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-black">Equipment</h2>
            <p className="mt-1 text-sm text-black/60">
              Manage equipment/gear sections across all disciplines
            </p>
          </div>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-xs font-bold text-white hover:bg-orange-700 transition-colors"
        >
          <Plus size={16} />
          <span>New Section</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search equipment sections..."
          className="w-full rounded-2xl border border-black/10 bg-white pl-12 pr-4 py-4 text-sm text-black outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="rounded-3xl border border-black/8 bg-white p-12 text-center text-sm text-black/60">
          Loading equipment sections...
        </div>
      ) : filteredSections.length === 0 ? (
        <div className="rounded-3xl border border-black/8 bg-white p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 mx-auto mb-4">
            <Wrench size={32} className="text-orange-400" />
          </div>
          <h3 className="text-lg font-bold text-black mb-2">
            {searchQuery ? "No sections found" : "No equipment sections yet"}
          </h3>
          <p className="text-sm text-black/60 mb-6">
            {searchQuery
              ? "Try a different search term."
              : "Create your first equipment section to get started."}
          </p>
          {!searchQuery && (
            <button
              onClick={onCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-xs font-bold text-white hover:bg-orange-700 transition-colors"
            >
              <Plus size={16} />
              <span>Create First Section</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSections)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([disciplineId, disciplineSections]) => (
              <div key={disciplineId}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider border ${DISCIPLINE_COLORS[disciplineId] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                    {disciplineId}
                  </span>
                  <span className="text-xs text-black/50">
                    {disciplineSections.length} section{disciplineSections.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid gap-4">
                  {disciplineSections
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((section) => (
                      <div
                        key={section.id}
                        className="group flex items-center justify-between rounded-2xl border border-black/8 bg-white p-6 shadow-sm hover:border-orange-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-5">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-100 transition-colors">
                            <Wrench size={20} />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-black">{section.name}</h3>
                            <p className="text-xs text-black/50 mt-1">/{section.slug}</p>
                            {section.description && (
                              <p className="text-sm text-black/60 mt-2 line-clamp-1 max-w-md">
                                {section.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border ${
                            section.visible
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-black/5 text-black/50 border-black/10"
                          }`}>
                            {section.visible ? "Visible" : "Hidden"}
                          </span>
                          <button
                            onClick={() => onEdit(section)}
                            className="flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2.5 text-xs font-bold text-black hover:bg-black/5 transition-colors"
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(section.id)}
                            className="rounded-xl p-2.5 text-black/30 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
