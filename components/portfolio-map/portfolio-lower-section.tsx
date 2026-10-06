"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Locale = "ja" | "en";

const records = [
  { date: "2023.07", title: { ja: "rt18_formula1 / rt18_formula1_x", en: "rt18_formula1 / rt18_formula1_x" }, text: { ja: "F1のニュース・レース情報とイラストを発信する活動を開始。InstagramとXを中心に公開記録を積み上げる。", en: "Started publishing F1 news, race information, and illustrations, building a public archive through Instagram and X." }, href: "/links" },
  { date: "2024.11", title: { ja: "Fine Day Plus / rt18_music", en: "Fine Day Plus / rt18_music" }, text: { ja: "学生3人のバンド活動と、rt18_music名義の音楽記録を開始。演奏、カバー、制作へ広げる。", en: "Started band activity and personal music records under rt18_music, expanding into performances, covers, and production." }, href: "/disciplines/musician" },
  { date: "2025.06", title: { ja: "GitHub / rt18formula1", en: "GitHub / rt18formula1" }, text: { ja: "rt18formula1名義のGitHubアカウントを開設。以後のWebサービスと開発記録を公開リポジトリとして整理する。", en: "Opened the rt18formula1 GitHub account and began organizing web services and development records as public repositories." }, href: "https://github.com/rt18formula1" },
  { date: "2025.10", title: { ja: "rt18_formula1_xを公開", en: "Published rt18_formula1_x on X" }, text: { ja: "公開プロフィールに記録されたJoined October 2025を基準に、XでF1イラストとニュースの発信を継続。", en: "Continued publishing F1 illustrations and news on X; the public profile records the account as joined in October 2025." }, href: "/links" },
  { date: "2025", title: { ja: "rt18_formula1公式サイトを公開", en: "Published the rt18_formula1 official site" }, text: { ja: "ニュース、スケジュール、リザルト、イラスト、ポートフォリオをまとめるWeb基盤を制作・公開。", en: "Built and published a web platform combining news, schedules, results, illustrations, and portfolio work." }, href: "/portfolio/developer" },
  { date: "2025–2026", title: { ja: "rt18_devとして開発を拡張", en: "Expanded development as rt18_dev" }, text: { ja: "F1サイト、カレンダー、生成ツールなど、公開Webサービスの制作・運用へ活動を拡張。", en: "Expanded into building and operating public web services, including F1 sites, calendars, and generator tools." }, href: "/portfolio/developer" },
  { date: "2026 上期", title: { ja: "calender-generatorを公開", en: "Released calender-generator" }, text: { ja: "画像と年月から、フォトフレームや壁紙向けのカレンダー画像を生成・書き出しできるWebツールを公開。", en: "Released a web tool that generates and exports calendar artwork from an image, year, month, and layout template." }, href: "/portfolio/developer" },
  { date: "2026 上期", title: { ja: "nasu-calendarを公開", en: "Released nasu-calendar" }, text: { ja: "株式会社pedanticの動画投稿予定をGoogle Calendarで一覧・購読できる公開カレンダーを実装。", en: "Built a public calendar for browsing and subscribing to 株式会社pedantic's video publishing schedule through Google Calendar." }, href: "/portfolio/developer" },
  { date: "2026 上期", title: { ja: "Meteor Creator Studioを開発", en: "Developed Meteor Creator Studio" }, text: { ja: "レイヤー、ツール、パネルを備えたプロ向けクリエイティブスイートの開発を開始。", en: "Started developing a professional creative suite built around layers, tools, and dockable panels." }, href: "/portfolio/developer" },
  { date: "2026.08–09", title: { ja: "Portfolio Mapを制作", en: "Built the Portfolio Map" }, text: { ja: "複数の活動Identityと公開した制作物をつなぎ、F1・音楽・開発を横断して閲覧できるPortfolio Mapを制作。", en: "Built a Portfolio Map connecting public releases across F1, music, and software." }, href: "/profile" },
];

const copy = {
  ja: { label: "プロフィール", name: "塚本隆正", alias: "Ryusei Tsukamoto", intro: "2010年石川県生まれ。クリエイター。角川ドワンゴ学園S高等学校に在学。Fine Day Plusに所属。2023年7月にrt18_formula1としてF1を中心とした情報やイラストの発信活動を始める。以降、rt18_musicとしての音楽活動やrt18_devとしてのWeb開発などマルチにクリエイター活動を行っている。", full: "プロフィール全文", record: "活動の記録", hint: "スクロールして辿る", details: "詳細を見る" },
  en: { label: "Profile", name: "Ryusei Tsukamoto", alias: "塚本隆正", intro: "Born in Ishikawa in 2010. Creator. Currently attending S High School at Kadokawa Dwango Academy and a member of Fine Day Plus. In July 2023, he began publishing F1-related information and illustrations as rt18_formula1. Since then, he has continued working across creative fields, including music as rt18_music and web development as rt18_dev.", full: "Full profile", record: "Activity record", hint: "Scroll to explore", details: "Read more" },
};

function RecordScroller({ locale, details }: { locale: Locale; details: string }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const viewport = viewportRef.current;
      const elapsed = now - last;
      last = now;
      if (viewport && !hovered && !interacting) {
        const midpoint = viewport.scrollHeight / 2;
        viewport.scrollTop += elapsed * 0.018;
        if (viewport.scrollTop >= midpoint) viewport.scrollTop -= midpoint;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hovered, interacting]);

  const handleUserScroll = () => {
    setInteracting(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setInteracting(false), 1800);
  };

  return <div ref={viewportRef} className="record-scroll" aria-label="活動歴の縦スクロール" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onWheel={handleUserScroll} onTouchStart={() => setInteracting(true)} onTouchEnd={() => setInteracting(false)}>{[...records, ...records].map((item, index) => <article key={`${item.date}-${index}`} aria-hidden={index >= records.length} className="record-entry relative py-7 pl-8 first:pt-0 sm:pl-12"><span className="absolute -left-[2.08rem] top-9 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-600 ring-1 ring-blue-600 sm:top-10" /><p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">{item.date}</p><h4 className="mt-2 text-xl font-black tracking-tight sm:text-2xl">{item.title[locale]}</h4><p className="mt-3 max-w-2xl text-sm leading-7 text-black/60">{item.text[locale]}</p><span className="mt-4 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-black/35">{details} <ArrowUpRight size={13} /></span></article>)}</div>;
}

export function PortfolioLowerSection() {
  const [locale, setLocale] = useState<Locale>("ja");
  const text = copy[locale];
  return (
    <section id="profile" className="bg-white" aria-label="Ryusei Tsukamoto profile">
      <div className="mx-auto max-w-5xl px-5 py-20 sm:px-10 sm:py-28">
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-3xl"><p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/40">{text.label}</p><h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-6xl">{text.name}</h2><p className="mt-2 text-sm font-medium tracking-wide text-black/45">{text.alias}</p><p className="mt-8 text-base leading-8 text-black/70 sm:text-lg sm:leading-9">{text.intro}</p><Link href="/profile" className="mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600 transition hover:text-blue-800">{text.full} <ArrowUpRight size={14} /></Link></div>
          <div className="flex shrink-0 rounded-full border border-black/10 p-1 text-[10px] font-black uppercase tracking-widest"><button onClick={() => setLocale("ja")} className={`rounded-full px-2.5 py-1.5 ${locale === "ja" ? "bg-black text-white" : "text-black/40"}`}>JA</button><button onClick={() => setLocale("en")} className={`rounded-full px-2.5 py-1.5 ${locale === "en" ? "bg-black text-white" : "text-black/40"}`}>EN</button></div>
        </div>
        <div className="mt-24 sm:mt-32"><div className="mb-8 flex items-end justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/40">Personal record</p><h3 className="mt-4 text-2xl font-black tracking-tight sm:text-4xl">{text.record}</h3></div><span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/35">{text.hint} ↕</span></div><div className="relative ml-1 border-l border-black/15 pl-7 sm:pl-12"><RecordScroller locale={locale} details={text.details} /></div></div>
      </div>
    </section>
  );
}
