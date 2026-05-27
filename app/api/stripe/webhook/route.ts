import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { verifyStripeSignature } from "@/lib/stripe";
import { sendEmail } from "@/lib/email/sendEmail";
import { subscriptionActiveEmail, paymentFailedEmail } from "@/lib/email/templates";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (secret && !verifyStripeSignature(rawBody, request.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "Firma de Stripe no válida." }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  const object = event.data?.object || {};
  const metadata = object.metadata || object.subscription_details?.metadata || {};
  const userId = metadata.user_id;
  const selectedPlan = metadata.selected_plan;
  const billingInterval = metadata.billing_interval;

  async function updateProfile(extra: Record<string, any>) {
    if (!userId) return;
    await supabase.from("profiles").update({ ...extra, updated_at: new Date().toISOString() }).eq("id", userId);
  }

  if (event.type === "checkout.session.completed") {
    await updateProfile({
      stripe_customer_id: object.customer,
      stripe_subscription_id: object.subscription,
      subscription_status: "active",
      selected_plan: selectedPlan,
      billing_interval: billingInterval,
      trial_type: metadata.trial_type || null
    });
    if (object.customer_email) await sendEmail(subscriptionActiveEmail(object.customer_email, selectedPlan));
  }

  if (["customer.subscription.created", "customer.subscription.updated"].includes(event.type)) {
    const sub = object;
    await updateProfile({
      stripe_customer_id: sub.customer,
      stripe_subscription_id: sub.id,
      subscription_status: sub.status,
      current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
      selected_plan: selectedPlan || sub.metadata?.selected_plan,
      billing_interval: billingInterval || sub.metadata?.billing_interval
    });
  }

  if (event.type === "customer.subscription.deleted") {
    await updateProfile({ subscription_status: "canceled", selected_plan: "free", billing_interval: null, current_period_end: null });
  }

  if (event.type === "invoice.payment_failed") {
    const customerId = object.customer;
    const { data: profile } = await supabase.from("profiles").select("id,email").eq("stripe_customer_id", customerId).maybeSingle();
    if (profile?.id) await supabase.from("profiles").update({ subscription_status: "past_due", updated_at: new Date().toISOString() }).eq("id", profile.id);
    if (profile?.email) await sendEmail(paymentFailedEmail(profile.email));
  }

  return NextResponse.json({ received: true });
}
