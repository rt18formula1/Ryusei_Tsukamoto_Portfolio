import { linktreeLinks } from "@/lib/content";

export function getLinktreeLink(slug: string) {
  return linktreeLinks.find((link) => link.slug === slug) ?? null;
}
