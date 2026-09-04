import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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

function addressHtml(order: any, fallbackName: string) {
  return [
    order.shipping_name || fallbackName,
    order.shipping_postal_code,
    `${order.shipping_prefecture || ""} ${order.shipping_city || ""}`.trim(),
    order.shipping_address_line1,
    order.shipping_address_line2,
    order.shipping_country || "Japan",
  ].filter(Boolean).map((line) => escapeHtml(line)).join("<br>");
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("rt18_admin")?.value;
    if (sessionCookie !== "1") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, trackingNumber } = await request.json();
    if (!orderId || !trackingNumber) {
      return NextResponse.json({ error: "Missing orderId or trackingNumber" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders").select("*").eq("id", orderId).single();
    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const { data: authData } = await supabaseAdmin.auth.admin.getUserById(order.user_id);
    const { data: profile } = await supabaseAdmin
      .from("user_profiles").select("*").eq("id", order.user_id).single();

    const email = authData?.user?.email;
    if (!email) {
      return NextResponse.json({ error: "User email not found" }, { status: 404 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ error: "Resend not configured" }, { status: 500 });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(resendKey);

    const name = profile?.display_name || `${profile?.last_name || ""} ${profile?.first_name || ""}`.trim() || "Customer";

    await resend.emails.send({
      from: "rt18_formula1 Shop <onboarding@resend.dev>",
      to: email,
      subject: `Your order has been shipped! #${orderId.slice(0, 8).toUpperCase()} - rt18_formula1`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <h1 style="font-size: 24px; margin: 0 0 16px;">Your order has been shipped!</h1>
        <p>Hi ${escapeHtml(name)},</p>
        <p>Great news! Your order <strong>#${escapeHtml(orderId.slice(0, 8).toUpperCase())}</strong> has been shipped.</p>
        <br>
        <p><strong>Tracking Number:</strong> ${escapeHtml(trackingNumber)}</p>
        <br>
        <p><strong>Shipping Address:</strong></p>
        <p>${addressHtml(order, name)}</p>
        <br>
        <p>You can check your order status at: <a href="https://rt18-formula1-official-site.vercel.app/shop/mypage">My Page</a></p>
        <br>
        <p>Thank you for your purchase!</p>
        <p style="color: #666;">rt18_formula1 Shop</p>
        </div>
      `,
    });

    await supabaseAdmin.from("orders")
      .update({ tracking_number: trackingNumber, status: "shipped" })
      .eq("id", orderId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Shipping notification error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
