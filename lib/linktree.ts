import { linktreeLinks } from "@/lib/content";
import { getLinktreeLinks } from "@/lib/linktree-queries";

export function getLinktreeLink(slug: string) {
  return linktreeLinks.find((link) => link.slug === slug) ?? null;
}

export async function getPublishedLinktreeLink(slug: string) {
  const links = await getLinktreeLinks();
  return links.find((link) => link.slug === slug) ?? null;
}
