import { NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { createClient } from "../../../../lib/supabaseServer";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Build-time guard to prevent Supabase initialization during build
const isBuildTime = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'test';

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  // Build-time guard
  if (isBuildTime) {
    return NextResponse.json({ error: "Build time" }, { status: 200 });
  }

  try {
    const body = await request.json();
    const { items, userId, shipping } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!user) {
      console.error("[checkout] No session. authError:", authError?.message);
      return NextResponse.json({ error: "Please log in again to complete checkout." }, { status: 401 });
    }
    const verifiedUserId = user.id;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const itemIds = items.map((i: any) => i.id);

    const { data: dbProducts, error: dbError } = await supabaseAdmin
      .from("products").select("*").in("id", itemIds);

    if (dbError || !dbProducts || dbProducts.length === 0) {
      console.error("[checkout] DB error:", dbError);
      return NextResponse.json({ error: "Failed to fetch products from database" }, { status: 500 });
    }

    // Validate all items can be found and have valid prices
    const resolvedItems = items.map((item: any) => {
      const product = dbProducts.find((p: any) => p.id === item.id);
      return { item, product };
    });

    const missingProducts = resolvedItems.filter(({ product }: any) => !product);
    if (missingProducts.length > 0) {
      return NextResponse.json({ error: "Some products were not found. Please refresh your cart." }, { status: 400 });
    }

    const invalidPrices = resolvedItems.filter(({ product }: any) => !product || typeof product.price !== "number" || product.price <= 0);
    if (invalidPrices.length > 0) {
      return NextResponse.json({ error: "Invalid product price detected." }, { status: 400 });
    }

    const isPhysical = resolvedItems.some(({ product }: any) => product.type === "physical");

    // Upsert shipping profile if physical
    if (shipping && isPhysical) {
      const profileUpdate = {
        id: verifiedUserId,
        last_name: cleanText(shipping.lastName),
        first_name: cleanText(shipping.firstName),
        postal_code: cleanText(shipping.postalCode),
        prefecture: cleanText(shipping.prefecture),
        city: cleanText(shipping.city),
        address_line1: cleanText(shipping.address1),
        address_line2: cleanText(shipping.address2) || null,
        country: cleanText(shipping.country) || "Japan",
      };
      const { error: profileError } = await supabaseAdmin
        .from("user_profiles")
        .upsert(profileUpdate, { onConflict: "id" });
      if (profileError) {
        console.error("[checkout] Profile upsert error:", profileError);
      }
    }

    const origin = request.headers.get("origin") || "https://rt18-formula1-official-site.vercel.app";

    const line_items = resolvedItems.map(({ item, product }: any) => ({
      price_data: {
        currency: "jpy",
        unit_amount: Math.round(Number(product.price)),
        product_data: {
          name: product.name_en || product.name_ja || "Product",
          ...(product.image_url ? { images: [product.image_url] } : {}),
        },
      },
      quantity: Math.max(1, Math.round(Number(item.quantity) || 1)),
    }));

    const cartQuantities = resolvedItems
      .map(({ item }: any) => `${item.id}:${Math.round(Number(item.quantity) || 1)}`)
      .join(",");

    // Stripe metadata: values must be <= 500 chars
    const metaShippingName = shipping
      ? `${cleanText(shipping.lastName)} ${cleanText(shipping.firstName)}`.trim()
      : "";

    const sessionParams: any = {
      mode: "payment",
      line_items,
      success_url: `${origin}/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop/cart`,
      metadata: {
        user_id: verifiedUserId,
        item_ids: itemIds.join(",").slice(0, 500),
        cart_quantities: cartQuantities.slice(0, 500),
        shipping_name: metaShippingName.slice(0, 100),
        shipping_postal_code: (shipping?.postalCode ?? "").slice(0, 20),
        shipping_prefecture: (shipping?.prefecture ?? "").slice(0, 50),
        shipping_city: (shipping?.city ?? "").slice(0, 100),
        shipping_address_line1: (shipping?.address1 ?? "").slice(0, 200),
        shipping_address_line2: (shipping?.address2 ?? "").slice(0, 200),
        shipping_country: (shipping?.country ?? "Japan").slice(0, 50),
      },
    };

    // Collect shipping in Stripe for physical goods
    if (isPhysical) {
      sessionParams.shipping_address_collection = {
        allowed_countries: ["JP", "US", "GB", "AU", "CA", "FR", "DE", "IT", "ES", "NL", "BE", "SG", "CN", "KR", "TW", "HK"],
      };
    }

    console.log("[checkout] creating stripe session, items:", line_items.length, "physical:", isPhysical);
    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log("[checkout] session created:", session.id);

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("[checkout] Stripe error:", err?.message, err?.type, err?.code);
    const userMessage = err?.type === "StripeInvalidRequestError"
      ? `Payment setup error: ${err.message}`
      : "Failed to create checkout session. Please try again.";
    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
