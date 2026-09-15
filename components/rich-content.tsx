"use client";

import Link from "next/link";
import { generateImageProps } from "@/lib/seo-utils";
import type { DbPortfolio } from "@/lib/supabase-queries";
import { isRichHtml, sanitizeRichHtml } from "@/lib/rich-text";
import styles from "./rich-content.module.css";

type RichContentProps = {
  content: string | null | undefined;
  embeddedPortfolio?: DbPortfolio[];
  className?: string;
};

function PortfolioEmbed({ item }: { item: DbPortfolio }) {
  return (
    <div className="my-8 border border-black/10 rounded-xl overflow-hidden bg-white shadow-sm max-w-sm mx-auto not-prose">
      <Link href={`/portfolio/${item.id}`}>
        <div className="aspect-square relative bg-black/5">
          {item.image_url &&
            (() => {
              const imageProps = generateImageProps(item.image_url, item.title_en, "portfolio");
              return imageProps ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img {...imageProps} className="w-full h-full object-cover" alt={item.title_en} />
              ) : null;
            })()}
        </div>
        <div className="p-4">
          <h4 className="font-bold text-sm">{item.title_en}</h4>
          <p className="text-xs text-blue-500 mt-2 font-bold">View Artwork →</p>
        </div>
      </Link>
    </div>
  );
}

/**
 * Renders admin-authored body text:
 * - TipTap HTML (sanitized) when present
 * - Legacy plain text with [portfolio:uuid] embeds otherwise
 */
export function RichContent({
  content,
  embeddedPortfolio = [],
  className = "",
}: RichContentProps) {
  if (!content) return null;

  const renderParts = (text: string, asHtml: boolean) => {
    const parts = text.split(/(\[portfolio:[a-f0-9-]+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[portfolio:([a-f0-9-]+)\]/);
      if (match) {
        const item = embeddedPortfolio.find((p) => p.id === match[1]);
        if (item) return <PortfolioEmbed key={index} item={item} />;
        return <span key={index}>{part}</span>;
      }
      if (asHtml) {
        const safe = sanitizeRichHtml(part);
        if (!safe.trim()) return null;
        return (
          <div
            key={index}
            className="rich-html"
            dangerouslySetInnerHTML={{ __html: safe }}
          />
        );
      }
      return (
        <span key={index} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  if (isRichHtml(content)) {
    return <div className={`${styles.root} ${className}`}>{renderParts(content, true)}</div>;
  }

  return <div className={className}>{renderParts(content, false)}</div>;
}

export default RichContent;
