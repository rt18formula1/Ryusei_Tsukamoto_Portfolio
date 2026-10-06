import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";

const activityHistory = [
  { year: "2026", title: "Web products and portfolio systems", text: "Developer Project detail、印刷用Project Sheet、Admin data modelを設計・実装。" },
  { year: "2025", title: "F1 media and tools", text: "F1公式サイト、カレンダー生成ツール、公開カレンダーを制作。" },
  { year: "Ongoing", title: "Creative research", text: "イラスト、音楽、文章、テクノロジーを横断して新しい表現を試しています。" },
];

const disciplines = [
  { label: "Developer", note: "Web products / systems", color: "#2563eb" },
  { label: "Illustrator", note: "F1 fan art / visual design", color: "#7c3aed" },
  { label: "Musician", note: "Sound / composition", color: "#db2777" },
  { label: "Blogger", note: "Writing / research", color: "#059669" },
  { label: "Investor", note: "Markets / technology", color: "#d97706" },
];

export function PortfolioLowerSection() {
  return (
    <section className="border-t border-black/10 bg-[#fafaf8]" aria-label="About Ryusei Tsukamoto">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">RYUSEI TSUKAMOTO</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">I build things,<br />make images,<br />and follow ideas.</h1>
            <p className="mt-7 max-w-xl text-sm leading-7 text-black/65 sm:text-base">Webプロダクトをつくり、F1を描き、音楽や文章で考えたことを残しています。ひとつの肩書きに収まらない活動を、Mapの5つの領域から見つけてください。</p>
            <div className="mt-7 flex flex-wrap gap-3"><Link href="/profile" className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-black/75">About me <ArrowUpRight size={14} /></Link><Link href="/links" className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-3 text-xs font-bold uppercase tracking-widest transition hover:border-black">All links <ArrowUpRight size={14} /></Link></div>
          </div>
          <div className="rounded-[2rem] bg-black p-6 text-white sm:p-8"><p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">What I do</p><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{disciplines.map((item) => <div key={item.label} className="rounded-2xl border border-white/10 p-4"><span className="mb-4 block h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} /><p className="text-sm font-black">{item.label}</p><p className="mt-1 text-[11px] leading-5 text-white/50">{item.note}</p></div>)}</div></div>
        </div>
        <div className="mt-20 sm:mt-28"><div className="flex items-end justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Selected moments</p><h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Activity roll</h2></div><span className="hidden items-center gap-1 text-[10px] font-black uppercase tracking-widest text-black/35 sm:flex">Scroll <ChevronRight size={14} /></span></div><div className="mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{activityHistory.map((item, index) => <article key={item.year} className="min-w-[82%] snap-start rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm sm:min-w-[360px] sm:p-8"><div className="flex items-center justify-between"><span className="text-3xl font-black tracking-tight text-black/15">0{index + 1}</span><span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black/45">{item.year}</span></div><h3 className="mt-12 text-lg font-black tracking-tight">{item.title}</h3><p className="mt-3 text-sm leading-6 text-black/60">{item.text}</p></article>)}</div></div>
        <div className="mt-16 flex flex-col gap-4 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-xl text-xs leading-6 text-black/50">詳しいプロジェクト情報、制作背景、ギャラリー、リンクはMapの各ノードと深いレイヤーにまとめています。</p><Link href="/portfolio/developer" className="inline-flex w-fit items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-800">Explore details <ArrowUpRight size={14} /></Link></div>
      </div>
    </section>
  );
}
