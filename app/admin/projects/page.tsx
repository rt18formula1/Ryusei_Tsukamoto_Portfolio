"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getDevProjects, type DbDevProject } from "@/lib/supabase-queries";

function getStatus(project: DbDevProject): string {
  const general = (project.information || []).find((c: any) => c.category === "GENERAL");
  const statusItem = general?.items?.find((i: any) => i.label === "Status");
  return (statusItem?.value as string) || "Public";
}

function getType(project: DbDevProject): string {
  const general = (project.information || []).find((c: any) => c.category === "GENERAL");
  const typeItem = general?.items?.find((i: any) => i.label === "Type");
  return (typeItem?.value as string) || "—";
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Public: "bg-green-100 text-green-700",
    "In Development": "bg-blue-100 text-blue-700",
    Beta: "bg-blue-100 text-blue-700",
    Private: "bg-gray-100 text-gray-500",
    Archived: "bg-gray-100 text-gray-400",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${colors[status] || colors.Public}`}>
      {status}
    </span>
  );
}

const STATUS_FILTERS = ["All", "Public", "In Development", "Private", "Archived"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<DbDevProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    getDevProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch = !search ||
        p.project_name.toLowerCase().includes(search.toLowerCase()) ||
        (p.short_description || "").toLowerCase().includes(search.toLowerCase());
      const status = getStatus(p);
      const matchesStatus = statusFilter === "All" || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1">Projects</h1>
          <p className="text-sm text-gray-400">Developer Projects — {projects.length}件</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-black/80 transition"
        >
          + New Project
        </Link>
      </div>

      {/* Search & Filter */}
      {!loading && projects.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-black/10 rounded-lg text-sm font-bold focus:outline-none focus:border-black"
          />
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition ${
                  statusFilter === f
                    ? "bg-black text-white"
                    : "border border-black/15 text-gray-600 hover:border-black"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && <p className="text-sm text-gray-400">Loading…</p>}

      {!loading && projects.length === 0 && (
        <div className="border border-dashed border-black/15 rounded-xl p-12 text-center">
          <p className="text-sm text-gray-400 mb-4">No projects yet.</p>
          <Link
            href="/admin/projects/new"
            className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-black/80 transition"
          >
            Create First Project
          </Link>
        </div>
      )}

      {!loading && projects.length > 0 && filtered.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">No projects match your filters.</p>
      )}

      {!loading && filtered.length > 0 && (
        <div className="border border-black/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-gray-50">
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Project Name</th>
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hidden lg:table-cell">Updated</th>
                <th className="text-right px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filtered.map((p) => {
                const status = getStatus(p);
                const type = getType(p);
                return (
                  <tr key={p.id} className="hover:bg-black/5 transition-colors">
                    <td className="px-4 py-3 font-bold">
                      {p.main_visual_url && (
                        <img src={p.main_visual_url} alt="" className="inline-block w-8 h-8 rounded object-cover mr-2 align-middle" />
                      )}
                      {p.project_name}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell"><StatusBadge status={status} /></td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500">{type}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-400 text-xs">
                      {new Date(p.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/projects/${p.id}`}
                        className="text-xs font-bold text-black hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
