"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

export function SiteHeader() {
  const { language, setLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { href: "/#developer",   label: "Developer", badge: "Flagship" },
    { href: "/#illustrator", label: "Illustrator" },
    { href: "/#musician",    label: "Musician" },
    { href: "/#blogger",     label: "Blogger" },
    { href: "/#investor",    label: "Investor" },
    { href: "/portfolio",    label: language === "ja" ? "ポートフォリオ全一覧" : "All Portfolio" },
    { href: "/#profile",     label: language === "ja" ? "プロフィール" : "Profile" },
    { href: "/#contact",     label: language === "ja" ? "コンタクト" : "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/10">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex flex-col group shrink-0">
          <span className="font-black text-lg md:text-xl tracking-tighter text-black group-hover:text-gray-600 transition-colors uppercase">
            RYUSEI TSUKAMOTO
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-400 -mt-0.5">
            Multi-Discipline Portfolio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/#developer" className="text-xs font-bold uppercase tracking-widest text-black hover:text-gray-600 transition-colors flex items-center gap-1.5">
            <span>Developer</span>
            <span className="bg-black text-white text-[9px] px-2 py-0.5 rounded-full font-black">PRO</span>
          </Link>
          <Link href="/#illustrator" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
            Illustrator
          </Link>
          <Link href="/#musician" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
            Musician
          </Link>
          <Link href="/#blogger" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
            Blogger
          </Link>
          <Link href="/#investor" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
            Investor
          </Link>
          <Link href="/portfolio" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors border-l border-black/10 pl-6">
            All Works →
          </Link>
        </nav>

        {/* Right: lang toggle + hamburger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLanguage(language === "ja" ? "en" : "ja")}
            className="text-[10px] font-black uppercase tracking-widest border border-black/15 rounded-full px-3 py-1.5 hover:border-black hover:bg-black hover:text-white transition-all"
          >
            {language === "ja" ? "EN" : "JA"}
          </button>
          <button
            type="button"
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span className={`block w-6 h-[2px] bg-black transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-6 h-[2px] bg-black transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-[2px] bg-black transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 top-[65px] z-40 bg-white overflow-y-auto">
          <nav className="container mx-auto px-6 py-8 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="py-4 text-xl font-black border-b border-black/5 hover:text-gray-600 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-black text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase">
                      {link.badge}
                    </span>
                  )}
                </div>
                <span className="text-gray-300 text-base">→</span>
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={closeMenu}
              className="py-4 text-xs font-bold text-gray-400 hover:text-black transition-colors mt-6 uppercase tracking-widest"
            >
              Admin Dashboard
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
