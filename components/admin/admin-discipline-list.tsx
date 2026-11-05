"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Palette,
} from "lucide-react";
import type { DbDiscipline } from "@/types/discipline";

interface AdminDisciplineListProps {
  onEdit: (discipline: DbDiscipline) => void;
  onCreate: () => void;
  onDelete: (id: string) => Promise<void>;
}

export function AdminDisciplineList({
  onEdit,
  onCreate,
  onDelete,
}: AdminDisciplineListProps) {
  const [disciplines, setDisciplines] = useState<DbDiscipline[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisciplines();
  }, []);

  const fetchDisciplines = async () => {
    setLoading(true);
    try {
      const { getAdminDisciplinesAction } = await import("@/lib/admin-actions");
      const data = await getAdminDisciplinesAction();
      setDisciplines(data);
    } catch (error) {
      console.error("Failed to fetch disciplines:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このDisciplineを削除しますか？関連するActivityやEquipmentも影響を受ける可能性があります。")) return;
    await onDelete(id);
    setDisciplines(disciplines.filter((d) => d.id !== id));
  };

  const filteredDisciplines = disciplines.filter(
    (discipline) =>
      discipline.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discipline.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.28em] text-black/35">Portfolio Structure</p>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight">Disciplines</h1>
          <p className="mt-1 text-xs text-black/50">Manage portfolio disciplines (developer, illustrator, etc.)</p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-black/80"
        >
          <Plus size={15} />
          <span>New Discipline</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 text-black/35" size={14} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search disciplines..."
          className="w-full rounded-xl border border-black/10 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-black/30 focus:ring-1 focus:ring-black/10"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="rounded-3xl border border-black/8 bg-white p-12 text-center text-sm text-black/60">
          Loading disciplines...
        </div>
      ) : filteredDisciplines.length === 0 ? (
        <div className="rounded-3xl border border-black/8 bg-white p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mx-auto mb-4">
            <Palette size={32} className="text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-black mb-2">
            {searchQuery ? "No disciplines found" : "No disciplines yet"}
          </h3>
          <p className="text-sm text-black/60 mb-6">
            {searchQuery
              ? "Try a different search term."
              : "Create your first discipline to get started."}
          </p>
          {!searchQuery && (
            <button
              onClick={onCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-xs font-bold text-white hover:bg-black/80 transition-colors"
            >
              <Plus size={16} />
              <span>Create First Discipline</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredDisciplines
            .sort((a, b) => a.display_order - b.display_order)
            .map((discipline) => (
              <div
                key={discipline.id}
                className="flex items-center justify-between rounded-2xl border border-black/8 bg-white p-4 shadow-sm hover:border-black/20 transition"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: discipline.color }}
                  >
                    <Palette size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-black">{discipline.name}</h3>
                    <p className="text-xs text-black/50 mt-0.5">/{discipline.slug}</p>
                    {discipline.description && (
                      <p className="text-xs text-black/60 mt-1 line-clamp-1 max-w-md">
                        {discipline.description}
                      </p>
                    )}
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    discipline.visible
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-black/5 text-black/50"
                  }`}>
                    {discipline.visible ? "Visible" : "Hidden"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(discipline)}
                    className="flex items-center gap-1.5 rounded-xl border border-black/10 px-3 py-2 text-xs font-bold text-black hover:bg-black/5"
                  >
                    <Edit size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(discipline.id)}
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
