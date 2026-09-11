"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/components/providers/language-provider";
import { MOCK_DEV_PROJECT } from "@/lib/dev-project/mock";
import { DevProjectModal } from "@/components/dev-project/dev-project-modal";
import type { DbNews, DbPortfolio, DbEvent } from "@/lib/supabase-queries";
import { ExternalLink, Code, Palette, Music, BookOpen, TrendingUp, ArrowRight, Printer } from "lucide-react";

export default function HomeClient({
  news,
  portfolio,
  events = []
}: {
  news: DbNews[];
  portfolio: DbPortfolio[];
  events?: DbEvent[];
}) {
  const { language } = useLanguage();
  const [selectedDevProject, setSelectedDevProject] = useState<typeof MOCK_DEV_PROJECT | null>(null);

  const isJa = language === "ja";

  const disciplines = [
    {
      id: "developer",
      title: "Developer",
      icon: Code,
      badge: "Flagship",
      description: isJa
        ? "Next.js、TypeScript、Supabase、Cloudflare等を用いたフルスタックWebアプリケーション開発・自動化ツール制作。"
        : "Full-stack web applications, automation pipelines, and software tools built with Next.js, TypeScript, Supabase, and Cloudflare.",
      accent: "from-blue-600 to-indigo-600",
    },
    {
      id: "illustrator",
      title: "Illustrator",
      icon: Palette,
      badge: "Artwork",
      description: isJa
        ? "モータースポーツ、F1、グラフィックアートを中心としたデジタルイラストレーション・ファンアート制作。"
        : "Digital illustrations, graphic art, and visual content focusing on Formula 1, motorsport moments, and creative graphics.",
      accent: "from-purple-600 to-pink-600",
    },
    {
      id: "musician",
      title: "Musician",
      icon: Music,
      badge: "Audio",
      description: isJa
        ? "サウンドデザイン、楽曲制作、オーディオコンテンツの発信。"
        : "Sound design, music composition, and audio content production.",
      accent: "from-amber-500 to-red-600",
    },
    {
      id: "blogger",
      title: "Blogger",
      icon: BookOpen,
      badge: "Writing",
      description: isJa
        ? "技術検証、開発ログ、デザイン思想、知見をまとめたWeb記事・noteの執筆。"
        : "Technical articles, development logs, design notes, and analytical writings on note and technical blogs.",
      accent: "from-emerald-600 to-teal-600",
    },
    {
      id: "investor",
      title: "Investor",
      icon: TrendingUp,
      badge: "Research",
      description: isJa
        ? "テクノロジー市場、Web3、成長企業、金融市場におけるリサーチと投資活動。"
        : "Market research and investment activities in tech sectors, growth companies, and emerging markets.",
      accent: "from-gray-800 to-black",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 bg-[#fafafa] border-b border-black/8 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-full mb-6">
              RYUSEI TSUKAMOTO PORTFOLIO
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] text-black mb-8">
              Engineering, Design & Creative Portfolio
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed mb-10">
              {isJa
                ? "開発、イラスト、音楽、執筆、投資リサーチなど、多様な領域のプロジェクトと知見を一元管理・発信する Ryusei Tsukamoto の個人ポートフォリオ。"
                : "Personal portfolio of Ryusei Tsukamoto consolidating projects across software development, illustration, music, writing, and investment research."}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#developer"
                className="px-8 py-4 bg-black text-white font-bold text-sm rounded-full hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2"
              >
                Explore Developer Projects
                <ArrowRight size={16} />
              </a>
              <Link
                href="/portfolio"
                className="px-8 py-4 border border-black/20 font-bold text-sm rounded-full hover:border-black transition-colors bg-white flex items-center gap-2"
              >
                View All Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Disciplines Overview Bar */}
      <section className="py-12 bg-black text-white border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {disciplines.map((d) => {
              const Icon = d.icon;
              return (
                <a
                  key={d.id}
                  href={`#${d.id}`}
                  className="group flex flex-col items-center p-4 rounded-2xl hover:bg-white/10 transition-colors"
                >
                  <Icon size={24} className="mb-2 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="font-black text-sm uppercase tracking-wider">{d.title}</span>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                    {d.badge}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* 1. DEVELOPER SECTION (FLAGSHIP) */}
        <section id="developer" className="py-24 border-b border-black/8 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="p-2 bg-black text-white rounded-xl">
                    <Code size={20} />
                  </span>
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">
                    FLAGSHIP DISCIPLINE
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight">Developer Projects</h2>
              </div>
              <p className="text-gray-600 max-w-md text-sm font-medium leading-relaxed">
                {isJa
                  ? "単一のデータソースから Web View (Large Detail Modal) と A4 Printable Project Sheet (PDF資料) を自動生成する統合プロジェクトシステム。"
                  : "Unified project system rendering both Web Detail View (Large Modal) and A4 Printable Project Sheets (PDF) from a single source of truth."}
              </p>
            </div>

            {/* Featured Developer Project Card */}
            <div className="bg-[#fafafa] rounded-3xl border border-black/10 overflow-hidden shadow-xl hover:shadow-2xl transition-all group">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 aspect-video bg-gray-200 overflow-hidden relative">
                  <img
                    src={MOCK_DEV_PROJECT.mainVisualUrl}
                    alt={MOCK_DEV_PROJECT.projectName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-lg">
                    Featured Project
                  </div>
                </div>

                <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-black tracking-tight mb-4 group-hover:text-blue-600 transition-colors">
                      {MOCK_DEV_PROJECT.projectName}
                    </h3>
                    <p className="text-gray-600 text-sm font-medium leading-relaxed mb-8">
                      {MOCK_DEV_PROJECT.shortDescription}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {MOCK_DEV_PROJECT.information.flatMap(cat =>
                        cat.items.filter(i => cat.category === "INFRASTRUCTURE" || cat.category === "GENERAL").map((item, idx) => (
                          <span key={idx} className="px-3 py-1 bg-white border border-black/10 rounded-full text-xs font-bold text-gray-700">
                            {Array.isArray(item.value) ? item.value.join(", ") : String(item.value)}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-black/8">
                    <button
                      onClick={() => setSelectedDevProject(MOCK_DEV_PROJECT)}
                      className="flex-1 py-3 px-6 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      Web Detail Modal
                      <ArrowRight size={14} />
                    </button>
                    <Link
                      href={`/portfolio/dev/${MOCK_DEV_PROJECT.id}/print`}
                      target="_blank"
                      className="py-3 px-6 border border-black/20 bg-white text-black rounded-xl text-xs font-bold hover:border-black transition-colors flex items-center justify-center gap-2"
                    >
                      <Printer size={14} />
                      A4 Print / PDF Sheet
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ILLUSTRATOR SECTION */}
        <section id="illustrator" className="py-24 border-b border-black/8 bg-[#fafafa]">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="p-2 bg-purple-600 text-white rounded-xl">
                <Palette size={20} />
              </span>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-purple-600">
                VISUAL ARTS
              </span>
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-6">Illustrator & Visual Works</h2>
            <p className="text-gray-600 max-w-2xl text-base font-medium leading-relaxed mb-12">
              {isJa
                ? "モータースポーツ・F1をはじめとする象徴的な瞬間、ドライバー、マシンのグラフィックイラストレーション。独創的なビジュアル表現を展開。"
                : "Digital illustrations and graphic artwork showcasing motorsport moments, driver icons, and visual creative concepts."}
            </p>

            {/* Works Grid */}
            {portfolio.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.slice(0, 6).map((work) => (
                  <Link
                    key={work.id}
                    href={`/portfolio/${work.id}`}
                    className="group border border-black/10 rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {work.image_url ? (
                        <img
                          src={work.image_url}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg group-hover:text-purple-600 transition-colors">
                        {isJa ? work.title_ja || work.title_en : work.title_en}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center border border-dashed border-black/20 rounded-3xl bg-white">
                <p className="text-gray-500 font-bold">Portfolio artworks loaded from database.</p>
              </div>
            )}

            <div className="mt-12 text-center">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white font-bold text-sm rounded-full hover:bg-gray-800 transition-colors"
              >
                View All Artworks
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* 3. OTHER DISCIPLINES (Musician, Blogger, Investor) */}
        <section id="musician" className="py-24 border-b border-black/8 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Musician */}
              <div className="space-y-4 p-8 rounded-3xl bg-[#fafafa] border border-black/8">
                <div className="p-3 bg-amber-500 text-white rounded-2xl w-fit">
                  <Music size={24} />
                </div>
                <h3 className="text-2xl font-black">Musician</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {isJa
                    ? "サウンドトラック、音響デザイン、音楽コンテンツの制作・配信活動。"
                    : "Music composition, sound design, and creative audio content."}
                </p>
              </div>

              {/* Blogger */}
              <div id="blogger" className="space-y-4 p-8 rounded-3xl bg-[#fafafa] border border-black/8">
                <div className="p-3 bg-emerald-600 text-white rounded-2xl w-fit">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-2xl font-black">Blogger</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {isJa
                    ? "技術ブログやnoteでの開発知見、デザイン思想、検証ログの公開。"
                    : "Technical writings, engineering insights, and design blogs published on note and tech platforms."}
                </p>
                <a
                  href="https://note.com/rt18_dpfp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline pt-2"
                >
                  Visit note Profile <ExternalLink size={12} />
                </a>
              </div>

              {/* Investor */}
              <div id="investor" className="space-y-4 p-8 rounded-3xl bg-[#fafafa] border border-black/8">
                <div className="p-3 bg-black text-white rounded-2xl w-fit">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-2xl font-black">Investor</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {isJa
                    ? "テクノロジー領域・新興成長企業・金融市場のリサーチと分析。"
                    : "Market intelligence, technology sector research, and growth investment analysis."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Profile & Contact Section */}
        <section id="profile" className="py-24 bg-[#fafafa]">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
            <h2 className="text-4xl font-black tracking-tight mb-6">Profile & Contact</h2>
            <p className="text-lg text-gray-600 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
              {isJa
                ? "開発案件のご相談、イラスト・デザインのご依頼、コラボレーション等、お気軽にお問い合わせください。"
                : "For software development inquiries, illustration commissions, or collaboration opportunities, feel free to get in touch."}
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="mailto:contact@example.com"
                className="px-8 py-4 bg-black text-white font-bold text-sm rounded-full hover:bg-gray-800 transition-colors shadow-lg"
              >
                Contact Ryusei Tsukamoto
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Developer Project Large Detail Modal */}
      {selectedDevProject && (
        <DevProjectModal
          project={selectedDevProject}
          isOpen={true}
          onClose={() => setSelectedDevProject(null)}
        />
      )}

      <SiteFooter />
    </div>
  );
}
