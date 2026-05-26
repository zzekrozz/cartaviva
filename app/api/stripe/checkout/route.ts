import { NextResponse } from "next/server";
import { createServerAnonSupabaseClient } from "@/lib/supabase/server";
import { getPriceId, getStripe } from "@/lib/stripe";
import { toBillingInterval, toPlanTier } from "@/lib/plan-config";

export async function POST(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.replace("Bearer ", "");
    const supabase = createServerAnonSupabaseClient(token || undefined);
    const { data, error } = await supabase.auth.getUser(token || undefined);
    if (error || !data.user) return NextResponse.json({ error: "Necesitas iniciar sesión." }, { status: 401 });

    const body = await request.json();
    const plan = toPlanTier(body.plan);
    const interval = toBillingInterval(body.interval);
    const trial = body.trial === "one-euro" ? "one-euro" : "none";
    if (plan === "free") return NextResponse.json({ error: "El plan gratis no necesita checkout." }, { status: 400 });

    const priceId = getPriceId(plan, interval, trial);
    if (!priceId) return NextResponse.json({ error: `Falta Price ID de Stripe para ${plan} ${interval}.` }, { status: 400 });

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const { data: profile } = await supabase.from("profiles").select("stripe_customer_id,email").eq("id", data.user.id).maybeSingle();

    let customerId = profile?.stripe_customer_id as string | undefined;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: data.user.email || profile?.email || undefined, metadata: { user_id: data.user.id } });
      customerId = customer.id;
      await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", data.user.id);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/probar?checkout=cancelled`,
      metadata: { user_id: data.user.id, selected_plan: plan, billing_interval: interval, trial_type: trial },
      subscription_data: { metadata: { user_id: data.user.id, selected_plan: plan, billing_interval: interval, trial_type: trial } },
      allow_promotion_codes: true
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "No se pudo crear el checkout." }, { status: 500 });
  }
}
