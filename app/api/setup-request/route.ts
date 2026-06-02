import { NextResponse } from "next/server";
import { BRAND_NAME } from "@/lib/brand";
import { createServiceSupabaseClient, createServerAnonSupabaseClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/sendEmail";
import { setupRequestAdminEmail, setupRequestReceivedEmail } from "@/lib/email/templates";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = {
      restaurant_name: clean(body.restaurant_name),
      contact_name: clean(body.contact_name),
      whatsapp: clean(body.whatsapp),
      email: clean(body.email),
      city: clean(body.city),
      interested_plan: clean(body.interested_plan) || "carta-visual",
      current_menu_url: clean(body.current_menu_url),
      notes: clean(body.notes),
      status: "new"
    };

    if (!payload.restaurant_name || !payload.whatsapp) {
      return NextResponse.json({ error: "Nombre del restaurante y WhatsApp son obligatorios." }, { status: 400 });
    }

    const auth = request.headers.get("authorization") || "";
    const token = auth.replace("Bearer ", "");
    let userId: string | null = null;
    if (token) {
      const anon = createServerAnonSupabaseClient(token);
      const { data } = await anon.auth.getUser(token).catch(() => ({ data: { user: null } } as any));
      userId = data?.user?.id || null;
    }
    const supabase = createServiceSupabaseClient();
    const { error } = await supabase.from("setup_requests").insert({ ...payload, user_id: userId });
    if (error && error.code !== "42P01") throw error;

    const support = process.env.SUPPORT_EMAIL || process.env.RESEND_FROM_EMAIL || "";
    if (payload.email) {
      await sendEmail({ to: payload.email, subject: `Hemos recibido tu solicitud para montar tu carta`, html: setupRequestReceivedEmail({ brandName: BRAND_NAME, restaurantName: payload.restaurant_name }) });
    }
    if (support) {
      await sendEmail({ to: support, subject: `Nueva solicitud de montaje en ${BRAND_NAME}`, html: setupRequestAdminEmail({ brandName: BRAND_NAME, payload }) });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "No se pudo guardar la solicitud." }, { status: 500 });
  }
}
