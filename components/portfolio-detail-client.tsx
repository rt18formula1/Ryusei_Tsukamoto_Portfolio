"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { generateImageProps } from "@/lib/seo-utils";
import type { DbPortfolio } from "@/lib/supabase-queries";
import Image from "next/image";
import { RichContent } from "@/components/rich-content";

export default function PortfolioDetailClient({ portfolioItem }: { portfolioItem: DbPortfolio }) {
  const { language } = useLanguage();

  if (!portfolioItem) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Portfolio not found</h1>
          <Link href="/portfolio" className="underline">
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  const body =
    language === "ja"
      ? portfolioItem.body_ja || portfolioItem.body_en
      : portfolioItem.body_en || "";

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="bg-white border-b border-black/10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/portfolio" className="hover:underline">
            ← Back to Portfolio
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-bold mb-2">
            {language === "ja" ? portfolioItem.title_ja || portfolioItem.title_en : portfolioItem.title_en}
          </h2>
          <p className="text-gray-500">{portfolioItem.created_at?.split("T")[0]}</p>
        </div>
        <div className="w-full bg-black/5 border border-black/10 rounded-lg overflow-hidden aspect-square md:aspect-video flex items-center justify-center text-7xl relative">
          {portfolioItem.image_url ? (() => {
                        const imageProps = generateImageProps(portfolioItem.image_url, language === "ja" ? portfolioItem.title_ja || portfolioItem.title_en : portfolioItem.title_en, "portfolio");
                        return imageProps ? (
                          <Image {...imageProps} fill className="object-cover" />
                        ) : null;
                      })() : (
            <span>🎨</span>
          )}
        </div>
        <div className="mt-8 max-w-none text-black leading-relaxed">
          {body ? (
            <RichContent content={body} />
          ) : (
            <p className="text-gray-500">No description yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
