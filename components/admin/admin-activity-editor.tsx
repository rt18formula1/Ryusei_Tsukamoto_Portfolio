"use client";

import React, { useState } from "react";
import { ArrowLeft, Save, Plus, Trash2, X, Upload } from "lucide-react";
import type { Activity, DisciplineId } from "@/types/portfolio-hierarchy";

interface AdminActivityEditorProps {
  activity: Partial<Activity>;
  onSave: (updatedActivity: Activity) => void;
  onCancel: () => void;
}

const DISCIPLINES: Array<{ id: DisciplineId; label: string }> = [
  { id: "developer", label: "DEVELOPER" },
  { id: "illustrator", label: "ILLUSTRATOR" },
  { id: "musician", label: "MUSICIAN" },
  { id: "blogger", label: "BLOGGER" },
  { id: "investor", label: "INVESTOR" },
];

export function AdminActivityEditor({
  activity,
  onSave,
  onCancel,
}: AdminActivityEditorProps) {
  const [name, setName] = useState(activity.name || "");
  const [slug, setSlug] = useState(activity.slug || "");
  const [disciplineId, setDisciplineId] = useState<DisciplineId>(
    activity.disciplineId || "developer"
  );
  const [description, setDescription] = useState(activity.description || "");
  const [visualUrl, setVisualUrl] = useState(activity.visual?.image || "");
  const [links, setLinks] = useState(activity.links || []);
  const [displayOrder, setDisplayOrder] = useState(activity.displayOrder || 1);
  const [visible, setVisible] = useState(activity.visible ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      alert("Name and Slug are required.");
      return;
    }

    const payload: Activity = {
      id: activity.id || slug,
      name,
      slug,
      disciplineId,
      description,
      visual: visualUrl ? { image: visualUrl } : undefined,
      links,
      contentType: activity.contentType || "project",
      contents: activity.contents || [],
      displayOrder,
      visible,
    };

    onSave(payload);
  };

  const addLink = () => {
    setLinks([...links, { label: "", url: "" }]);
  };

  const updateLink = (index: number, key: "label" | "url", value: string) => {
    const next = [...links];
    next[index] = { ...next[index], [key]: value };
    setLinks(next);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
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
          <span>Save Activity</span>
        </button>
      </div>

      {/* Form Box */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-black/8 bg-white p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div>
          <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 uppercase tracking-wider">
            Activity / Brand Editor
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-black">
            {activity.id ? `Edit ${activity.name}` : "Create New Activity"}
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-black/60">
              Activity / Brand Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. rt18_dev, Fine Day Plus"
              required
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-black/60">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. rt18-dev"
              required
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-black/60">
            Parent Discipline
          </label>
          <select
            value={disciplineId}
            onChange={(e) => setDisciplineId(e.target.value as DisciplineId)}
            className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-xs text-black outline-none"
          >
            {DISCIPLINES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-black/60">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this activity, scope, and purpose..."
            rows={3}
            className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-black/60">
            Visual Image URL (Optional)
          </label>
          <input
            type="text"
            value={visualUrl}
            onChange={(e) => setVisualUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none"
          />
        </div>

        {/* Links Section */}
        <div className="border-t border-black/8 pt-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-black">External Links & Socials</h4>
            <button
              type="button"
              onClick={addLink}
              className="flex items-center gap-1 rounded-lg border border-black/10 px-2.5 py-1 text-[11px] font-bold text-black hover:bg-black/5"
            >
              <Plus size={12} />
              <span>Add Link</span>
            </button>
          </div>

          <div className="space-y-2">
            {links.map((link, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-xl bg-black/[.02] p-2 border border-black/5"
              >
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink(index, "label", e.target.value)}
                  placeholder="Label"
                  className="w-1/3 rounded-lg border border-black/10 px-2.5 py-1.5 text-xs outline-none"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateLink(index, "url", e.target.value)}
                  placeholder="https://"
                  className="flex-1 rounded-lg border border-black/10 px-2.5 py-1.5 text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="rounded p-1.5 text-black/30 hover:bg-red-50 hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Visibility & Order */}
        <div className="flex items-center justify-between border-t border-black/8 pt-5">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="activity-visible"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-black"
            />
            <label htmlFor="activity-visible" className="text-xs font-bold text-black">
              Visible on Public Portfolio
            </label>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-black/60">Display Order:</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-16 rounded-lg border border-black/10 px-2 py-1 text-xs text-center"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
