"use client";

import Link from "next/link";
import { ExternalLink, Link2, QrCode } from "lucide-react";
import type { LinktreeLink } from "@/lib/content";
import { SiteFooter } from "@/components/site-footer";

function iconForLink(link: LinktreeLink) {
  const value = `${link.title} ${link.url}`.toLowerCase();
  if (value.includes("instagram")) return "/instagram-icon.png";
  if (value.includes("youtube")) return "/youtube-logo.png";
  if (value.includes("tiktok")) return "/tiktok-logo.png";
  if (value.includes("linkedin")) return "/linkedin-icon.png";
  if (value.includes("github")) return "/github-icon.webp";
  if (value.includes("line")) return "/line-icon.png";
  if (value.includes("twitter") || value.includes("x.com")) return "/x-logo.png";
  if (value.includes("threads")) return "/threads-icon.png";
  return "/icon.png";
}

function TrackableLink({ link }: { link: LinktreeLink }) {
  return (
    <a href={`/go/${link.slug}`} className="group flex min-h-14 items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-black/30 hover:shadow-lg">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black/[.04] p-2"><img src={iconForLink(link)} alt="" className="h-full w-full object-contain" /></span>
      <span className="min-w-0 flex-1 truncate text-sm font-bold tracking-tight">{link.title}</span>
      <ExternalLink size={16} className="shrink-0 text-black/25 transition group-hover:text-black" />
    </a>
  );
}

export function LinktreePageClient({ links }: { links: LinktreeLink[] }) {
  return (
    <main className="min-h-screen bg-[#dfe4e8] px-4 py-8 text-black sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-black/55">
          <Link href="/" className="transition hover:text-black">← Portfolio Map</Link>
          <Link href="/wallet" className="inline-flex items-center gap-1.5 transition hover:text-black"><QrCode size={14} /> QR Card</Link>
        </div>
        <section className="rounded-[2rem] bg-white/65 px-4 py-8 shadow-sm backdrop-blur sm:px-12 sm:py-12">
          <header className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-black shadow-xl"><img src="/icon.png" alt="" className="h-full w-full object-cover" /></div>
            <a href="https://rt18-formula1-official-site.vercel.app/#top" className="mt-5 inline-block text-2xl font-black tracking-tight transition-opacity hover:opacity-60">rt18_formula1</a>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-black/65">This account is dedicated to posting F1 illustrations created by RT18. We would greatly appreciate it if you could follow, like, and share!</p>
            <div className="mt-5 flex items-center justify-center gap-3 text-black/45"><Link2 size={16} /><span className="text-[10px] font-black uppercase tracking-[0.25em]">Links</span></div>
          </header>
          <div className="mt-8 space-y-3">{links.map((link) => <TrackableLink key={link.slug} link={link} />)}</div>
        </section>
        <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">RT18_FORMULA1 · RYUSEI TSUKAMOTO</p>
      </div>
      <div className="mx-auto mt-10 max-w-6xl overflow-hidden rounded-[1.5rem]"><SiteFooter /></div>
    </main>
  );
}
