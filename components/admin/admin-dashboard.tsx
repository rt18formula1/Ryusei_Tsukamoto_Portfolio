"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  Sparkles,
  FolderGit2,
  CheckCircle2,
  Clock,
  Lock,
  Plus,
  ArrowRight,
  GitFork,
  ExternalLink,
  Eye,
} from "lucide-react";
import type { DbDevProject } from "@/lib/supabase-queries";
import type { HierarchyStats } from "@/lib/admin-hierarchy-service";
import type { AdminTab } from "./admin-sidebar";

interface AdminDashboardProps {
  stats: HierarchyStats;
  projects: DbDevProject[];
  onNavigateTab: (tab: AdminTab) => void;
  onOpenProject: (project?: DbDevProject) => void;
}

export function AdminDashboard({
  stats,
  projects,
  onNavigateTab,
  onOpenProject,
}: AdminDashboardProps) {
  const statCards = [
    {
      label: "Disciplines",
      value: stats.disciplinesCount,
      icon: <Layers size={18} className="text-blue-600" />,
      bg: "bg-blue-50",
      tab: "disciplines" as AdminTab,
    },
    {
      label: "Activities",
      value: stats.activitiesCount,
      icon: <Sparkles size={18} className="text-purple-600" />,
      bg: "bg-purple-50",
      tab: "activities" as AdminTab,
    },
    {
      label: "Projects",
      value: stats.projectsCount,
      icon: <FolderGit2 size={18} className="text-black" />,
      bg: "bg-black/5",
      tab: "projects" as AdminTab,
    },
    {
      label: "Published",
      value: stats.publishedCount,
      icon: <CheckCircle2 size={18} className="text-emerald-600" />,
      bg: "bg-emerald-50",
      tab: "projects" as AdminTab,
    },
    {
      label: "In Development",
      value: stats.inDevCount,
      icon: <Clock size={18} className="text-amber-600" />,
      bg: "bg-amber-50",
      tab: "projects" as AdminTab,
    },
    {
      label: "Private / Drafts",
      value: stats.privateCount,
      icon: <Lock size={18} className="text-gray-600" />,
      bg: "bg-gray-100",
      tab: "projects" as AdminTab,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.28em] text-black/35">
            System Overview
          </p>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Portfolio Admin
          </h1>
          <p className="mt-1 text-xs text-black/50">
            Hierarchy構造と各コンテンツを一元管理します。
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab("hierarchy")}
            className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-xs font-bold text-black shadow-sm transition hover:bg-black/5"
          >
            <GitFork size={15} />
            <span>Hierarchy Tree</span>
          </button>
          <button
            onClick={() => onOpenProject()}
            className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-black/80"
          >
            <Plus size={15} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            onClick={() => onNavigateTab(card.tab)}
            className="group cursor-pointer rounded-2xl border border-black/8 bg-white p-4 shadow-sm transition hover:border-black/20 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-black/45">
                {card.label}
              </span>
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${card.bg}`}
              >
                {card.icon}
              </div>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight text-black">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Architecture Context Banner */}
      <div className="rounded-2xl border border-black/8 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="rounded-md bg-black/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black/55">
              Data-Driven Architecture
            </span>
            <h3 className="mt-2 text-base font-bold text-black">
              Hierarchy → Portfolio (Map / List / Detail)
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-black/55 max-w-2xl">
              Adminで更新したDiscipline・Activity・Projectの情報は、公開サイトの五角形マップ、リスト、パンくず、詳細モーダルへ自動反映されます。
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-black/[.02] px-4 py-2.5 text-xs font-bold text-black transition hover:bg-black/10 shrink-0"
          >
            <span>Live Portfolio を開く</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* Recent Updates Table */}
      <div className="rounded-2xl border border-black/8 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-black/8 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-sm font-bold text-black">Recent Updates</h2>
            <p className="text-xs text-black/40">最近編集・登録されたプロジェクト</p>
          </div>
          <button
            onClick={() => onNavigateTab("projects")}
            className="flex items-center gap-1 text-xs font-bold text-black/60 hover:text-black"
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="py-16 text-center text-xs text-black/40">
            プロジェクトがまだ登録されていません。
          </div>
        ) : (
          <div className="divide-y divide-black/6">
            {projects.slice(0, 6).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between px-5 py-3.5 transition hover:bg-black/[.015] sm:px-6"
              >
                <div
                  onClick={() => onOpenProject(project)}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3.5"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-black/5 border border-black/5">
                    {project.main_visual_url ? (
                      <img
                        src={project.main_visual_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-black text-black/25">
                        DEV
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-black sm:text-sm">
                      {project.project_name || "Untitled Project"}
                    </p>
                    <p className="truncate text-[11px] text-black/45">
                      {project.short_description || "No short description provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden text-[11px] text-black/35 sm:inline">
                    {project.updated_at
                      ? new Date(project.updated_at).toLocaleDateString("ja-JP")
                      : "-"}
                  </span>
                  <button
                    onClick={() => onOpenProject(project)}
                    className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-black hover:border-black/30"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
