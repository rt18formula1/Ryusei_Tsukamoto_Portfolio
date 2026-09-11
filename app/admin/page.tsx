"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import {
  getNewsList,
  getPortfolioList,
  getAlbumsByType,
  getAllAlbums,
  getAlbumRelations,
  getEvents,
  uploadImageToStorage,
  getProducts,
  getOrders,
  getCommissions,
  getDevProjects,
  type DbNews,
  type DbPortfolio,
  type DbAlbum,
  type DbEvent,
  type DbDevProject,
} from "@/lib/supabase-queries";
import {
  createNewsAction,
  createPortfolioAction,
  createAlbumAction,
  addNewsToAlbumAction,
  addPortfolioToAlbumAction,
  deleteNewsAction,
  deletePortfolioAction,
  deleteAlbumAction,
  createEventAction,
  deleteEventAction,
  createProductAction,
  deleteProductAction,
  createDevProjectAction,
  updateDevProjectAction,
  deleteDevProjectAction,
  uploadDevProjectImageAction,
} from "@/lib/admin-actions";
import { createAlbumRelation } from "@/lib/supabase-queries";
import { AdminImageCard } from "@/components/admin-image-card";
import { AlbumNodeEditor } from "@/components/album-node-editor";
import { ShopAdminTab } from "@/components/shop/shop-admin-tab";

export default function AdminPage() {
  const [sessionOk, setSessionOk] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [news, setNews] = useState<DbNews[]>([]);
  const [portfolio, setPortfolio] = useState<DbPortfolio[]>([]);
  const [albums, setAlbums] = useState<DbAlbum[]>([]);
  const [albumRelations, setAlbumRelations] = useState<{ parent_id: string; child_id: string }[]>([]);
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [devProjects, setDevProjects] = useState<DbDevProject[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState({
    portfolio: false,
    news: false,
    albums: false,
    events: false,
    shop: false,
    devProjects: false
  });

  // Dev Project Modal State
  const [activeModal, setActiveModal] = useState<"news" | "portfolio" | "album" | "event" | "product" | "devProject" | "edit" | null>(null);
  const [albumType, setAlbumType] = useState<"backnumber" | "portfolio">("portfolio");
  const [editingDevProject, setEditingDevProject] = useState<DbDevProject | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    file: null as File | null,
    previewUrl: "",
    albumId: "",
    parentId: "" as string,
    location: "",
    startTime: "",
    endTime: "",
    // Product fields
    price: "",
    type: "digital" as "digital" | "physical" | "skill",
    status: "draft" as "on_sale" | "sold_out" | "draft",
    // Dev Project fields
    shortDescription: "",
    mainVisualUrl: "",
    mainVisualFocalPointX: 0.5,
    mainVisualFocalPointY: 0.5,
    information: [] as any[],
    details: [] as any[],
    gallery: [] as any[],
    links: [] as any[],
    sortOrder: 0,
  });

  const resetForm = () => {
    setFormData({ 
      title: "", 
      content: "", 
      file: null, 
      previewUrl: "", 
      albumId: "", 
      parentId: "", 
      location: "", 
      startTime: "", 
      endTime: "",
      price: "",
      type: "digital",
      status: "draft",
      shortDescription: "",
      mainVisualUrl: "",
      mainVisualFocalPointX: 0.5,
      mainVisualFocalPointY: 0.5,
      information: [],
      details: [],
      gallery: [],
      links: [],
      sortOrder: 0,
    });
    setEditingDevProject(null);
  };

  const buildAlbumOptions = (type: "backnumber" | "portfolio", parentId: string | null = null, depth = 0): DbAlbum[] => {
    return albums
      .filter((album) => album.type === type && album.parent_id === parentId)
      .flatMap((album) => [
        { ...album, name_en: `${"— ".repeat(depth)}${album.name_en}` },
        ...buildAlbumOptions(type, album.id, depth + 1),
      ]);
  };

  const parentAlbumOptions = buildAlbumOptions(albumType);
  const assignmentAlbumOptions = activeModal === "news" ? buildAlbumOptions("backnumber") : buildAlbumOptions("portfolio");

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setSessionOk(Boolean(data.ok));
        if (data.ok) loadData();
      })
      .catch(() => setSessionOk(false));
  }, []);

  const loadData = async () => {
    const [n, p, allAlbums, relations, e, prods, allOrders, allCommissions, dps] = await Promise.all([
      getNewsList(),
      getPortfolioList(),
      getAllAlbums(),
      getAlbumRelations(),
      getEvents(),
      getProducts(),
      getOrders(),
      getCommissions(),
      getDevProjects(),
    ]);
    setNews(n);
    setPortfolio(p);
    setAlbums(allAlbums);
    setAlbumRelations(relations);
    setEvents(e);
    setProducts(prods);
    setOrders(allOrders);
    setCommissions(allCommissions);
    setDevProjects(dps);
  };

  const login = async () => {
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      setError(payload?.error ?? "ログインに失敗しました");
      return;
    }
    setSessionOk(true);
    setPassword("");
    loadData();
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setSessionOk(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }
  };

  const handlePost = async () => {
    if (!formData.title || (!formData.file && activeModal !== "album" && activeModal !== "devProject")) {
      alert("Title and Image are required!");
      return;
    }
    setLoading(true);
    try {
      if (activeModal === "news") {
        const image_url = await uploadImageToStorage("news-images", formData.file!);
        const item = await createNewsAction({
          title_en: formData.title,
          title_ja: formData.title,
          body_en: formData.content,
          body_ja: formData.content,
          image_url,
          published_at: new Date().toISOString(),
        });
        if (formData.albumId) {
          await addNewsToAlbumAction(formData.albumId, item.id);
        }
      } else if (activeModal === "portfolio") {
        const image_url = await uploadImageToStorage("portfolio-images", formData.file!);
        const p = await createPortfolioAction({
          title_en: formData.title,
          title_ja: formData.title,
          body_en: formData.content,
          body_ja: formData.content,
          image_url,
          sort_order: portfolio.length,
        });
        if (formData.albumId) {
          await addPortfolioToAlbumAction(formData.albumId, p.id);
        }
      } else if (activeModal === "album") {
        let cover_image_url = null;
        if (formData.file) {
          const bucket = albumType === "backnumber" ? "bucknumber-covers" : "album-covers";
          cover_image_url = await uploadImageToStorage(bucket, formData.file);
        }
        const newAlbum = await createAlbumAction({
          name_en: formData.title,
          name_ja: formData.title,
          description_en: formData.content,
          description_ja: formData.content,
          type: albumType,
          parent_id: null,
          cover_image_url,
          sort_order: albums.length,
        });
        
        if (formData.parentId) {
          await createAlbumRelation(formData.parentId, newAlbum.id);
        }
      } else if (activeModal === "event") {
        await createEventAction({
          title: formData.title,
          description: formData.content,
          location: formData.location,
          start_time: formData.startTime,
          end_time: formData.endTime || null,
          is_all_day: false,
          source: "manual",
        });
      } else if (activeModal === "product") {
        let image_url = null;
        if (formData.file) {
          image_url = await uploadImageToStorage("portfolio-images", formData.file);
        }
        await createProductAction({
          name_ja: formData.title,
          name_en: formData.title,
          description_ja: formData.content,
          description_en: formData.content,
          price: parseInt(formData.price) || 0,
          type: formData.type,
          status: formData.status,
          image_url,
          sort_order: products.length,
        });
      } else if (activeModal === "devProject") {
        // Upload main visual if provided
        let mainVisualUrl = formData.mainVisualUrl;
        if (formData.file) {
          mainVisualUrl = await uploadDevProjectImageAction("portfolio-images", formData.file);
        }
        
        const projectData: Partial<DbDevProject> = {
          project_name: formData.title,
          short_description: formData.shortDescription,
          main_visual_url: mainVisualUrl,
          main_visual_focal_point_x: formData.mainVisualFocalPointX,
          main_visual_focal_point_y: formData.mainVisualFocalPointY,
          information: formData.information,
          details: formData.details,
          gallery: formData.gallery,
          links: formData.links,
          sort_order: formData.sortOrder,
        };
        
        if (editingDevProject) {
          await updateDevProjectAction(editingDevProject.id, projectData);
        } else {
          await createDevProjectAction(projectData);
        }
      }
      await loadData();
      setActiveModal(null);
      resetForm();
      alert("Success!");
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to post.";
      alert(`❌ エラー:\n${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Delete this news?")) return;
    setLoading(true);
    await deleteNewsAction(id);
    await loadData();
    setLoading(false);
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm("Delete this portfolio item?")) return;
    setLoading(true);
    await deletePortfolioAction(id);
    await loadData();
    setLoading(false);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    setLoading(true);
    await deleteEventAction(id);
    await loadData();
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    setLoading(true);
    await deleteProductAction(id);
    await loadData();
    setLoading(false);
  };

  const handleDeleteDevProject = async (id: string) => {
    if (!confirm("Delete this Developer Project?")) return;
    setLoading(true);
    await deleteDevProjectAction(id);
    await loadData();
    setLoading(false);
  };

  const handleEditDevProject = (project: DbDevProject) => {
    setEditingDevProject(project);
    setFormData({
      title: project.project_name,
      content: "",
      file: null,
      previewUrl: project.main_visual_url || "",
      albumId: "",
      parentId: "",
      location: "",
      startTime: "",
      endTime: "",
      price: "",
      type: "digital",
      status: "draft",
      shortDescription: project.short_description,
      mainVisualUrl: project.main_visual_url || "",
      mainVisualFocalPointX: project.main_visual_focal_point_x || 0.5,
      mainVisualFocalPointY: project.main_visual_focal_point_y || 0.5,
      information: project.information || [],
      details: project.details || [],
      gallery: project.gallery || [],
      links: project.links || [],
      sortOrder: project.sort_order,
    });
    setActiveModal("devProject");
  };

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleEdit = (item: { id: string; type: "news" | "portfolio"; title_en: string; title_ja: string; body_en?: string; body_ja?: string }) => {
    alert(`Edit functionality for ${item.type} ID: ${item.id} will be implemented soon.`);
  };

  const handleAlbumCreate = (name: string, type: "backnumber" | "portfolio") => {
    alert(`Album creation: ${name} (${type}) will be implemented soon.`);
  };

  if (!sessionOk) {
    return (
      <div className="min-h-screen bg-white text-black">
        <SiteHeader />
        <div className="container mx-auto px-4 py-12 max-w-md">
          <h1 className="text-3xl font-black mb-6">Admin</h1>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-black/20 rounded-lg mb-4"
            placeholder="admin@example.com"
          />
          <label className="block text-sm font-semibold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            className="w-full px-4 py-2 border border-black/20 rounded-lg mb-4"
          />
          {error ? <p className="text-sm mb-4 text-red-500">{error}</p> : null}
          <button type="button" onClick={login} className="w-full px-4 py-3 bg-black text-white font-semibold rounded-lg">
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black pb-24">
      <SiteHeader />
      <div className="container mx-auto px-4 py-10 max-w-6xl space-y-12">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black">Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => { resetForm(); setActiveModal("portfolio"); }}
              className="px-6 py-2 bg-black text-white font-bold rounded-full hover:bg-black/80 transition shadow-sm"
            >
              + Post Portfolio
            </button>
            <button
              onClick={() => { resetForm(); setActiveModal("news"); }}
              className="px-6 py-2 border-2 border-black font-bold rounded-full hover:bg-black/5 transition"
            >
              + Post News
            </button>
            <button
              onClick={() => { resetForm(); setActiveModal("event"); }}
              className="px-6 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition shadow-sm"
            >
              + Post Event
            </button>
            <button
              onClick={() => { resetForm(); setActiveModal("product"); }}
              className="px-6 py-2 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition shadow-sm"
            >
              + Post Product
            </button>
            <button
              onClick={() => { resetForm(); setActiveModal("devProject"); }}
              className="px-6 py-2 bg-amber-600 text-white font-bold rounded-full hover:bg-amber-700 transition shadow-sm"
            >
              + Post Dev Project
            </button>
            <button onClick={logout} className="text-sm underline">Logout</button>
          </div>
        </div>

        {loading && <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse z-[110]"></div>}

        {/* Portfolio Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-black/10 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleSection("portfolio")}
                className="w-6 h-6 flex items-center justify-center text-black hover:bg-black/5 rounded transition-colors"
              >
                <span className={`transform transition-transform ${collapsedSections.portfolio ? "rotate-90" : ""}`}>▶</span>
              </button>
              <h2 className="text-xl font-bold">Portfolio ({portfolio.length})</h2>
            </div>
            <button onClick={() => { resetForm(); setAlbumType("portfolio"); setActiveModal("album"); }} className="text-sm font-bold underline">+ New Album</button>
          </div>
          {!collapsedSections.portfolio && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {portfolio.map((p) => (
                <AdminImageCard
                  key={p.id}
                  id={p.id}
                  title={p.title_en}
                  imageUrl={p.image_url}
                  date={p.created_at}
                  type="portfolio"
                  onDelete={() => handleDeletePortfolio(p.id)}
                  onAssign={() => {
                    const aid = prompt("Album ID?");
                    if (aid) addPortfolioToAlbumAction(aid, p.id).then(() => alert("Assigned!"));
                  }}
                  onCopyEmbed={() => {
                    navigator.clipboard.writeText(`[portfolio:${p.id}]`);
                    alert("Copied to clipboard!");
                  }}
                  onEdit={() => handleEdit({ id: p.id, type: "portfolio", title_en: p.title_en, title_ja: p.title_ja, body_en: p.body_en, body_ja: p.body_ja })}
                />
              ))}
            </div>
          )}
        </section>

        {/* News Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-black/10 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleSection("news")}
                className="w-6 h-6 flex items-center justify-center text-black hover:bg-black/5 rounded transition-colors"
              >
                <span className={`transform transition-transform ${collapsedSections.news ? "rotate-90" : ""}`}>▶</span>
              </button>
              <h2 className="text-xl font-bold">News ({news.length})</h2>
            </div>
            <button onClick={() => { resetForm(); setAlbumType("backnumber"); setActiveModal("album"); }} className="text-sm font-bold underline">+ New Backnumber</button>
          </div>
          {!collapsedSections.news && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {news.map((n) => (
                <AdminImageCard
                  key={n.id}
                  id={n.id}
                  title={n.title_en}
                  imageUrl={n.image_url}
                  date={n.published_at}
                  type="news"
                  onDelete={() => handleDeleteNews(n.id)}
                  onAssign={() => {
                    const aid = prompt("Album ID?");
                    if (aid) addNewsToAlbumAction(aid, n.id).then(() => alert("Assigned!"));
                  }}
                  onCopyEmbed={() => {
                    navigator.clipboard.writeText(`[news:${n.id}]`);
                    alert("Copied to clipboard!");
                  }}
                  onEdit={() => handleEdit({ id: n.id, type: "news", title_en: n.title_en, title_ja: n.title_ja, body_en: n.body_en, body_ja: n.body_ja })}
                />
              ))}
            </div>
          )}
        </section>

        {/* Albums Section (Hierarchical Display) */}
        <section className="space-y-6">
          <div className="border-b border-black/10 pb-4">
            <h2 className="text-xl font-bold">Albums & Backnumbers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Portfolio Albums */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-400">Portfolio Albums</h3>
              <div className="space-y-2">
                {(() => {
                  const childIds = new Set(albumRelations.map(r => r.child_id));
                  const rootAlbums = albums.filter(a => a.type === "portfolio" && !childIds.has(a.id));
                  return rootAlbums.map(parent => (
                    <AlbumTree key={parent.id} album={parent} albums={albums} relations={albumRelations} depth={0} onDelete={loadData} />
                  ));
                })()}
              </div>
            </div>
            {/* Backnumbers */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-400">Backnumbers</h3>
              <div className="space-y-2">
                {(() => {
                  const childIds = new Set(albumRelations.map(r => r.child_id));
                  const rootAlbums = albums.filter(a => a.type === "backnumber" && !childIds.has(a.id));
                  return rootAlbums.map(parent => (
                    <AlbumTree key={parent.id} album={parent} albums={albums} relations={albumRelations} depth={0} onDelete={loadData} />
                  ));
                })()}
              </div>
            </div>
          </div>
        </section>

        {/* Dev Projects Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-black/10 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleSection("devProjects")}
                className="w-6 h-6 flex items-center justify-center text-black hover:bg-black/5 rounded transition-colors"
              >
                <span className={`transform transition-transform ${collapsedSections.devProjects ? "rotate-90" : ""}`}>▶</span>
              </button>
              <h2 className="text-xl font-bold">Developer Projects ({devProjects.length})</h2>
            </div>
            <button
              onClick={() => { resetForm(); setActiveModal("devProject"); }}
              className="px-4 py-2 bg-amber-600 text-white font-bold rounded-full hover:bg-amber-700 transition shadow-sm text-sm"
            >
              + New Dev Project
            </button>
          </div>
          {!collapsedSections.devProjects && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devProjects.map((proj) => (
                <div key={proj.id} className="border border-black/10 rounded-2xl p-5 bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-black text-sm">{proj.project_name}</p>
                      <p className="text-xs text-gray-400 font-mono mt-1">ID: {proj.id}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <a href={`/portfolio/dev/${proj.id}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs font-bold border border-black/20 rounded-lg py-2 hover:bg-black hover:text-white transition-colors">
                      View Detail
                    </a>
                    <a href={`/portfolio/dev/${proj.id}/print`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs font-bold border border-black/20 rounded-lg py-2 hover:bg-black hover:text-white transition-colors">
                      Print / PDF
                    </a>
                    <button
                      onClick={() => handleEditDevProject(proj)}
                      className="flex-1 text-center text-xs font-bold bg-amber-600 text-white rounded-lg py-2 hover:bg-amber-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDevProject(proj.id)}
                      className="flex-1 text-center text-xs font-bold bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Shop Management Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-black/10 pb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => toggleSection("shop")} className="w-6 h-6 flex items-center justify-center text-black hover:bg-black/5 rounded transition-colors">
                <span className={`transform transition-transform ${collapsedSections.shop ? "rotate-90" : ""}`}>Shop</span>
              </button>
              <h2 className="text-xl font-bold">Shop Management</h2>
            </div>
          </div>
          {!collapsedSections.shop && <ShopAdminTab />}
        </section>
        {/* Events Section */}
        <section className="space-y-6">
          <div className="border-b border-black/10 pb-4">
            <h2 className="text-xl font-bold">Upcoming Events (Manual)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.filter(e => e.source === "manual").map((e) => (
              <div key={e.id} className="p-4 border border-black/10 rounded-2xl bg-white flex justify-between items-center group">
                <div>
                  <p className="text-[10px] font-black text-gray-400 mb-1">
                    {new Date(e.start_time).toLocaleString()}
                  </p>
                  <h3 className="font-bold">{e.title}</h3>
                  {e.location && <p className="text-xs text-gray-400">📍 {e.location}</p>}
                </div>
                <button onClick={() => handleDeleteEvent(e.id)} className="text-red-500 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
              </div>
            ))}
            {events.filter(e => e.source === "manual").length === 0 && (
              <p className="text-sm text-gray-400">No manual events created.</p>
            )}
          </div>
        </section>

        {/* Album Relations Node Editor */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-black/10 pb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">Album Relations Editor</h2>
              <button
                onClick={() => handleAlbumCreate("New Album", "portfolio")}
                className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded hover:bg-blue-600 transition"
              >
                + New Album
              </button>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-4">
              Drag nodes to arrange, connect nodes to create parent-child relationships, double-click nodes to edit.
            </p>
            <AlbumNodeEditor />
          </div>
        </section>
      </div>

      {/* Shared Creation Modal (Instagram-style) */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10">
          <div className="bg-white w-full max-w-5xl h-full max-h-[720px] rounded-[28px] overflow-hidden flex flex-col shadow-2xl">
            <div className="h-14 border-b border-black/10 flex items-center justify-between px-6 shrink-0">
              <button onClick={() => { setActiveModal(null); resetForm(); }} className="text-sm font-bold text-gray-400 hover:text-black">Cancel</button>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-400">
                  {activeModal === "album" ? "Collection Setup" : activeModal === "devProject" ? "Developer Project" : "Publisher"}
                </p>
                <h3 className="font-black text-lg">
                  {activeModal === "album" ? `New ${albumType === "backnumber" ? "Backnumber" : "Album"}` : 
                   activeModal === "devProject" ? (editingDevProject ? "Edit Developer Project" : "New Developer Project") :
                   `New ${activeModal === "news" ? "News" : "Post"}`}
                </h3>
              </div>
              <button
                onClick={handlePost}
                disabled={loading}
                className="text-blue-500 font-black text-sm disabled:opacity-30"
              >
                {loading ? "Processing..." : (activeModal === "album" ? "Create" : (editingDevProject ? "Update" : "Share"))}
              </button>
            </div>
            
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Column: Image Preview / Upload */}
              <div className="flex-1 bg-[#f6f4ef] flex flex-col items-center justify-center relative group min-h-[320px] border-r border-black/5">
                {formData.previewUrl ? (
                  <img src={formData.previewUrl} className="w-full h-full object-contain" alt="Preview" />
                ) : (
                  <div className="text-center p-10 max-w-sm">
                    <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">🖼️</div>
                    <p className="text-sm font-bold text-gray-800 mb-2">Upload Thumbnail</p>
                    <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                      {activeModal === "album"
                        ? "Choose a cover that makes this collection immediately recognizable."
                        : activeModal === "devProject"
                        ? "Upload the main visual for this developer project (16:9 recommended)."
                        : "Drop in the hero image first so the preview and card layouts are easy to judge."}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="modal-file-input"
                    />
                    <label
                      htmlFor="modal-file-input"
                      className="px-6 py-2.5 bg-black text-white text-xs font-black rounded-lg cursor-pointer hover:bg-black/80 transition"
                    >
                      Choose from Computer
                    </label>
                  </div>
                )}
                {formData.previewUrl && (
                  <button
                    onClick={() => setFormData({ ...formData, file: null, previewUrl: "" })}
                    className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Right Column: Metadata Fields */}
              <div className="w-full md:w-[420px] flex flex-col bg-white overflow-y-auto">
                <div className="p-6 space-y-8">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-black/[0.03] p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400 mb-2">Type</p>
                      <p className="text-sm font-black capitalize">{activeModal === "album" ? albumType : activeModal}</p>
                    </div>
                    <div className="rounded-2xl bg-black/[0.03] p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400 mb-2">Title</p>
                      <p className="text-sm font-black">{formData.title.length}/80</p>
                    </div>
                    <div className="rounded-2xl bg-black/[0.03] p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400 mb-2">Body</p>
                      <p className="text-sm font-black">{formData.content.length} chars</p>
                    </div>
                  </div>

                  {activeModal === "album" && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Parent Album (Optional)</label>
                      <select
                        value={formData.parentId}
                        onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                        className="w-full p-3 bg-black/5 rounded-xl text-sm font-bold appearance-none focus:outline-none focus:ring-2 ring-black/5"
                      >
                        <option value="">No parent (Root album)</option>
                        {parentAlbumOptions.map((a) => (
                          <option key={a.id} value={a.id}>{a.name_en}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</label>
                      <input
                        type="text"
                        placeholder="Enter title..."
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full text-lg font-bold focus:outline-none border-b-2 border-black/5 pb-2 transition-colors focus:border-black"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                      <textarea
                        placeholder="Write a description..."
                        rows={6}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full text-sm resize-none focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {activeModal === "event" && (
                    <div className="space-y-4 pt-4 border-t border-black/5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Start Time</label>
                        <input
                          type="datetime-local"
                          value={formData.startTime}
                          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                          className="w-full p-3 bg-black/5 rounded-xl text-sm font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Suzuka Circuit, Online, etc."
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full p-3 bg-black/5 rounded-xl text-sm font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {activeModal === "product" && (
                    <div className="space-y-4 pt-4 border-t border-black/5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price (JPY)</label>
                          <input
                            type="number"
                            placeholder="e.g. 1500"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full p-3 bg-black/5 rounded-xl text-sm font-bold"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</label>
                          <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            className="w-full p-3 bg-black/5 rounded-xl text-sm font-bold appearance-none"
                          >
                            <option value="digital">Digital</option>
                            <option value="physical">Physical</option>
                            <option value="skill">Skill</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                          className="w-full p-3 bg-black/5 rounded-xl text-sm font-bold appearance-none"
                        >
                          <option value="draft">Draft</option>
                          <option value="on_sale">On Sale</option>
                          <option value="sold_out">Sold Out</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {activeModal === "devProject" && (
                    <div className="space-y-6 pt-4 border-t border-black/5">
                      {/* Short Description */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Short Description</label>
                        <textarea
                          placeholder="Brief description for cards and previews..."
                          rows={3}
                          value={formData.shortDescription}
                          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                          className="w-full text-sm resize-none focus:outline-none leading-relaxed"
                        />
                      </div>

                      {/* Main Visual Focal Point */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Main Visual Focal Point (0-1)</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">X (Horizontal)</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="1"
                              value={formData.mainVisualFocalPointX}
                              onChange={(e) => setFormData({ ...formData, mainVisualFocalPointX: parseFloat(e.target.value) })}
                              className="w-full p-3 bg-black/5 rounded-xl text-sm font-bold"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Y (Vertical)</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="1"
                              value={formData.mainVisualFocalPointY}
                              onChange={(e) => setFormData({ ...formData, mainVisualFocalPointY: parseFloat(e.target.value) })}
                              className="w-full p-3 bg-black/5 rounded-xl text-sm font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Sort Order */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort Order</label>
                        <input
                          type="number"
                          value={formData.sortOrder}
                          onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                          className="w-full p-3 bg-black/5 rounded-xl text-sm font-bold"
                        />
                      </div>

                      {/* Information Categories */}
                      <div className="space-y-4 pt-4 border-t border-black/5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Project Information</label>
                          <button
                            onClick={() => setFormData({ ...formData, information: [...formData.information, { category: "GENERAL", items: [] }] })}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            + Add Category
                          </button>
                        </div>
                        {formData.information.map((cat, catIdx) => (
                          <div key={catIdx} className="border border-black/10 rounded-xl p-4 bg-gray-50 space-y-3">
                            <div className="flex items-center justify-between">
                              <select
                                value={cat.category}
                                onChange={(e) => {
                                  const newInfo = [...formData.information];
                                  newInfo[catIdx] = { ...newInfo[catIdx], category: e.target.value };
                                  setFormData({ ...formData, information: newInfo });
                                }}
                                className="w-full md:w-1/2 p-2 bg-white border border-black/10 rounded-lg text-sm font-bold appearance-none"
                              >
                                <option value="GENERAL">GENERAL</option>
                                <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
                                <option value="DATA">DATA</option>
                                <option value="AUTHENTICATION">AUTHENTICATION</option>
                                <option value="API / INTEGRATION">API / INTEGRATION</option>
                                <option value="OTHER">OTHER</option>
                              </select>
                              <button
                                onClick={() => {
                                  const newInfo = formData.information.filter((_, i) => i !== catIdx);
                                  setFormData({ ...formData, information: newInfo });
                                }}
                                className="text-red-500 text-xs font-bold hover:underline ml-2"
                              >
                                Remove Category
                              </button>
                            </div>
                            <div className="space-y-2">
                              {cat.items.map((item: any, itemIdx: number) => <div key={itemIdx} className="flex gap-2">
                                <input type="text" placeholder="Label" value={item.label} onChange={(e) => { const information = [...formData.information]; information[catIdx] = { ...information[catIdx], items: information[catIdx].items.map((entry: any, index: number) => index === itemIdx ? { ...entry, label: e.target.value } : entry) }; setFormData({ ...formData, information }); }} className="w-1/3 rounded-lg border border-black/10 bg-white p-2 text-sm font-bold" />
                                <input type="text" placeholder="Value" value={Array.isArray(item.value) ? item.value.join(", ") : item.value} onChange={(e) => { const information = [...formData.information]; const values = e.target.value.split(",").map((value) => value.trim()); information[catIdx] = { ...information[catIdx], items: information[catIdx].items.map((entry: any, index: number) => index === itemIdx ? { ...entry, value: values.length > 1 ? values : e.target.value } : entry) }; setFormData({ ...formData, information }); }} className="w-2/3 rounded-lg border border-black/10 bg-white p-2 text-sm" />
                                <button onClick={() => { const information = [...formData.information]; information[catIdx] = { ...information[catIdx], items: information[catIdx].items.filter((_: any, index: number) => index !== itemIdx) }; setFormData({ ...formData, information }); }} className="text-xs font-bold text-red-500">✕</button>
                              </div>)}
                              <button
                                onClick={() => {
                                  const newInfo = [...formData.information];
                                  newInfo[catIdx] = { ...newInfo[catIdx], items: [...newInfo[catIdx].items, { label: "", value: "", type: "Text" }] };
                                  setFormData({ ...formData, information: newInfo });
                                }}
                                className="text-xs font-bold text-blue-600 hover:underline"
                              >
                                + Add Item
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Details Blocks */}
                      <div className="space-y-4 pt-4 border-t border-black/5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Project Details</label>
                          <button
                            onClick={() => setFormData({ ...formData, details: [...formData.details, { id: `d${Date.now()}`, type: "Text", content: "", order: formData.details.length }] })}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            + Add Block
                          </button>
                        </div>
                        {formData.details.map((block: any, blockIdx: number) => (
                          <div key={blockIdx} className="border border-black/10 rounded-xl p-4 bg-gray-50 space-y-3">
                            <div className="flex items-center justify-between">
                              <select
                                value={block.type}
                                onChange={(e) => {
                                  const newDetails = [...formData.details];
                                  newDetails[blockIdx] = { ...newDetails[blockIdx], type: e.target.value };
                                  setFormData({ ...formData, details: newDetails });
                                }}
                                className="w-full md:w-1/3 p-2 bg-white border border-black/10 rounded-lg text-sm font-bold appearance-none"
                              >
                                <option value="Section">Section</option>
                                <option value="Text">Text</option>
                                <option value="Image">Image</option>
                                <option value="ImageText">Image + Text</option>
                                <option value="Highlight">Highlight</option>
                              </select>
                              <button
                                onClick={() => {
                                  const newDetails = formData.details.filter((_: any, i: number) => i !== blockIdx);
                                  setFormData({ ...formData, details: newDetails });
                                }}
                                className="text-red-500 text-xs font-bold hover:underline ml-2"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="space-y-2">
                              {block.type === "Section" && (
                                <input
                                  type="text"
                                  placeholder="Section Title"
                                  value={block.content || ""}
                                  onChange={(e) => {
                                    const newDetails = [...formData.details];
                                    newDetails[blockIdx] = { ...newDetails[blockIdx], content: e.target.value };
                                    setFormData({ ...formData, details: newDetails });
                                  }}
                                  className="w-full p-2 bg-white border border-black/10 rounded-lg text-sm font-bold"
                                />
                              )}
                              {block.type === "Text" && (
                                <textarea
                                  placeholder="Text content..."
                                  rows={4}
                                  value={block.content || ""}
                                  onChange={(e) => {
                                    const newDetails = [...formData.details];
                                    newDetails[blockIdx] = { ...newDetails[blockIdx], content: e.target.value };
                                    setFormData({ ...formData, details: newDetails });
                                  }}
                                  className="w-full text-sm resize-none focus:outline-none leading-relaxed"
                                />
                              )}
                              {block.type === "Image" && (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    placeholder="Image URL"
                                    value={block.imageUrl || ""}
                                    onChange={(e) => {
                                      const newDetails = [...formData.details];
                                      newDetails[blockIdx] = { ...newDetails[blockIdx], imageUrl: e.target.value };
                                      setFormData({ ...formData, details: newDetails });
                                    }}
                                    className="w-full p-2 bg-white border border-black/10 rounded-lg text-sm"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Caption (optional)"
                                    value={block.imageCaption || ""}
                                    onChange={(e) => {
                                      const newDetails = [...formData.details];
                                      newDetails[blockIdx] = { ...newDetails[blockIdx], imageCaption: e.target.value };
                                      setFormData({ ...formData, details: newDetails });
                                    }}
                                    className="w-full p-2 bg-white border border-black/10 rounded-lg text-sm"
                                  />
                                </div>
                              )}
                              {block.type === "ImageText" && (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    placeholder="Image URL"
                                    value={block.imageUrl || ""}
                                    onChange={(e) => {
                                      const newDetails = [...formData.details];
                                      newDetails[blockIdx] = { ...newDetails[blockIdx], imageUrl: e.target.value };
                                      setFormData({ ...formData, details: newDetails });
                                    }}
                                    className="w-full p-2 bg-white border border-black/10 rounded-lg text-sm"
                                  />
                                  <textarea
                                    placeholder="Text content..."
                                    rows={3}
                                    value={block.text || ""}
                                    onChange={(e) => {
                                      const newDetails = [...formData.details];
                                      newDetails[blockIdx] = { ...newDetails[blockIdx], text: e.target.value };
                                      setFormData({ ...formData, details: newDetails });
                                    }}
                                    className="w-full text-sm resize-none focus:outline-none leading-relaxed"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Caption (optional)"
                                    value={block.imageCaption || ""}
                                    onChange={(e) => {
                                      const newDetails = [...formData.details];
                                      newDetails[blockIdx] = { ...newDetails[blockIdx], imageCaption: e.target.value };
                                      setFormData({ ...formData, details: newDetails });
                                    }}
                                    className="w-full p-2 bg-white border border-black/10 rounded-lg text-sm"
                                  />
                                </div>
                              )}
                              {block.type === "Highlight" && (
                                <input
                                  type="text"
                                  placeholder="Highlight text"
                                  value={block.content || ""}
                                  onChange={(e) => {
                                    const newDetails = [...formData.details];
                                    newDetails[blockIdx] = { ...newDetails[blockIdx], content: e.target.value };
                                    setFormData({ ...formData, details: newDetails });
                                  }}
                                  className="w-full p-2 bg-white border border-black/10 rounded-lg text-sm font-bold"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Gallery */}
                      <div className="space-y-4 pt-4 border-t border-black/5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gallery</label>
                          <button
                            onClick={() => setFormData({ ...formData, gallery: [...formData.gallery, { id: `g${Date.now()}`, imageUrl: "", caption: "", description: "", order: formData.gallery.length }] })}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            + Add Image
                          </button>
                        </div>
                        {formData.gallery.map((item: any, itemIdx: number) => (
                          <div key={itemIdx} className="border border-black/10 rounded-xl p-4 bg-gray-50 space-y-2 flex gap-4">
                            <input
                              type="text"
                              placeholder="Image URL"
                              value={item.imageUrl}
                              onChange={(e) => {
                                const newGallery = [...formData.gallery];
                                newGallery[itemIdx] = { ...newGallery[itemIdx], imageUrl: e.target.value };
                                setFormData({ ...formData, gallery: newGallery });
                              }}
                              className="w-full p-2 bg-white border border-black/10 rounded-lg text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Caption"
                              value={item.caption || ""}
                              onChange={(e) => {
                                const newGallery = [...formData.gallery];
                                newGallery[itemIdx] = { ...newGallery[itemIdx], caption: e.target.value };
                                setFormData({ ...formData, gallery: newGallery });
                              }}
                              className="w-1/2 p-2 bg-white border border-black/10 rounded-lg text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Description (optional)"
                              value={item.description || ""}
                              onChange={(e) => {
                                const newGallery = [...formData.gallery];
                                newGallery[itemIdx] = { ...newGallery[itemIdx], description: e.target.value };
                                setFormData({ ...formData, gallery: newGallery });
                              }}
                              className="w-1/2 p-2 bg-white border border-black/10 rounded-lg text-sm"
                            />
                            <input
                              type="number"
                              placeholder="Order"
                              value={item.order}
                              onChange={(e) => {
                                const newGallery = [...formData.gallery];
                                newGallery[itemIdx] = { ...newGallery[itemIdx], order: parseInt(e.target.value) || 0 };
                                setFormData({ ...formData, gallery: newGallery });
                              }}
                              className="w-20 p-2 bg-white border border-black/10 rounded-lg text-sm"
                            />
                            <button
                              onClick={() => {
                                const newGallery = formData.gallery.filter((_: any, i: number) => i !== itemIdx);
                                setFormData({ ...formData, gallery: newGallery });
                              }}
                              className="text-red-500 text-xs font-bold hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="space-y-4 pt-4 border-t border-black/5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Links</label>
                          <button
                            onClick={() => setFormData({ ...formData, links: [...formData.links, { id: `l${Date.now()}`, title: "Website", description: "", url: "", displayUrl: "", buttonLabel: "Visit", order: formData.links.length }] })}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            + Add Link
                          </button>
                        </div>
                        {formData.links.map((link: any, linkIdx: number) => (
                          <div key={linkIdx} className="border border-black/10 rounded-xl p-4 bg-gray-50 space-y-2">
                            <div className="flex items-center justify-between">
                              <select
                                value={link.title}
                                onChange={(e) => {
                                  const newLinks = [...formData.links];
                                  newLinks[linkIdx] = { ...newLinks[linkIdx], title: e.target.value };
                                  setFormData({ ...formData, links: newLinks });
                                }}
                                className="w-full md:w-1/3 p-2 bg-white border border-black/10 rounded-lg text-sm font-bold appearance-none"
                              >
                                <option value="Website">Website</option>
                                <option value="GitHub">GitHub</option>
                                <option value="Documentation">Documentation</option>
                                <option value="Demo">Demo</option>
                                <option value="Other">Other</option>
                              </select>
                              <button
                                onClick={() => {
                                  const newLinks = formData.links.filter((_: any, i: number) => i !== linkIdx);
                                  setFormData({ ...formData, links: newLinks });
                                }}
                                className="text-red-500 text-xs font-bold hover:underline ml-2"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="Description"
                                value={link.description || ""}
                                onChange={(e) => {
                                  const newLinks = [...formData.links];
                                  newLinks[linkIdx] = { ...newLinks[linkIdx], description: e.target.value };
                                  setFormData({ ...formData, links: newLinks });
                                }}
                                className="w-full p-2 bg-white border border-black/10 rounded-lg text-sm"
                              />
                              <input
                                type="text"
                                placeholder="Full URL"
                                value={link.url || ""}
                                onChange={(e) => {
                                  const newLinks = [...formData.links];
                                  newLinks[linkIdx] = { ...newLinks[linkIdx], url: e.target.value };
                                  setFormData({ ...formData, links: newLinks });
                                }}
                                className="w-full p-2 bg-white border border-black/10 rounded-lg text-sm"
                              />
                              <input
                                type="text"
                                placeholder="Display URL (shortened for UI)"
                                value={link.displayUrl || ""}
                                onChange={(e) => {
                                  const newLinks = [...formData.links];
                                  newLinks[linkIdx] = { ...newLinks[linkIdx], displayUrl: e.target.value };
                                  setFormData({ ...formData, links: newLinks });
                                }}
                                className="w-full p-2 bg-white border border-black/10 rounded-lg text-sm"
                              />
                              <input
                                type="text"
                                placeholder="Button Label"
                                value={link.buttonLabel || "Visit"}
                                onChange={(e) => {
                                  const newLinks = [...formData.links];
                                  newLinks[linkIdx] = { ...newLinks[linkIdx], buttonLabel: e.target.value };
                                  setFormData({ ...formData, links: newLinks });
                                }}
                                className="w-full p-2 bg-white border border-black/10 rounded-lg text-sm"
                              />
                              <input
                                type="number"
                                placeholder="Order"
                                value={link.order}
                                onChange={(e) => {
                                  const newLinks = [...formData.links];
                                  newLinks[linkIdx] = { ...newLinks[linkIdx], order: parseInt(e.target.value) || 0 };
                                  setFormData({ ...formData, links: newLinks });
                                }}
                                className="w-20 p-2 bg-white border border-black/10 rounded-lg text-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(activeModal === "portfolio" || activeModal === "news") && (
                    <div className="pt-6 border-t border-black/5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">
                        {activeModal === "news" ? "Assign to Backnumber" : "Add to Album"}
                      </label>
                      <select
                        value={formData.albumId}
                        onChange={(e) => setFormData({ ...formData, albumId: e.target.value })}
                        className="w-full p-3 bg-black/5 rounded-xl text-sm font-bold appearance-none focus:outline-none focus:ring-2 ring-black/5"
                      >
                        <option value="">
                          {activeModal === "news" ? "None (Standalone article)" : "None (Standalone work)"}
                        </option>
                        {assignmentAlbumOptions.map((a) => (
                          <option key={a.id} value={a.id}>{a.name_en}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="rounded-2xl border border-black/10 bg-[#fbfaf7] p-4 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">Preview Notes</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {activeModal === "news"
                        ? "News cards read best with a strong thumbnail, a short title, and the correct Backnumber selected before publishing."
                        : activeModal === "portfolio"
                          ? "Portfolio posts feel stronger when the cover image is clean and the album assignment already matches the collection structure."
                          : activeModal === "devProject"
                          ? "Fill in all sections for a complete developer project. Main visual, information categories, details blocks, gallery, and links will all appear in the detail view and print layout."
                          : "Nested collections are easiest to scan when parent albums stay broad and child albums stay specific."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AlbumListItem({ album, onDelete, isChild }: { album: DbAlbum, onDelete: () => void, isChild?: boolean }) {
  return (
    <div className={`p-3 border border-black/10 rounded-xl flex items-center justify-between bg-white shadow-sm hover:shadow-md transition-shadow ${isChild ? 'bg-gray-50' : ''}`}>
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="w-10 h-10 shrink-0 bg-black/5 rounded-lg overflow-hidden relative border border-black/5">
          {album.cover_image_url ? (
            <img src={album.cover_image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs">📁</div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[9px] font-mono text-gray-400 truncate">{album.id}</p>
          <p className="font-black text-sm truncate">{album.name_en}</p>
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); if (confirm("Delete?")) onDelete(); }} className="text-red-500 text-xs font-bold hover:underline ml-4">Delete</button>
    </div>
  );
}

function AlbumTree({ album, albums, relations, depth, onDelete }: { album: DbAlbum, albums: DbAlbum[], relations: { parent_id: string; child_id: string }[], depth: number, onDelete: () => void }) {
  const children = relations
    .filter(r => r.parent_id === album.id)
    .map(r => albums.find(a => a.id === r.child_id))
    .filter((child): child is DbAlbum => child !== undefined);
  
  return (
    <div key={album.id} className="space-y-2">
      <div style={{ marginLeft: depth * 20 }}>
        <AlbumListItem 
          album={album} 
          onDelete={() => deleteAlbumAction(album.id).then(onDelete)} 
          isChild={depth > 0} 
        />
      </div>
      {children.map(child => (
        <AlbumTree 
          key={child.id} 
          album={child} 
          albums={albums} 
          relations={relations}
          depth={depth + 1} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}
