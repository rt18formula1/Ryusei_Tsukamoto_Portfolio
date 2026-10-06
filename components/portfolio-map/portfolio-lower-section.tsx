import Link from "next/link";
import { ArrowUpRight, ExternalLink, QrCode } from "lucide-react";
import { linktreeLinks } from "@/lib/content";

const activityHistory = [
  { year: "2026", label: "Developer Project detail / Print Sheet / Admin data model" },
  { year: "2025", label: "F1 official site, calendar tools, and portfolio map development" },
  { year: "Ongoing", label: "Illustration, music, writing, and technology market research" },
];

const featuredProjects = [
  { name: "rt18-formula1-official-site", description: "F1情報を統合した公式Webサイト", href: "/portfolio/developer/rt18-dev/rt18-formula1-official-site" },
  { name: "calender-generator", description: "画像からカレンダーを生成するWebツール", href: "/portfolio/developer/rt18-dev/calender-generator" },
  { name: "nasu-calendar", description: "ゆる学徒公開カレンダー", href: "/portfolio/developer/rt18-dev/nasu-calendar" },
];

export function PortfolioLowerSection() {
  return (
    <section className="border-t border-black/10 bg-[#fafaf8]" aria-label="Profile, activity history, and links">
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">RYUSEI TSUKAMOTO</p>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Creator / Developer Portfolio</h1>
            <p className="max-w-2xl text-sm leading-7 text-black/65 sm:text-base">
              Webプロダクト、ビジュアル表現、音楽、文章、リサーチを横断して活動しています。ここでは活動の入口、プロジェクト、実績、連絡先を一つにまとめています。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/profile" className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-black/75">
                Full Profile <ArrowUpRight size={14} />
              </Link>
              <Link href="/wallet" className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-3 text-xs font-bold uppercase tracking-widest transition hover:border-black">
                QR Card <QrCode size={14} />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.25em] text-black/40">Activity History</p>
            <div className="space-y-5">
              {activityHistory.map((item) => (
                <div key={item.year} className="grid grid-cols-[64px_1fr] gap-4 border-b border-black/5 pb-5 last:border-0 last:pb-0">
                  <span className="text-xs font-black text-blue-600">{item.year}</span>
                  <p className="text-sm leading-6 text-black/70">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-[0.25em] text-black/40">Featured Projects</h2>
              <Link href="/portfolio/developer/rt18-dev" className="text-xs font-bold text-blue-600 hover:text-blue-800">View all →</Link>
            </div>
            <div className="space-y-3">
              {featuredProjects.map((project) => (
                <Link key={project.name} href={project.href} className="group flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white p-4 transition hover:border-black/30 hover:shadow-md">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight group-hover:text-blue-600">{project.name}</h3>
                    <p className="mt-1 text-xs text-black/55">{project.description}</p>
                  </div>
                  <ArrowUpRight size={16} className="shrink-0 text-black/30 transition group-hover:text-black" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-[0.25em] text-black/40">Links</h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/35">Linktree replacement</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {linktreeLinks.map((item) => (
                <a key={item.title} href={item.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold transition hover:border-black hover:bg-black hover:text-white">
                  <span>{item.title}</span>
                  <ExternalLink size={14} className="text-black/30 transition group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-black p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50">Carry the portfolio</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">QRカードを保存する</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">スマートフォンで開いて、プロフィールと各リンクへすぐアクセスできます。</p>
          </div>
          <Link href="/wallet" className="mt-6 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-black transition hover:bg-white/80 sm:mt-0">
            Open QR Card <QrCode size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
