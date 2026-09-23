"use client";

import React from "react";
import {
  LayoutDashboard,
  GitFork,
  Layers,
  Sparkles,
  FolderGit2,
  FileText,
  Image as ImageIcon,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export type AdminTab =
  | "dashboard"
  | "hierarchy"
  | "disciplines"
  | "activities"
  | "projects"
  | "other-contents"
  | "media"
  | "settings";

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  open: boolean;
  onToggleOpen: () => void;
  projectCount: number;
  onSignOut: () => void;
}

export function AdminSidebar({
  currentTab,
  onSelectTab,
  open,
  onToggleOpen,
  projectCount,
  onSignOut,
}: AdminSidebarProps) {
  const navItems: Array<{
    group: string;
    items: Array<{
      id: AdminTab;
      label: string;
      icon: React.ReactNode;
      badge?: number | string;
    }>;
  }> = [
    {
      group: "Overview",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard size={16} />,
        },
      ],
    },
    {
      group: "Portfolio",
      items: [
        {
          id: "hierarchy",
          label: "Hierarchy Tree",
          icon: <GitFork size={16} />,
        },
        {
          id: "disciplines",
          label: "Disciplines",
          icon: <Layers size={16} />,
          badge: "5",
        },
        {
          id: "activities",
          label: "Activities",
          icon: <Sparkles size={16} />,
          badge: "4",
        },
      ],
    },
    {
      group: "Content",
      items: [
        {
          id: "projects",
          label: "Projects",
          icon: <FolderGit2 size={16} />,
          badge: projectCount,
        },
        {
          id: "other-contents",
          label: "Other Contents",
          icon: <FileText size={16} />,
        },
      ],
    },
    {
      group: "Assets & System",
      items: [
        {
          id: "media",
          label: "Media Library",
          icon: <ImageIcon size={16} />,
        },
        {
          id: "settings",
          label: "Settings",
          icon: <Settings size={16} />,
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-black/8 bg-white transition-all duration-300 lg:flex ${
        open ? "w-64" : "w-16"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-black/8 px-4">
        {open ? (
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[.24em] text-black/35">
              RYUSEI TSUKAMOTO
            </p>
            <p className="truncate text-base font-bold tracking-tight text-black">
              Portfolio Admin
            </p>
          </div>
        ) : (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-black text-xs font-black text-white">
            R
          </div>
        )}
        <button
          onClick={onToggleOpen}
          className="rounded-lg p-1.5 text-black/40 hover:bg-black/5 hover:text-black focus:outline-none"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-6">
        {navItems.map((group) => (
          <div key={group.group}>
            {open && (
              <p className="px-2 mb-1.5 text-[9px] font-bold uppercase tracking-[.22em] text-black/30">
                {group.group}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-black text-white shadow-sm"
                        : "text-black/60 hover:bg-black/[.04] hover:text-black"
                    }`}
                    title={!open ? item.label : undefined}
                  >
                    <span
                      className={`shrink-0 ${
                        isActive ? "text-white" : "text-black/40 group-hover:text-black"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {open && (
                      <>
                        <span className="flex-1 truncate text-left">{item.label}</span>
                        {item.badge !== undefined && (
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-black/5 text-black/50 group-hover:bg-black/10"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sign Out / User Footer */}
      <div className="border-t border-black/8 p-3">
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-black/50 transition hover:bg-red-50 hover:text-red-700"
          title={!open ? "Sign out" : undefined}
        >
          <LogOut size={16} className="shrink-0 text-black/40 group-hover:text-red-600" />
          {open && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
