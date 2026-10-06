"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import { HierarchyBreadcrumb } from "@/components/portfolio/hierarchy-breadcrumb";

type Locale = "ja" | "en";
type Localized = { ja: string; en: string };

const milestones: Array<{ date: string; title: Localized; body: Localized; href: string }> = [
  { date: "2023.07", title: { ja: "rt18_formula1を開始", en: "Launched rt18_formula1" }, body: { ja: "F1のニュース、レース情報、イラストをSNSで発信する活動を開始。", en: "Started publishing F1 news, race information, and illustrations across social platforms." }, href: "/links" },
  { date: "2024.11", title: { ja: "Fine Day Plusを結成", en: "Formed Fine Day Plus" }, body: { ja: "学生3人のバンドとして演奏と制作を開始。T-SQUAREのカバーなどを公開。", en: "Started performing and producing as a three-student band, including published T-SQUARE covers." }, href: "/disciplines/musician" },
  { date: "2025", title: { ja: "rt18_formula1公式サイトを公開", en: "Published the rt18_formula1 official site" }, body: { ja: "ニュース、スケジュール、リザルト、イラスト、ポートフォリオを一つのWeb基盤にまとめた。", en: "Brought news, schedules, results, illustrations, and portfolio work into one web platform." }, href: "/portfolio/developer" },
  { date: "2026 上期", title: { ja: "calender-generator / nasu-calendar", en: "calender-generator / nasu-calendar" }, body: { ja: "カレンダー画像生成ツールと、株式会社pedanticの動画公開予定を購読できるGoogle Calendar連携サイトを制作。", en: "Built a calendar artwork generator and a Google Calendar-powered public schedule site for 株式会社pedantic." }, href: "/portfolio/developer" },
  { date: "2026 上期", title: { ja: "Meteor Creator Studio", en: "Meteor Creator Studio" }, body: { ja: "レイヤー、ツール、パネルを備えたフリーミアム型クリエイティブスイートの構想・開発を開始。", en: "Started designing and developing a freemium creative suite with layers, tools, and dockable panels." }, href: "/portfolio/developer" },
  { date: "2026.08–09", title: { ja: "Portfolio Mapを制作", en: "Built the Portfolio Map" }, body: { ja: "活動Identityと公開した制作物を接続し、F1・音楽・開発を横断して閲覧できるPortfolio Mapを制作。", en: "Built a Portfolio Map connecting public releases across F1, music, and software." }, href: "/" },
];

const projects = [
  { name: "rt18-formula1-official-site", description: { ja: "F1ニュース、スケジュール、リザルト、イラスト、ポートフォリオを統合した公式Webサイト。", en: "Official F1 web site integrating news, schedules, results, illustrations, and portfolio work." }, links: [{ label: "Website", href: "https://rt18-formula1-official-site.vercel.app" }, { label: "GitHub", href: "https://github.com/rt18formula1/rt18-formula1-official-site" }] },
  { name: "calender-generator", description: { ja: "画像・年月・テンプレートを選んでカレンダー画像を生成し、書き出せるWebツール。", en: "A web tool for generating and exporting calendar artwork from images, dates, and templates." }, links: [{ label: "Website", href: "https://calendar-generator-six.vercel.app" }, { label: "GitHub", href: "https://github.com/rt18formula1/calender-generator" }] },
  { name: "nasu-calendar", description: { ja: "株式会社pedanticの動画投稿スケジュールを一覧・購読できる公開カレンダー。", en: "A public calendar for browsing and subscribing to 株式会社pedantic's video schedule." }, links: [{ label: "Website", href: "https://yurugakuto-calendar.vercel.app" }, { label: "GitHub", href: "https://github.com/rt18formula1/nasu-calendar" }] },
  { name: "Meteor_Creator_Studio", description: { ja: "Meteor Photo / Vector / Video / Layoutへ展開するクリエイティブスイート。", en: "A creative suite planned across Meteor Photo, Vector, Video, and Layout." }, links: [{ label: "GitHub", href: "https://github.com/rt18formula1/Meteor_Creator_Studio" }] },
];

const identities = [
  { name: "rt18_formula1", text: { ja: "F1の情報、イラスト、Webを公開する活動名。", en: "The public identity for F1 information, illustration, and web work." }, href: "/links" },
  { name: "rt18_dev", text: { ja: "Webアプリケーション、ツール、オートメーションを制作する開発活動。", en: "The development identity for web applications, tools, and automation." }, href: "/portfolio/developer" },
  { name: "Fine Day Plus / rt18_music", text: { ja: "学生バンドでの演奏と、音楽制作・記録の活動。", en: "Band performance plus personal music production and documentation." }, href: "/disciplines/musician" },
];

const copy = {
  ja: { eyebrow: "プロフィール", name: "塚本隆正", roman: "Ryusei Tsukamoto", bio: "2010年石川県生まれ。クリエイター。角川ドワンゴ学園S高等学校に在学。Fine Day Plusに所属。2023年7月にrt18_formula1としてF1を中心とした情報やイラストの発信活動を始める。以降、rt18_musicとしての音楽活動やrt18_devとしてのWeb開発など、複数の名前と媒体を行き来しながら制作を続けている。", history: "活動歴", releases: "公開したサービス / 制作物", identities: "活動名と役割", home: "Portfolio Mapへ戻る", map: "Mapで見る" },
  en: { eyebrow: "Profile", name: "Ryusei Tsukamoto", roman: "塚本隆正", bio: "Born in Ishikawa in 2010. Creator. Currently attending S High School at Kadokawa Dwango Academy and a member of Fine Day Plus. He began publishing F1 information and illustrations as rt18_formula1 in July 2023, and continues to create across music as rt18_music and web development as rt18_dev.", history: "Activity history", releases: "Published services / works", identities: "Public identities", home: "Back to Portfolio Map", map: "View on Map" },
};

export function ProfilePageClient() {
  const [locale, setLocale] = useState<Locale>("ja");
  const text = copy[locale];
  return <div className="min-h-screen bg-white text-black">
    <nav className="sticky top-0 z-20 border-b border-black/10 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-8"><div className="mx-auto flex max-w-5xl items-center justify-between gap-4"><HierarchyBreadcrumb items={[{ label: "HOME", href: "/" }, { label: "PROFILE" }]} /><div className="flex items-center gap-2"><div className="flex rounded-full border border-black/10 p-1 text-[10px] font-black"><button onClick={() => setLocale("ja")} className={`rounded-full px-2.5 py-1.5 ${locale === "ja" ? "bg-black text-white" : "text-black/40"}`}>JA</button><button onClick={() => setLocale("en")} className={`rounded-full px-2.5 py-1.5 ${locale === "en" ? "bg-black text-white" : "text-black/40"}`}>EN</button></div><Link href="/" className="rounded-full bg-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white">{text.map}</Link></div></div></nav>
    <main className="mx-auto max-w-5xl px-5 py-16 sm:px-10 sm:py-24">
      <header className="max-w-3xl"><p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/40">{text.eyebrow}</p><h1 className="mt-5 text-5xl font-black tracking-[-0.06em] sm:text-7xl">{text.name}</h1><p className="mt-3 text-sm tracking-wide text-black/45">{text.roman}</p><p className="mt-9 text-base leading-8 text-black/75 sm:text-lg sm:leading-9">{text.bio}</p></header>
      <section className="mt-24"><div className="flex items-end justify-between"><h2 className="text-2xl font-black tracking-tight sm:text-4xl">{text.history}</h2><span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/35">2023 — 2026</span></div><div className="mt-10 border-l border-black/15 pl-7 sm:pl-12">{milestones.map((item) => <article key={`${item.date}-${item.title.ja}`} className="relative py-7 first:pt-0"><span className="absolute -left-[2.18rem] top-8 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-600 ring-1 ring-blue-600 sm:-left-[3.18rem] sm:top-9" /><p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">{item.date}</p><h3 className="mt-2 text-xl font-black sm:text-2xl">{item.title[locale]}</h3><p className="mt-3 max-w-2xl text-sm leading-7 text-black/60">{item.body[locale]}</p><Link href={item.href} className="mt-4 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-black/40 hover:text-blue-600">{text.map} <ArrowUpRight size={13} /></Link></article>)}</div></section>
      <section className="mt-24"><h2 className="text-2xl font-black tracking-tight sm:text-4xl">{text.releases}</h2><div className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2">{projects.map((project) => <article key={project.name}><h3 className="font-mono text-sm font-bold">{project.name}</h3><p className="mt-3 text-sm leading-7 text-black/60">{project.description[locale]}</p><div className="mt-4 flex flex-wrap gap-4">{project.links.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.16em] text-blue-600 hover:text-blue-800">{link.label} <ExternalLink size={12} /></a>)}</div></article>)}</div></section>
      <section className="mt-24"><h2 className="text-2xl font-black tracking-tight sm:text-4xl">{text.identities}</h2><div className="mt-8 grid gap-8 sm:grid-cols-3">{identities.map((item) => <Link key={item.name} href={item.href} className="group"><h3 className="font-black group-hover:text-blue-600">{item.name}</h3><p className="mt-3 text-sm leading-7 text-black/60">{item.text[locale]}</p><span className="mt-3 inline-flex text-[10px] font-black uppercase tracking-[0.18em] text-black/35">{text.map} <ArrowUpRight size={12} className="ml-1" /></span></Link>)}</div></section>
      <div className="mt-24"><Link href="/" className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-blue-600">{text.home} <ArrowUpRight size={14} /></Link></div>
    </main><footer className="border-t border-black/10 px-5 py-8 text-center text-[10px] font-mono uppercase tracking-[0.2em] text-black/35">© {new Date().getFullYear()} Ryusei Tsukamoto</footer>
  </div>;
}
