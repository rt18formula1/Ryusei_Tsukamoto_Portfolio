"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Check,
  Plus,
  Trash2,
  Upload,
  X,
  LoaderCircle,
  Eye,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { DbEquipmentSection, DbEquipmentItem } from "@/lib/supabase-queries";
import type { EquipmentSection, EquipmentItem } from "@/types/equipment";
import type { DisciplineId } from "@/types/portfolio-map";
import { uploadImageToStorage } from "@/lib/supabase-queries";

interface AdminEquipmentEditorProps {
  initialSection?: DbEquipmentSection | null;
  initialItems?: DbEquipmentItem[] | null;
  onSaveSection: (section: Partial<DbEquipmentSection>) => Promise<void>;
  onSaveItem: (item: Partial<DbEquipmentItem>) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onCancel: () => void;
}

const newId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function AdminEquipmentEditor({
  initialSection,
  initialItems,
  onSaveSection,
  onSaveItem,
  onDeleteItem,
  onCancel,
}: AdminEquipmentEditorProps) {
  const [sectionName, setSectionName] = useState(initialSection?.name || "");
  const [slug, setSlug] = useState(initialSection?.slug || "");
  const [disciplineId, setDisciplineId] = useState<DisciplineId>(
    initialSection?.discipline_id || "developer"
  );
  const [description, setDescription] = useState(initialSection?.description || "");
  const [displayOrder, setDisplayOrder] = useState(initialSection?.display_order || 0);
  const [visible, setVisible] = useState(initialSection?.visible ?? true);

  const [items, setItems] = useState<EquipmentItem[]>(
    initialItems?.map((item) => ({
      id: item.id,
      sectionId: item.section_id,
      name: item.name,
      description: item.description || undefined,
      imageUrl: item.image_url || undefined,
      displayOrder: item.display_order,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })) || []
  );

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSaveSection = async () => {
    if (!sectionName.trim() || !slug.trim()) {
      alert("Section name and slug are required.");
      return;
    }
    setSaving(true);
    try {
      await onSaveSection({
        id: initialSection?.id,
        discipline_id: disciplineId,
        name: sectionName,
        slug,
        description: description || null,
        display_order: displayOrder,
        visible,
      });
    } catch (e: unknown) {
      console.error(e);
      alert(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveItem = async (item: EquipmentItem) => {
    setSaving(true);
    try {
      await onSaveItem({
        id: item.id,
        section_id: initialSection?.id || "",
        name: item.name,
        description: item.description || null,
        image_url: item.imageUrl || null,
        display_order: item.displayOrder,
      });
    } catch (e: unknown) {
      console.error(e);
      alert(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("このアイテムを削除しますか？")) return;
    setSaving(true);
    try {
      await onDeleteItem(id);
      setItems(items.filter((i) => i.id !== id));
    } catch (e: unknown) {
      console.error(e);
      alert(e instanceof Error ? e.message : "削除に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: newId("eq-item"),
        sectionId: initialSection?.id || "",
        name: "",
        description: "",
        imageUrl: "",
        displayOrder: items.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  };

  const moveItem = (index: number, dir: "up" | "down") => {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    next.forEach((item, i) => (item.displayOrder = i + 1));
    setItems(next);
  };

  const uploadItemImage = async (file: File, itemIndex: number) => {
    setUploading(true);
    try {
      const url = await uploadImageToStorage("portfolio-images", file);
      const next = [...items];
      next[itemIndex].imageUrl = url;
      setItems(next);
      await handleSaveItem(next[itemIndex]);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-black/8 bg-[#fbfbfa]/95 px-4 py-3 backdrop-blur sm:px-6">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-bold text-black/50 hover:text-black"
        >
          <ArrowLeft size={16} />
          <span>一覧に戻る</span>
        </button>

        <div className="flex items-center gap-2.5">
          {initialSection?.id && (
            <Link
              href={`/portfolio/${disciplineId}/equipment/${initialSection.id}`}
              target="_blank"
              className="hidden items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold text-black hover:border-black/30 sm:flex"
            >
              <Eye size={13} />
              <span>Preview</span>
            </Link>
          )}

          <button
            onClick={handleSaveSection}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white hover:bg-black/80 disabled:opacity-50"
          >
            {saving ? <LoaderCircle size={13} className="animate-spin" /> : <Save size={13} />}
            <span>Save Section</span>
          </button>
        </div>
      </div>

      {/* Editor Main Container */}
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Left Column: Section Details & Items */}
        <div className="space-y-6">
          {/* Section Basic Info */}
          <div className="rounded-3xl border border-black/8 bg-white p-6 sm:p-8 shadow-sm">
            <div>
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                Equipment Section
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-black">
                {initialSection?.id ? `Edit ${sectionName}` : "Create New Equipment Section"}
              </h2>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-black/60">
                  Section Name
                </label>
                <input
                  type="text"
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  placeholder="e.g. Development Setup"
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-black/60">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. development-setup"
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-1.5 block text-xs font-bold text-black/60">Discipline</label>
              <div className="flex flex-wrap gap-2">
                {["developer", "illustrator", "musician", "blogger", "investor", "photographer"].map((discipline) => (
                  <button
                    key={discipline}
                    type="button"
                    onClick={() => setDisciplineId(discipline as DisciplineId)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold capitalize transition ${
                      disciplineId === discipline
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white text-black/60 hover:border-black/30"
                    }`}
                  >
                    {discipline}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-1.5 block text-xs font-bold text-black/60">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this equipment section..."
                rows={3}
                className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5 resize-none"
              />
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-black/60">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  min={0}
                  className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <input
                type="checkbox"
                id="section-visible"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                className="h-4 w-4 rounded border-black/20 focus:ring-2 focus:ring-black/5"
              />
              <label htmlFor="section-visible" className="text-xs font-bold text-black/60">
                Visible in Portfolio
              </label>
            </div>
          </div>

          {/* Equipment Items */}
          <div className="rounded-3xl border border-black/8 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-black">Equipment Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1.5 rounded-xl border border-black/10 px-3 py-1.5 text-xs font-bold text-black hover:bg-black/5"
              >
                <Plus size={13} /> Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-black/8 bg-white p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-black/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black/50">
                      Item {index + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveItem(index, "up")}
                        disabled={index === 0}
                        className="rounded p-1 text-black/30 hover:bg-black/5 disabled:opacity-20"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        onClick={() => moveItem(index, "down")}
                        disabled={index === items.length - 1}
                        className="rounded p-1 text-black/30 hover:bg-black/5 disabled:opacity-20"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="rounded p-1 text-black/30 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-black/60">Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const next = [...items];
                        next[index].name = e.target.value;
                        setItems(next);
                      }}
                      placeholder="e.g. MacBook Pro M3"
                      className="w-full rounded-lg border border-black/10 px-3 py-2 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-black/60">Description</label>
                    <textarea
                      value={item.description || ""}
                      onChange={(e) => {
                        const next = [...items];
                        next[index].description = e.target.value;
                        setItems(next);
                      }}
                      placeholder="Brief description..."
                      rows={2}
                      className="w-full rounded-lg border border-black/10 px-3 py-2 text-xs outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-black/60">Image</label>
                    {item.imageUrl ? (
                      <div className="space-y-2">
                        <div className="aspect-video rounded-lg overflow-hidden bg-black/5">
                          <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer text-xs font-bold text-black hover:underline">
                            Change Image
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) void uploadItemImage(file, index);
                              }}
                            />
                          </label>
                          <button
                            onClick={() => {
                              const next = [...items];
                              next[index].imageUrl = "";
                              setItems(next);
                            }}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-black/10 bg-black/[.02] text-xs font-bold text-black/40 hover:border-black hover:bg-black/[.04]">
                        <Upload size={20} />
                        <span>{uploading ? "Uploading..." : "Click to Upload Image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void uploadItemImage(file, index);
                          }}
                        />
                      </label>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveItem(item)}
                      disabled={saving}
                      className="flex items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-xs font-bold text-white hover:bg-black/80 disabled:opacity-50"
                    >
                      <Save size={12} />
                      <span>Save Item</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-black/8 bg-white p-5 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-wider text-black mb-3">Tips</h4>
            <ul className="space-y-2 text-xs text-black/60">
              <li>• Images are optional for equipment items</li>
              <li>• Use display order to control section visibility</li>
              <li>• Discipline determines which portfolio page shows this section</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
