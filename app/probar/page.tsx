"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Gift, MessageCircle } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { ORDERED_PLANS, PLAN_CONFIGS, displayPriceForInterval, type BillingInterval } from "@/lib/plan-config";
import { SetupRequestForm } from "@/components/cartaviva/SetupRequestForm";

const intervals: BillingInterval[] = ["monthly", "quarterly", "yearly"];
const labels: Record<BillingInterval, string> = { monthly: "Mensual", quarterly: "Trimestral", yearly: "Anual" };

export default function TryPage() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");

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
          <p className="mx-auto mt-4 max-w-3xl text-base font-medium leading-8 text-[#6b594a]">Puedes construir tu carta gratis. Si te gusta cómo queda, activas el plan desde 1 € el primer mes.</p>
          <div className="mx-auto mt-8 flex max-w-xl rounded-full border border-[#eadfce] bg-[#fffaf3] p-1">
            {intervals.map((key) => <button key={key} onClick={() => setInterval(key)} className={`flex-1 rounded-full px-4 py-3 text-sm font-black ${interval === key ? "bg-[#221812] text-white" : "text-[#6b594a] hover:bg-white"}`}>{labels[key]}</button>)}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm font-black text-[#a3581c]">
            {interval === "monthly" ? <span className="rounded-full bg-[#fff4e8] px-4 py-2">Construye gratis · activa desde 1 € + IVA el primer mes</span> : null}
            {interval === "quarterly" ? <span className="rounded-full bg-[#fff4e8] px-4 py-2">Paga 2 meses y usa 3 · montaje lanzamiento</span> : null}
            {interval === "yearly" ? <span className="rounded-full bg-[#fff4e8] px-4 py-2">Paga 10 meses y usa 12 · montaje incluido</span> : null}
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-4">
          {ORDERED_PLANS.map((id) => {
            const plan = PLAN_CONFIGS[id];
            const paid = id !== "free";
            const href = id === "free"
              ? "/builder?plan=free"
              : `/builder?plan=${plan.urlValue}&trial=one-euro&billing=${interval}`;
            return (
              <article key={id} className={`relative rounded-[2rem] border p-6 shadow-sm ${plan.recommended ? "border-[#e85d04] bg-[#221812] text-white" : "border-[#eadfce] bg-white"}`}>
                {plan.recommended ? <span className="absolute -top-3 left-6 rounded-full bg-[#e85d04] px-4 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">Recomendado</span> : null}
                <h2 className="text-2xl font-black">{plan.name}</h2>
                <p className={`mt-2 min-h-16 text-sm font-semibold leading-7 ${plan.recommended ? "text-white/70" : "text-[#6b594a]"}`}>{plan.description}</p>
                {paid ? (
                  <>
                    <p className={`mt-4 text-sm font-black line-through ${plan.recommended ? "text-white/50" : "text-[#8a796a]"}`}>{plan.monthlyPrice} €/mes + IVA</p>
                    <p className="mt-1 text-4xl font-black">Primer mes: 1 € + IVA</p>
                    <p className={`mt-2 text-xs font-bold ${plan.recommended ? "text-white/70" : "text-[#7b6a5b]"}`}>Después: {displayPriceForInterval(plan, interval)} + IVA</p>
                  </>
                ) : (
                  <>
                    <p className="mt-4 text-4xl font-black">{displayPriceForInterval(plan, interval)}</p>
                    <p className={`mt-1 text-xs font-bold ${plan.recommended ? "text-white/60" : "text-[#7b6a5b]"}`}>Gratis para siempre</p>
                  </>
                )}
                {paid && (interval === "quarterly" || interval === "yearly") ? <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#fff4e8] px-3 py-2 text-xs font-black text-[#a3581c]"><Gift size={14} /> Montaje inicial incluido</p> : null}
                <ul className="mt-6 space-y-3">
                  {plan.features.slice(0, 8).map((feature) => <li key={feature} className="flex gap-2 text-sm font-semibold leading-6"><Check size={17} className={plan.recommended ? "mt-0.5 shrink-0 text-orange-200" : "mt-0.5 shrink-0 text-[#e85d04]"} />{feature}</li>)}
                </ul>
                <Link href={href} className={`mt-7 block w-full rounded-full px-5 py-3 text-center text-sm font-black ${plan.recommended ? "bg-white text-[#221812]" : "bg-[#221812] text-white"}`}>
                  Construir ahora gratis
                </Link>
                {paid ? <p className={`mt-3 text-center text-xs font-bold ${plan.recommended ? "text-white/70" : "text-[#7b6a5b]"}`}>Si te gusta cómo queda, puedes activar el plan desde 1 € el primer mes.</p> : null}
              </article>
            );
          })}
        </section>

        <section className="mt-10"><SetupRequestForm compact /></section>
      </div>
    </main>
  );
}
