"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, CreditCard, Gift, Loader2, MessageCircle } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { ORDERED_PLANS, PLAN_CONFIGS, displayPriceForInterval, type BillingInterval, type PlanId } from "@/lib/plan-config";
import { SetupRequestForm } from "@/components/cartaviva/SetupRequestForm";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/client";

const intervals: BillingInterval[] = ["monthly", "quarterly", "yearly"];
const labels: Record<BillingInterval, string> = { monthly: "Mensual", quarterly: "Trimestral", yearly: "Anual" };

export default function TryPage() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState("");

  async function startCheckout(plan: PlanId) {
    if (plan === "free") {
      window.location.href = "/builder?plan=free";
      return;
    }
    setLoading(`${plan}-${interval}`);
    setMessage("");
    try {
      if (!hasSupabaseConfig()) throw new Error("Configura Supabase antes de probar pagos reales.");
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        window.location.href = `/login?next=${encodeURIComponent(`/probar?plan=${plan}&billing=${interval}`)}`;
        return;
      }
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan, interval, trial: interval === "monthly" ? "one-euro" : "none" })
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "No se pudo abrir Stripe.");
      window.location.href = json.url;
    } catch (error: any) {
      setMessage(error?.message || "No se pudo abrir Stripe.");
    } finally {
      setLoading("");
    }
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-8 text-[#221812]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black shadow-sm"><ArrowLeft size={16} /> Volver</Link>
          <Link href="/montaje" className="inline-flex items-center gap-2 rounded-full bg-[#221812] px-4 py-2 text-sm font-black text-white"><MessageCircle size={16} /> Quiero que me la montéis</Link>
        </div>

        <section className="mt-8 rounded-[2.7rem] border border-[#eadfce] bg-white p-6 text-center shadow-sm md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#e85d04]">{BRAND_NAME}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Elige qué constructor quieres probar</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base font-medium leading-8 text-[#6b594a]">Probar el constructor es gratis. Cada plan desbloquea diferentes opciones. Puedes crear tu carta, ver cómo quedaría y decidir después.</p>
          <div className="mx-auto mt-8 flex max-w-xl rounded-full border border-[#eadfce] bg-[#fffaf3] p-1">
            {intervals.map((key) => <button key={key} onClick={() => setInterval(key)} className={`flex-1 rounded-full px-4 py-3 text-sm font-black ${interval === key ? "bg-[#221812] text-white" : "text-[#6b594a] hover:bg-white"}`}>{labels[key]}</button>)}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm font-black text-[#a3581c]">
            {interval === "monthly" ? <span className="rounded-full bg-[#fff4e8] px-4 py-2">Primer mes por 1 € + IVA</span> : null}
            {interval === "quarterly" ? <span className="rounded-full bg-[#fff4e8] px-4 py-2">Paga 2 meses y usa 3 · montaje lanzamiento</span> : null}
            {interval === "yearly" ? <span className="rounded-full bg-[#fff4e8] px-4 py-2">Paga 10 meses y usa 12 · montaje incluido</span> : null}
          </div>
        </section>

        {message ? <div className="mt-5 rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-black text-red-700">{message}</div> : null}

        <section className="mt-8 grid gap-5 lg:grid-cols-4">
          {ORDERED_PLANS.map((id) => {
            const plan = PLAN_CONFIGS[id];
            const paid = id !== "free";
            const key = `${id}-${interval}`;
            return (
              <article key={id} className={`relative rounded-[2rem] border p-6 shadow-sm ${plan.recommended ? "border-[#e85d04] bg-[#221812] text-white" : "border-[#eadfce] bg-white"}`}>
                {plan.recommended ? <span className="absolute -top-3 left-6 rounded-full bg-[#e85d04] px-4 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">Recomendado</span> : null}
                <h2 className="text-2xl font-black">{plan.name}</h2>
                <p className={`mt-2 min-h-16 text-sm font-semibold leading-7 ${plan.recommended ? "text-white/70" : "text-[#6b594a]"}`}>{plan.description}</p>
                <p className="mt-4 text-4xl font-black">{displayPriceForInterval(plan, interval)}</p>
                <p className={`mt-1 text-xs font-bold ${plan.recommended ? "text-white/60" : "text-[#7b6a5b]"}`}>{paid ? "+ IVA" : "Gratis para siempre"}</p>
                {paid && interval === "monthly" ? <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#fff4e8] px-3 py-2 text-xs font-black text-[#a3581c]"><CreditCard size={14} /> Primer mes por 1 €</p> : null}
                {paid && (interval === "quarterly" || interval === "yearly") ? <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#fff4e8] px-3 py-2 text-xs font-black text-[#a3581c]"><Gift size={14} /> Montaje inicial incluido</p> : null}
                <ul className="mt-6 space-y-3">
                  {plan.features.slice(0, 8).map((feature) => <li key={feature} className="flex gap-2 text-sm font-semibold leading-6"><Check size={17} className={plan.recommended ? "mt-0.5 shrink-0 text-orange-200" : "mt-0.5 shrink-0 text-[#e85d04]"} />{feature}</li>)}
                </ul>
                <button onClick={() => startCheckout(id)} disabled={loading === key} className={`mt-7 w-full rounded-full px-5 py-3 text-sm font-black ${plan.recommended ? "bg-white text-[#221812]" : "bg-[#221812] text-white"}`}>
                  {loading === key ? <span className="inline-flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Abriendo...</span> : paid ? (interval === "monthly" ? "Probar por 1 € el primer mes" : interval === "quarterly" ? "Empezar trimestral" : "Elegir anual") : "Empezar gratis"}
                </button>
              </article>
            );
          })}
        </section>

        <section className="mt-10"><SetupRequestForm compact /></section>
      </div>
    </main>
  );
}
