"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Check,
  Eye,
  Plus,
  Trash2,
  Upload,
  X,
  Type,
  ImageIcon,
  Link2,
  Layers,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from "lucide-react";
import type { DbDevProject } from "@/lib/supabase-queries";
import type {
  DevProjectInformation,
  DevProjectDetailBlock,
  DevProjectGalleryItem,
  DevProjectLink,
  DevProjectDetailBlockType,
  DevProjectStatus,
  DevProjectVisibility,
} from "@/types/dev-project";
import { uploadImageToStorage } from "@/lib/supabase-queries";

interface AdminProjectEditorProps {
  initialProject?: DbDevProject | null;
  onSave: (project: Partial<DbDevProject>, publish?: boolean) => Promise<void>;
  onCancel: () => void;
}

const DEFAULT_CATEGORIES = [
  "GENERAL",
  "INFRASTRUCTURE",
  "DATA",
  "AUTHENTICATION",
  "API / INTEGRATION",
  "TECHNOLOGY",
  "OTHER",
];

const newId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function AdminProjectEditor({
  initialProject,
  onSave,
  onCancel,
}: AdminProjectEditorProps) {
  const [projectName, setProjectName] = useState(initialProject?.project_name || "");
  const [shortDescription, setShortDescription] = useState(
    initialProject?.short_description || ""
  );
  const [mainVisualUrl, setMainVisualUrl] = useState(
    initialProject?.main_visual_url || ""
  );
  const [focalX, setFocalX] = useState(initialProject?.main_visual_focal_point_x ?? 0.5);
  const [focalY, setFocalY] = useState(initialProject?.main_visual_focal_point_y ?? 0.5);

  const [information, setInformation] = useState<DevProjectInformation[]>(
    Array.isArray(initialProject?.information) && initialProject.information.length > 0
      ? structuredClone(initialProject.information)
      : [
          {
            category: "GENERAL",
            items: [
              { label: "Status", value: "In Development", type: "Text" },
              { label: "Type", value: "Web Application", type: "Text" },
              { label: "Started", value: new Date().toISOString().slice(0, 10), type: "Text" },
              { label: "Platform", value: ["Web"], type: "Multiple Values" },
              { label: "Visibility", value: "Draft", type: "Text" },
            ],
          },
          { category: "TECHNOLOGY", items: [] },
        ]
  );

  const [details, setDetails] = useState<DevProjectDetailBlock[]>(
    Array.isArray(initialProject?.details) ? structuredClone(initialProject.details) : []
  );

  const [gallery, setGallery] = useState<DevProjectGalleryItem[]>(
    Array.isArray(initialProject?.gallery) ? structuredClone(initialProject.gallery) : []
  );

  const [links, setLinks] = useState<DevProjectLink[]>(
    Array.isArray(initialProject?.links) ? structuredClone(initialProject.links) : []
  );

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [addBlockMenu, setAddBlockMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "info" | "gallery" | "links">("content");

  const getGeneralItem = (label: string, fallback = "") => {
    const general = information.find((c) => c.category === "GENERAL");
    const item = general?.items.find((i) => i.label === label);
    if (!item) return fallback;
    return Array.isArray(item.value) ? item.value.join(", ") : String(item.value || fallback);
  };

  const setGeneralItem = (label: string, value: string | string[]) => {
    const next = structuredClone(information);
    let generalIndex = next.findIndex((c) => c.category === "GENERAL");
    if (generalIndex < 0) {
      next.unshift({ category: "GENERAL", items: [] });
      generalIndex = 0;
    }
    const items = [...next[generalIndex].items];
    const itemIndex = items.findIndex((i) => i.label === label);
    const updated = {
      label,
      value,
      type: Array.isArray(value) ? ("Multiple Values" as const) : ("Text" as const),
    };
    if (itemIndex < 0) {
      items.push(updated);
    } else {
      items[itemIndex] = updated;
    }
    next[generalIndex].items = items;
    setInformation(next);
  };

  const status = getGeneralItem("Status", "In Development");
  const visibility = getGeneralItem("Visibility", "Draft");
  const projectType = getGeneralItem("Type", "Web Application");
  const started = getGeneralItem("Started", new Date().toISOString().slice(0, 10));
  const platform = getGeneralItem("Platform", "Web");

  const handleSave = async (publish = false) => {
    if (!projectName.trim()) {
      alert("プロジェクトタイトルを入力してください。");
      return;
    }
    setSaving(true);
    try {
      if (publish) {
        setGeneralItem("Visibility", "Published");
      }
      const payload: Partial<DbDevProject> = {
        id: initialProject?.id,
        project_name: projectName,
        short_description: shortDescription,
        main_visual_url: mainVisualUrl || null,
        main_visual_focal_point_x: focalX,
        main_visual_focal_point_y: focalY,
        information,
        details: details.map((d, i) => ({ ...d, order: i + 1 })),
        gallery: gallery.map((g, i) => ({ ...g, order: i + 1 })),
        links: links.map((l, i) => ({ ...l, order: i + 1 })),
      };
      await onSave(payload, publish);
    } catch (e: unknown) {
      console.error(e);
      alert(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File, target: "cover" | "block" | "gallery") => {
    setUploading(true);
    try {
      const url = await uploadImageToStorage("portfolio-images", file);
      if (target === "cover") {
        setMainVisualUrl(url);
      } else if (target === "gallery") {
        setGallery([
          ...gallery,
          {
            id: newId("gal"),
            imageUrl: url,
            caption: "",
            altText: "",
            order: gallery.length + 1,
          },
        ]);
      } else {
        setDetails([
          ...details,
          {
            id: newId("blk"),
            type: "Image",
            imageUrl: url,
            imageCaption: "",
            order: details.length + 1,
          },
        ]);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const addBlock = (type: DevProjectDetailBlockType) => {
    setDetails([
      ...details,
      {
        id: newId("blk"),
        type,
        content: "",
        text: "",
        imageUrl: "",
        imageCaption: "",
        order: details.length + 1,
      },
    ]);
    setAddBlockMenu(false);
  };

  const moveBlock = (index: number, dir: "up" | "down") => {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= details.length) return;
    const next = [...details];
    [next[index], next[target]] = [next[target], next[index]];
    setDetails(next);
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
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              visibility === "Published"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-black/5 text-black/50"
            }`}
          >
            {visibility}
          </span>

          {initialProject?.id && (
            <Link
              href={`/portfolio/dev/${initialProject.id}`}
              target="_blank"
              className="hidden items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-bold text-black hover:border-black/30 sm:flex"
            >
              <Eye size={13} />
              <span>Preview</span>
            </Link>
          )}

          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs font-bold text-black hover:bg-black/5 disabled:opacity-50"
          >
            {saving ? <LoaderCircle size={13} className="animate-spin" /> : <Save size={13} />}
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white hover:bg-black/80 disabled:opacity-50"
          >
            <Check size={14} />
            <span>Publish</span>
          </button>
        </div>
      </div>

      {/* Editor Main Container */}
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Left Column: Content & Details */}
        <div className="space-y-6">
          {/* Basic Title & Short Description */}
          <div className="rounded-3xl border border-black/8 bg-white p-6 sm:p-8 shadow-sm">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project Name (e.g. F1 Telemetry Visualizer)"
              className="w-full bg-transparent text-2xl font-bold tracking-tight text-black outline-none placeholder:text-black/20 sm:text-4xl"
            />
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Short Description (1〜2文でプロダクトの概要を記述)"
              className="mt-4 w-full bg-transparent text-sm text-black/60 outline-none placeholder:text-black/25 sm:text-base"
            />
          </div>

          {/* Main Visual & Cover */}
          <div className="rounded-3xl border border-black/8 bg-white overflow-hidden shadow-sm">
            <div className="aspect-[16/9] bg-black/[.03] relative">
              {mainVisualUrl ? (
                <img
                  src={mainVisualUrl}
                  alt="Cover preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <label className="flex h-full cursor-pointer flex-col items-center justify-center gap-2 text-xs font-bold text-black/40 hover:bg-black/[.02]">
                  <Upload size={24} />
                  <span>{uploading ? "Uploading..." : "Click to Upload Main Visual"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadImage(file, "cover");
                    }}
                  />
                </label>
              )}
            </div>
            {mainVisualUrl && (
              <div className="flex items-center justify-between border-t border-black/8 p-3 px-4">
                <span className="text-[11px] font-bold text-black/40 uppercase">Main Visual</span>
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
                        if (file) void uploadImage(file, "cover");
                      }}
                    />
                  </label>
                  <button
                    onClick={() => setMainVisualUrl("")}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Editor Tabs: Details / Information / Gallery / Links */}
          <div className="flex border-b border-black/10 gap-4">
            {[
              { id: "content", label: "Project Details (Blocks)" },
              { id: "info", label: "Project Information (Structured)" },
              { id: "gallery", label: `Gallery (${gallery.length})` },
              { id: "links", label: `Links (${links.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === tab.id
                    ? "border-b-2 border-black text-black"
                    : "text-black/40 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Project Details (Blocks) */}
          {activeTab === "content" && (
            <div className="space-y-3">
              {details.map((block, index) => (
                <div
                  key={block.id}
                  className="rounded-2xl border border-black/8 bg-white p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-black/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black/50">
                      {block.type}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveBlock(index, "up")}
                        disabled={index === 0}
                        className="rounded p-1 text-black/30 hover:bg-black/5 disabled:opacity-20"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        onClick={() => moveBlock(index, "down")}
                        disabled={index === details.length - 1}
                        className="rounded p-1 text-black/30 hover:bg-black/5 disabled:opacity-20"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        onClick={() => setDetails(details.filter((_, i) => i !== index))}
                        className="rounded p-1 text-black/30 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {block.type === "Section" && (
                    <input
                      type="text"
                      value={block.content || ""}
                      onChange={(e) => {
                        const next = [...details];
                        next[index].content = e.target.value;
                        setDetails(next);
                      }}
                      placeholder="Section Heading"
                      className="w-full text-lg font-bold text-black outline-none border-b border-black/10 pb-1"
                    />
                  )}

                  {block.type === "Text" && (
                    <textarea
                      value={block.content || ""}
                      onChange={(e) => {
                        const next = [...details];
                        next[index].content = e.target.value;
                        setDetails(next);
                      }}
                      placeholder="Write markdown or narrative text..."
                      rows={4}
                      className="w-full text-xs leading-relaxed text-black/80 outline-none resize-none"
                    />
                  )}

                  {block.type === "Highlight" && (
                    <textarea
                      value={block.content || ""}
                      onChange={(e) => {
                        const next = [...details];
                        next[index].content = e.target.value;
                        setDetails(next);
                      }}
                      placeholder="Highlight callout text..."
                      rows={2}
                      className="w-full rounded-xl bg-black p-3 text-xs text-white outline-none"
                    />
                  )}

                  {block.type === "Image" && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={block.imageUrl || ""}
                        onChange={(e) => {
                          const next = [...details];
                          next[index].imageUrl = e.target.value;
                          setDetails(next);
                        }}
                        placeholder="Image URL (https://...)"
                        className="w-full rounded-lg border border-black/10 px-3 py-1.5 text-xs outline-none"
                      />
                      <input
                        type="text"
                        value={block.imageCaption || ""}
                        onChange={(e) => {
                          const next = [...details];
                          next[index].imageCaption = e.target.value;
                          setDetails(next);
                        }}
                        placeholder="Caption (optional)"
                        className="w-full rounded-lg border border-black/10 px-3 py-1.5 text-xs outline-none"
                      />
                    </div>
                  )}

                  {block.type === "ImageText" && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        value={block.imageUrl || ""}
                        onChange={(e) => {
                          const next = [...details];
                          next[index].imageUrl = e.target.value;
                          setDetails(next);
                        }}
                        placeholder="Image URL"
                        className="rounded-lg border border-black/10 px-3 py-1.5 text-xs outline-none"
                      />
                      <textarea
                        value={block.text || block.content || ""}
                        onChange={(e) => {
                          const next = [...details];
                          next[index].text = e.target.value;
                          next[index].content = e.target.value;
                          setDetails(next);
                        }}
                        placeholder="Text beside image..."
                        rows={3}
                        className="rounded-lg border border-black/10 px-3 py-1.5 text-xs outline-none"
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Add Block Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAddBlockMenu(!addBlockMenu)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-black/20 bg-white py-3.5 text-xs font-bold text-black/60 hover:border-black hover:text-black"
                >
                  <Plus size={15} />
                  <span>Add Detail Block</span>
                </button>

                {addBlockMenu && (
                  <div className="absolute left-0 bottom-full mb-2 grid w-full grid-cols-2 gap-2 rounded-2xl border border-black/10 bg-white p-2 shadow-xl sm:grid-cols-5 z-20">
                    <button
                      onClick={() => addBlock("Text")}
                      className="flex flex-col items-center gap-1.5 rounded-xl p-2.5 text-xs font-bold text-black hover:bg-black/5"
                    >
                      <Type size={16} /> Text
                    </button>
                    <button
                      onClick={() => addBlock("Section")}
                      className="flex flex-col items-center gap-1.5 rounded-xl p-2.5 text-xs font-bold text-black hover:bg-black/5"
                    >
                      <span className="text-base font-black">H</span> Section
                    </button>
                    <button
                      onClick={() => addBlock("Highlight")}
                      className="flex flex-col items-center gap-1.5 rounded-xl p-2.5 text-xs font-bold text-black hover:bg-black/5"
                    >
                      Highlight
                    </button>
                    <button
                      onClick={() => addBlock("Image")}
                      className="flex flex-col items-center gap-1.5 rounded-xl p-2.5 text-xs font-bold text-black hover:bg-black/5"
                    >
                      <ImageIcon size={16} /> Image
                    </button>
                    <button
                      onClick={() => addBlock("ImageText")}
                      className="flex flex-col items-center gap-1.5 rounded-xl p-2.5 text-xs font-bold text-black hover:bg-black/5"
                    >
                      <Link2 size={16} /> Image + Text
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Project Information (Structured Categories) */}
          {activeTab === "info" && (
            <div className="space-y-5">
              {/* AI Assistant Bar */}
              <div className="flex items-center justify-between rounded-2xl border border-black/8 bg-purple-50/50 p-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-600" />
                  <span className="text-xs font-bold text-black">AI Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClassifyType}
                    disabled={isClassifying || !projectName.trim()}
                    className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-black hover:border-black/30 disabled:opacity-50"
                  >
                    {isClassifying ? <LoaderCircle size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    <span>分類</span>
                  </button>
                  <button
                    onClick={handleScoreCompleteness}
                    disabled={isScoring}
                    className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-black hover:border-black/30 disabled:opacity-50"
                  >
                    {isScoring ? <LoaderCircle size={12} className="animate-spin" /> : <Layers size={12} />}
                    <span>完成度</span>
                  </button>
                </div>
              </div>

              {completenessScore !== null && (
                <div className="rounded-xl border border-black/8 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-black/60">コンテンツ完成度スコア</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-black/5 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all"
                          style={{ width: `${completenessScore * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-black">{Math.round(completenessScore * 100)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {information.map((cat, catIdx) => (
                <div
                  key={cat.category}
                  className="rounded-3xl border border-black/8 bg-white p-5 sm:p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-black/6 pb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-black">
                      {cat.category}
                    </span>
                    <button
                      onClick={() => {
                        const next = [...information];
                        next[catIdx].items.push({
                          label: "New Property",
                          value: "",
                          type: "Text",
                        });
                        setInformation(next);
                      }}
                      className="flex items-center gap-1 text-[11px] font-bold text-black hover:underline"
                    >
                      <Plus size={12} /> Add Item
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {cat.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="flex items-center gap-2 rounded-xl bg-black/[.02] p-2"
                      >
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const next = [...information];
                            next[catIdx].items[itemIdx].label = e.target.value;
                            setInformation(next);
                          }}
                          placeholder="Label"
                          className="w-1/3 rounded-lg border border-black/10 px-2.5 py-1.5 text-xs font-bold outline-none"
                        />
                        <input
                          type="text"
                          value={
                            Array.isArray(item.value) ? item.value.join(", ") : String(item.value || "")
                          }
                          onChange={(e) => {
                            const next = [...information];
                            const val = e.target.value;
                            next[catIdx].items[itemIdx].value =
                              item.type === "Multiple Values"
                                ? val.split(",").map((s) => s.trim())
                                : val;
                            setInformation(next);
                          }}
                          placeholder="Value"
                          className="flex-1 rounded-lg border border-black/10 px-2.5 py-1.5 text-xs outline-none"
                        />
                        <button
                          onClick={() => {
                            const next = [...information];
                            next[catIdx].items.splice(itemIdx, 1);
                            setInformation(next);
                          }}
                          className="rounded p-1 text-black/30 hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Add Custom Category Button */}
              <button
                type="button"
                onClick={() => {
                  const customName = prompt("新規カテゴリ名を入力してください (例: PERFORMANCE, DESIGN):");
                  if (customName && customName.trim()) {
                    setInformation([
                      ...information,
                      { category: customName.trim().toUpperCase(), items: [] },
                    ]);
                  }
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-black/15 bg-white py-3 text-xs font-bold text-black hover:bg-black/5"
              >
                <Plus size={14} />
                <span>Add Custom Category</span>
              </button>
            </div>
          )}

          {/* Tab 3: Gallery */}
          {activeTab === "gallery" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-black/60">
                  Screenshots & Visual Outputs
                </span>
                <label className="cursor-pointer rounded-xl bg-black px-3.5 py-2 text-xs font-bold text-white hover:bg-black/80">
                  {uploading ? "Uploading..." : "+ Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadImage(file, "gallery");
                    }}
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {gallery.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-black/8 bg-white p-3 space-y-2 shadow-sm"
                  >
                    <div className="aspect-[16/9] rounded-xl overflow-hidden bg-black/5">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <input
                      type="text"
                      value={item.caption || ""}
                      onChange={(e) => {
                        const next = [...gallery];
                        next[index].caption = e.target.value;
                        setGallery(next);
                      }}
                      placeholder="Caption"
                      className="w-full rounded-lg border border-black/10 px-2.5 py-1 text-xs outline-none"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => setGallery(gallery.filter((_, i) => i !== index))}
                        className="text-[10px] font-bold text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Links */}
          {activeTab === "links" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-black/60">
                  Website, GitHub & Additional Links
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLinks([
                      ...links,
                      {
                        id: newId("lnk"),
                        title: "Website",
                        description: "",
                        url: "https://",
                        buttonLabel: "Open",
                        order: links.length + 1,
                      },
                    ])
                  }
                  className="flex items-center gap-1 rounded-xl border border-black/10 px-3 py-1.5 text-xs font-bold text-black hover:bg-black/5"
                >
                  <Plus size={13} /> Add Link
                </button>
              </div>

              {links.map((link, index) => (
                <div
                  key={link.id}
                  className="grid gap-2 rounded-2xl border border-black/8 bg-white p-3 sm:grid-cols-[120px_1fr_1.5fr_40px]"
                >
                  <select
                    value={link.title}
                    onChange={(e) => {
                      const next = [...links];
                      next[index].title = e.target.value;
                      setLinks(next);
                    }}
                    className="rounded-lg border border-black/10 bg-white px-2 py-1.5 text-xs outline-none"
                  >
                    <option>Website</option>
                    <option>GitHub</option>
                    <option>Documentation</option>
                    <option>App Store</option>
                    <option>Additional</option>
                  </select>
                  <input
                    type="text"
                    value={link.description}
                    onChange={(e) => {
                      const next = [...links];
                      next[index].description = e.target.value;
                      setLinks(next);
                    }}
                    placeholder="Description (required)"
                    className="rounded-lg border border-black/10 px-2.5 py-1.5 text-xs outline-none"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => {
                      const next = [...links];
                      next[index].url = e.target.value;
                      setLinks(next);
                    }}
                    placeholder="Full URL (https://...)"
                    className="rounded-lg border border-black/10 px-2.5 py-1.5 text-xs outline-none"
                  />
                  <button
                    onClick={() => setLinks(links.filter((_, i) => i !== index))}
                    className="flex items-center justify-center rounded text-black/30 hover:bg-red-50 hover:text-red-600"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Metadata Sidebar */}
        <div className="space-y-5">
          <div className="rounded-3xl border border-black/8 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-black">
              Publishing & Status
            </h3>

            <div>
              <label className="mb-1 block text-[11px] font-bold text-black/60">Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setGeneralItem("Visibility", e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold outline-none"
              >
                <option value="Published">Published (公開)</option>
                <option value="Draft">Draft (下書き)</option>
                <option value="Hidden">Hidden (非公開)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold text-black/60">Project Status</label>
              <select
                value={status}
                onChange={(e) => setGeneralItem("Status", e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold outline-none"
              >
                <option value="Public">Public (公開運用中)</option>
                <option value="In Development">In Development (開発中)</option>
                <option value="Private">Private (非公開)</option>
                <option value="Archived">Archived (アーカイブ)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold text-black/60">Type</label>
              <input
                type="text"
                value={projectType}
                onChange={(e) => setGeneralItem("Type", e.target.value)}
                placeholder="Web Application"
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold text-black/60">Platform</label>
              <input
                type="text"
                value={platform}
                onChange={(e) => setGeneralItem("Platform", e.target.value.split(",").map((s) => s.trim()))}
                placeholder="Web, Mobile, Desktop"
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold text-black/60">Started</label>
              <input
                type="text"
                value={started}
                onChange={(e) => setGeneralItem("Started", e.target.value)}
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-xs font-semibold outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
