import { supabase } from "./supabaseClient";

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

export type DbDevProject = {
  id: string;
  project_name: string;
  short_description: string;
  main_visual_url: string | null;
  main_visual_focal_point_x: number | null;
  main_visual_focal_point_y: number | null;
  information: any; // JSON
  details: any; // JSON
  gallery: any; // JSON
  links: any; // JSON
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

export async function uploadImageToStorage(
  bucket: "news-images" | "portfolio-images" | "album-covers" | "bucknumber-covers",
  file: File
): Promise<string> {
  // Use presigned URL only (supports large files, no server payload limit)
  return await uploadViaPresignedUrl(bucket, file);
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

export async function getDevProjects() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("dev_projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching dev projects:", error);
    return [];
  }
  return data as DbDevProject[];
}

export async function getDevProjectById(id: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("dev_projects").select("*").eq("id", id).single();
  if (error) return null;
  return data as DbDevProject;
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
