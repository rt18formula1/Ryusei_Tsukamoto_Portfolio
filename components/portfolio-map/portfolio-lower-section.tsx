import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";

const activities = [
  { label: "Developer", color: "#2563eb", href: "/portfolio/developer", text: "Next.js、React、TypeScript、Supabase、Cloudflare。フルスタックWebアプリケーション開発、ツール・自動化設計。" },
  { label: "Illustrator", color: "#7c3aed", href: "/disciplines/illustrator", text: "モータースポーツ・F1を中心としたデジタルイラストレーション、ファンアート、ビジュアルコンテンツ制作。" },
  { label: "Musician", color: "#db2777", href: "/disciplines/musician", text: "サウンドデザイン、楽曲制作、オーディオコンテンツ制作。" },
  { label: "Blogger", color: "#059669", href: "/disciplines/blogger", text: "技術検証、開発ログ、設計思想、noteやWeb上での知見発信。" },
  { label: "Investor", color: "#d97706", href: "/disciplines/investor", text: "テクノロジー市場、新興成長企業、金融市場におけるリサーチと知見の集積。" },
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
          <div><p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/40">Profile / プロフィール</p><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Ryusei Tsukamoto</h2></div>
          <div><p className="max-w-2xl text-sm leading-7 text-black/65 sm:text-base">テクノロジーによるプロダクト実装から、グラフィックによる視覚的表現、音楽制作、考察・執筆、市場リサーチまで、境界を持たずに活動を展開。それぞれの領域で培った知見を統合し、独自の価値とクオリティを追求しています。</p><div className="mt-7 flex flex-wrap gap-2">{socialLinks.map(([name, url, icon]) => <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name} className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black/[.02] p-3 transition hover:-translate-y-0.5 hover:border-black hover:bg-white"><img src={icon} alt="" className="h-full w-full object-contain" /></a>)}</div></div>
        </section>

        <section className="border-b border-black/10 py-16 sm:py-24"><div className="flex items-end justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/40">Activities / 活動領域</p><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">What I do</h2></div><span className="hidden items-center gap-1 text-[10px] font-black uppercase tracking-widest text-black/35 sm:flex">Scroll <ChevronRight size={14} /></span></div><div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{activities.map((item) => <Link key={item.label} href={item.href} className="group min-w-[82%] snap-start border-t-2 border-black pt-5 sm:min-w-[360px]"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} /><h3 className="text-base font-black tracking-tight group-hover:text-blue-600">{item.label}</h3></div><p className="mt-3 max-w-sm text-sm leading-6 text-black/55">{item.text}</p><span className="mt-5 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-black/35 group-hover:text-black">Explore <ArrowUpRight size={13} /></span></Link>)}</div></section>

        <section className="grid gap-4 py-16 sm:grid-cols-2 sm:py-20"><Link href="/links" className="group rounded-3xl bg-black p-7 text-white transition hover:bg-black/85"><p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">Links</p><h2 className="mt-6 text-2xl font-black tracking-tight">SNS・公式サイト・ショップ</h2><span className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest">Open links <ArrowUpRight size={14} /></span></Link><Link href="/profile" className="group rounded-3xl border border-black/10 p-7 transition hover:border-black"><p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/40">More about me</p><h2 className="mt-6 text-2xl font-black tracking-tight">プロフィールの詳細</h2><span className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600">Read profile <ArrowUpRight size={14} /></span></Link></section>
      </div>
    </section>
  );
}
