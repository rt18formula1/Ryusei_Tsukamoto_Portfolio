"use client";

import { useEffect, useState } from "react";
import { getDevProjects, type DbDevProject } from "@/lib/supabase-queries";

interface MediaItem {
  id: string;
  projectName: string;
  url: string;
  type: "main-visual" | "gallery" | "details";
  caption?: string;
}

export default function MediaPage() {
  const [projects, setProjects] = useState<DbDevProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    getDevProjects().then(setProjects).finally(() => setLoading(false));
  }, []);

  const mediaItems: MediaItem[] = projects.flatMap((p) => {
    const items: MediaItem[] = [];
    if (p.main_visual_url) {
      items.push({ id: `${p.id}-main`, projectName: p.project_name, url: p.main_visual_url, type: "main-visual" });
    }
    (p.gallery || []).forEach((g: any, i: number) => {
      if (g.imageUrl) {
        items.push({ id: `${p.id}-g${i}`, projectName: p.project_name, url: g.imageUrl, type: "gallery", caption: g.caption });
      }
    });
    (p.details || []).forEach((d: any, i: number) => {
      if (d.imageUrl) {
        items.push({ id: `${p.id}-d${i}`, projectName: p.project_name, url: d.imageUrl, type: "details", caption: d.imageCaption });
      }
    });
    return items;
  });

  const filtered = filter === "all" ? mediaItems : mediaItems.filter((m) => m.type === filter);

  const typeLabels: Record<string, string> = {
    "main-visual": "Main Visual",
    gallery: "Gallery",
    details: "Details",
  };

  const typeColors: Record<string, string> = {
    "main-visual": "bg-blue-100 text-blue-700",
    gallery: "bg-purple-100 text-purple-700",
    details: "bg-green-100 text-green-700",
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <h1 className="text-2xl font-black mb-1">Media</h1>
      <p className="text-sm text-gray-400 mb-8">
        プロジェクトに登録されている画像一覧 — {mediaItems.length}件
      </p>

      {loading && <p className="text-sm text-gray-400">Loading…</p>}

      {!loading && mediaItems.length === 0 && (
        <div className="border border-dashed border-black/15 rounded-xl p-12 text-center">
          <p className="text-sm text-gray-400">No media found.</p>
        </div>
      )}

      {!loading && mediaItems.length > 0 && (
        <>
          {/* Filter */}
          <div className="flex gap-2 mb-6">
            {["all", "main-visual", "gallery", "details"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition ${
                  filter === f
                    ? "bg-black text-white"
                    : "border border-black/15 text-gray-600 hover:border-black"
                }`}
              >
                {f === "all" ? "All" : typeLabels[f]}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="border border-black/10 rounded-xl overflow-hidden bg-white group">
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={item.url}
                    alt={item.caption || item.projectName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${typeColors[item.type]}`}>
                      {typeLabels[item.type]}
                    </span>
                  </div>
                  <p className="text-xs font-bold truncate">{item.projectName}</p>
                  {item.caption && (
                    <p className="text-[10px] text-gray-400 truncate">{item.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
