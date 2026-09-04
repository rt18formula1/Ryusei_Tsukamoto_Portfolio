import { NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatJPY(value: unknown) {
  return `&yen;${Number(value || 0).toLocaleString("ja-JP")}`;
}

function parseCartItems(metadata: any) {
  if (metadata?.cart_quantities) {
    return String(metadata.cart_quantities)
      .split(",")
      .map((entry) => {
        const [id, quantity] = entry.split(":");
        return { id, quantity: Math.max(1, Number(quantity) || 1) };
      })
      .filter((item) => item.id);
  }

  if (metadata?.cart_items) {
    try {
      const parsed = JSON.parse(metadata.cart_items);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => ({
            id: String(item.id || ""),
            quantity: Math.max(1, Number(item.quantity) || 1),
          }))
          .filter((item) => item.id);
      }
    } catch (error) {
      console.error("Failed to parse cart_items metadata:", error);
    }
  }

  return String(metadata?.item_ids || "")
    .split(",")
    .filter(Boolean)
    .map((id) => ({ id, quantity: 1 }));
}

function addressHtml(order: any, fallbackName: string) {
  const lines = [
    order.shipping_name || fallbackName,
    order.shipping_postal_code,
    `${order.shipping_prefecture || ""} ${order.shipping_city || ""}`.trim(),
    order.shipping_address_line1,
    order.shipping_address_line2,
    order.shipping_country || "Japan",
  ].filter(Boolean);

  return lines.map((line) => escapeHtml(line)).join("<br>");
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("No stripe-signature header");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log("Webhook event type:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    console.log("Session ID:", session.id);
    console.log("Session metadata:", JSON.stringify(session.metadata));
    console.log("Amount total:", session.amount_total);

    const { user_id } = session.metadata || {};

    if (!user_id) {
      console.error("No user_id in metadata");
      return NextResponse.json({ received: true });
    }

    let supabaseAdmin;
    try {
      supabaseAdmin = getSupabaseAdmin();
      console.log("Supabase admin initialized");
    } catch (e: any) {
      console.error("Supabase admin init error:", e.message);
      return NextResponse.json({ error: "Supabase init failed" }, { status: 500 });
    }

    // Create order
    const insertData = {
      user_id,
      status: "paid",
      total_price: session.amount_total,
      stripe_payment_intent_id: session.payment_intent || null,
      stripe_checkout_session_id: session.id,
      shipping_name: session.metadata?.shipping_name || null,
      shipping_postal_code: session.metadata?.shipping_postal_code || null,
      shipping_prefecture: session.metadata?.shipping_prefecture || null,
      shipping_city: session.metadata?.shipping_city || null,
      shipping_address_line1: session.metadata?.shipping_address_line1 || null,
      shipping_address_line2: session.metadata?.shipping_address_line2 || null,
      shipping_country: session.metadata?.shipping_country || "Japan",
    };
    console.log("Inserting order:", JSON.stringify(insertData));

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert(insertData)
      .select()
      .single();

    if (orderError) {
      console.error("Order insert error:", JSON.stringify(orderError));
      return NextResponse.json({ error: "Order creation failed", detail: orderError.message }, { status: 500 });
    }

    console.log("Order created:", order.id);

    // Create order_items
    const cartItems = parseCartItems(session.metadata);
    if (cartItems.length > 0) {
      const ids = cartItems.map((item) => item.id);
      const { data: dbProducts } = await supabaseAdmin.from("products").select("*").in("id", ids);

      if (dbProducts && dbProducts.length > 0) {
        const orderItems = [];
        for (const item of cartItems) {
          const product = dbProducts.find((p: any) => p.id === item.id);
          if (!product) continue;
          orderItems.push({
            order_id: order.id,
            product_id: product.id,
            quantity: item.quantity,
            price: product.price,
          });
        }
        const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems);
        if (itemsError) console.error("Order items error:", JSON.stringify(itemsError));
        else console.log("Order items created:", orderItems.length);

        // Handle digital content delivery
        for (const p of dbProducts) {
          if (p.type === "digital") {
            const { data: dc } = await supabaseAdmin.from("digital_contents").select("*").eq("product_id", p.id).single();
            if (dc?.delivery_type === "activate_code") {
              const { data: code } = await supabaseAdmin.from("activate_codes")
                .select("*").eq("product_id", p.id).eq("is_used", false).limit(1).single();
              if (code) {
                await supabaseAdmin.from("activate_codes")
                  .update({ is_used: true, used_by: user_id, used_at: new Date().toISOString() })
                  .eq("id", code.id);
                console.log("Activate code assigned:", code.code);
              }
            }
          }
        }
      }
    }

    // Send confirmation email (optional - skip if Resend not configured)
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const { data: authData } = await supabaseAdmin.auth.admin.getUserById(user_id);
        const { data: profile } = await supabaseAdmin.from("user_profiles").select("*").eq("id", user_id).single();
        if (authData.user?.email) {
          const { Resend } = await import("resend");
          const resend = new Resend(resendKey);
          const customerName = order.shipping_name || [profile?.last_name, profile?.first_name].filter(Boolean).join(" ") || profile?.display_name || "Customer";
          await resend.emails.send({
            from: "rt18_formula1 Shop <onboarding@resend.dev>",
            to: authData.user.email,
            subject: `Order Confirmation #${order.id.slice(0, 8).toUpperCase()} - rt18_formula1`,
            html: `
              <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
                <h1 style="font-size: 24px; margin: 0 0 16px;">Thank you for your order!</h1>
                <p>Hi ${escapeHtml(customerName)},</p>
                <p>Your payment has been confirmed.</p>
                <p><strong>Order ID:</strong> #${escapeHtml(order.id.slice(0, 8).toUpperCase())}</p>
                <p><strong>Total:</strong> ${formatJPY(order.total_price)}</p>
                <p><strong>Status:</strong> ${escapeHtml(order.status)}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0;" />
                <p style="margin-bottom: 8px;"><strong>Shipping to:</strong></p>
                <p>${addressHtml(order, customerName)}</p>
                <p style="margin-top: 24px;">You can check your order here: <a href="https://rt18-formula1-official-site.vercel.app/shop/mypage">My Page</a></p>
                <p>Thank you for your purchase!</p>
                <p style="color: #666;">rt18_formula1 Shop</p>
              </div>
            `,
          });
          console.log("Confirmation email sent to:", authData.user.email);
        }
      }
    } catch (emailError: any) {
      console.error("Email error (non-fatal):", emailError.message);
    }
  }

  return NextResponse.json({ received: true });
}
