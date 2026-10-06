"use server";

import { supabaseAdmin } from "./supabaseAdmin";
import { stripe } from "./stripe";
import type { DbNews, DbPortfolio, DbAlbum, DbEvent, DbDevProject } from "./supabase-queries";
import { verifyAdmin } from "./admin-auth";
import { uploadImageToStorage } from "./supabase-queries";
import type { DbPortfolioActivity } from "@/types/portfolio-hierarchy";
import type { LinktreeLink } from "@/lib/content";


export async function createNewsAction(news: Partial<DbNews>) {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin.from("news").insert(news).select().single();
  if (error) throw error;
  return data as DbNews;
}

export async function createPortfolioAction(portfolio: Partial<DbPortfolio>) {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin.from("portfolio").insert(portfolio).select().single();
  if (error) throw error;
  return data as DbPortfolio;
}

export async function createAlbumAction(album: Partial<DbAlbum>) {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin.from("albums").insert(album).select().single();
  if (error) throw error;
  return data as DbAlbum;
}

export async function addNewsToAlbumAction(album_id: string, news_id: string) {
  await verifyAdmin();
  const { error } = await supabaseAdmin.from("news_albums").insert({ album_id, news_id });
  if (error) throw error;
}

export async function addPortfolioToAlbumAction(album_id: string, portfolio_id: string) {
  await verifyAdmin();
  const { error } = await supabaseAdmin.from("portfolio_albums").insert({ album_id, portfolio_id });
  if (error) throw error;
}

export async function deleteNewsAction(id: string) {
  await verifyAdmin();
  const { error } = await supabaseAdmin.from("news").delete().eq("id", id);
  if (error) throw error;
}

export async function deletePortfolioAction(id: string) {
  await verifyAdmin();
  const { error } = await supabaseAdmin.from("portfolio").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteAlbumAction(id: string) {
  await verifyAdmin();
  const { error } = await supabaseAdmin.from("albums").delete().eq("id", id);
  if (error) throw error;
}

// ----------------------------------------------------------------------
// Events
// ----------------------------------------------------------------------

export async function createEventAction(event: Partial<DbEvent>) {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin.from("events").insert(event).select().single();
  if (error) throw error;
  return data as DbEvent;
}

export async function deleteEventAction(id: string) {
  await verifyAdmin();
  const { error } = await supabaseAdmin.from("events").delete().eq("id", id);
  if (error) throw error;
  return { success: true };
}
// ----------------------------------------------------------------------
// Shop & Products
// ----------------------------------------------------------------------

export async function createProductAction(product: any) {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin.from("products").insert(product).select().single();
  if (error) throw error;
  return data;
}

export async function updateProductAction(id: string, product: any) {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin.from("products").update(product).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProductAction(id: string) {
  await verifyAdmin();
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) throw error;
  return { success: true };
}

// ----------------------------------------------------------------------
// Commissions
// ----------------------------------------------------------------------

export async function updateCommissionStatusAction(id: string, status: string) {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin.from("commissions").update({ status }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

// ----------------------------------------------------------------------
// Stripe Sync
// ----------------------------------------------------------------------

export async function syncProductToStripeAction(productId: string) {
  await verifyAdmin();
  // 1. Get product from DB
  const { data: product, error } = await supabaseAdmin.from("products").select("*").eq("id", productId).single();
  if (error || !product) throw new Error("Product not found");

  // 2. Create Product on Stripe following Managed Payments blueprint
  const stripeProduct = await stripe.products.create({
    name: product.name_en || product.name_ja,
    description: product.description_en || product.description_ja,
    tax_code: "txcd_10103100", // As per blueprint for digital products
    default_price_data: {
      unit_amount: product.price,
      currency: "jpy",
    },
  }, {
    headers: {
      "stripe-version": "2026-02-25.preview"
    } as any
  });

  // 3. Update DB with Stripe ID
  await supabaseAdmin.from("products").update({
    stripe_product_id: stripeProduct.id,
    stripe_price_id: stripeProduct.default_price as string,
  }).eq("id", productId);

  return stripeProduct;
}

// ----------------------------------------------------------------------
// Developer Projects
// ----------------------------------------------------------------------

export async function createDevProjectAction(project: Partial<DbDevProject>) {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin.from("dev_projects").insert(project).select().single();
  if (error) throw error;
  return data as DbDevProject;
}

export async function updateDevProjectAction(id: string, project: Partial<DbDevProject>) {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin.from("dev_projects").update(project).eq("id", id).select().single();
  if (error) throw error;
  return data as DbDevProject;
}

export async function deleteDevProjectAction(id: string) {
  await verifyAdmin();
  const { error } = await supabaseAdmin.from("dev_projects").delete().eq("id", id);
  if (error) throw error;
  return { success: true };
}

export async function createPortfolioActivityAction(activity: Partial<DbPortfolioActivity>) {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin.from("portfolio_activities").insert(activity).select().single();
  if (error) throw error;
  return data as DbPortfolioActivity;
}

export async function updatePortfolioActivityAction(id: string, activity: Partial<DbPortfolioActivity>) {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin.from("portfolio_activities").update(activity).eq("id", id).select().single();
  if (error) throw error;
  return data as DbPortfolioActivity;
}

export async function uploadDevProjectImageAction(bucket: "news-images" | "portfolio-images" | "album-covers" | "bucknumber-covers", file: File) {
  await verifyAdmin();
  return await uploadImageToStorage(bucket, file);
}

export async function saveLinktreeLinksAction(links: LinktreeLink[]) {
  await verifyAdmin();
  const rows = links.map((link, index) => ({
    slug: link.slug.trim(),
    title: link.title.trim(),
    url: link.url.trim(),
    group: link.group,
    description: link.description?.trim() || null,
    sort_order: index,
    is_active: link.is_active !== false,
  }));
  if (rows.some((row) => !row.slug || !row.title || !row.url)) throw new Error("Slug, title, and URL are required");
  const { error: upsertError } = await supabaseAdmin.from("linktree_links").upsert(rows, { onConflict: "slug" });
  if (upsertError) throw upsertError;
  return { success: true };
}
