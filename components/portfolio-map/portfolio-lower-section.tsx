"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

type Locale = "ja" | "en";

const records = [
  { date: "2023.07", title: { ja: "rt18_formula1の活動開始", en: "rt18_formula1 begins" }, text: { ja: "F1を中心とした情報発信とイラストレーションを開始。SNSを軸に活動を広げる。", en: "Started publishing F1-related updates and illustrations, growing the activity through social platforms." }, href: "/links" },
  { date: "2024.11", title: { ja: "Fine Day Plus", en: "Fine Day Plus" }, text: { ja: "3人編成の学生バンドとして活動開始。演奏・制作・発表へ音楽活動を広げる。", en: "Started a three-piece student band, expanding from playing to production and public releases." }, href: "/disciplines/musician" },
  { date: "2025", title: { ja: "F1 Web / SNS / Illustration", en: "F1 web, social, and illustration" }, text: { ja: "rt18_formula1のRepository、Web、SNS、イラストレーションを継続的に制作。", en: "Continued building the rt18_formula1 repository, web presence, social channels, and illustrations." }, href: "/links" },
  { date: "2026 Early–Mid", title: { ja: "Web・AI・Software Development", en: "Web, AI, and software development" }, text: { ja: "calender-generator、nasu-calendar、Meteor_Creator_StudioなどのProjectを開発。F1からWeb、Calendar、Automationへ実装領域を拡張。", en: "Developed projects including calender-generator, nasu-calendar, and Meteor_Creator_Studio, extending from F1 into web, calendar, and automation tools." }, href: "/portfolio/developer" },
  { date: "2026.08–09", title: { ja: "Personal Portfolio / Public Research", en: "Personal portfolio and public research" }, text: { ja: "複数の活動Identityを接続するPersonal Portfolioを制作。日経STOCKリーグでは南海トラフ防災・減災をテーマに研究。", en: "Built a personal portfolio connecting multiple activity identities. Researched Nankai Trough disaster prevention and mitigation for the Nikkei STOCK League." }, href: "/profile" },
];

const copy = {
  ja: { label: "Profile", name: "Ryusei Tsukamoto", intro: "ソフトウェアをつくり、絵を描き、音楽と文章で考えを記録する。技術と表現を別々のものにせず、調べること、つくること、伝えることをひとつの活動として続けています。", full: "プロフィール全文", record: "活動の記録", hint: "スクロールして辿る", details: "詳細を見る" },
  en: { label: "Profile", name: "Ryusei Tsukamoto", intro: "I build software, draw, and use music and writing to record ideas. I keep research, making, and communicating connected as one practice rather than treating technology and expression as separate fields.", full: "Full profile", record: "Activity record", hint: "Scroll to explore", details: "Read more" },
};

export function PortfolioLowerSection() {
  const [locale, setLocale] = useState<Locale>("ja");
  const text = copy[locale];
  return (
    <section id="profile" className="bg-white" aria-label="Ryusei Tsukamoto profile">
      <div className="mx-auto max-w-5xl px-5 py-20 sm:px-10 sm:py-28">
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-3xl"><p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/40">{text.label}</p><h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-6xl">{text.name}</h2><p className="mt-8 text-base leading-8 text-black/70 sm:text-lg sm:leading-9">{text.intro}</p><Link href="/profile" className="mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600 transition hover:text-blue-800">{text.full} <ArrowUpRight size={14} /></Link></div>
          <div className="flex shrink-0 rounded-full border border-black/10 p-1 text-[10px] font-black uppercase tracking-widest"><button onClick={() => setLocale("ja")} className={`rounded-full px-2.5 py-1.5 ${locale === "ja" ? "bg-black text-white" : "text-black/40"}`}>JA</button><button onClick={() => setLocale("en")} className={`rounded-full px-2.5 py-1.5 ${locale === "en" ? "bg-black text-white" : "text-black/40"}`}>EN</button></div>
        </div>
        <div className="mt-24 sm:mt-32"><div className="mb-8 flex items-end justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/40">Personal record</p><h3 className="mt-4 text-2xl font-black tracking-tight sm:text-4xl">{text.record}</h3></div><span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/35">{text.hint} ↓</span></div><div className="relative ml-1 border-l border-black/15 pl-7 sm:pl-12">{records.map((item) => <article key={item.date} className="record-entry relative pb-14 last:pb-0"><span className="absolute -left-[2.08rem] top-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600 ring-1 ring-blue-600" /><p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">{item.date}</p><h4 className="mt-3 text-xl font-black tracking-tight sm:text-2xl">{item.title[locale]}</h4><p className="mt-3 max-w-2xl text-sm leading-7 text-black/60">{item.text[locale]}</p><Link href={item.href} className="mt-4 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-black/35 transition hover:text-black">{text.details} <ArrowUpRight size={13} /></Link></article>)}</div></div>
      </div>
    </section>
  );
}
