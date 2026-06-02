"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Gift, MessageCircle } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { ORDERED_PLANS, PLAN_CONFIGS, displayRecurringPrice, type BillingInterval } from "@/lib/plan-config";
import { SetupRequestForm } from "@/components/cartaviva/SetupRequestForm";

const intervals: BillingInterval[] = ["monthly", "quarterly", "yearly"];
const labels: Record<BillingInterval, string> = { monthly: "Mensual", quarterly: "Trimestral", yearly: "Anual" };

function TrialCallout({ recurringPrice }: { recurringPrice: string }) {
  return (
    <div className="mt-4 rounded-[1.45rem] border border-[#f3d7bc] bg-[#fff7ee] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#a3581c]">Primer mes</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-[#221812]">1 € + IVA</p>
      <p className="mt-2 text-xs font-bold text-[#7b6a5b]">Después {recurringPrice} + IVA.</p>
    </div>
  );
}

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
          <p className="mx-auto mt-4 max-w-3xl text-base font-medium leading-8 text-[#6b594a]">Puedes construir tu carta gratis. Si te gusta cómo queda, activas el plan por 1 € + IVA el primer mes.</p>
          <div className="mx-auto mt-8 flex max-w-xl rounded-full border border-[#eadfce] bg-[#fffaf3] p-1">
            {intervals.map((key) => (
              <button key={key} onClick={() => setInterval(key)} className={`flex-1 rounded-full px-4 py-3 text-sm font-black ${interval === key ? "bg-[#221812] text-white" : "text-[#6b594a] hover:bg-white"}`}>
                {labels[key]}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm font-black text-[#a3581c]">
            {interval === "monthly" ? <span className="rounded-full bg-[#fff4e8] px-4 py-2">Construyes gratis y activas por 1 € + IVA el primer mes</span> : null}
            {interval === "quarterly" ? <span className="rounded-full bg-[#fff4e8] px-4 py-2">Paga 2 meses y usa 3</span> : null}
            {interval === "yearly" ? <span className="rounded-full bg-[#fff4e8] px-4 py-2">Paga 10 meses y usa 12</span> : null}
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
              <article key={id} className={`relative flex flex-col rounded-[2rem] border p-6 shadow-sm ${plan.recommended ? "border-[#e85d04] bg-[#221812] text-white shadow-[0_28px_80px_rgba(232,93,4,0.16)]" : "border-[#eadfce] bg-white"}`}>
                {plan.recommended ? <span className="absolute -top-3 left-6 rounded-full bg-[#e85d04] px-4 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">Recomendado</span> : null}
                <div className="min-h-[126px]">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-black">{plan.name}</h2>
                    {paid ? <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${plan.recommended ? "bg-white/12 text-orange-100" : "bg-[#fff4e8] text-[#a3581c]"}`}>{interval === "monthly" ? "Prueba premium" : interval === "quarterly" ? "2 x 3" : "10 x 12"}</span> : null}
                  </div>
                  <p className={`mt-3 text-sm font-semibold leading-7 ${plan.recommended ? "text-white/72" : "text-[#6b594a]"}`}>{plan.description}</p>
                </div>

                <div className="mt-5 min-h-[170px]">
                  {paid ? (
                    <>
                      <p className={`text-sm font-black line-through ${plan.recommended ? "text-white/50" : "text-[#8a796a]"}`}>{plan.monthlyPrice} €/mes + IVA</p>
                      <TrialCallout recurringPrice={displayRecurringPrice(plan, interval)} />
                    </>
                  ) : (
                    <div className="rounded-[1.45rem] border border-[#eadfce] bg-[#fffdf9] p-4">
                      <p className="text-4xl font-black">{displayRecurringPrice(plan, interval)}</p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[#6b594a]">Logo y portada incluidos para que la prueba ya se vea profesional.</p>
                    </div>
                  )}
                  {paid && (interval === "quarterly" || interval === "yearly") ? <p className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${plan.recommended ? "bg-white/10 text-orange-100" : "bg-[#fff4e8] text-[#a3581c]"}`}><Gift size={14} /> Montaje inicial incluido</p> : null}
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.slice(0, 8).map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm font-semibold leading-6">
                      <Check size={17} className={plan.recommended ? "mt-0.5 shrink-0 text-orange-200" : "mt-0.5 shrink-0 text-[#e85d04]"} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 space-y-3">
                  <Link href={href} className={`block w-full rounded-full px-5 py-3 text-center text-sm font-black ${plan.recommended ? "bg-white text-[#221812]" : "bg-[#221812] text-white"}`}>
                    {paid ? "Construir gratis" : "Empezar gratis"}
                  </Link>
                  <p className={`min-h-[36px] text-center text-xs font-bold ${plan.recommended ? "text-white/72" : "text-[#7b6a5b]"}`}>
                    {paid ? "Si te gusta cómo queda, actívalo por 1 € el primer mes." : "Sin pago, sin tarjeta y con logo y portada incluidos."}
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-10"><SetupRequestForm compact /></section>
      </div>
    </main>
  );
}
