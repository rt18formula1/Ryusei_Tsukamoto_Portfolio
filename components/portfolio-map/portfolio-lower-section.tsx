import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const record = [
  { label: "Developer", title: "rt18_dev", text: "Webプロダクト、ツール、自動化の設計と実装。calender-generator、nasu-calendar、rt18-formula1-official-site、Meteor_Creator_Studio、fine-day-plus-officialを扱っています。", color: "#2563eb" },
  { label: "Illustrator", title: "rt18_formula1", text: "モータースポーツとF1を題材に、ドライバー、マシン、レースの瞬間をデジタルイラストレーションとして記録しています。", color: "#7c3aed" },
  { label: "Musician", title: "rt18_music / Fine Day Plus", text: "サウンドデザイン、楽曲制作、オーディオコンテンツの制作と発表。", color: "#db2777" },
  { label: "Blogger", title: "記録・考察・開発ログ", text: "技術検証、設計思想、制作の過程を文章として残し、noteやWebで共有しています。", color: "#059669" },
  { label: "Investor", title: "市場・テクノロジーリサーチ", text: "新興成長企業やテクノロジー市場を調べ、長期的な視点で知識を蓄積しています。", color: "#d97706" },
];

export function PortfolioLowerSection() {
  return (
    <section id="profile" className="bg-white" aria-label="Ryusei Tsukamoto profile">
      <div className="mx-auto max-w-5xl px-5 py-20 sm:px-10 sm:py-28">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/40">Profile</p>
          <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-6xl">Ryusei Tsukamoto</h2>
          <p className="mt-8 text-base leading-8 text-black/70 sm:text-lg sm:leading-9">ソフトウェアをつくり、絵を描き、音楽と文章で考えを記録する。技術と表現を別々のものにせず、調べること、つくること、伝えることをひとつの活動として続けています。</p>
          <Link href="/profile" className="mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600 transition hover:text-blue-800">プロフィール全文 <ArrowUpRight size={14} /></Link>
        </div>

        <div className="mt-24 sm:mt-32">
          <div className="mb-8 flex items-end justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.28em] text-black/40">Personal record</p><h3 className="mt-4 text-2xl font-black tracking-tight sm:text-4xl">活動の記録</h3></div><span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/35">Scroll</span></div>
          <div className="relative ml-1 border-l border-black/15 pl-7 sm:pl-12">{record.map((item, index) => <article key={item.label} className="relative pb-12 last:pb-0"><span className="absolute -left-[2.08rem] top-1 h-3 w-3 rounded-full border-2 border-white" style={{ backgroundColor: item.color, boxShadow: `0 0 0 1px ${item.color}` }} /><p className="text-[10px] font-black uppercase tracking-[0.25em] text-black/40">{String(index + 1).padStart(2, "0")} / {item.label}</p><h4 className="mt-3 text-xl font-black tracking-tight sm:text-2xl">{item.title}</h4><p className="mt-3 max-w-2xl text-sm leading-7 text-black/60">{item.text}</p></article>)}</div>
        </div>
      </div>
    </section>
  );
}
