"use client";

import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import type { HierarchyContent, ContentType } from "@/types/portfolio-hierarchy";

interface AdminContentEditorProps {
  content: Partial<HierarchyContent>;
  onSave: (updatedContent: HierarchyContent) => void;
  onCancel: () => void;
}

const CONTENT_TYPES: Array<{ value: ContentType; label: string }> = [
  { value: "artwork", label: "Artwork" },
  { value: "work", label: "Work" },
  { value: "article", label: "Article" },
  { value: "research", label: "Research" },
];

export function AdminContentEditor({
  content,
  onSave,
  onCancel,
}: AdminContentEditorProps) {
  const [name, setName] = useState(content.name || "");
  const [slug, setSlug] = useState(content.slug || "");
  const [contentType, setContentType] = useState<ContentType>(
    content.type || "artwork"
  );
  const [description, setDescription] = useState(content.description || "");
  const [mainVisualUrl, setMainVisualUrl] = useState(content.mainVisualUrl || "");
  const [displayOrder, setDisplayOrder] = useState(content.displayOrder || 1);
  const [visible, setVisible] = useState(content.visible ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      alert("Name and Slug are required.");
      return;
    }

    const payload: HierarchyContent = {
      id: content.id || slug,
      name,
      slug,
      type: contentType,
      description,
      mainVisualUrl,
      displayOrder,
      visible,
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
          <span>Save Content</span>
        </button>
      </div>

      {/* Form Box */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-black/8 bg-white p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div>
          <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 uppercase tracking-wider">
            Content Editor
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-black">
            {content.id ? `Edit ${content.name}` : "Create New Content"}
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="content-name" className="mb-1.5 block text-xs font-bold text-black/60">
              Content Name
            </label>
            <input
              id="content-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Digital Art, Music Track"
              required
              aria-required="true"
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div>
            <label htmlFor="content-slug" className="mb-1.5 block text-xs font-bold text-black/60">Slug</label>
            <input
              id="content-slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. digital-art"
              required
              aria-required="true"
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
            />
          </div>
        </div>

        <div>
          <label htmlFor="content-type" className="mb-1.5 block text-xs font-bold text-black/60">Content Type</label>
          <select
            id="content-type"
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ContentType)}
            className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
          >
            {CONTENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="content-description" className="mb-1.5 block text-xs font-bold text-black/60">Description</label>
          <textarea
            id="content-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this content..."
            rows={3}
            className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5 resize-none"
          />
        </div>

        <div>
          <label htmlFor="content-visual" className="mb-1.5 block text-xs font-bold text-black/60">Main Visual URL</label>
          <input
            id="content-visual"
            type="url"
            value={mainVisualUrl}
            onChange={(e) => setMainVisualUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="content-order" className="mb-1.5 block text-xs font-bold text-black/60">Display Order</label>
            <input
              id="content-order"
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
            id="content-visible"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            className="h-4 w-4 rounded border-black/20 focus:ring-2 focus:ring-black/5"
          />
          <label htmlFor="content-visible" className="text-xs font-bold text-black/60">
            Visible in Portfolio
          </label>
        </div>
      </form>
    </div>
  );
}
