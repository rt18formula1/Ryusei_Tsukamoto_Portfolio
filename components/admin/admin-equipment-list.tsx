"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  Search,
} from "lucide-react";
import type { DbEquipmentSection } from "@/lib/supabase-queries";
import type { DisciplineId } from "@/types/portfolio-map";

interface AdminEquipmentListProps {
  disciplineId?: DisciplineId;
  onEdit: (section: DbEquipmentSection) => void;
  onCreate: () => void;
  onDelete: (id: string) => Promise<void>;
}

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">Equipment Sections</h2>
          <p className="mt-1 text-sm text-black/60">
            Manage equipment/gear sections for {disciplineId || "all disciplines"}
          </p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-black/80"
        >
          <Plus size={14} />
          <span>New Section</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" size={16} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search sections..."
          className="w-full rounded-xl border border-black/10 pl-10 pr-4 py-2.5 text-xs text-black outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="rounded-3xl border border-black/8 bg-white p-8 text-center text-sm text-black/60">
          Loading...
        </div>
      ) : filteredSections.length === 0 ? (
        <div className="rounded-3xl border border-black/8 bg-white p-8 text-center text-sm text-black/60">
          {searchQuery ? "No sections found matching your search." : "No equipment sections yet. Create your first one!"}
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className="flex items-center justify-between rounded-2xl border border-black/8 bg-white p-4 shadow-sm hover:border-black/20 transition"
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-black">{section.name}</h3>
                  <p className="text-xs text-black/50 mt-0.5">/{section.slug}</p>
                </div>
                <span className="rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black/60">
                  {section.discipline_id}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  section.visible ? "bg-emerald-50 text-emerald-700" : "bg-black/5 text-black/50"
                }`}>
                  {section.visible ? "Visible" : "Hidden"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(section)}
                  className="flex items-center gap-1.5 rounded-xl border border-black/10 px-3 py-2 text-xs font-bold text-black hover:bg-black/5"
                >
                  <Edit size={13} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(section.id)}
                  className="rounded-xl p-2 text-black/30 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
