import { linktreeLinks, type LinktreeLink } from "@/lib/content";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function getLinktreeLinks(options: { includeInactive?: boolean } = {}): Promise<LinktreeLink[]> {
  try {
    let query = supabaseAdmin
      .from("linktree_links")
      .select("slug,title,url,group,description,sort_order,is_active")
      .order("sort_order", { ascending: true });
    if (!options.includeInactive) query = query.eq("is_active", true);
    const { data, error } = await query;
    if (!error && data?.length) {
      const dbSlugs = new Set(data.map((l: any) => l.slug));
      const missing = linktreeLinks.filter((l) => !dbSlugs.has(l.slug));
      if (missing.length === 0) return data as LinktreeLink[];
      return [...(data as LinktreeLink[]), ...missing];
    }
  } catch {
    // Keep the public page available during local development or before migration.
  }
  return linktreeLinks;
}
