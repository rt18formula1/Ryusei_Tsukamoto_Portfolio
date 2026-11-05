import { supabase, getSupabase } from "./supabaseClient";
import type { DbPortfolioActivity } from "@/types/portfolio-hierarchy";
import type { DbEquipmentSection, DbEquipmentItem, EquipmentSection, EquipmentItem } from "@/types/equipment";
import type { DbDiscipline, Discipline } from "@/types/discipline";

export type { DbEquipmentSection, DbEquipmentItem, EquipmentSection, EquipmentItem, DbDiscipline, Discipline };

export type DbNews = {
  id: string;
  title_en: string;
  title_ja: string;
  body_en: string;
  body_ja: string;
  image_url: string | null;
  published_at: string;
  created_at: string;
};

export type DbPortfolio = {
  id: string;
  title_en: string;
  title_ja: string;
  body_en: string;
  body_ja: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
};

export type DbAlbum = {
  id: string;
  name_en: string;
  name_ja: string;
  description_en: string;
  description_ja: string;
  cover_image_url: string | null;
  parent_id: string | null;
  type: "backnumber" | "portfolio";
  tags: string[];
  sort_order: number;
  position_x: number;
  position_y: number;
  created_at: string;
};

export type DbEvent = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string | null;
  is_all_day: boolean;
  color: string;
  source: 'manual' | 'google';
  created_at: string;
};

import type {
  DevProjectInformation,
  DevProjectDetailBlock,
  DevProjectGalleryItem,
  DevProjectLink,
} from "@/types/dev-project";
import type { DisciplineId } from "@/types/portfolio-map";

export type DbDevProject = {
  id: string;
  project_name: string;
  short_description: string;
  main_visual_url: string | null;
  main_visual_focal_point_x: number | null;
  main_visual_focal_point_y: number | null;
  information: DevProjectInformation[];
  details: DevProjectDetailBlock[];
  gallery: DevProjectGalleryItem[];
  links: DevProjectLink[];
  discipline_id: DisciplineId;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// ----------------------------------------------------------------------
// Storage Upload
// ----------------------------------------------------------------------

async function uploadViaPresignedUrl(
  bucket: string,
  file: File
): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }

  const signRes = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      bucket,
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
    }),
  });

  if (!signRes.ok) {
    let errMsg = "Upload failed";
    try {
      const err = await signRes.json();
      errMsg = err.error || errMsg;
    } catch { /* ignore json parse error */ }
    throw new Error(`presigned: ${errMsg} (HTTP ${signRes.status})`);
  }

  const signed = (await signRes.json()) as { uploadUrl?: string; url?: string };
  if (!signed.uploadUrl || !signed.url) {
    throw new Error("presigned: アップロードURLの取得に失敗しました");
  }

  const uploadRes = await fetch(signed.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });

  if (!uploadRes.ok) {
    const message = await uploadRes.text().catch(() => "Unknown upload error");
    throw new Error(`presigned: R2 PUT failed: ${message} (HTTP ${uploadRes.status})`);
  }

  return signed.url;
}

async function uploadViaDirectApi(bucket: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);

  const res = await fetch("/api/admin/upload-direct", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    let errMsg = "Direct upload failed";
    try {
      const err = await res.json();
      errMsg = err.error || errMsg;
    } catch { /* ignore */ }
    throw new Error(`direct: ${errMsg} (HTTP ${res.status})`);
  }

  const data = (await res.json()) as { url?: string };
  if (!data.url) {
    throw new Error("direct: アップロードURLの取得に失敗しました");
  }
  return data.url;
}

export async function uploadImageToStorage(
  bucket: "news-images" | "portfolio-images" | "album-covers" | "bucknumber-covers",
  file: File
): Promise<string> {
  // Try presigned URL first; if CORS or client PUT fails, fallback to direct upload API
  try {
    return await uploadViaPresignedUrl(bucket, file);
  } catch (err) {
    console.warn("Presigned upload failed, falling back to direct upload API:", err);
    return await uploadViaDirectApi(bucket, file);
  }
}

// ----------------------------------------------------------------------
// News CRUD
// ----------------------------------------------------------------------

export async function getNewsList() {
  if (!supabase) return [];
  
  // Try explicit ordering to ensure latest first
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false }); // Order by created_at descending (newest first)

  if (error) {
    console.error("Error fetching news:", error);
    return [];
  }
  
  // Debug: Log the order of news items
  if (data && data.length > 0) {
    console.log("News order (first 3 items):", data.slice(0, 3).map(n => ({
      id: n.id,
      title: n.title_en,
      created_at: n.created_at,
      published_at: n.published_at
    })));
  }
  
  return data as DbNews[];
}

export async function getNewsById(id: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("news").select("*").eq("id", id).single();
  if (error) return null;
  return data as DbNews;
}

export async function createNews(news: Partial<DbNews>) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.from("news").insert(news).select().single();
  if (error) throw error;
  return data as DbNews;
}

export async function updateNews(id: string, news: Partial<DbNews>) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.from("news").update(news).eq("id", id).select().single();
  if (error) throw error;
  return data as DbNews;
}

export async function deleteNews(id: string) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) throw error;
}

// ----------------------------------------------------------------------
// Portfolio CRUD
// ----------------------------------------------------------------------

export async function getPortfolioList() {
  if (!supabase) return [];
  const { data, error } = await supabase.from("portfolio").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching portfolio:", error);
    return [];
  }
  return data as DbPortfolio[];
}

export async function getPortfolioById(id: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("portfolio").select("*").eq("id", id).single();
  if (error) return null;
  return data as DbPortfolio;
}

export async function getPortfolioByIds(ids: string[]) {
  if (!supabase) return [];
  const { data, error } = await supabase.from("portfolio").select("*").in("id", ids);
  if (error) return [];
  return data as DbPortfolio[];
}

export async function createPortfolio(portfolio: Partial<DbPortfolio>) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.from("portfolio").insert(portfolio).select().single();
  if (error) throw error;
  return data as DbPortfolio;
}

export async function updatePortfolio(id: string, portfolio: Partial<DbPortfolio>) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.from("portfolio").update(portfolio).eq("id", id).select().single();
  if (error) throw error;
  return data as DbPortfolio;
}

export async function deletePortfolio(id: string) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { error } = await supabase.from("portfolio").delete().eq("id", id);
  if (error) throw error;
}

// ----------------------------------------------------------------------
// Albums CRUD
// ----------------------------------------------------------------------

export async function getAlbumsByType(type: "backnumber" | "portfolio") {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .eq("type", type)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching albums:", error);
    return [];
  }
  return data as DbAlbum[];
}

export async function createAlbum(album: Partial<DbAlbum>) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.from("albums").insert(album).select().single();
  if (error) throw error;
  return data as DbAlbum;
}

export async function deleteAlbum(id: string) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { error } = await supabase.from("albums").delete().eq("id", id);
  if (error) throw error;
}

// ----------------------------------------------------------------------
// Intermediary Tables (Many-to-Many) - Corrected table names
// ----------------------------------------------------------------------

export async function addNewsToAlbum(album_id: string, news_id: string) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { error } = await supabase.from("news_albums").insert({ album_id, news_id });
  if (error) throw error;
}

export async function addPortfolioToAlbum(album_id: string, portfolio_id: string) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { error } = await supabase.from("portfolio_albums").insert({ album_id, portfolio_id });
  if (error) throw error;
}

export async function getNewsByAlbumId(album_id: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("news_albums")
    .select(`
      news_id,
      news (*)
    `)
    .eq("album_id", album_id);

  if (error) {
    console.error("Error fetching news for album:", error);
    return [];
  }
  return ((data as unknown as { news: DbNews | null }[]) ?? []).map(item => item.news).filter(Boolean) as DbNews[];
}

export async function getPortfolioByAlbumId(album_id: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("portfolio_albums")
    .select(`
      portfolio_id,
      portfolio (*)
    `)
    .eq("album_id", album_id);

  if (error) {
    console.error("Error fetching portfolio for album:", error);
    return [];
  }
  return ((data as unknown as { portfolio: DbPortfolio | null }[]) ?? []).map(item => item.portfolio).filter(Boolean) as DbPortfolio[];
}

export async function getPortfolioAlbumsMapping() {
  if (!supabase) return [];
  const { data, error } = await supabase.from("portfolio_albums").select("*");
  if (error) return [];
  return data as { portfolio_id: string; album_id: string }[];
}

export async function getNewsAlbumsMapping() {
  if (!supabase) return [];
  const { data, error } = await supabase.from("news_albums").select("*");
  if (error) return [];
  return data as { news_id: string; album_id: string }[];
}

// ----------------------------------------------------------------------
// Navigation Helpers (Prev/Next)
// ----------------------------------------------------------------------

export async function getAdjacentNews(currentPublishedAt: string) {
  if (!supabase) return { prev: null, next: null };
  const { data: prev } = await supabase
    .from("news")
    .select("id, title_en")
    .lt("published_at", currentPublishedAt)
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  const { data: next } = await supabase
    .from("news")
    .select("id, title_en")
    .gt("published_at", currentPublishedAt)
    .order("published_at", { ascending: true })
    .limit(1)
    .single();

  return { prev, next };
}

export async function getAdjacentPortfolio(currentSortOrder: number) {
  if (!supabase) return { prev: null, next: null };
  const { data: prev } = await supabase
    .from("portfolio")
    .select("id, title_en")
    .lt("sort_order", currentSortOrder)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const { data: next } = await supabase
    .from("portfolio")
    .select("id, title_en")
    .gt("sort_order", currentSortOrder)
    .order("sort_order", { ascending: true })
    .limit(1)
    .single();

  return { prev, next };
}

// ----------------------------------------------------------------------
// Album Relations CRUD
// ----------------------------------------------------------------------

export async function getAlbumRelations() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("album_relations")
    .select("*");

  if (error) {
    console.error("Error fetching album relations:", error);
    return [];
  }
  return data as { parent_id: string; child_id: string }[];
}

export async function createAlbumRelation(parentId: string, childId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("album_relations")
    .insert({ parent_id: parentId, child_id: childId })
    .select()
    .single();

  if (error) {
    console.error("Error creating album relation:", error);
    return null;
  }
  return data;
}

export async function deleteAlbumRelation(parentId: string, childId: string) {
  if (!supabase) return false;
  const { error } = await supabase
    .from("album_relations")
    .delete()
    .eq("parent_id", parentId)
    .eq("child_id", childId);

  if (error) {
    console.error("Error deleting album relation:", error);
    return false;
  }
  return true;
}

export async function getAllAlbums() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data as DbAlbum[];
}

// ----------------------------------------------------------------------
// Events CRUD
// ----------------------------------------------------------------------

export async function getEvents() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_time", { ascending: true });
    
  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }
  return data as DbEvent[];
}

// ----------------------------------------------------------------------
// Shop & Products
// ----------------------------------------------------------------------

export async function getMyProfile() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase.from("user_profiles").select("*").eq("id", user.id).single();
  if (error) return null;
  return data;
}

export async function getProductById(id: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function getProducts() {
  if (!supabase) return [];
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) return [];
  return data;
}

export async function getOrders() {
  if (!supabase) return [];
  const { data, error } = await supabase.from("orders").select("*, user_profiles(*)").order("created_at", { ascending: false });
  if (error) return [];
  return data;
}

export async function getCommissions() {
  if (!supabase) return [];
  const { data, error } = await supabase.from("commissions").select("*, user_profiles(*)").order("created_at", { ascending: false });
  if (error) return [];
  return data;
}

// ----------------------------------------------------------------------
// Developer Projects CRUD
// ----------------------------------------------------------------------

export async function getDevProjects(disciplineId?: DisciplineId) {
  // If called on server side, try supabaseAdmin first for maximum reliability in Cloudflare Workers
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getSupabaseAdmin } = require("./supabaseAdmin");
      const admin = getSupabaseAdmin();
      let query = admin
        .from("dev_projects")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (disciplineId) query = query.eq("discipline_id", disciplineId);
      const { data, error } = await query;
      if (!error && data) return data as DbDevProject[];
    } catch {}
  }

  const client = getSupabase();
  if (!client) return [];
  let query = client
    .from("dev_projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  
  if (disciplineId) {
    query = query.eq("discipline_id", disciplineId);
  }
  
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching dev projects:", error);
    return [];
  }
  return data as DbDevProject[];
}

export async function getPortfolioActivities(disciplineId?: DisciplineId) {
  // If called on server side, try supabaseAdmin first
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getSupabaseAdmin } = require("./supabaseAdmin");
      const admin = getSupabaseAdmin();
      let query = admin
        .from("portfolio_activities")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (disciplineId) query = query.eq("discipline_id", disciplineId);
      const { data, error } = await query;
      if (!error && data) return data as DbPortfolioActivity[];
    } catch {}
  }

  const client = getSupabase();
  if (!client) return [];
  let query = client.from("portfolio_activities").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: true });
  if (disciplineId) query = query.eq("discipline_id", disciplineId);
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching portfolio activities:", error);
    return [];
  }
  return data as DbPortfolioActivity[];
}

export async function getDevProjectById(id: string) {
  // If called on server side (Next.js App Router Server Component), try supabaseAdmin first to allow previewing Draft projects
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getSupabaseAdmin } = require("./supabaseAdmin");
      const admin = getSupabaseAdmin();
      const { data, error } = await admin.from("dev_projects").select("*").eq("id", id).single();
      if (!error && data) return data as DbDevProject;
    } catch {}
  }

  const client = getSupabase();
  if (client) {
    const { data, error } = await client.from("dev_projects").select("*").eq("id", id).single();
    if (!error && data) return data as DbDevProject;
  }

  return null;
}

export async function createDevProject(project: Partial<DbDevProject>) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.from("dev_projects").insert(project).select().single();
  if (error) throw error;
  return data as DbDevProject;
}

export async function updateDevProject(id: string, project: Partial<DbDevProject>) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.from("dev_projects").update(project).eq("id", id).select().single();
  if (error) throw error;
  return data as DbDevProject;
}

export async function deleteDevProject(id: string) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { error } = await supabase.from("dev_projects").delete().eq("id", id);
  if (error) throw error;
}

// ----------------------------------------------------------------------
// Equipment Sections CRUD
// ----------------------------------------------------------------------

export async function getEquipmentSections(disciplineId?: DisciplineId) {
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getSupabaseAdmin } = require("./supabaseAdmin");
      const admin = getSupabaseAdmin();
      let query = admin
        .from("equipment_sections")
        .select("*")
        .order("display_order", { ascending: true });
      if (disciplineId) query = query.eq("discipline_id", disciplineId);
      const { data, error } = await query;
      if (!error && data) return data as DbEquipmentSection[];
    } catch {}
  }

  const client = getSupabase();
  if (!client) return [];
  let query = client
    .from("equipment_sections")
    .select("*")
    .order("display_order", { ascending: true });
  
  if (disciplineId) {
    query = query.eq("discipline_id", disciplineId);
  }
  
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching equipment sections:", error);
    return [];
  }
  return data as DbEquipmentSection[];
}

export async function getEquipmentSectionById(id: string) {
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getSupabaseAdmin } = require("./supabaseAdmin");
      const admin = getSupabaseAdmin();
      const { data, error } = await admin.from("equipment_sections").select("*").eq("id", id).single();
      if (!error && data) return data as DbEquipmentSection;
    } catch {}
  }

  const client = getSupabase();
  if (client) {
    const { data, error } = await client.from("equipment_sections").select("*").eq("id", id).single();
    if (!error && data) return data as DbEquipmentSection;
  }

  return null;
}

export async function getEquipmentSectionWithItems(id: string) {
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getSupabaseAdmin } = require("./supabaseAdmin");
      const admin = getSupabaseAdmin();
      const { data, error } = await admin
        .from("equipment_sections")
        .select(`
          *,
          equipment_items (*)
        `)
        .eq("id", id)
        .single();
      if (!error && data) {
        const section = data as DbEquipmentSection & { equipment_items: DbEquipmentItem[] };
        return {
          id: section.id,
          disciplineId: section.discipline_id,
          name: section.name,
          slug: section.slug,
          description: section.description || undefined,
          displayOrder: section.display_order,
          visible: section.visible,
          createdAt: section.created_at,
          updatedAt: section.updated_at,
          items: section.equipment_items.map((item) => ({
            id: item.id,
            sectionId: item.section_id,
            name: item.name,
            description: item.description || undefined,
            imageUrl: item.image_url || undefined,
            displayOrder: item.display_order,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          })),
        } as EquipmentSection;
      }
    } catch {}
  }

  const client = getSupabase();
  if (client) {
    const { data, error } = await client
      .from("equipment_sections")
      .select(`
        *,
        equipment_items (*)
      `)
      .eq("id", id)
      .single();
    if (!error && data) {
      const section = data as DbEquipmentSection & { equipment_items: DbEquipmentItem[] };
      return {
        id: section.id,
        disciplineId: section.discipline_id,
        name: section.name,
        slug: section.slug,
        description: section.description || undefined,
        displayOrder: section.display_order,
        visible: section.visible,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
        items: section.equipment_items.map((item) => ({
          id: item.id,
          sectionId: item.section_id,
          name: item.name,
          description: item.description || undefined,
          imageUrl: item.image_url || undefined,
          displayOrder: item.display_order,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        })),
      } as EquipmentSection;
    }
  }

  return null;
}

export async function createEquipmentSection(section: Partial<DbEquipmentSection>) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.from("equipment_sections").insert(section).select().single();
  if (error) throw error;
  return data as DbEquipmentSection;
}

export async function updateEquipmentSection(id: string, section: Partial<DbEquipmentSection>) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.from("equipment_sections").update(section).eq("id", id).select().single();
  if (error) throw error;
  return data as DbEquipmentSection;
}

export async function deleteEquipmentSection(id: string) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { error } = await supabase.from("equipment_sections").delete().eq("id", id);
  if (error) throw error;
}

// ----------------------------------------------------------------------
// Equipment Items CRUD
// ----------------------------------------------------------------------

export async function getEquipmentItems(sectionId: string) {
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getSupabaseAdmin } = require("./supabaseAdmin");
      const admin = getSupabaseAdmin();
      const { data, error } = await admin
        .from("equipment_items")
        .select("*")
        .eq("section_id", sectionId)
        .order("display_order", { ascending: true });
      if (!error && data) return data as DbEquipmentItem[];
    } catch {}
  }

  const client = getSupabase();
  if (!client) return [];
  const { data, error } = await client
    .from("equipment_items")
    .select("*")
    .eq("section_id", sectionId)
    .order("display_order", { ascending: true });
  if (error) {
    console.error("Error fetching equipment items:", error);
    return [];
  }
  return data as DbEquipmentItem[];
}

export async function createEquipmentItem(item: Partial<DbEquipmentItem>) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.from("equipment_items").insert(item).select().single();
  if (error) throw error;
  return data as DbEquipmentItem;
}

export async function updateEquipmentItem(id: string, item: Partial<DbEquipmentItem>) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.from("equipment_items").update(item).eq("id", id).select().single();
  if (error) throw error;
  return data as DbEquipmentItem;
}

export async function deleteEquipmentItem(id: string) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { error } = await supabase.from("equipment_items").delete().eq("id", id);
  if (error) throw error;
}

export async function getEquipmentSectionsWithItems(disciplineId?: DisciplineId) {
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getSupabaseAdmin } = require("./supabaseAdmin");
      const admin = getSupabaseAdmin();
      let query = admin
        .from("equipment_sections")
        .select(`
          *,
          equipment_items (*)
        `)
        .order("display_order", { ascending: true });
      if (disciplineId) query = query.eq("discipline_id", disciplineId);
      const { data, error } = await query;
      if (!error && data) {
        return (data as (DbEquipmentSection & { equipment_items: DbEquipmentItem[] })[]).map((section) => ({
          id: section.id,
          disciplineId: section.discipline_id,
          name: section.name,
          slug: section.slug,
          description: section.description || undefined,
          displayOrder: section.display_order,
          visible: section.visible,
          createdAt: section.created_at,
          updatedAt: section.updated_at,
          items: section.equipment_items.map((item) => ({
            id: item.id,
            sectionId: item.section_id,
            name: item.name,
            description: item.description || undefined,
            imageUrl: item.image_url || undefined,
            displayOrder: item.display_order,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          })),
        })) as EquipmentSection[];
      }
    } catch {}
  }

  const client = getSupabase();
  if (!client) return [];
  let query = client
    .from("equipment_sections")
    .select(`
      *,
      equipment_items (*)
    `)
    .order("display_order", { ascending: true });

  if (disciplineId) {
    query = query.eq("discipline_id", disciplineId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching equipment sections with items:", error);
    return [];
  }
  return (data as (DbEquipmentSection & { equipment_items: DbEquipmentItem[] })[]).map((section) => ({
    id: section.id,
    disciplineId: section.discipline_id,
    name: section.name,
    slug: section.slug,
    description: section.description || undefined,
    displayOrder: section.display_order,
    visible: section.visible,
    createdAt: section.created_at,
    updatedAt: section.updated_at,
    items: section.equipment_items.map((item) => ({
      id: item.id,
      sectionId: item.section_id,
      name: item.name,
      description: item.description || undefined,
      imageUrl: item.image_url || undefined,
      displayOrder: item.display_order,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })),
  })) as EquipmentSection[];
}

// ─── Discipline Queries ─────────────────────────────────────────────────────

export async function getDisciplines(): Promise<DbDiscipline[]> {
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getSupabaseAdmin } = require("./supabaseAdmin");
      const admin = getSupabaseAdmin();
      const { data, error } = await admin
        .from("disciplines")
        .select("*")
        .order("display_order", { ascending: true });
      if (!error && data) return data as DbDiscipline[];
    } catch {}
  }

  const client = getSupabase();
  if (!client) return [];
  const { data, error } = await client
    .from("disciplines")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) {
    console.error("Error fetching disciplines:", error);
    return [];
  }
  return data as DbDiscipline[];
}

export async function getDisciplineById(id: string): Promise<DbDiscipline | null> {
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getSupabaseAdmin } = require("./supabaseAdmin");
      const admin = getSupabaseAdmin();
      const { data, error } = await admin.from("disciplines").select("*").eq("id", id).single();
      if (!error && data) return data as DbDiscipline;
    } catch {}
  }

  const client = getSupabase();
  if (!client) return null;
  const { data, error } = await client.from("disciplines").select("*").eq("id", id).single();
  if (error) {
    console.error("Error fetching discipline:", error);
    return null;
  }
  return data as DbDiscipline;
}

export async function createDiscipline(discipline: Omit<DbDiscipline, "created_at" | "updated_at">): Promise<DbDiscipline> {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.from("disciplines").insert(discipline).select().single();
  if (error) throw error;
  return data as DbDiscipline;
}

export async function updateDiscipline(id: string, discipline: Partial<DbDiscipline>): Promise<DbDiscipline> {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.from("disciplines").update(discipline).eq("id", id).select().single();
  if (error) throw error;
  return data as DbDiscipline;
}

export async function deleteDiscipline(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { error } = await supabase.from("disciplines").delete().eq("id", id);
  if (error) throw error;
}
