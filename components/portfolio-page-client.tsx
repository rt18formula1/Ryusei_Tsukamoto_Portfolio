"use client";

import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/components/providers/language-provider";
import type { DbAlbum, DbPortfolio } from "@/lib/supabase-queries";

export default function PortfolioPageClient({ portfolio, albums, mapping }: { portfolio: DbPortfolio[]; albums: DbAlbum[]; mapping: { portfolio_id: string; album_id: string }[] }) {
  const { language } = useLanguage();
  const assigned = new Set(mapping.map((item) => item.portfolio_id));
  const standalone = portfolio.filter((item) => !assigned.has(item.id));
  const rootAlbums = albums.filter((album) => !album.parent_id);
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-black/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600">
            <a href="/" className="hover:text-black transition-colors">HOME</a>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-black">PORTFOLIO</span>
          </div>
          <a
            href="/"
            className="text-[10px] font-bold uppercase tracking-widest bg-black text-white rounded-full px-4 py-2 hover:bg-gray-800 transition-all"
          >
            Home
          </a>
        </div>
      </nav>

      <main className="flex-1">
        <header className="border-b border-black/10 px-4 py-12 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-5xl font-black tracking-tighter md:text-8xl">PORTFOLIO</h1>
            <div className="mt-5 h-2 w-20 bg-black" />
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
          <section>
            <h2 className="mb-8 text-xs font-black uppercase tracking-[0.25em] text-gray-400">Selected Work</h2>
            <PortfolioGrid items={standalone} language={language} />
          </section>
          {rootAlbums.length > 0 && (
            <section className="mt-20 border-t border-black/10 pt-12">
              <h2 className="mb-8 text-xs font-black uppercase tracking-[0.25em] text-gray-400">Collections</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rootAlbums.map((album) => (
                  <Link key={album.id} href={`/albums/${album.id}`} className="group overflow-hidden rounded-2xl border border-black/10">
                    <div className="aspect-video bg-black/5">
                      {album.cover_image_url && (
                        <img src={album.cover_image_url} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-black">{language === "ja" ? album.name_ja || album.name_en : album.name_en}</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-600">{language === "ja" ? album.description_ja || album.description_en : album.description_en}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function PortfolioGrid({ items, language }: { items: DbPortfolio[]; language: "ja" | "en" }) {
  if (items.length === 0) return <p className="py-16 text-gray-400">{language === "ja" ? "ポートフォリオは準備中です。" : "Portfolio work is coming soon."}</p>;
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <Link key={item.id} href={`/portfolio/${item.id}`} className="group overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:-translate-y-1 hover:shadow-xl"><div className="aspect-[4/3] bg-black/5">{item.image_url ? <img src={item.image_url} alt={language === "ja" ? item.title_ja || item.title_en : item.title_en} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-5xl">✦</div>}</div><div className="p-5"><h3 className="text-xl font-black">{language === "ja" ? item.title_ja || item.title_en : item.title_en}</h3></div></Link>)}</div>;
}
