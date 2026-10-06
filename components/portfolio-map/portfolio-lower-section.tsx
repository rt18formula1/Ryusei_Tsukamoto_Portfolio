import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const record = [
  { date: "2023.07", title: "rt18_formula1の活動開始", text: "F1を中心とした情報発信・SNS活動を継続的に形成。" },
  { date: "2024.11", title: "Fine Day Plus", text: "3人編成の学生バンドとして活動開始。演奏・制作へ音楽活動を広げる。" },
  { date: "2025", title: "F1 / 学習 / 研究 / 投資 / 開発", text: "rt18_formula1関連のRepository・Web・SNS活動を蓄積し、複数のDomainを並行して進める。" },
  { date: "2026 Early–Mid", title: "Web・AI・Software Development", text: "calender-generator、nasu-calendar、Meteor_Creator_StudioなどのProjectが具体化。F1からWeb、Calendar、Automationへ実装領域を拡張。" },
  { date: "2026.08–09", title: "Research / Finance / Personal Portfolio", text: "南海トラフ防災・減災の日経STOCKリーグ研究、企業・投資リサーチ、Personal Portfolioを横断接続。" },
  { date: "2026.09.29", title: "Personal Record System", text: "Project・Decision・Failure・Asset・Activityを時間軸で追跡するPersonal OSの構造を整理。" },
];

export function PortfolioLowerSection() {
  return (
    <section id="profile" className="bg-white" aria-label="Ryusei Tsukamoto profile">
      <div className="mx-auto max-w-5xl px-5 py-20 sm:px-10 sm:py-28">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/40">Profile</p>
          <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-6xl">Ryusei Tsukamoto</h2>
          <p className="mt-8 max-w-3xl text-base leading-8 text-black/70 sm:text-lg sm:leading-9">塚本隆正。石川県小松市を主な活動拠点とする高校生。2025年12月からS高等学校に在籍し、2028年3月の卒業を予定しています。Study、Research、Investment、Development、F1、Music、Media、Creativeを横断しながら、ソフトウェアをつくり、絵を描き、音楽と文章で考えを記録しています。</p>
          <Link href="/profile" className="mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600 transition hover:text-blue-800">プロフィール全文 <ArrowUpRight size={14} /></Link>
        </div>

        <div className="mt-24 sm:mt-32">
          <div className="mb-8 flex items-end justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/40">Personal record</p><h3 className="mt-4 text-2xl font-black tracking-tight sm:text-4xl">活動の記録</h3></div><span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/35">Scroll ↓</span></div>
          <div className="record-scroll relative overflow-hidden" aria-label="活動歴の縦スクロール"><div className="record-scroll-track">{[...record, ...record].map((item, index) => <article key={`${item.date}-${index}`} aria-hidden={index >= record.length} className="relative py-7 pl-8 first:pt-0 sm:pl-12"><span className="absolute left-0 top-9 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-white sm:top-10" /><p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">{item.date}</p><h4 className="mt-2 text-xl font-black tracking-tight sm:text-2xl">{item.title}</h4><p className="mt-3 max-w-2xl text-sm leading-7 text-black/60">{item.text}</p></article>)}</div></div>
        </div>
      </div>
    </section>
  );
}
