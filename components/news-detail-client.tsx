"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/components/providers/language-provider";
import { generateImageProps } from "@/lib/seo-utils";
import type { DbNews, DbPortfolio } from "@/lib/supabase-queries";
import { ShareButtons } from "@/components/share-buttons";
import { RichContent } from "@/components/rich-content";

export default function NewsDetailClient({ 
  newsItem, 
  embeddedPortfolio = [],
  prev,
  next
}: { 
  newsItem: DbNews;
  embeddedPortfolio?: DbPortfolio[];
  prev?: { id: string; title_en: string } | null;
  next?: { id: string; title_en: string } | null;
}) {
  const { language } = useLanguage();

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">News not found</h1>
            <Link href="/news" className="underline">
              Back to News
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const title = language === "ja" ? newsItem.title_ja || newsItem.title_en : newsItem.title_en;
  const body = (language === "ja" ? newsItem.body_ja || newsItem.body_en : newsItem.body_en) || "";

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-6 md:py-12">
          <header className="mb-12 border-b border-black/10 pb-8">
            <Link href="/news" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-2 group mb-8">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to News
            </Link>
            <p className="text-sm font-bold text-gray-400 mb-4">{newsItem.published_at.split("T")[0]}</p>
            <h1 className="text-2xl md:text-5xl font-black mb-6 md:mb-8 tracking-tighter leading-tight">{title}</h1>
            {newsItem.image_url && (
              <div className="aspect-video relative rounded-2xl md:rounded-3xl overflow-hidden bg-black/5 border border-black/10 shadow-xl">
                {(() => {
                        const imageProps = generateImageProps(newsItem.image_url, title, "news");
                        return imageProps ? (
                          <img {...imageProps} className="w-full h-full object-cover" />
                        ) : null;
                      })()}
              </div>
            )}
          </header>

          <div className="prose prose-xl max-w-none text-black leading-relaxed font-medium mb-12">
            <RichContent content={body} embeddedPortfolio={embeddedPortfolio} />
          </div>

          <ShareButtons title={title} />

          <div className="border-t border-black/10 pt-12 flex flex-col md:flex-row gap-8 justify-between items-center mb-12">
            {prev ? (
              <Link href={`/news/${prev.id}`} className="group flex-1 flex items-center gap-4 text-left w-full">
                <div className="text-4xl font-light text-gray-300 group-hover:text-black transition-colors">←</div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Previous Story</p>
                  <p className="font-bold line-clamp-1">{prev.title_en}</p>
                </div>
              </Link>
            ) : <div className="flex-1" />}

            {next ? (
              <Link href={`/news/${next.id}`} className="group flex-1 flex items-center gap-4 text-right justify-end w-full">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Next Story</p>
                  <p className="font-bold line-clamp-1">{next.title_en}</p>
                </div>
                <div className="text-4xl font-light text-gray-300 group-hover:text-black transition-colors">→</div>
              </Link>
            ) : <div className="flex-1" />}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
