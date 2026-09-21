"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Eye,
  FilePlus2,
  Image as ImageIcon,
  Link2,
  LoaderCircle,
  LogOut,
  MoreHorizontal,
  PanelRight,
  Plus,
  Save,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  Type,
  Upload,
  X,
} from "lucide-react";
import {
  createDevProjectAction,
  deleteDevProjectAction,
  updateDevProjectAction,
} from "@/lib/admin-actions";
import { getDevProjects, uploadImageToStorage, type DbDevProject } from "@/lib/supabase-queries";
import type {
  DevProjectInformation,
  DevProjectDetailBlock,
  DevProjectGalleryItem,
  DevProjectLink,
  DevProjectDetailBlockType,
} from "@/types/dev-project";

const defaultInformation: DevProjectInformation[] = [
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
];

type BlockType = DevProjectDetailBlockType;
type Block = DevProjectDetailBlock;
type LinkItem = DevProjectLink;
type GalleryItem = DevProjectGalleryItem;
type ProjectDraft = Partial<DbDevProject>;
type SaveState = "saved" | "dirty" | "saving" | "published" | "error";

const newId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function emptyProject(): ProjectDraft {
  return {
    project_name: "",
    short_description: "",
    main_visual_url: "",
    main_visual_focal_point_x: 0.5,
    main_visual_focal_point_y: 0.5,
    information: structuredClone(defaultInformation),
    details: [],
    gallery: [],
    links: [],
    sort_order: 0,
  };
}

function generalValue(project: ProjectDraft, label: string, fallback = ""): string {
  const category = (project.information as DevProjectInformation[] | undefined)?.find(
    (item) => item?.category === "GENERAL"
  );
  const item = category?.items?.find((entry) => entry?.label === label);
  if (!item) return fallback;
  return Array.isArray(item.value) ? item.value.join(", ") : String(item.value || fallback);
}

function setGeneral(project: ProjectDraft, label: string, value: string | string[]): DevProjectInformation[] {
  const information: DevProjectInformation[] = Array.isArray(project.information)
    ? [...project.information]
    : [];
  let index = information.findIndex((item) => item?.category === "GENERAL");
  if (index < 0) {
    information.unshift({ category: "GENERAL", items: [] });
    index = 0;
  }
  const items = [...(information[index].items || [])];
  const next = {
    label,
    value,
    type: Array.isArray(value) ? ("Multiple Values" as const) : ("Text" as const),
  };
  const itemIndex = items.findIndex((item) => item?.label === label);
  if (itemIndex < 0) {
    items.push(next);
  } else {
    items[itemIndex] = { ...items[itemIndex], ...next };
  }
  information[index] = { ...information[index], items };
  return information;
}

function normaliseBlocks(value: unknown): Block[] {
  if (!Array.isArray(value)) return [];
  return value.map((item: Partial<Block>, index) => ({
    id: item?.id || newId("block"),
    order: index + 1,
    type: (item?.type || "Text") as BlockType,
    content: item?.type === "ImageText" ? item?.content || "" : item?.content || item?.text || "",
    text: item?.text || item?.content || "",
    imageUrl: item?.imageUrl || "",
    imageCaption: item?.imageCaption || "",
  }));
}

function normaliseLinks(value: unknown): LinkItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((item: Partial<LinkItem>, index) => ({
    id: item?.id || newId("link"),
    order: index + 1,
    title: item?.title || "Additional",
    description: item?.description || "",
    url: item?.url || "",
    buttonLabel: item?.buttonLabel || "Open",
  }));
}

function normaliseGallery(value: unknown): GalleryItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((item: Partial<GalleryItem>, index) => ({
    id: item?.id || newId("gallery"),
    order: index + 1,
    imageUrl: item?.imageUrl || "",
    caption: item?.caption || "",
    description: item?.description || "",
  }));
}

function projectSlug(id: string) { return `/portfolio/dev/${id}`; }

export default function AdminPage() {
  const [sessionOk, setSessionOk] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [projects, setProjects] = useState<DbDevProject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProjectDraft | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(true);

  const refresh = useCallback(async () => setProjects(await getDevProjects()), []);

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => { setSessionOk(Boolean(data.ok)); if (data.ok) void refresh(); })
      .catch(() => setSessionOk(false));
  }, [refresh]);

  const openProject = (project?: DbDevProject) => {
    const next = project ? { ...project, information: project.information || [], details: project.details || [], gallery: project.gallery || [], links: project.links || [] } : emptyProject();
    setSelectedId(project?.id || null);
    setDraft(next);
    setSaveState(project && generalValue(project, "Visibility", "Published") === "Published" ? "published" : "saved");
    setNotice("");
  };

  const closeProject = () => { setDraft(null); setSelectedId(null); setNotice(""); setSaveState("saved"); };

  const login = async () => {
    setLoginError("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, credentials: "include", body: JSON.stringify({ email, password }) });
    if (!response.ok) { const body = await response.json().catch(() => null); setLoginError(body?.error || "ログインに失敗しました"); return; }
    setSessionOk(true); setPassword(""); await refresh();
  };

  const save = useCallback(async (publish = false, automatic = false) => {
    if (!draft) return;
    if (!draft.project_name?.trim()) { setNotice("タイトルを入力してください"); setSaveState("error"); return; }
    const information = setGeneral(draft, "Visibility", publish ? "Published" : generalValue(draft, "Visibility", "Draft"));
    setSaveState("saving");
    try {
      const payload = { ...draft, information, details: normaliseBlocks(draft.details), links: normaliseLinks(draft.links), gallery: normaliseGallery(draft.gallery) };
      const saved = selectedId ? await updateDevProjectAction(selectedId, payload) : await createDevProjectAction({ ...payload, sort_order: projects.length });
      setDraft(saved);
      setSelectedId(saved.id);
      setSaveState(publish ? "published" : "saved");
      setNotice(publish ? "Published to the portfolio" : automatic ? "Saved" : "Draft saved");
      await refresh();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "保存に失敗しました";
      setSaveState("error");
      setNotice(msg);
    }
  }, [draft, selectedId, projects.length, refresh]);

  // Existing pages auto-save after a short pause. New pages are only created by an explicit save/publish.
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!draft || !selectedId || saveState !== "dirty") return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => void save(false, true), 1200);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [draft, selectedId, saveState, save]);

  const remove = async (project: DbDevProject) => {
    if (!window.confirm(`「${project.project_name}」を削除しますか？この操作は元に戻せません。`)) return;
    await deleteDevProjectAction(project.id);
    if (selectedId === project.id) closeProject();
    await refresh();
  };

  if (!sessionOk) return <LoginScreen email={email} password={password} error={loginError} setEmail={setEmail} setPassword={setPassword} onLogin={login} />;
  if (draft) return <NotionWorkspace draft={draft} setDraft={(value) => { setDraft(value); setSaveState("dirty"); setNotice(""); }} state={saveState} notice={notice} onBack={closeProject} onSave={() => void save(false)} onPublish={() => void save(true)} />;

  const filtered = projects.filter((project) => `${project.project_name} ${project.short_description}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="min-h-screen bg-[#f7f7f5] text-[#202020]"><aside className={`${libraryOpen ? "w-72" : "w-16"} fixed inset-y-0 left-0 z-20 hidden flex-col border-r border-black/8 bg-white transition-all lg:flex`}><div className="flex items-center justify-between border-b border-black/8 px-4 py-5"><div className={libraryOpen ? "" : "hidden"}><p className="text-[9px] font-bold uppercase tracking-[.25em] text-black/35">RYUSEI TSUKAMOTO</p><p className="mt-1 text-lg font-semibold tracking-tight">Admin Studio</p></div><button onClick={() => setLibraryOpen(!libraryOpen)} className="rounded-lg p-2 text-black/45 hover:bg-black/5 hover:text-black" aria-label="Toggle library"><PanelRight size={17} /></button></div><div className={libraryOpen ? "block p-3" : "hidden"}><button onClick={() => openProject()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-3 py-3 text-sm font-semibold text-white hover:bg-black/80"><Plus size={16} /> New page</button><div className="relative mt-5"><Search size={14} className="absolute left-3 top-3 text-black/35" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pages" className="w-full rounded-lg bg-black/[.04] py-2.5 pl-9 pr-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-black/15" /></div></div><div className={libraryOpen ? "flex-1 overflow-y-auto px-3 pb-4" : "hidden"}><p className="mb-2 mt-5 px-2 text-[10px] font-bold uppercase tracking-[.2em] text-black/30">Pages · {filtered.length}</p>{filtered.map((project) => <button key={project.id} onClick={() => openProject(project)} className={`group mb-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-sm ${selectedId === project.id ? "bg-black/7" : "hover:bg-black/[.04]"}`}><FilePlus2 size={15} className="shrink-0 text-black/40" /><span className="min-w-0 flex-1 truncate">{project.project_name || "Untitled"}</span><ChevronRight size={13} className="text-black/20" /></button>)}{filtered.length === 0 && <p className="px-2 py-8 text-xs leading-5 text-black/35">まだページがありません。<br />New pageから始めましょう。</p>}</div><div className={libraryOpen ? "border-t border-black/8 p-3" : "hidden"}><button onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); setSessionOk(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-black/45 hover:bg-red-50 hover:text-red-700"><LogOut size={15} /> Sign out</button></div></aside><main className={`${libraryOpen ? "lg:ml-72" : "lg:ml-16"} min-h-screen transition-all`}><div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.28em] text-black/35">Portfolio Admin</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Your pages.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-black/45">Notionのようにページを書き、保存して、Portfolioへ公開します。</p></div><button onClick={() => openProject()} className="hidden items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white sm:flex"><Plus size={16} /> New page</button></div><div className="mt-12 grid gap-4 sm:grid-cols-3"><Stat label="Pages" value={String(projects.length)} /><Stat label="Published" value={String(projects.filter((p) => generalValue(p, "Visibility", "Published") === "Published").length)} /><Stat label="Drafts" value={String(projects.filter((p) => generalValue(p, "Visibility", "Draft") !== "Published").length)} /></div><div className="mt-12 rounded-2xl border border-black/8 bg-white"><div className="flex items-center justify-between border-b border-black/8 px-5 py-4 sm:px-6"><div><h2 className="font-semibold">All pages</h2><p className="mt-1 text-xs text-black/40">Developer portfolio pages</p></div><button onClick={() => openProject()} className="rounded-lg p-2 text-black/45 hover:bg-black/5 sm:hidden"><Plus size={18} /></button></div>{filtered.map((project) => <div key={project.id} className="flex items-center gap-3 border-b border-black/6 px-5 py-4 last:border-0 sm:px-6"><button onClick={() => openProject(project)} className="flex min-w-0 flex-1 items-center gap-3 text-left"><div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-black/5">{project.main_visual_url && <img src={project.main_visual_url} alt="" className="h-full w-full object-cover" />}</div><span className="min-w-0"><strong className="block truncate text-sm">{project.project_name || "Untitled"}</strong><span className="mt-1 block truncate text-xs text-black/40">{project.short_description || "No description"}</span></span></button><span className={`hidden rounded-full px-2.5 py-1 text-[10px] font-semibold sm:block ${generalValue(project, "Visibility", "Published") === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-black/5 text-black/45"}`}>{generalValue(project, "Visibility", "Published")}</span><button onClick={() => void remove(project)} className="rounded-lg p-2 text-black/25 hover:bg-red-50 hover:text-red-600" aria-label="Delete page"><Trash2 size={15} /></button></div>)}{filtered.length === 0 && <p className="px-6 py-20 text-center text-sm text-black/40">まだページがありません。</p>}</div></div></main></div>;
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-black/8 bg-white p-5"><p className="text-xs text-black/40">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p></div>; }

function NotionWorkspace({ draft, setDraft, state, notice, onBack, onSave, onPublish }: { draft: ProjectDraft; setDraft: (value: ProjectDraft) => void; state: SaveState; notice: string; onBack: () => void; onSave: () => void; onPublish: () => void }) {
  const [propertiesOpen, setPropertiesOpen] = useState(true);
  const [addMenu, setAddMenu] = useState(false);
  const [uploading, setUploading] = useState(false);
  const blocks = normaliseBlocks(draft.details);
  const links = normaliseLinks(draft.links);
  const gallery = normaliseGallery(draft.gallery);
  const update = (patch: ProjectDraft) => setDraft({ ...draft, ...patch });
  const updateBlocks = (next: Block[]) => update({ details: next.map((block, index) => ({ ...block, order: index + 1 })) });
  const addBlock = (type: BlockType) => { updateBlocks([...blocks, { id: newId("block"), order: blocks.length + 1, type, content: "", text: "", imageUrl: "", imageCaption: "" }]); setAddMenu(false); };
  const upload = async (file: File, target: "cover" | "block") => {
    setUploading(true);
    try {
      const url = await uploadImageToStorage("portfolio-images", file);
      if (target === "cover") update({ main_visual_url: url });
      else updateBlocks([...blocks, { id: newId("block"), order: blocks.length + 1, type: "Image", imageUrl: url, imageCaption: "" }]);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "画像アップロードに失敗しました";
      window.alert(msg);
    }
    finally { setUploading(false); }
  };
  const updateLinks = (next: LinkItem[]) => update({ links: next.map((item, index) => ({ ...item, order: index + 1 })) });

  return <div className="min-h-screen bg-[#fbfbfa] text-[#202020]"><header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-black/8 bg-[#fbfbfa]/95 px-4 py-3 backdrop-blur sm:px-6"><button onClick={onBack} className="flex min-w-0 items-center gap-2 text-sm text-black/55 hover:text-black"><ArrowLeft size={17} /><span className="hidden sm:inline">All pages</span><span className="sm:hidden">Back</span></button><div className="flex min-w-0 items-center gap-2"><span className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold sm:flex ${state === "published" ? "bg-emerald-50 text-emerald-700" : state === "saving" ? "bg-amber-50 text-amber-700" : state === "error" ? "bg-red-50 text-red-700" : "bg-black/5 text-black/45"}`}>{state === "saving" && <LoaderCircle size={12} className="animate-spin" />}{state === "published" ? "Published" : state === "saving" ? "Saving" : state === "dirty" ? "Unsaved" : state === "error" ? "Error" : "Saved"}</span>{notice && <span className="max-w-[150px] truncate text-xs text-black/40 sm:max-w-none">{notice}</span>}<button onClick={() => setPropertiesOpen(!propertiesOpen)} className="rounded-lg p-2 text-black/45 hover:bg-black/5 lg:hidden" aria-label="Toggle page settings"><Settings2 size={17} /></button>{draft.id && <Link href={projectSlug(draft.id)} target="_blank" className="hidden items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold hover:border-black/30 sm:flex"><Eye size={14} /> Preview</Link>}<button onClick={onSave} disabled={state === "saving"} className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold hover:bg-black/[.03] disabled:opacity-50"><Save size={14} /><span className="hidden sm:inline">Save</span></button><button onClick={onPublish} disabled={state === "saving"} className="flex items-center gap-1.5 rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-black/80 disabled:opacity-50"><Check size={14} /> Publish</button></div></header><div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,760px)_280px] lg:gap-14"><main><div className="mb-10"><p className="mb-4 text-[10px] font-bold uppercase tracking-[.28em] text-black/30">Untitled page · rt18_dev</p><input value={draft.project_name || ""} onChange={(e) => update({ project_name: e.target.value })} placeholder="Untitled" autoFocus={!draft.id} className="w-full bg-transparent text-4xl font-semibold tracking-[-.06em] outline-none placeholder:text-black/20 sm:text-6xl" /><input value={draft.short_description || ""} onChange={(e) => update({ short_description: e.target.value })} placeholder="Add a short description…" className="mt-5 w-full bg-transparent text-base leading-7 text-black/45 outline-none placeholder:text-black/25 sm:text-lg" /></div><div className="mb-10 overflow-hidden rounded-2xl border border-black/8 bg-white"><div className="aspect-[2/1] bg-black/[.04]">{draft.main_visual_url ? <img src={draft.main_visual_url} alt="" className="h-full w-full object-cover" /> : <label className="flex h-full cursor-pointer flex-col items-center justify-center gap-3 text-sm text-black/35 hover:bg-black/[.02]"><Upload size={22} /><span>{uploading ? "Uploading…" : "Add cover"}</span><input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(file, "cover"); e.currentTarget.value = ""; }} /></label>}</div>{draft.main_visual_url && <div className="flex items-center justify-between border-t border-black/8 px-4 py-3"><span className="text-xs text-black/40">Cover image</span><label className="cursor-pointer text-xs font-semibold text-black/55 hover:text-black">Replace<input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(file, "cover"); e.currentTarget.value = ""; }} /></label></div>}</div><div className="space-y-2">{blocks.map((block, index) => <NotionBlock key={block.id} block={block} index={index} total={blocks.length} onChange={(next) => updateBlocks(blocks.map((item) => item.id === block.id ? next : item))} onMove={(direction) => { const next = [...blocks]; const target = direction === "up" ? index - 1 : index + 1; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; updateBlocks(next); }} onDelete={() => updateBlocks(blocks.filter((item) => item.id !== block.id))} />)}</div><div className="relative mt-6"><button onClick={() => setAddMenu(!addMenu)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 bg-white py-4 text-sm font-semibold text-black/45 hover:border-black/30 hover:text-black"><Plus size={16} /> Add block</button>{addMenu && <div className="absolute bottom-full left-0 z-20 mb-2 grid w-full grid-cols-2 gap-2 rounded-xl border border-black/10 bg-white p-2 shadow-xl sm:grid-cols-5"><AddBlockButton icon={<Type size={16} />} label="Text" onClick={() => addBlock("Text")} /><AddBlockButton icon={<span className="text-base font-bold">H</span>} label="Heading" onClick={() => addBlock("Section")} /><AddBlockButton icon={<Sparkles size={16} />} label="Callout" onClick={() => addBlock("Highlight")} /><AddBlockButton icon={<ImageIcon size={16} />} label="Image" onClick={() => addBlock("Image")} /><AddBlockButton icon={<Link2 size={16} />} label="Image + text" onClick={() => addBlock("ImageText")} /></div>}</div><div className="mt-12 border-t border-black/8 pt-8"><div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold">Links</h3><p className="mt-1 text-xs text-black/40">公開ページの最後に表示されます。</p></div><button onClick={() => updateLinks([...links, { id: newId("link"), order: links.length + 1, title: "Website", description: "", url: "", buttonLabel: "Open" }])} className="rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold hover:bg-black/[.03]"><Plus size={14} className="mr-1 inline" /> Add</button></div><div className="mt-4 space-y-2">{links.map((item, index) => <div key={item.id} className="grid gap-2 rounded-xl border border-black/8 bg-white p-3 sm:grid-cols-[110px_1fr_1.2fr_32px]"><select value={item.title} onChange={(e) => updateLinks(links.map((link, i) => i === index ? { ...link, title: e.target.value } : link))} className="rounded-lg bg-black/[.03] px-2 py-2 text-xs outline-none"><option>Website</option><option>GitHub</option><option>Additional</option></select><input value={item.description} onChange={(e) => updateLinks(links.map((link, i) => i === index ? { ...link, description: e.target.value } : link))} placeholder="Description" className="rounded-lg bg-black/[.03] px-3 py-2 text-xs outline-none" /><input value={item.url} onChange={(e) => updateLinks(links.map((link, i) => i === index ? { ...link, url: e.target.value } : link))} placeholder="https://" className="rounded-lg bg-black/[.03] px-3 py-2 text-xs outline-none" /><button onClick={() => updateLinks(links.filter((_, i) => i !== index))} className="rounded p-2 text-black/30 hover:bg-red-50 hover:text-red-600"><X size={15} /></button></div>)}</div></div></main><PageProperties open={propertiesOpen} draft={draft} update={update} gallery={gallery} updateGallery={(next) => update({ gallery: next })} /></div></div>;
}

function AddBlockButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) { return <button onClick={onClick} className="flex flex-col items-center gap-2 rounded-lg px-2 py-3 text-xs font-semibold text-black/55 hover:bg-black/[.05] hover:text-black">{icon}<span>{label}</span></button>; }

function NotionBlock({ block, index, total, onChange, onMove, onDelete }: { block: Block; index: number; total: number; onChange: (block: Block) => void; onMove: (direction: "up" | "down") => void; onDelete: () => void }) {
  const [focused, setFocused] = useState(false);
  const content = block.type === "ImageText" ? block.text || block.content || "" : block.content || "";
  return <div className={`group relative rounded-xl border bg-white transition ${focused ? "border-black/20 shadow-sm" : "border-transparent hover:border-black/10"}`} onFocus={() => setFocused(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}><div className={`absolute -left-2 top-3 z-10 flex -translate-x-full items-center gap-1 transition ${focused ? "opacity-100" : "pointer-events-none opacity-0"}`}><button onMouseDown={(e) => e.preventDefault()} onClick={() => onMove("up")} disabled={index === 0} className="rounded p-1 text-black/35 hover:bg-black/5 disabled:opacity-20">↑</button><button onMouseDown={(e) => e.preventDefault()} onClick={() => onMove("down")} disabled={index === total - 1} className="rounded p-1 text-black/35 hover:bg-black/5 disabled:opacity-20">↓</button><button onMouseDown={(e) => e.preventDefault()} onClick={onDelete} className="rounded p-1 text-black/35 hover:bg-red-50 hover:text-red-600"><Trash2 size={13} /></button></div><div className="flex items-center gap-2 px-3 pt-2 text-[10px] font-bold uppercase tracking-[.18em] text-black/25"><span className="h-1.5 w-1.5 rounded-full bg-black/25" />{block.type === "Section" ? "Heading" : block.type === "Highlight" ? "Callout" : block.type}</div>{block.type === "Section" ? <input value={content} onChange={(e) => onChange({ ...block, content: e.target.value })} placeholder="Heading" className="w-full bg-transparent px-3 py-2 text-2xl font-semibold tracking-tight outline-none placeholder:text-black/20" /> : block.type === "Highlight" ? <textarea value={content} onChange={(e) => onChange({ ...block, content: e.target.value })} placeholder="Write a callout…" rows={3} className="m-3 w-[calc(100%-1.5rem)] rounded-lg bg-black px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/35" /> : block.type === "Image" ? <div className="p-3"><div className="overflow-hidden rounded-lg bg-black/[.04]">{block.imageUrl ? <img src={block.imageUrl} alt="" className="max-h-[420px] w-full object-contain" /> : <div className="p-8 text-center text-sm text-black/35">Add an image URL in this block or use the cover uploader.</div>}</div><input value={block.imageUrl || ""} onChange={(e) => onChange({ ...block, imageUrl: e.target.value })} placeholder="Image URL" className="mt-2 w-full rounded-lg bg-black/[.04] px-3 py-2 text-xs outline-none" /><input value={block.imageCaption || ""} onChange={(e) => onChange({ ...block, imageCaption: e.target.value })} placeholder="Caption (optional)" className="mt-2 w-full rounded-lg bg-black/[.04] px-3 py-2 text-xs outline-none" /></div> : block.type === "ImageText" ? <div className="grid gap-3 p-3 md:grid-cols-2"><div><div className="aspect-video overflow-hidden rounded-lg bg-black/[.04]">{block.imageUrl && <img src={block.imageUrl} alt="" className="h-full w-full object-cover" />}</div><input value={block.imageUrl || ""} onChange={(e) => onChange({ ...block, imageUrl: e.target.value })} placeholder="Image URL" className="mt-2 w-full rounded-lg bg-black/[.04] px-3 py-2 text-xs outline-none" /></div><textarea value={content} onChange={(e) => onChange({ ...block, text: e.target.value, content: e.target.value })} placeholder="Write beside the image…" rows={7} className="w-full resize-none rounded-lg bg-black/[.04] px-3 py-3 text-sm leading-6 outline-none" /></div> : <textarea value={content} onChange={(e) => onChange({ ...block, content: e.target.value })} placeholder="Type '/' for commands, or start writing…" rows={5} className="w-full resize-none bg-transparent px-3 py-3 text-sm leading-7 outline-none placeholder:text-black/25" />}</div>;
}

function PageProperties({ open, draft, update, gallery, updateGallery }: { open: boolean; draft: ProjectDraft; update: (patch: ProjectDraft) => void; gallery: GalleryItem[]; updateGallery: (gallery: GalleryItem[]) => void }) {
  const status = generalValue(draft, "Status", "In Development");
  const visibility = generalValue(draft, "Visibility", "Draft");
  return <aside className={`${open ? "block" : "hidden"} lg:sticky lg:top-24 lg:block lg:h-fit`}><div className="rounded-2xl border border-black/8 bg-white p-5"><div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-black/35">Page settings</p><p className="mt-1 text-xs text-black/40">Properties</p></div><MoreHorizontal size={17} className="text-black/30" /></div><label className="mb-2 block text-xs font-semibold text-black/55">Visibility</label><select value={visibility} onChange={(e) => update({ information: setGeneral(draft, "Visibility", e.target.value) })} className="mb-5 w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm outline-none"><option>Draft</option><option>Published</option><option>Hidden</option></select><label className="mb-2 block text-xs font-semibold text-black/55">Status</label><select value={status} onChange={(e) => update({ information: setGeneral(draft, "Status", e.target.value) })} className="mb-5 w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm outline-none"><option>In Development</option><option>Public</option><option>Private</option><option>Archived</option></select><label className="mb-2 block text-xs font-semibold text-black/55">Type</label><input value={generalValue(draft, "Type", "Web Application")} onChange={(e) => update({ information: setGeneral(draft, "Type", e.target.value) })} className="mb-5 w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none" /><label className="mb-2 block text-xs font-semibold text-black/55">Started</label><input value={generalValue(draft, "Started")} onChange={(e) => update({ information: setGeneral(draft, "Started", e.target.value) })} className="mb-5 w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none" /><label className="mb-2 block text-xs font-semibold text-black/55">Platform</label><input value={generalValue(draft, "Platform")} onChange={(e) => update({ information: setGeneral(draft, "Platform", e.target.value.split(",").map((item) => item.trim()).filter(Boolean)) })} className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none" /></div><div className="mt-4 rounded-2xl border border-black/8 bg-white p-5"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Gallery</p><p className="mt-1 text-xs text-black/40">Existing gallery items</p></div><button onClick={() => updateGallery([...gallery, { id: newId("gallery"), order: gallery.length + 1, imageUrl: "", caption: "", description: "" }])} className="rounded-lg p-2 text-black/45 hover:bg-black/5"><Plus size={16} /></button></div>{gallery.length === 0 ? <p className="mt-4 text-xs leading-5 text-black/35">Add screenshots from the plus button.</p> : <div className="mt-4 space-y-3">{gallery.map((item, index) => <div key={item.id} className="rounded-lg bg-black/[.03] p-2"><div className="aspect-video overflow-hidden rounded bg-black/5">{item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />}</div><input value={item.imageUrl} onChange={(e) => updateGallery(gallery.map((entry, i) => i === index ? { ...entry, imageUrl: e.target.value } : entry))} placeholder="Image URL" className="mt-2 w-full bg-transparent px-1 py-1 text-xs outline-none" /><input value={item.caption} onChange={(e) => updateGallery(gallery.map((entry, i) => i === index ? { ...entry, caption: e.target.value } : entry))} placeholder="Caption" className="w-full bg-transparent px-1 py-1 text-xs outline-none" /><button onClick={() => updateGallery(gallery.filter((_, i) => i !== index))} className="mt-1 text-[10px] text-red-500">Remove</button></div>)}</div>}</div></aside>;
}

function LoginScreen({ email, password, error, setEmail, setPassword, onLogin }: { email: string; password: string; error: string; setEmail: (value: string) => void; setPassword: (value: string) => void; onLogin: () => void }) { return <div className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-5"><div className="w-full max-w-sm"><p className="text-[10px] font-bold uppercase tracking-[.3em] text-black/35">RYUSEI TSUKAMOTO</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.05em]">Admin Studio</h1><p className="mt-3 text-sm leading-6 text-black/45">Supabase Authでログインして、Portfolioのページを編集します。</p><div className="mt-8 rounded-2xl border border-black/8 bg-white p-6 shadow-sm"><label className="mb-2 block text-xs font-semibold text-black/60">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4 w-full rounded-lg border border-black/10 px-3 py-3 text-sm outline-none focus:border-black/30" placeholder="admin@example.com" /><label className="mb-2 block text-xs font-semibold text-black/60">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onLogin()} className="w-full rounded-lg border border-black/10 px-3 py-3 text-sm outline-none focus:border-black/30" placeholder="••••••••" />{error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}<button onClick={onLogin} className="mt-6 w-full rounded-lg bg-black py-3 text-sm font-semibold text-white hover:bg-black/80">Sign in</button></div><p className="mt-6 text-center text-xs text-black/35">Private workspace · Supabase Auth</p></div></div>; }
