"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Eye,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  LayoutDashboard,
  Link2,
  LogOut,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  createDevProjectAction,
  deleteDevProjectAction,
  updateDevProjectAction,
} from "@/lib/admin-actions";
import { getDevProjects, uploadImageToStorage, type DbDevProject } from "@/lib/supabase-queries";
import { NotionEditor } from "@/components/admin/notion-editor";
import { PORTFOLIO_HIERARCHY } from "@/lib/portfolio-hierarchy/data";

const disciplines = [
  { id: "developer", label: "DEVELOPER", description: "Web applications, tools, and automation", color: "#2563eb" },
  { id: "illustrator", label: "ILLUSTRATOR", description: "Illustration and visual work", color: "#7c3aed" },
  { id: "musician", label: "MUSICIAN", description: "Music and sound projects", color: "#db2777" },
  { id: "blogger", label: "BLOGGER", description: "Articles and development logs", color: "#059669" },
  { id: "investor", label: "INVESTOR", description: "Research and investment activities", color: "#d97706" },
];

const defaultInformation = [
  { category: "GENERAL", items: [
    { label: "Status", value: "In Development", type: "Text" },
    { label: "Type", value: "Web Application", type: "Text" },
    { label: "Started", value: new Date().toISOString().slice(0, 10), type: "Text" },
    { label: "Platform", value: ["Web"], type: "Multiple Values" },
  ] },
  { category: "TECHNOLOGY", items: [] },
];

const emptyProject = (): Partial<DbDevProject> => ({
  project_name: "",
  short_description: "",
  main_visual_url: "",
  main_visual_focal_point_x: 0.5,
  main_visual_focal_point_y: 0.5,
  information: defaultInformation,
  details: [],
  gallery: [],
  links: [],
  sort_order: 0,
});

function getGeneral(project: Partial<DbDevProject>, label: string, fallback = "") {
  const category = (project.information as any[] | undefined)?.find((item) => item.category === "GENERAL");
  const item = category?.items?.find((entry: any) => entry.label === label);
  return Array.isArray(item?.value) ? item.value.join(", ") : item?.value || fallback;
}

function setGeneral(project: Partial<DbDevProject>, label: string, value: string | string[]) {
  const information = Array.isArray(project.information) ? [...project.information] : [];
  let index = information.findIndex((item: any) => item.category === "GENERAL");
  if (index < 0) { information.unshift({ category: "GENERAL", items: [] }); index = 0; }
  const items = [...(information[index].items || [])];
  const itemIndex = items.findIndex((item: any) => item.label === label);
  const next = { label, value, type: Array.isArray(value) ? "Multiple Values" : "Text" };
  if (itemIndex < 0) items.push(next); else items[itemIndex] = { ...items[itemIndex], ...next };
  information[index] = { ...information[index], items };
  return information;
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value));
}

function statusTone(value: string) {
  if (value === "Public") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (value === "Private") return "bg-slate-100 text-slate-600 border-slate-200";
  if (value === "Archived") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
}

type Section = "dashboard" | "hierarchy" | "projects" | "disciplines" | "media" | "settings";

export default function AdminPage() {
  const [sessionOk, setSessionOk] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [section, setSection] = useState<Section>("dashboard");
  const [projects, setProjects] = useState<DbDevProject[]>([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editor, setEditor] = useState<Partial<DbDevProject> | null>(null);
  const [editorState, setEditorState] = useState<"draft" | "saved" | "published">("draft");
  const [message, setMessage] = useState("");
  const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({ developer: true, "rt18-dev": true });

  const refresh = async () => {
    const data = await getDevProjects();
    setProjects(data);
  };

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => { setSessionOk(Boolean(data.ok)); if (data.ok) refresh(); })
      .catch(() => setSessionOk(false));
  }, []);

  const filteredProjects = useMemo(() => projects.filter((project) => {
    const text = `${project.project_name} ${project.short_description}`.toLowerCase();
    return text.includes(query.toLowerCase());
  }), [projects, query]);

  const counts = useMemo(() => ({
    disciplines: disciplines.length,
    activities: PORTFOLIO_HIERARCHY.disciplines.reduce((sum, item) => sum + item.activities.length, 0),
    projects: projects.length,
    published: projects.filter((project) => getGeneral(project, "Visibility", "Published") === "Published").length,
    development: projects.filter((project) => getGeneral(project, "Status", "In Development") === "In Development").length,
    private: projects.filter((project) => getGeneral(project, "Status", "In Development") === "Private").length,
  }), [projects]);

  const openEditor = (project?: DbDevProject) => {
    setSelectedId(project?.id || null);
    setEditor(project ? { ...project, information: project.information || [], details: project.details || [], gallery: project.gallery || [], links: project.links || [] } : emptyProject());
    setEditorState(project && getGeneral(project, "Visibility") === "Published" ? "published" : "draft");
    setMessage("");
  };

  const closeEditor = () => { setEditor(null); setSelectedId(null); setMessage(""); };

  const saveProject = async (publish = false) => {
    if (!editor?.project_name?.trim()) { setMessage("Project name is required."); return; }
    const information = setGeneral(editor, "Visibility", publish ? "Published" : "Draft");
    setMessage(publish ? "Publishing…" : "Saving draft…");
    try {
      if (selectedId) await updateDevProjectAction(selectedId, { ...editor, information });
      else await createDevProjectAction({ ...editor, information, sort_order: projects.length });
      await refresh();
      setEditorState(publish ? "published" : "saved");
      setMessage(publish ? "Published to the portfolio." : "Draft saved.");
      if (!selectedId) { setEditor(null); setSelectedId(null); }
    } catch (error: any) {
      setMessage(error?.message || "保存に失敗しました");
    }
  };

  const removeProject = async (project: DbDevProject) => {
    if (!window.confirm(`「${project.project_name}」を削除しますか？この操作は元に戻せません。`)) return;
    await deleteDevProjectAction(project.id);
    if (selectedId === project.id) closeEditor();
    await refresh();
  };

  const login = async () => {
    setLoginError("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, credentials: "include", body: JSON.stringify({ email, password }) });
    if (!response.ok) { const body = await response.json().catch(() => null); setLoginError(body?.error || "ログインに失敗しました"); return; }
    setSessionOk(true); setPassword(""); refresh();
  };

  if (!sessionOk) return <LoginScreen email={email} password={password} error={loginError} setEmail={setEmail} setPassword={setPassword} onLogin={login} />;
  if (editor) return <ProjectEditor editor={editor} setEditor={setEditor} state={editorState} message={message} onBack={closeEditor} onSave={() => saveProject(false)} onPublish={() => saveProject(true)} />;

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#202020]">
      <AdminSidebar section={section} setSection={setSection} onLogout={async () => { await fetch("/api/admin/logout", { method: "POST" }); setSessionOk(false); }} />
      <main className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-black/8 bg-[#f7f7f5]/90 px-10 backdrop-blur">
          <div className="flex items-center gap-3 text-sm text-black/50"><span>Admin</span><ChevronRight size={14} /><span className="font-semibold text-black">{sectionLabel(section)}</span></div>
          <div className="flex items-center gap-4"><div className="hidden items-center gap-2 text-xs text-black/40 md:flex"><ShieldCheck size={15} className="text-emerald-600" /> Supabase Auth secured</div><button className="rounded-full p-2 hover:bg-black/5"><CircleHelp size={18} /></button></div>
        </header>
        <div className="mx-auto max-w-[1400px] px-10 py-10">{section === "dashboard" && <Dashboard counts={counts} projects={projects} onProject={openEditor} onNavigate={setSection} />}{section === "hierarchy" && <Hierarchy projects={projects} openNodes={openNodes} setOpenNodes={setOpenNodes} onProject={openEditor} onNew={openEditor} />}{section === "projects" && <Projects projects={filteredProjects} query={query} setQuery={setQuery} onProject={openEditor} onNew={() => openEditor()} onDelete={removeProject} />}{section === "disciplines" && <Disciplines />}{section === "media" && <MediaNotice />}{section === "settings" && <SettingsPanel />}</div>
      </main>
    </div>
  );
}

function sectionLabel(section: Section) { return ({ dashboard: "Dashboard", hierarchy: "Hierarchy", projects: "Projects", disciplines: "Disciplines", media: "Media Library", settings: "Settings" })[section]; }

function AdminSidebar({ section, setSection, onLogout }: { section: Section; setSection: (section: Section) => void; onLogout: () => void }) {
  const item = (id: Section, label: string, icon: React.ReactNode) => <button onClick={() => setSection(id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${section === id ? "bg-black text-white" : "text-black/55 hover:bg-black/5 hover:text-black"}`}>{icon}<span>{label}</span></button>;
  return <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:flex flex-col border-r border-black/8 bg-white px-4 py-6"><div className="px-3"><p className="text-[10px] font-bold uppercase tracking-[.3em] text-black/35">RYUSEI TSUKAMOTO</p><h1 className="mt-1 text-xl font-semibold tracking-tight">Portfolio Admin</h1></div><div className="my-8 space-y-1">{item("dashboard", "Dashboard", <LayoutDashboard size={17} />)}<p className="px-3 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[.22em] text-black/30">Portfolio</p>{item("hierarchy", "Hierarchy", <FolderKanban size={17} />)}{item("disciplines", "Disciplines", <BarChart3 size={17} />)}<p className="px-3 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[.22em] text-black/30">Content</p>{item("projects", "Projects", <FileText size={17} />)}{item("media", "Media Library", <ImageIcon size={17} />)}</div><div className="mt-auto space-y-1 border-t border-black/8 pt-4">{item("settings", "Settings", <Settings size={17} />)}<button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-black/45 hover:bg-red-50 hover:text-red-700"><LogOut size={17} />Sign out</button></div></aside>;
}

function PageTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) { return <div className="mb-9 flex items-end justify-between gap-6"><div><p className="mb-3 text-[10px] font-bold uppercase tracking-[.25em] text-black/35">{eyebrow}</p><h2 className="text-4xl font-semibold tracking-[-.04em]">{title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-black/48">{description}</p></div>{action}</div>; }

function Dashboard({ counts, projects, onProject, onNavigate }: { counts: any; projects: DbDevProject[]; onProject: (project: DbDevProject) => void; onNavigate: (section: Section) => void }) {
  return <><PageTitle eyebrow="Portfolio Admin" title="Good evening, Ryusei." description="Portfolioの構造とコンテンツを、ここから一貫して管理できます。" action={<button onClick={() => onNavigate("projects")} className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-black/80"><Plus size={16} /> New project</button>} /><div className="grid grid-cols-3 gap-4 xl:grid-cols-6">{[["Disciplines", counts.disciplines, "5 fixed roots"], ["Activities", counts.activities, "brands / activities"], ["Projects", counts.projects, "developer contents"], ["Published", counts.published, "visible on portfolio"], ["In development", counts.development, "status"], ["Private", counts.private, "not public"]].map(([label, value, note]) => <div key={label} className="rounded-xl border border-black/8 bg-white p-5"><p className="text-xs text-black/45">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p><p className="mt-2 text-[11px] text-black/35">{note}</p></div>)}</div><div className="mt-8 grid grid-cols-[1.4fr_1fr] gap-6"><div className="rounded-xl border border-black/8 bg-white"><div className="flex items-center justify-between border-b border-black/8 px-6 py-5"><div><h3 className="font-semibold">Recent updates</h3><p className="mt-1 text-xs text-black/40">最後に編集されたProject</p></div><button onClick={() => onNavigate("projects")} className="text-xs font-semibold text-black/50 hover:text-black">View all →</button></div>{projects.slice(0, 5).map((project) => <button key={project.id} onClick={() => onProject(project)} className="flex w-full items-center justify-between border-b border-black/6 px-6 py-4 text-left last:border-0 hover:bg-black/[.02]"><div className="flex items-center gap-3"><div className="h-9 w-9 overflow-hidden rounded-lg bg-black/5">{project.main_visual_url && <img src={project.main_visual_url} alt="" className="h-full w-full object-cover" />}</div><div><p className="text-sm font-medium">{project.project_name}</p><p className="mt-1 text-xs text-black/40">rt18_dev · {formatDate(project.updated_at)}</p></div></div><ChevronRight size={16} className="text-black/30" /></button>)}{projects.length === 0 && <EmptyState text="まだProjectがありません" />}</div><div className="rounded-xl border border-black/8 bg-[#202020] p-6 text-white"><Sparkles size={18} className="text-yellow-300" /><h3 className="mt-10 text-2xl font-semibold tracking-tight">Write like a story.</h3><p className="mt-3 text-sm leading-6 text-white/60">noteのように、タイトル・概要・本文を順番に整えてから公開。途中の編集はDraftとして保存できます。</p><button onClick={() => onNavigate("hierarchy")} className="mt-8 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black">Open hierarchy</button></div></div></>;
}

function Hierarchy({ projects, openNodes, setOpenNodes, onProject, onNew }: { projects: DbDevProject[]; openNodes: Record<string, boolean>; setOpenNodes: (value: Record<string, boolean>) => void; onProject: (project: DbDevProject) => void; onNew: () => void }) {
  const toggle = (id: string) => setOpenNodes({ ...openNodes, [id]: !openNodes[id] });
  const developerProjects = projects;
  return <><PageTitle eyebrow="Portfolio / Structure" title="Hierarchy" description="Discipline → Activity / Brand → Project の順に、Portfolioの全体像を確認します。" action={<button onClick={onNew} className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16} /> Add project</button>} /><div className="grid grid-cols-[1.1fr_.9fr] gap-6"><div className="rounded-xl border border-black/8 bg-white p-6"><div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-black/35">Portfolio</p><p className="mt-1 text-sm text-black/45">5 disciplines · {projects.length} projects</p></div><button className="rounded-md p-2 text-black/35 hover:bg-black/5"><MoreHorizontal size={18} /></button></div>{disciplines.map((discipline) => { const isOpen = openNodes[discipline.id]; const activity = PORTFOLIO_HIERARCHY.disciplines.find((item) => item.id === discipline.id)?.activities || []; return <div key={discipline.id} className="mb-1"><button onClick={() => toggle(discipline.id)} className="flex w-full items-center gap-2 rounded-lg px-2 py-3 text-left hover:bg-black/[.03]"><span className="text-black/35">{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span><span className="h-2 w-2 rounded-full" style={{ backgroundColor: discipline.color }} /><span className="text-sm font-semibold tracking-wide">{discipline.label}</span><span className="ml-auto text-xs text-black/35">{discipline.id === "developer" ? projects.length : activity.length ? `${activity.length} activities` : "empty"}</span></button>{isOpen && <div className="ml-7 border-l border-black/10 pl-4">{activity.length ? activity.map((item) => <div key={item.id}><button onClick={() => toggle(item.id)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2.5 text-left text-sm hover:bg-black/[.03]"><span className="text-black/35">{openNodes[item.id] ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</span><span className="font-medium">{item.name}</span><span className="ml-auto text-xs text-black/35">{projects.length} contents</span></button>{openNodes[item.id] && <div className="ml-6 border-l border-black/10 pl-4">{developerProjects.map((project) => <button key={project.id} onClick={() => onProject(project)} className="group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-black/65 hover:bg-blue-50 hover:text-blue-800"><FileText size={14} className="text-black/25 group-hover:text-blue-500" /><span className="truncate">{project.project_name}</span><ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100" /></button>)}<button onClick={onNew} className="mt-1 flex items-center gap-2 px-2 py-2 text-xs font-semibold text-blue-600"><Plus size={14} /> Add content</button></div>}</div>) : <button onClick={onNew} className="flex items-center gap-2 px-2 py-3 text-xs text-black/35 hover:text-black"><Plus size={14} /> Add activity</button>}</div>}</div>})}</div><div className="rounded-xl border border-black/8 bg-white p-6"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-black/35">Data flow</p><div className="mt-8 space-y-3">{["Admin data", "Hierarchy data", "Portfolio Map / List / Detail"].map((label, index) => <div key={label}><div className="rounded-lg border border-black/8 bg-[#fafaf8] px-4 py-4"><p className="text-xs font-bold uppercase tracking-widest text-black/35">0{index + 1}</p><p className="mt-2 font-semibold">{label}</p></div>{index < 2 && <div className="ml-8 h-7 border-l border-dashed border-black/20" />}</div>)}</div><div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm leading-6 text-blue-900">ここで作成・編集したProjectは、既存のPortfolio本体が読む `dev_projects` データに反映されます。</div></div></div></>;
}

function Projects({ projects, query, setQuery, onProject, onNew, onDelete }: { projects: DbDevProject[]; query: string; setQuery: (value: string) => void; onProject: (project: DbDevProject) => void; onNew: () => void; onDelete: (project: DbDevProject) => void }) {
  return (
    <>
      <PageTitle eyebrow="Content / Projects" title="Projects" description="Projectの公開状態、概要、Detail、Gallery、Linksを一つの編集画面で管理します。" action={<button onClick={onNew} className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16} /> New project</button>} />
      <div className="mb-5 flex items-center justify-between">
        <div className="relative w-80"><Search size={16} className="absolute left-3 top-3 text-black/30" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects…" className="w-full rounded-lg border border-black/10 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-black/30" /></div>
        <p className="text-xs text-black/40">{projects.length} projects</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-black/8 bg-white">
        <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_42px] border-b border-black/8 bg-[#fafaf8] px-5 py-3 text-[10px] font-bold uppercase tracking-[.15em] text-black/35"><span>Project</span><span>Activity</span><span>Status</span><span>Updated</span><span /></div>
        {projects.map((project) => {
          const status = getGeneral(project, "Status", "In Development");
          const visibility = getGeneral(project, "Visibility", "Published");
          return (
            <div key={project.id} className="grid grid-cols-[1.6fr_1fr_1fr_1fr_42px] items-center border-b border-black/6 px-5 py-4 last:border-0 hover:bg-black/[.015]">
              <button onClick={() => onProject(project)} className="flex min-w-0 items-center gap-3 text-left"><div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-black/5">{project.main_visual_url && <img src={project.main_visual_url} alt="" className="h-full w-full object-cover" />}</div><div className="min-w-0"><p className="truncate text-sm font-semibold">{project.project_name}</p><p className="mt-1 truncate text-xs text-black/40">{project.short_description || "No description"}</p></div></button>
              <span className="text-sm text-black/55">rt18_dev</span>
              <div><span className={`rounded-full border px-2 py-1 text-[11px] font-medium ${statusTone(status)}`}>{status}</span><span className="ml-2 text-[10px] uppercase tracking-wider text-black/35">{visibility}</span></div>
              <span className="text-sm text-black/45">{formatDate(project.updated_at)}</span>
              <button onClick={() => onDelete(project)} className="rounded-md p-2 text-black/25 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button>
            </div>
          );
        })}
        {projects.length === 0 && <EmptyState text="該当するProjectがありません" />}
      </div>
    </>
  );
}

function ProjectEditor({ editor, setEditor, state, message, onBack, onSave, onPublish }: { editor: Partial<DbDevProject>; setEditor: (value: Partial<DbDevProject>) => void; state: string; message: string; onBack: () => void; onSave: () => void; onPublish: () => void }) {
  const [uploading, setUploading] = useState(false);
  const uploadCover = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImageToStorage("portfolio-images", file);
      setEditor({ ...editor, main_visual_url: url });
    } catch (error: any) {
      window.alert(error?.message || "画像のアップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const details = Array.isArray(editor.details) ? editor.details : [];
  const gallery = Array.isArray(editor.gallery) ? editor.gallery : [];
  const links = Array.isArray(editor.links) ? editor.links : [];
  const update = (patch: Partial<DbDevProject>) => setEditor({ ...editor, ...patch });
  const updateDetails = (next: any[]) => update({ details: next.map((block, index) => ({ ...block, order: index + 1 })) });
  const updateGallery = (next: any[]) => update({ gallery: next.map((item, index) => ({ ...item, order: index + 1 })) });
  const updateLinks = (next: any[]) => update({ links: next.map((item, index) => ({ ...item, order: index + 1 })) });
  const addDetail = (type: string) => updateDetails([...details, { id: `d-${Date.now()}`, order: details.length + 1, type, content: "" }]);
  const status = getGeneral(editor, "Status", "In Development");
  const visibility = getGeneral(editor, "Visibility", "Published");
  return <div className="min-h-screen bg-[#fafaf8] text-[#202020]"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/8 bg-[#fafaf8]/95 px-8 backdrop-blur"><button onClick={onBack} className="flex items-center gap-2 text-sm text-black/55 hover:text-black"><ArrowLeft size={17} /> Back to projects</button><div className="flex items-center gap-3"><span className={`rounded-full px-3 py-1 text-xs ${state === "published" ? "bg-emerald-50 text-emerald-700" : "bg-black/5 text-black/50"}`}>{state === "published" ? "Published" : state === "saved" ? "Draft saved" : "Unsaved changes"}</span>{message && <span className="text-xs text-black/45">{message}</span>}<>{editor.id && <a href={`/portfolio/dev/${editor.id}`} target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-lg border border-black/12 bg-white px-3.5 py-2 text-sm font-semibold hover:bg-black/[.03] sm:flex"><Eye size={15} /> Preview</a>}<button onClick={onSave} className="flex items-center gap-2 rounded-lg border border-black/12 bg-white px-3.5 py-2 text-sm font-semibold hover:bg-black/[.03]"><Save size={15} /> Save draft</button></><button onClick={onPublish} className="flex items-center gap-2 rounded-lg bg-black px-3.5 py-2 text-sm font-semibold text-white hover:bg-black/80"><Check size={15} /> Publish</button></div></header><main className="mx-auto max-w-6xl px-8 py-10"><div className="mb-10"><p className="mb-3 text-[10px] font-bold uppercase tracking-[.25em] text-black/35">Project editor</p><input value={editor.project_name || ""} onChange={(e) => update({ project_name: e.target.value })} placeholder="Project title" className="w-full bg-transparent text-5xl font-semibold tracking-[-.05em] outline-none placeholder:text-black/20" /><input value={editor.short_description || ""} onChange={(e) => update({ short_description: e.target.value })} placeholder="A short description that appears in the project card…" className="mt-4 w-full max-w-3xl bg-transparent text-lg text-black/50 outline-none placeholder:text-black/25" /></div><div className="grid grid-cols-[1fr_300px] gap-10"><div className="space-y-10"><section><SectionHeading icon={<FileText size={16} />} title="Project details" hint="noteのように本文をBlockで組み立てます" /><div className="space-y-3">{details.map((block: any, index: number) => <div key={block.id || index} className="group relative rounded-xl border border-black/8 bg-white p-3"><div className="mb-2 flex items-center justify-between"><div className="flex items-center gap-2"><span className="rounded bg-black/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black/45">{block.type}</span><span className="text-[11px] text-black/30">Block {index + 1}</span></div><div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100"><button disabled={index === 0} onClick={() => { const next = [...details]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; updateDetails(next); }} className="rounded p-1.5 hover:bg-black/5 disabled:opacity-20"><ArrowUp size={14} /></button><button disabled={index === details.length - 1} onClick={() => { const next = [...details]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; updateDetails(next); }} className="rounded p-1.5 hover:bg-black/5 disabled:opacity-20"><ArrowDown size={14} /></button><button onClick={() => updateDetails(details.filter((_: any, i: number) => i !== index))} className="rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button></div></div>{block.type === "Section" ? <input value={block.content || ""} onChange={(e) => updateDetails(details.map((item: any, i: number) => i === index ? { ...item, content: e.target.value } : item))} placeholder="Section heading" className="w-full px-2 py-2 text-2xl font-semibold outline-none placeholder:text-black/20" /> : <>{block.type === "ImageText" && <input value={block.imageUrl || ""} onChange={(e) => updateDetails(details.map((item: any, i: number) => i === index ? { ...item, imageUrl: e.target.value } : item))} placeholder="Image URL for this block" className="mb-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none" />}<NotionEditor value={block.content || ""} onChange={(html) => updateDetails(details.map((item: any, i: number) => i === index ? { ...item, content: html } : item))} placeholder="Start writing…" compact={block.type === "Highlight"} /></>}</div>)}{details.length === 0 && <div className="rounded-xl border border-dashed border-black/15 bg-white px-6 py-12 text-center text-sm text-black/40">Detail blocks will appear here. Add a section or start writing.</div>}<div className="flex flex-wrap gap-2"><button onClick={() => addDetail("Section")} className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold hover:bg-black/[.03]"><Plus size={14} /> Section</button><button onClick={() => addDetail("Text")} className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold hover:bg-black/[.03]"><Plus size={14} /> Text</button><button onClick={() => addDetail("Highlight")} className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold hover:bg-black/[.03]"><Plus size={14} /> Highlight</button><button onClick={() => addDetail("ImageText")} className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold hover:bg-black/[.03]"><Plus size={14} /> Image + Text</button></div></div></section><section><SectionHeading icon={<ImageIcon size={16} />} title="Gallery" hint="Main visualとは別のProject screenshots" /><div className="space-y-3">{gallery.map((item: any, index: number) => <div key={item.id || index} className="grid grid-cols-[80px_1fr_1fr_32px] gap-3 rounded-xl border border-black/8 bg-white p-3"><div className="h-16 overflow-hidden rounded-lg bg-black/5">{item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />}</div><input value={item.caption || ""} onChange={(e) => updateGallery(gallery.map((x: any, i: number) => i === index ? { ...x, caption: e.target.value } : x))} placeholder="Caption" className="rounded-lg bg-black/[.03] px-3 text-sm outline-none" /><input value={item.imageUrl || ""} onChange={(e) => updateGallery(gallery.map((x: any, i: number) => i === index ? { ...x, imageUrl: e.target.value } : x))} placeholder="Image URL" className="rounded-lg bg-black/[.03] px-3 text-sm outline-none" /><button onClick={() => updateGallery(gallery.filter((_: any, i: number) => i !== index))} className="text-black/25 hover:text-red-600"><X size={16} /></button></div>)}<button onClick={() => updateGallery([...gallery, { id: `g-${Date.now()}`, order: gallery.length + 1, imageUrl: "", caption: "", description: "" }])} className="flex items-center gap-2 rounded-lg border border-dashed border-black/15 px-3 py-2 text-xs font-semibold text-black/50 hover:border-black/30 hover:text-black"><Plus size={14} /> Add gallery image</button></div></section><section><SectionHeading icon={<Link2 size={16} />} title="Links" hint="Website → GitHub → Additional links" /><div className="space-y-3">{links.map((item: any, index: number) => <div key={item.id || index} className="grid grid-cols-[120px_1fr_1fr_32px] gap-3 rounded-xl border border-black/8 bg-white p-3"><select value={item.title || "Additional"} onChange={(e) => updateLinks(links.map((x: any, i: number) => i === index ? { ...x, title: e.target.value } : x))} className="rounded-lg bg-black/[.03] px-2 text-sm outline-none"><option>Website</option><option>GitHub</option><option>Additional</option></select><input value={item.description || ""} onChange={(e) => updateLinks(links.map((x: any, i: number) => i === index ? { ...x, description: e.target.value } : x))} placeholder="Description" className="rounded-lg bg-black/[.03] px-3 text-sm outline-none" /><input value={item.url || ""} onChange={(e) => updateLinks(links.map((x: any, i: number) => i === index ? { ...x, url: e.target.value } : x))} placeholder="https://" className="rounded-lg bg-black/[.03] px-3 text-sm outline-none" /><button onClick={() => updateLinks(links.filter((_: any, i: number) => i !== index))} className="text-black/25 hover:text-red-600"><X size={16} /></button></div>)}<button onClick={() => updateLinks([...links, { id: `l-${Date.now()}`, order: links.length + 1, title: "Additional", description: "", url: "", buttonLabel: "Open" }])} className="flex items-center gap-2 rounded-lg border border-dashed border-black/15 px-3 py-2 text-xs font-semibold text-black/50 hover:border-black/30 hover:text-black"><Plus size={14} /> Add link</button></div></section></div><aside className="space-y-5"><div className="rounded-xl border border-black/8 bg-white p-5"><p className="mb-4 text-[10px] font-bold uppercase tracking-[.2em] text-black/35">Publishing</p><label className="mb-2 block text-xs font-semibold text-black/60">Status</label><select value={status} onChange={(e) => update({ information: setGeneral(editor, "Status", e.target.value) })} className="mb-4 w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm outline-none"><option>Public</option><option>In Development</option><option>Private</option><option>Archived</option></select><label className="mb-2 block text-xs font-semibold text-black/60">Visibility</label><select value={visibility} onChange={(e) => update({ information: setGeneral(editor, "Visibility", e.target.value) })} className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm outline-none"><option>Published</option><option>Draft</option><option>Hidden</option></select><div className="mt-5 border-t border-black/8 pt-4 text-xs leading-5 text-black/45">StatusはProjectの状態、VisibilityはPortfolioへの表示状態です。別々に管理できます。</div></div><div className="rounded-xl border border-black/8 bg-white p-5"><p className="mb-4 text-[10px] font-bold uppercase tracking-[.2em] text-black/35">Main visual</p><div className="mb-3 aspect-[16/9] overflow-hidden rounded-lg bg-black/5">{editor.main_visual_url ? <img src={editor.main_visual_url} alt="" className="h-full w-full object-cover" style={{ objectPosition: `${Number(editor.main_visual_focal_point_x || .5) * 100}% ${Number(editor.main_visual_focal_point_y || .5) * 100}%` }} /> : <div className="flex h-full items-center justify-center text-xs text-black/30"><Upload size={16} className="mr-2" />Add cover image</div>}</div><div className="flex gap-2"><input value={editor.main_visual_url || ""} onChange={(e) => update({ main_visual_url: e.target.value })} placeholder="Image URL" className="min-w-0 flex-1 rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none" /><label className="flex cursor-pointer items-center gap-1 rounded-lg border border-black/10 px-3 text-xs font-semibold hover:bg-black/[.03]"><Upload size={14} /> {uploading ? "Uploading…" : "Upload"}<input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) void uploadCover(file); e.currentTarget.value = ""; }} /></label></div><p className="mt-3 text-[11px] leading-5 text-black/40">URL入力または既存のStorageへ画像をアップロードできます。</p></div><div className="rounded-xl border border-black/8 bg-white p-5"><p className="mb-4 text-[10px] font-bold uppercase tracking-[.2em] text-black/35">Project information</p><div className="space-y-3">{["Type", "Started", "Platform"].map((label) => <label key={label} className="block"><span className="mb-1 block text-xs font-semibold text-black/60">{label}</span><input value={getGeneral(editor, label)} onChange={(e) => update({ information: setGeneral(editor, label, label === "Platform" ? e.target.value.split(",").map((x) => x.trim()).filter(Boolean) : e.target.value) })} className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none" /></label>)}</div></div></aside></div></main></div>;
}

function SectionHeading({ icon, title, hint }: { icon: React.ReactNode; title: string; hint: string }) { return <div className="mb-4 flex items-center gap-3"><div className="rounded-lg bg-black p-2 text-white">{icon}</div><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-xs text-black/40">{hint}</p></div></div>; }
function EmptyState({ text }: { text: string }) { return <div className="px-6 py-16 text-center text-sm text-black/40">{text}</div>; }
function Disciplines() { return <><PageTitle eyebrow="Portfolio / Roots" title="Disciplines" description="Portfolioの最上位にある5つの領域。現段階では既存Hierarchyを基準に表示しています。" /><div className="grid grid-cols-2 gap-4 xl:grid-cols-3">{disciplines.map((discipline) => { const data = PORTFOLIO_HIERARCHY.disciplines.find((x) => x.id === discipline.id); return <div key={discipline.id} className="rounded-xl border border-black/8 bg-white p-6"><div className="flex items-center justify-between"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: discipline.color }} /><MoreHorizontal size={18} className="text-black/25" /></div><h3 className="mt-8 text-xl font-semibold">{discipline.label}</h3><p className="mt-2 text-sm leading-6 text-black/45">{discipline.description}</p><div className="mt-6 flex gap-6 border-t border-black/8 pt-4 text-xs text-black/45"><span>{data?.activities.length || 0} Activities</span><span>{data?.activities.reduce((sum, a) => sum + a.contents.length, 0) || 0} Contents</span></div></div>})}</div></>; }
function MediaNotice() { return <><PageTitle eyebrow="Media" title="Media Library" description="GalleryとMain visualをまとめて管理するための領域です。現在はProject Editor内から画像URLを登録できます。" /><div className="rounded-xl border border-dashed border-black/15 bg-white px-6 py-20 text-center"><ImageIcon size={28} className="mx-auto text-black/25" /><h3 className="mt-5 font-semibold">Media Library is coming next</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/45">既存のStorage構成を壊さず、次の段階でアップロード・alt text・caption・並び替えをここへ集約できます。</p></div></>; }
function SettingsPanel() { return <><PageTitle eyebrow="System" title="Settings" description="認証と公開フローに関する現在の設定を確認できます。" /><div className="max-w-2xl space-y-4"><div className="rounded-xl border border-black/8 bg-white p-6"><div className="flex items-start gap-4"><ShieldCheck className="mt-1 text-emerald-600" size={20} /><div><h3 className="font-semibold">Admin authentication</h3><p className="mt-2 text-sm leading-6 text-black/50">Supabase Authのセッションを使い、`ADMIN_EMAIL` と一致するユーザーだけがこの画面へアクセスできます。</p></div></div></div><div className="rounded-xl border border-black/8 bg-white p-6"><div className="flex items-start gap-4"><BookOpen className="mt-1 text-blue-600" size={20} /><div><h3 className="font-semibold">Content model</h3><p className="mt-2 text-sm leading-6 text-black/50">既存の `dev_projects` を利用しています。新しいCMSや不要なDB migrationは追加していません。</p></div></div></div></div></>; }
function LoginScreen({ email, password, error, setEmail, setPassword, onLogin }: { email: string; password: string; error: string; setEmail: (value: string) => void; setPassword: (value: string) => void; onLogin: () => void }) { return <div className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-5"><div className="w-full max-w-sm"><div className="mb-10"><p className="text-[10px] font-bold uppercase tracking-[.3em] text-black/35">RYUSEI TSUKAMOTO</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Portfolio Admin</h1><p className="mt-3 text-sm leading-6 text-black/45">Supabase Authでログインしてコンテンツを管理します。</p></div><div className="rounded-2xl border border-black/8 bg-white p-7 shadow-sm"><label className="mb-2 block text-xs font-semibold text-black/60">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4 w-full rounded-lg border border-black/10 px-3 py-3 text-sm outline-none focus:border-black/30" placeholder="admin@example.com" /><label className="mb-2 block text-xs font-semibold text-black/60">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onLogin()} className="w-full rounded-lg border border-black/10 px-3 py-3 text-sm outline-none focus:border-black/30" placeholder="••••••••" />{error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}<button onClick={onLogin} className="mt-6 w-full rounded-lg bg-black py-3 text-sm font-semibold text-white hover:bg-black/80">Sign in</button></div><p className="mt-6 text-center text-xs text-black/35">Private workspace · Supabase Auth</p></div></div>; }
