"use client";

import Link from "next/link";
import { ExternalLink, Mail, Globe, BookOpen, Share2 } from "lucide-react";
import { HierarchyBreadcrumb } from "@/components/portfolio/hierarchy-breadcrumb";

export function ProfilePageClient() {
  const breadcrumbItems = [
    { label: "HOME", href: "/" },
    { label: "PROFILE & CONTACT" },
  ];

  const disciplines = [
    {
      id: "developer",
      title: "Developer",
      color: "#2563eb",
      summary: "Next.js, React, TypeScript, Supabase, Cloudflare. フルスタックWebアプリケーション開発、ツール・自動化設計。",
      href: "/portfolio/developer",
    },
    {
      id: "illustrator",
      title: "Illustrator",
      color: "#7c3aed",
      summary: "モータースポーツ・F1を中心としたデジタルイラストレーション、ファンアート、ビジュアルコンテンツ制作。",
      href: "/disciplines/illustrator",
    },
    {
      id: "musician",
      title: "Musician",
      color: "#db2777",
      summary: "サウンドデザイン、楽曲制作、オーディオコンテンツ制作。",
      href: "/disciplines/musician",
    },
    {
      id: "blogger",
      title: "Blogger",
      color: "#059669",
      summary: "技術検証、開発ログ、設計思想、noteやWeb上での知見発信。",
      href: "/disciplines/blogger",
    },
    {
      id: "investor",
      title: "Investor",
      color: "#d97706",
      summary: "テクノロジー市場、新興成長企業、金融市場におけるリサーチと知見の集積。",
      href: "/disciplines/investor",
    },
  ];

  const contactLinks = [
    {
      name: "GitHub",
      url: "https://github.com/rt18formula1",
      handle: "@rt18formula1",
      icon: Globe,
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/rt18_formula1_x",
      handle: "@rt18_formula1_x",
      icon: Share2,
    },
    {
      name: "note",
      url: "https://note.com/rt18_dpfp",
      handle: "rt18_dpfp",
      icon: BookOpen,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/rt18_formula1/",
      handle: "@rt18_formula1",
      icon: Share2,
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@rt18_formula1",
      handle: "@rt18_formula1",
      icon: Share2,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Top Bar Navigation */}
      <nav className="sticky top-0 z-20 border-b border-black/10 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-8 sm:py-4 lg:px-12" aria-label="Profile Navigation">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <HierarchyBreadcrumb items={breadcrumbItems} />
          <Link
            href="/"
            className="text-[10px] font-bold uppercase tracking-widest bg-black text-white rounded-full px-4 py-2 hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-black"
          >
            Portfolio Map
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-12 md:py-20 max-w-5xl space-y-16">
        {/* Header Profile Section */}
        <section className="space-y-6">
          <div className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-full">
            ABOUT / PROFILE
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-black">
            Ryusei Tsukamoto
          </h1>
          <p className="text-base sm:text-xl text-black/75 font-medium leading-relaxed max-w-3xl">
            Multi-disciplinary creator / developer working across software, visual expression, music, writing, and research.
          </p>
          <p className="text-sm text-black/55 leading-relaxed max-w-3xl">
            テクノロジーによるプロダクト実装から、グラフィックによる視覚的表現、音楽制作、考察・執筆、市場リサーチまで、境界を持たずに活動を展開。それぞれの領域で培った知見を統合し、独自の価値とクオリティを追求しています。
          </p>
        </section>

        {/* 5 Disciplines Section */}
        <section className="space-y-6 pt-8 border-t border-black/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-black/40">
              Disciplines / 活動領域
            </h2>
            <Link
              href="/"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              View on Map →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {disciplines.map((d) => (
              <Link
                key={d.id}
                href={d.href}
                className="group border border-black/10 rounded-2xl p-6 bg-[#fafaf8] hover:border-black/30 hover:bg-white hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <h3 className="font-black text-lg uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                      {d.title}
                    </h3>
                  </div>
                  <p className="text-xs text-black/65 leading-relaxed font-normal">
                    {d.summary}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-black/40 group-hover:text-black">
                  <span>Explore</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Contact & Links Section */}
        <section className="space-y-8 pt-8 border-t border-black/10">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-black/40 mb-3">
              Contact & Links / お問い合わせ
            </h2>
            <p className="text-sm text-black/65 leading-relaxed max-w-2xl">
              開発案件のご相談、イラスト・デザインのご依頼、コラボレーション等の各種お問い合わせは、SNSダイレクトメッセージまたは以下の連絡窓口よりお気軽にお問い合わせください。
            </p>
          </div>

          {/* Social / External Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between border border-black/10 rounded-2xl p-4 bg-white hover:border-black/30 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-black/5 rounded-xl group-hover:bg-black group-hover:text-white transition-colors">
                      <Icon size={18} />
                    </span>
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider">{item.name}</div>
                      <div className="text-[11px] text-black/50 font-mono">{item.handle}</div>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-black/30 group-hover:text-black transition-colors" />
                </a>
              );
            })}
          </div>

          {/* Direct Inquiry Note */}
          <div className="border border-black/10 rounded-2xl p-6 sm:p-8 bg-[#fafaf8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Mail size={16} className="text-blue-600" />
                <span>Inquiries & Requests</span>
              </div>
              <p className="text-xs text-black/60">
                お仕事のご依頼・技術相談・制作に関するご連絡は、各SNSまたはポートフォリオ経由でお受けしております。
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 transition-colors uppercase tracking-widest shrink-0"
            >
              Back to Map
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 py-8 px-4 text-center text-xs text-black/40 font-mono tracking-widest uppercase">
        © {new Date().getFullYear()} Ryusei Tsukamoto Portfolio
      </footer>
    </div>
  );
}
