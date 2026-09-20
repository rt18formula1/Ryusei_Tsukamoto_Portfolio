"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDisciplines } from "@/lib/portfolio-hierarchy";
import { getDevProjects, type DbDevProject } from "@/lib/supabase-queries";

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="border border-black/10 rounded-xl p-5 bg-white">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{label}</p>
      <p className={`text-3xl font-black ${color ?? ""}`}>{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const disciplines = getDisciplines();
  const [devProjects, setDevProjects] = useState<DbDevProject[]>([]);

  useEffect(() => {
    getDevProjects().then(setDevProjects);
  }, []);

  const activityCount = disciplines.reduce((sum, d) => sum + d.activities.length, 0);
  const projectCount = devProjects.length;

  const statusCounts: Record<string, number> = {};
  devProjects.forEach((p) => {
    const general = (p.information || []).find((c: any) => c.category === "GENERAL");
    const statusItem = general?.items?.find((i: any) => i.label === "Status");
    const status = (statusItem?.value as string) || "Public";
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const recent = [...devProjects]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <h1 className="text-2xl font-black mb-1">Portfolio Admin</h1>
      <p className="text-sm text-gray-400 mb-8">Portfolioの状態を把握する</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Disciplines" value={disciplines.length} />
        <StatCard label="Activities" value={activityCount} />
        <StatCard label="Projects" value={projectCount} />
        <StatCard label="Published" value={statusCounts["Public"] || 0} color="text-green-600" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="In Development" value={statusCounts["In Development"] || 0} color="text-blue-600" />
        <StatCard label="Private" value={statusCounts["Private"] || 0} color="text-gray-500" />
        <StatCard label="Archived" value={statusCounts["Archived"] || 0} color="text-gray-400" />
      </div>

      {/* Recent Updates */}
      <div className="mb-10">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Recent Updates</h2>
        <div className="border border-black/10 rounded-xl divide-y divide-black/5">
          {recent.length === 0 && (
            <p className="p-5 text-sm text-gray-400">No projects yet.</p>
          )}
          {recent.map((p) => (
            <Link
              key={p.id}
              href={`/admin/projects/${p.id}`}
              className="flex items-center justify-between p-4 hover:bg-black/5 transition-colors"
            >
              <span className="text-sm font-bold">{p.project_name}</span>
              <span className="text-xs text-gray-400">
                Updated {new Date(p.updated_at).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/hierarchy" className="px-4 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-black/80 transition">
            View Hierarchy
          </Link>
          <Link href="/admin/projects/new" className="px-4 py-2.5 border-2 border-black text-sm font-bold rounded-lg hover:bg-black/5 transition">
            + New Project
          </Link>
          <Link href="/admin/disciplines" className="px-4 py-2.5 border-2 border-black/20 text-sm font-bold rounded-lg hover:bg-black/5 transition">
            Manage Disciplines
          </Link>
        </div>
      </div>
    </div>
  );
}
