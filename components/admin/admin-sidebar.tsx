"use client";

import React from "react";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
} from "lucide-react";
import type { PortfolioHierarchy, Activity } from "@/types/portfolio-hierarchy";
import type { DisciplineId } from "@/types/portfolio-map";

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
  hierarchy: PortfolioHierarchy;
  onNavigateActivity?: (disciplineId: DisciplineId, activity: Activity) => void;
}

export function AdminSidebar({
  currentTab,
  onSelectTab,
  open,
  onToggleOpen,
  projectCount,
  onSignOut,
  hierarchy,
  onNavigateActivity,
}: AdminSidebarProps) {
  const systemItems: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={15} /> },
    { id: "media", label: "Media", icon: <ImageIcon size={15} /> },
    { id: "settings", label: "Settings", icon: <Settings size={15} /> },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 hidden flex-col bg-[#1a1a1a] transition-all duration-300 lg:flex ${
        open ? "w-64" : "w-16"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-white/8 px-4">
        {open ? (
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[.24em] text-white/35">
              RYUSEI TSUKAMOTO
            </p>
            <p className="truncate text-base font-bold tracking-tight text-white">
              Portfolio Admin
            </p>
          </div>
        ) : (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-black text-black">
            R
          </div>
        )}
        <button
          onClick={onToggleOpen}
          className="rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-white focus:outline-none"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
      </div>

      {/* Hierarchy Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {open && (
          <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[.22em] text-white/30">
            Portfolio Hierarchy
          </p>
        )}
        <div className="space-y-0.5">
          {hierarchy.disciplines.map((discipline) => {
            const isActive =
              currentTab === "hierarchy" || currentTab === "disciplines";
            return (
              <div key={discipline.id} className="group/disc">
                {/* Discipline button */}
                <button
                  onClick={() => onSelectTab("hierarchy")}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-[#2d2d2d] text-white"
                      : "text-[#d1d1d1] hover:bg-white/5"
                  }`}
                  title={!open ? discipline.name : undefined}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: discipline.color }}
                  />
                  {open && (
                    <>
                      <span className="flex-1 truncate text-left">
                        {discipline.name}
                      </span>
                      <span className="text-[10px] text-white/30">
                        {discipline.activities.length}
                      </span>
                    </>
                  )}
                </button>

                {/* Activities — hover-to-expand with fade-in */}
                {open && discipline.activities.length > 0 && (
                  <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover/disc:max-h-96 group-hover/disc:opacity-100">
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                      {discipline.activities.map((activity) => (
                        <button
                          key={activity.id}
                          onClick={() =>
                            onNavigateActivity?.(discipline.id, activity)
                          }
                          className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          <FileText size={12} className="shrink-0 text-white/30" />
                          <span className="truncate">{activity.name}</span>
                          {activity.contents.length > 0 && (
                            <span className="text-[9px] text-white/25">
                              {activity.contents.length}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* System items */}
        <div className="mt-6">
          {open && (
            <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[.22em] text-white/30">
              System
            </p>
          )}
          <div className="space-y-0.5">
            {systemItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-[#2d2d2d] text-white"
                      : "text-[#d1d1d1] hover:bg-white/5"
                  }`}
                  title={!open ? item.label : undefined}
                >
                  <span
                    className={`shrink-0 ${
                      isActive ? "text-white" : "text-white/40"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {open && (
                    <span className="flex-1 truncate text-left">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="border-t border-white/8 p-3">
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-white/50 transition hover:bg-red-500/10 hover:text-red-400"
          title={!open ? "Sign out" : undefined}
        >
          <LogOut size={15} className="shrink-0 text-white/40" />
          {open && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
