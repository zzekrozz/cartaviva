"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Coffee, Gift, Sparkles } from "lucide-react";
import { ORDERED_PLANS, PLAN_CONFIGS, displayRecurringPrice, type BillingInterval } from "@/lib/plan-config";

const intervalCopy: Record<BillingInterval, { label: string; eyebrow: string; note: string }> = {
  monthly: { label: "Mensual", eyebrow: "Prueba cualquier plan sin pagar antes", note: "Construyes gratis y, si te encaja, lo activas por 1 € + IVA el primer mes." },
  quarterly: { label: "Trimestral", eyebrow: "Paga 2 y usa 3", note: "Buena opción para dejarla montada y probarla ya con el restaurante." },
  yearly: { label: "Anual", eyebrow: "Paga 10 y usa 12", note: "La mejor tarifa cuando ya quieres dejarla funcionando todo el año." },
};

function TrialBubble({ planName }: { planName: string }) {
  return (
    <div className="rounded-[1.55rem] border border-[#f3d7bc] bg-[#fff7ee] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#a3581c]">Primer mes</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-[#221812]">1 € + IVA</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#6b594a]">Activas {planName.toLowerCase()} solo si te convence cómo queda.</p>
    </div>
  );
}

export function PricingSection({ defaultInterval = "monthly" }: { defaultInterval?: BillingInterval }) {
  const [interval, setInterval] = useState<BillingInterval>(defaultInterval);

  return (
    <section id="precios" className="mx-auto max-w-7xl px-4 py-20 text-[#221812]">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-[#e85d04]">Precios</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Planes pensados para vender bien desde la primera demo</h2>
        <p className="mt-4 text-base font-medium leading-8 text-[#6b594a]">El mensaje principal es simple: construyes gratis, enseñas el resultado y activas el plan por 1 € + IVA el primer mes si te encaja.</p>
      </div>

      <div className="mx-auto mt-8 flex max-w-xl rounded-full border border-[#eadfce] bg-white p-1 shadow-sm">
        {(Object.keys(intervalCopy) as BillingInterval[]).map((key) => (
          <button key={key} type="button" onClick={() => setInterval(key)} className={`flex-1 rounded-full px-4 py-3 text-sm font-black transition ${interval === key ? "bg-[#221812] text-white" : "text-[#6b594a] hover:bg-[#fff4e8]"}`}>{intervalCopy[key].label}</button>
        ))}
      </div>
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm font-bold text-[#7b6a5b]"><span className="text-[#e85d04]">{intervalCopy[interval].eyebrow}.</span> {intervalCopy[interval].note}</p>

      <div className="mt-10 grid gap-5 lg:grid-cols-4">
        {ORDERED_PLANS.map((id) => {
          const plan = PLAN_CONFIGS[id];
          const paid = id !== "free";
          const href = paid ? `/builder?plan=${plan.urlValue}&trial=one-euro&billing=${interval}` : "/builder?plan=free";

          return (
            <article key={id} className={`relative flex h-full flex-col rounded-[2.1rem] border p-6 shadow-sm ${plan.recommended ? "border-[#e85d04] bg-[#221812] text-white shadow-[0_28px_80px_rgba(232,93,4,0.16)]" : "border-[#eadfce] bg-white text-[#221812]"}`}>
              {plan.recommended ? <span className="absolute -top-3 left-6 rounded-full bg-[#e85d04] px-4 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white">Recomendado</span> : null}

              <div className="min-h-[120px]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-black">{plan.name}</h3>
                    <p className={`mt-3 text-sm font-semibold leading-7 ${plan.recommended ? "text-white/72" : "text-[#6b594a]"}`}>{plan.description}</p>
                  </div>
                  {paid ? <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${plan.recommended ? "bg-white/12 text-orange-100" : "bg-[#fff4e8] text-[#a3581c]"}`}>{interval === "monthly" ? "Prueba premium" : interval === "quarterly" ? "2 x 3" : "10 x 12"}</span> : null}
                </div>
              </div>

              <div className="mt-5 min-h-[170px]">
                {paid ? (
                  <div className="space-y-4">
                    <p className={`text-sm font-black line-through ${plan.recommended ? "text-white/50" : "text-[#8a796a]"}`}>{plan.monthlyPrice} €/mes + IVA</p>
                    <TrialBubble planName={plan.name} />
                    <p className={`text-xs font-bold ${plan.recommended ? "text-white/72" : "text-[#7b6a5b]"}`}>Después {displayRecurringPrice(plan, interval)} + IVA.</p>
                  </div>
                ) : (
                  <div className="flex h-full flex-col justify-between rounded-[1.55rem] border border-[#eadfce] bg-[#fffdf9] p-4">
                    <div>
                      <p className="text-4xl font-black tracking-tight">{displayRecurringPrice(plan, interval)}</p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[#6b594a]">Logo y portada incluidos para que la demo ya se vea como un negocio real.</p>
                    </div>
                    <p className="text-xs font-bold text-[#7b6a5b]">Gratis para siempre</p>
                  </div>
                )}
                {paid && interval === "yearly" ? <p className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${plan.recommended ? "bg-white/10 text-orange-100" : "bg-[#fff4e8] text-[#a3581c]"}`}><Coffee size={14} /> {plan.annualDailyCost}</p> : null}
                {paid && interval === "quarterly" ? <p className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${plan.recommended ? "bg-white/10 text-orange-100" : "bg-[#fff4e8] text-[#a3581c]"}`}><Gift size={14} /> Montaje inicial incluido en lanzamiento</p> : null}
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm font-semibold leading-6">
                    <Check size={17} className={plan.recommended ? "mt-0.5 shrink-0 text-orange-200" : "mt-0.5 shrink-0 text-[#e85d04]"} />
                    <span>{feature}</span>
                  </li>
                ))}
                {id === "restaurant-pro" ? (
                  <li className="flex gap-2 text-sm font-semibold leading-6">
                    <Sparkles size={17} className="mt-0.5 shrink-0 text-orange-200" />
                    <span>Si necesitas más de 150 productos: consultar</span>
                  </li>
                ) : null}
              </ul>

              <div className="mt-8 space-y-3">
                <Link href={href} className={`block rounded-full px-5 py-3 text-center text-sm font-black ${plan.recommended ? "bg-white text-[#221812]" : "bg-[#221812] text-white"}`}>
                  {paid ? "Construir gratis" : "Empezar gratis"}
                </Link>
                <p className={`min-h-[36px] text-center text-xs font-bold ${plan.recommended ? "text-white/72" : "text-[#7b6a5b]"}`}>
                  {paid ? "Si te gusta cómo queda, actívalo por 1 € el primer mes." : "Empieza gratis y cambia de plan cuando quieras."}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 rounded-[2rem] border border-orange-200 bg-[#fff4e8] p-6 md:grid-cols-3">
        <p className="text-sm font-black text-[#a3581c]">Planes de pago: activación por 1 € + IVA el primer mes.</p>
        <p className="text-sm font-black text-[#a3581c]">Trimestral: paga 2 meses y usa 3.</p>
        <p className="text-sm font-black text-[#a3581c]">Anual: paga 10 meses y usa 12.</p>
      </div>
    </section>
  );
}
