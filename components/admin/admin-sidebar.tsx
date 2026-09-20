"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavLeaf = { label: string; href: string };
type NavGroup = { section: string; items: NavLeaf[] };
type NavItem = NavLeaf | NavGroup;

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin" },
  {
    section: "Portfolio",
    items: [
      { label: "Hierarchy", href: "/admin/hierarchy" },
      { label: "Disciplines", href: "/admin/disciplines" },
      { label: "Activities", href: "/admin/activities" },
    ],
  },
  {
    section: "Content",
    items: [
      { label: "Projects", href: "/admin/projects" },
      { label: "Legacy Content", href: "/admin/legacy" },
    ],
  },
  { label: "Media", href: "/admin/media" },
  { label: "Settings", href: "/admin/settings" },
];

function isGroup(item: NavItem): item is NavGroup {
  return "section" in item;
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    window.location.href = "/admin";
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-black/10 shrink-0">
        <Link href="/admin" className="text-lg font-black tracking-tight">
          RT18 <span className="text-gray-400 font-bold">Admin</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map((item, i) => {
          if (isGroup(item)) {
            return (
              <div key={i} className="pt-3">
                <p className="px-3 pb-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {item.section}
                </p>
                {item.items.map((leaf) => {
                  const active = isActive(pathname, leaf.href);
                  return (
                    <Link
                      key={leaf.href}
                      href={leaf.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                        active
                          ? "bg-black text-white"
                          : "text-gray-600 hover:bg-black/5 hover:text-black"
                      }`}
                    >
                      {leaf.label}
                    </Link>
                  );
                })}
              </div>
            );
          }
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={i}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                active
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-black/5 hover:text-black"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-black/10 shrink-0 space-y-1">
        <Link
          href="/"
          className="block px-3 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-black/5 hover:text-black transition-colors"
        >
          ← View Portfolio
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-black/5 hover:text-black transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-3 left-3 z-50 p-2 bg-black text-white rounded-lg text-sm font-bold"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-60 border-r border-black/10 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-white border-r border-black/10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
