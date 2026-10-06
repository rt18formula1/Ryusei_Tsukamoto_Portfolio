import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";

const activities = [
  { year: "2026", title: "Developer Project / Portfolio Map", text: "Webサイト、データ設計、印刷用シートを制作しています。" },
  { year: "2025", title: "F1 media and tools", text: "F1ニュース、ファンアート、カレンダー関連のサービスを運営しています。" },
  { year: "Ongoing", title: "Creative work", text: "イラスト、音楽、文章、テクノロジーを横断して活動しています。" },
];

const socialLinks = [
  ["Instagram", "https://www.instagram.com/rt18_formula1/", "/instagram-icon.png"],
  ["X", "https://x.com/rt18_formula1_x", "/x-logo.png"],
  ["YouTube", "https://www.youtube.com/@rt18_formula1", "/youtube-logo.png"],
  ["TikTok", "https://www.tiktok.com/@rt18_formula1_official", "/tiktok-logo.png"],
  ["GitHub", "https://github.com/rt18formula1", "/github-icon.webp"],
  ["Threads", "https://www.threads.com/@rt18_formula1", "/threads-icon.png"],
  ["LinkedIn", "https://www.linkedin.com/in/rt18-formula1/", "/linkedin-icon.png"],
  ["LINE", "https://lin.ee/4jupn4j", "/line-icon.png"],
] as const;

export function PortfolioLowerSection() {
  return (
    <section className="border-t border-black/10 bg-white" aria-label="Profile and activity">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <section id="profile" className="grid gap-10 border-b border-black/10 py-16 sm:py-24 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div><p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/40">Profile</p><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">rt18_formula1</h2></div>
          <div><p className="max-w-2xl text-sm leading-7 text-black/65 sm:text-base">F1ファンアート、イラスト、最新のF1ニュースをチェックしてください。rt18_formula1は、象徴的なF1の瞬間、ドライバー、マシンを題材にした作品で、F1の世界観に浸れるビジュアルコンテンツを制作しています。</p><div className="mt-7 flex flex-wrap gap-2">{socialLinks.map(([name, url, icon]) => <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name} className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black/[.02] p-3 transition hover:-translate-y-0.5 hover:border-black hover:bg-white"><img src={icon} alt="" className="h-full w-full object-contain" /></a>)}</div></div>
        </section>

        <section className="border-b border-black/10 py-16 sm:py-24"><div className="flex items-end justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/40">Activity</p><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">What I do</h2></div><span className="hidden items-center gap-1 text-[10px] font-black uppercase tracking-widest text-black/35 sm:flex">Scroll <ChevronRight size={14} /></span></div><div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{activities.map((item) => <article key={item.year} className="min-w-[82%] snap-start border-t-2 border-black pt-5 sm:min-w-[360px]"><div className="flex items-center justify-between"><h3 className="text-base font-black tracking-tight">{item.title}</h3><span className="text-xs font-black text-blue-600">{item.year}</span></div><p className="mt-3 max-w-sm text-sm leading-6 text-black/55">{item.text}</p></article>)}</div></section>

        <section className="grid gap-4 py-16 sm:grid-cols-2 sm:py-20"><Link href="/links" className="group rounded-3xl bg-black p-7 text-white transition hover:bg-black/85"><p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">Links</p><h2 className="mt-6 text-2xl font-black tracking-tight">SNS・公式サイト・ショップ</h2><span className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest">Open links <ArrowUpRight size={14} /></span></Link><Link href="/profile" className="group rounded-3xl border border-black/10 p-7 transition hover:border-black"><p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/40">More about me</p><h2 className="mt-6 text-2xl font-black tracking-tight">プロフィールの詳細</h2><span className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600">Read profile <ArrowUpRight size={14} /></span></Link></section>
      </div>
    </section>
  );
}
