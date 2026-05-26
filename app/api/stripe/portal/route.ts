import { NextResponse } from "next/server";
import { createStripePortalSession } from "@/lib/stripe";
import { createServerAnonSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase/server";

async function userFromRequest(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const supabase = createServerAnonSupabaseClient(token);
  const { data, error } = await supabase.auth.getUser(token);
  if (error) return null;
  return data.user;
}

export async function POST(request: Request) {
  try {
    const user = await userFromRequest(request);
    if (!user) return NextResponse.json({ error: "Necesitas iniciar sesión." }, { status: 401 });
    const service = createServiceSupabaseClient();
    const { data: profile, error } = await service.from("profiles").select("stripe_customer_id").eq("id", user.id).single();
    if (error || !profile?.stripe_customer_id) return NextResponse.json({ error: "Todavía no hay cliente de Stripe vinculado." }, { status: 400 });
    const session = await createStripePortalSession(profile.stripe_customer_id);
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "No se pudo abrir el portal." }, { status: 400 });
  }
}
