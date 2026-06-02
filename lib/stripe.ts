import Stripe from "stripe";
import { getAutomaticCouponId, getTrialPriceId, type BillingInterval, type PlanId } from "@/lib/plan-config";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Falta STRIPE_SECRET_KEY");
  return new Stripe(key, { apiVersion: "2024-06-20" });
}

export function getPriceId(plan: PlanId, interval: BillingInterval, trial?: string | null) {
  const normalized = plan;
  if (trial === "one-euro" && interval === "monthly") {
    const trialPriceId = getTrialPriceId(normalized);
    if (trialPriceId) return trialPriceId;
  }
  if (normalized === "menu-day") {
    if (interval === "quarterly") return process.env.STRIPE_PRICE_MENU_DAY_QUARTERLY;
    if (interval === "yearly") return process.env.STRIPE_PRICE_MENU_DAY_YEARLY;
    return process.env.STRIPE_PRICE_MENU_DAY_MONTHLY;
  }
  if (normalized === "carta-visual") {
    if (interval === "quarterly") return process.env.STRIPE_PRICE_VISUAL_QUARTERLY;
    if (interval === "yearly") return process.env.STRIPE_PRICE_VISUAL_YEARLY;
    return process.env.STRIPE_PRICE_VISUAL_MONTHLY;
  }
  if (normalized === "restaurant-pro") {
    if (interval === "quarterly") return process.env.STRIPE_PRICE_PRO_QUARTERLY;
    if (interval === "yearly") return process.env.STRIPE_PRICE_PRO_YEARLY;
    return process.env.STRIPE_PRICE_PRO_MONTHLY;
  }
  return null;
}

export function getCheckoutDiscount(plan: PlanId, interval: BillingInterval, trial?: string | null) {
  if (trial !== "one-euro" || interval !== "monthly") return undefined;
  const coupon = getAutomaticCouponId(plan);
  if (!coupon) return undefined;
  return [{ coupon }];
}

export async function createStripePortalSession(customerId: string) {
  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return stripe.billingPortal.sessions.create({ customer: customerId, return_url: `${appUrl}/dashboard` });
}

export function verifyStripeSignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false;
  try {
    const stripe = getStripe();
    stripe.webhooks.constructEvent(rawBody, signature, secret);
    return true;
  } catch {
    return false;
  }
}
