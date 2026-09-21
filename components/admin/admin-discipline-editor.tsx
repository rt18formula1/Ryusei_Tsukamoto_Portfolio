"use client";

import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import type { Discipline, DisciplineId } from "@/types/portfolio-hierarchy";

interface AdminDisciplineEditorProps {
  discipline: Partial<Discipline>;
  onSave: (updatedDiscipline: Discipline) => void;
  onCancel: () => void;
}

const DISCIPLINE_COLORS = [
  { id: "developer", name: "DEVELOPER", color: "#2563eb" },
  { id: "illustrator", name: "ILLUSTRATOR", color: "#7c3aed" },
  { id: "musician", name: "MUSICIAN", color: "#db2777" },
  { id: "blogger", name: "BLOGGER", color: "#059669" },
  { id: "investor", name: "INVESTOR", color: "#d97706" },
];

export function AdminDisciplineEditor({
  discipline,
  onSave,
  onCancel,
}: AdminDisciplineEditorProps) {
  const [name, setName] = useState(discipline.name || "");
  const [slug, setSlug] = useState(discipline.slug || "");
  const [description, setDescription] = useState(discipline.description || "");
  const [color, setColor] = useState(discipline.color || "#2563eb");
  const [displayOrder, setDisplayOrder] = useState(discipline.displayOrder || 1);
  const [visible, setVisible] = useState(discipline.visible ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      alert("Name and Slug are required.");
      return;
    }

    const payload: Discipline = {
      id: (discipline.id || slug) as DisciplineId,
      name,
      slug,
      description,
      color,
      displayOrder,
      visible,
      activities: discipline.activities || [],
    };

    onSave(payload);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-bold text-black/50 hover:text-black"
        >
          <ArrowLeft size={16} />
          <span>Back to Hierarchy</span>
        </button>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-black/80"
        >
          <Save size={14} />
          <span>Save Discipline</span>
        </button>
      </div>

      {/* Form Box */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-black/8 bg-white p-6 sm:p-8 shadow-sm space-y-6"
      >

        <div>
          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
            Discipline Editor
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-black">
            {discipline.id ? `Edit ${discipline.name}` : "Create New Discipline"}
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="discipline-name" className="mb-1.5 block text-xs font-bold text-black/60">
              Discipline Name
            </label>
            <input
              id="discipline-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Developer, Illustrator"
              required
              aria-required="true"
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div>
            <label htmlFor="discipline-slug" className="mb-1.5 block text-xs font-bold text-black/60">Slug</label>
            <input
              id="discipline-slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. developer"
              required
              aria-required="true"
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </div>
        </div>

        <div>
          <label htmlFor="discipline-description" className="mb-1.5 block text-xs font-bold text-black/60">Description</label>
          <textarea
            id="discipline-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this discipline..."
            rows={3}
            className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5 resize-none"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="discipline-color" className="mb-1.5 block text-xs font-bold text-black/60">Color</label>
            <div className="flex gap-2">
              <input
                id="discipline-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-10 rounded-lg border border-black/10 cursor-pointer focus:ring-2 focus:ring-black/5"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#2563eb"
                aria-label="Color hex code"
                className="flex-1 rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
              />
            </div>
          </div>

          <div>
            <label htmlFor="discipline-order" className="mb-1.5 block text-xs font-bold text-black/60">Display Order</label>
            <input
              id="discipline-order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              min={1}
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="visible"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            className="h-4 w-4 rounded border-black/20 focus:ring-2 focus:ring-black/5"
          />
          <label htmlFor="visible" className="text-xs font-bold text-black/60">
            Visible in Portfolio
          </label>
        </div>
      </form>
    </div>
  );
}
