"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createDevProjectAction,
  updateDevProjectAction,
  uploadDevProjectImageAction,
  deleteDevProjectAction,
} from "@/lib/admin-actions";
import type { DbDevProject } from "@/lib/supabase-queries";

/* ---------- Section wrapper ---------- */
function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="border border-black/10 rounded-xl p-5 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ---------- Field label ---------- */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
      {children}
    </label>
  );
}

const inputCls = "w-full px-3 py-2 border border-black/10 rounded-lg text-sm font-bold focus:outline-none focus:border-black";
const textareaCls = "w-full text-sm resize-none focus:outline-none leading-relaxed border border-black/10 rounded-lg px-3 py-2 focus:border-black";

/* ---------- Information Editor ---------- */
const CATEGORIES = ["GENERAL", "INFRASTRUCTURE", "DATA", "AUTHENTICATION", "API / INTEGRATION", "OTHER"];
const STATUS_OPTIONS = ["Public", "In Development", "Private", "Archived"];
const TYPE_OPTIONS = ["Web Application", "Website", "Tool"];
const PLATFORM_OPTIONS = ["Web", "iOS", "iPadOS", "macOS", "Android", "Windows", "Desktop", "API", "Other"];

function InformationEditor({ information, setInformation }: { information: any[]; setInformation: (v: any[]) => void }) {
  const update = (idx: number, patch: any) => {
    setInformation(information.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };
  const updateItem = (catIdx: number, itemIdx: number, patch: any) => {
    setInformation(
      information.map((c, ci) =>
        ci === catIdx
          ? { ...c, items: c.items.map((it: any, ii: number) => (ii === itemIdx ? { ...it, ...patch } : it)) }
          : c
      )
    );
  };

  return (
    <div className="space-y-4">
      {information.map((cat, catIdx) => (
        <div key={catIdx} className="border border-black/10 rounded-xl p-4 bg-gray-50 space-y-3">
          <div className="flex items-center justify-between">
            <select
              value={cat.category}
              onChange={(e) => update(catIdx, { category: e.target.value })}
              className="w-1/2 px-2 py-1.5 bg-white border border-black/10 rounded-lg text-sm font-bold appearance-none"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              {!CATEGORIES.includes(cat.category) && <option value={cat.category}>{cat.category}</option>}
            </select>
            <button
              onClick={() => setInformation(information.filter((_, i) => i !== catIdx))}
              className="text-xs font-bold text-red-500 hover:underline"
            >
              Remove Category
            </button>
          </div>
          <div className="space-y-2">
            {cat.items?.map((item: any, itemIdx: number) => (
              <div key={itemIdx} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Label"
                  value={item.label}
                  onChange={(e) => updateItem(catIdx, itemIdx, { label: e.target.value })}
                  className="w-1/3 px-2 py-1.5 rounded-lg border border-black/10 bg-white text-sm font-bold"
                />
                {item.label === "Status" ? (
                  <select
                    value={Array.isArray(item.value) ? item.value[0] : item.value}
                    onChange={(e) => updateItem(catIdx, itemIdx, { value: e.target.value })}
                    className="w-2/3 px-2 py-1.5 rounded-lg border border-black/10 bg-white text-sm"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : item.label === "Type" ? (
                  <select
                    value={Array.isArray(item.value) ? item.value[0] : item.value}
                    onChange={(e) => updateItem(catIdx, itemIdx, { value: e.target.value })}
                    className="w-2/3 px-2 py-1.5 rounded-lg border border-black/10 bg-white text-sm"
                  >
                    {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                ) : item.label === "Platform" ? (
                  <input
                    type="text"
                    placeholder="Comma-separated (e.g. Web, iOS)"
                    value={Array.isArray(item.value) ? item.value.join(", ") : item.value}
                    onChange={(e) => {
                      const values = e.target.value.split(",").map((v) => v.trim()).filter(Boolean);
                      updateItem(catIdx, itemIdx, { value: values.length > 1 ? values : e.target.value, type: values.length > 1 ? "Multiple Values" : "Text" });
                    }}
                    className="w-2/3 px-2 py-1.5 rounded-lg border border-black/10 bg-white text-sm"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="Value"
                    value={Array.isArray(item.value) ? item.value.join(", ") : item.value}
                    onChange={(e) => updateItem(catIdx, itemIdx, { value: e.target.value })}
                    className="w-2/3 px-2 py-1.5 rounded-lg border border-black/10 bg-white text-sm"
                  />
                )}
                <button
                  onClick={() => setInformation(information.map((c, ci) => ci === catIdx ? { ...c, items: c.items.filter((_: any, ii: number) => ii !== itemIdx) } : c))}
                  className="text-xs font-bold text-red-500 px-1"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => update(catIdx, { items: [...(cat.items || []), { label: "", value: "", type: "Text" }] })}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              + Add Item
            </button>
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <button
          onClick={() => setInformation([...information, { category: "GENERAL", items: [] }])}
          className="text-xs font-bold text-blue-600 hover:underline"
        >
          + Add Category
        </button>
        <button
          onClick={() => setInformation([...information, { category: "", items: [] }])}
          className="text-xs font-bold text-blue-600 hover:underline"
        >
          + Add Custom Category
        </button>
      </div>
    </div>
  );
}

/* ---------- Details Editor ---------- */
const BLOCK_TYPES = ["Section", "Text", "Image", "ImageText", "Highlight"];

function DetailsEditor({ details, setDetails }: { details: any[]; setDetails: (v: any[]) => void }) {
  const update = (idx: number, patch: any) => {
    setDetails(details.map((b, i) => (i === idx ? { ...b, ...patch } : b)));
  };

  return (
    <div className="space-y-3">
      {details.map((block, idx) => (
        <div key={idx} className="border border-black/10 rounded-xl p-4 bg-gray-50 space-y-3">
          <div className="flex items-center justify-between">
            <select
              value={block.type}
              onChange={(e) => update(idx, { type: e.target.value })}
              className="w-1/3 px-2 py-1.5 bg-white border border-black/10 rounded-lg text-sm font-bold appearance-none"
            >
              {BLOCK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="flex gap-2">
              {idx > 0 && (
                <button onClick={() => {
                  const next = [...details];
                  [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                  setDetails(next);
                }} className="text-xs font-bold text-gray-500 hover:text-black">↑</button>
              )}
              {idx < details.length - 1 && (
                <button onClick={() => {
                  const next = [...details];
                  [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                  setDetails(next);
                }} className="text-xs font-bold text-gray-500 hover:text-black">↓</button>
              )}
              <button
                onClick={() => setDetails(details.filter((_, i) => i !== idx))}
                className="text-xs font-bold text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
          {(block.type === "Section" || block.type === "Highlight") && (
            <input
              type="text"
              placeholder={block.type === "Section" ? "Section Title" : "Highlight text"}
              value={block.content || ""}
              onChange={(e) => update(idx, { content: e.target.value })}
              className="w-full px-2 py-1.5 bg-white border border-black/10 rounded-lg text-sm font-bold"
            />
          )}
          {block.type === "Text" && (
            <textarea
              placeholder="Text content…"
              rows={4}
              value={block.content || ""}
              onChange={(e) => update(idx, { content: e.target.value })}
              className={textareaCls}
            />
          )}
          {block.type === "Image" && (
            <div className="space-y-2">
              <input type="text" placeholder="Image URL" value={block.imageUrl || ""} onChange={(e) => update(idx, { imageUrl: e.target.value })} className={inputCls} />
              <input type="text" placeholder="Caption (optional)" value={block.imageCaption || ""} onChange={(e) => update(idx, { imageCaption: e.target.value })} className={inputCls} />
            </div>
          )}
          {block.type === "ImageText" && (
            <div className="space-y-2">
              <input type="text" placeholder="Image URL" value={block.imageUrl || ""} onChange={(e) => update(idx, { imageUrl: e.target.value })} className={inputCls} />
              <textarea placeholder="Text content…" rows={3} value={block.text || ""} onChange={(e) => update(idx, { text: e.target.value })} className={textareaCls} />
              <input type="text" placeholder="Caption (optional)" value={block.imageCaption || ""} onChange={(e) => update(idx, { imageCaption: e.target.value })} className={inputCls} />
            </div>
          )}
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        {BLOCK_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setDetails([...details, { id: `d${Date.now()}`, type: t, content: "", order: details.length }])}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            + {t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Gallery Editor ---------- */
function GalleryEditor({ gallery, setGallery }: { gallery: any[]; setGallery: (v: any[]) => void }) {
  const update = (idx: number, patch: any) => {
    setGallery(gallery.map((g, i) => (i === idx ? { ...g, ...patch } : g)));
  };
  return (
    <div className="space-y-3">
      {gallery.map((item, idx) => (
        <div key={idx} className="flex flex-wrap gap-2 border border-black/10 rounded-xl p-3 bg-gray-50">
          <input type="text" placeholder="Image URL" value={item.imageUrl} onChange={(e) => update(idx, { imageUrl: e.target.value })} className="w-full px-2 py-1.5 bg-white border border-black/10 rounded-lg text-sm" />
          <input type="text" placeholder="Caption" value={item.caption || ""} onChange={(e) => update(idx, { caption: e.target.value })} className="w-1/2 px-2 py-1.5 bg-white border border-black/10 rounded-lg text-sm" />
          <input type="text" placeholder="Alt Text" value={item.description || ""} onChange={(e) => update(idx, { description: e.target.value })} className="w-1/2 px-2 py-1.5 bg-white border border-black/10 rounded-lg text-sm" />
          <button onClick={() => setGallery(gallery.filter((_, i) => i !== idx))} className="text-xs font-bold text-red-500">✕ Remove</button>
        </div>
      ))}
      <button
        onClick={() => setGallery([...gallery, { id: `g${Date.now()}`, imageUrl: "", caption: "", description: "", order: gallery.length }])}
        className="text-xs font-bold text-blue-600 hover:underline"
      >
        + Add Image
      </button>
    </div>
  );
}

/* ---------- Links Editor ---------- */
function LinksEditor({ links, setLinks }: { links: any[]; setLinks: (v: any[]) => void }) {
  const update = (idx: number, patch: any) => {
    setLinks(links.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  };
  return (
    <div className="space-y-3">
      {links.map((item, idx) => (
        <div key={idx} className="border border-black/10 rounded-xl p-3 bg-gray-50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{item.title || "Link"}</span>
            <button onClick={() => setLinks(links.filter((_, i) => i !== idx))} className="text-xs font-bold text-red-500">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Title" value={item.title || ""} onChange={(e) => update(idx, { title: e.target.value })} className="px-2 py-1.5 bg-white border border-black/10 rounded-lg text-sm font-bold" />
            <input type="text" placeholder="Button Label" value={item.buttonLabel || ""} onChange={(e) => update(idx, { buttonLabel: e.target.value })} className="px-2 py-1.5 bg-white border border-black/10 rounded-lg text-sm" />
            <input type="text" placeholder="Description (required)" value={item.description || ""} onChange={(e) => update(idx, { description: e.target.value })} className="col-span-2 px-2 py-1.5 bg-white border border-black/10 rounded-lg text-sm" />
            <input type="text" placeholder="URL" value={item.url || ""} onChange={(e) => update(idx, { url: e.target.value })} className="col-span-2 px-2 py-1.5 bg-white border border-black/10 rounded-lg text-sm font-mono" />
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <button onClick={() => setLinks([...links, { id: `l${Date.now()}`, title: "Website", description: "", url: "", buttonLabel: "Visit", order: links.length }])} className="text-xs font-bold text-blue-600 hover:underline">+ Website</button>
        <button onClick={() => setLinks([...links, { id: `l${Date.now()}`, title: "GitHub", description: "", url: "", buttonLabel: "View Code", order: links.length }])} className="text-xs font-bold text-blue-600 hover:underline">+ GitHub</button>
        <button onClick={() => setLinks([...links, { id: `l${Date.now()}`, title: "", description: "", url: "", buttonLabel: "", order: links.length }])} className="text-xs font-bold text-blue-600 hover:underline">+ Additional Link</button>
      </div>
    </div>
  );
}

/* ---------- Main Project Editor ---------- */
export function ProjectEditor({ project }: { project?: DbDevProject }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projectName, setProjectName] = useState(project?.project_name || "");
  const [shortDescription, setShortDescription] = useState(project?.short_description || "");
  const [mainVisualUrl, setMainVisualUrl] = useState(project?.main_visual_url || "");
  const [focalX, setFocalX] = useState(project?.main_visual_focal_point_x ?? 0.5);
  const [focalY, setFocalY] = useState(project?.main_visual_focal_point_y ?? 0.5);
  const [sortOrder, setSortOrder] = useState(project?.sort_order ?? 0);
  const [information, setInformation] = useState<any[]>(project?.information || []);
  const [details, setDetails] = useState<any[]>(project?.details || []);
  const [gallery, setGallery] = useState<any[]>(project?.gallery || []);
  const [links, setLinks] = useState<any[]>(project?.links || []);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(project?.main_visual_url || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const handleSave = async () => {
    if (!projectName.trim()) {
      setError("Project Name is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let finalMainVisual = mainVisualUrl;
      if (file) {
        finalMainVisual = await uploadDevProjectImageAction("portfolio-images", file);
      }

      const data: Partial<DbDevProject> = {
        project_name: projectName,
        short_description: shortDescription,
        main_visual_url: finalMainVisual,
        main_visual_focal_point_x: focalX,
        main_visual_focal_point_y: focalY,
        information,
        details,
        gallery,
        links,
        sort_order: sortOrder,
      };

      if (project) {
        await updateDevProjectAction(project.id, data);
      } else {
        await createDevProjectAction(data);
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    if (!confirm(`Delete "${project.project_name}"? This cannot be undone.`)) return;
    setSaving(true);
    try {
      await deleteDevProjectAction(project.id);
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/projects" className="text-xs text-gray-400 hover:text-black">← Projects</Link>
          <h1 className="text-2xl font-black mt-1">{project ? "Edit Project" : "New Project"}</h1>
        </div>
        <div className="flex gap-3 items-center">
          {project && (
            <>
              <Link
                href={`/portfolio/dev/${project.id}`}
                target="_blank"
                className="px-4 py-2 border border-black/15 text-sm font-bold rounded-lg hover:bg-black/5 transition"
              >
                View ↗
              </Link>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="px-4 py-2 border-2 border-red-500 text-red-500 text-sm font-bold rounded-lg hover:bg-red-50 transition disabled:opacity-40"
              >
                Delete
              </button>
            </>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-black/80 transition disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info */}
        <Section title="Basic Information">
          <div className="space-y-4">
            <div>
              <Label>Project Name</Label>
              <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} className={inputCls} placeholder="Project name" />
            </div>
            <div>
              <Label>Sort Order</Label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} className="w-24 px-3 py-2 border border-black/10 rounded-lg text-sm font-bold focus:outline-none focus:border-black" />
            </div>
          </div>
        </Section>

        {/* Main Visual */}
        <Section title="Main Visual">
          <div className="space-y-4">
            <div>
              <Label>Image</Label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
              {previewUrl && (
                <div className="mt-3 relative">
                  <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-contain border border-black/10 rounded-lg" />
                  <button
                    onClick={() => { setFile(null); setPreviewUrl(""); setMainVisualUrl(""); }}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
              {!previewUrl && (
                <input type="text" placeholder="Or paste image URL" value={mainVisualUrl} onChange={(e) => { setMainVisualUrl(e.target.value); setPreviewUrl(e.target.value); }} className={`${inputCls} mt-2`} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Focal Point X</Label>
                <input type="number" step="0.01" min="0" max="1" value={focalX} onChange={(e) => setFocalX(parseFloat(e.target.value))} className="w-full px-3 py-2 border border-black/10 rounded-lg text-sm font-bold focus:outline-none focus:border-black" />
              </div>
              <div>
                <Label>Focal Point Y</Label>
                <input type="number" step="0.01" min="0" max="1" value={focalY} onChange={(e) => setFocalY(parseFloat(e.target.value))} className="w-full px-3 py-2 border border-black/10 rounded-lg text-sm font-bold focus:outline-none focus:border-black" />
              </div>
            </div>
          </div>
        </Section>

        {/* Short Description */}
        <Section title="Short Description">
          <textarea
            placeholder="Brief description for cards and previews…"
            rows={3}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className={textareaCls}
          />
        </Section>

        {/* Project Information */}
        <Section title="Project Information" action={
          <span className="text-[10px] text-gray-400">Structured Data</span>
        }>
          <InformationEditor information={information} setInformation={setInformation} />
        </Section>

        {/* Project Details */}
        <Section title="Project Details" action={
          <span className="text-[10px] text-gray-400">Block-based Narrative</span>
        }>
          <DetailsEditor details={details} setDetails={setDetails} />
        </Section>

        {/* Gallery */}
        <Section title="Gallery" action={
          <span className="text-[10px] text-gray-400">Screenshots & Visuals</span>
        }>
          <GalleryEditor gallery={gallery} setGallery={setGallery} />
        </Section>

        {/* Links */}
        <Section title="Links" action={
          <span className="text-[10px] text-gray-400">Website → GitHub → Additional</span>
        }>
          <LinksEditor links={links} setLinks={setLinks} />
        </Section>
      </div>
    </div>
  );
}
