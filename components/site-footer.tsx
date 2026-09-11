"use client";

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-black/10 py-6 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-medium gap-4">
        <p>© {new Date().getFullYear()} Ryusei Tsukamoto. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/admin" className="hover:text-black transition-colors">Admin</Link>
          <Link href="/cookie-privacy-policy" className="hover:text-black transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}