"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Coffee, Gift, Sparkles } from "lucide-react";
import { ORDERED_PLANS, PLAN_CONFIGS, displayPriceForInterval, type BillingInterval } from "@/lib/plan-config";

const intervalCopy: Record<BillingInterval, { label: string; eyebrow: string; note: string }> = {
  monthly: { label: "Mensual", eyebrow: "Primer mes por 1 €", note: "Pago mes a mes. Ideal para probar con flexibilidad." },
  quarterly: { label: "Trimestral", eyebrow: "Paga 2 y usa 3", note: "Montaje inicial incluido durante lanzamiento. La mejor opción para dejarla lista." },
  yearly: { label: "Anual", eyebrow: "Paga 10 y usa 12", note: "2 meses gratis al pagar anual y montaje inicial incluido." }
};

export function PricingSection({ defaultInterval = "monthly" }: { defaultInterval?: BillingInterval }) {
  const [interval, setInterval] = useState<BillingInterval>(defaultInterval);

  return (
    <section id="precios" className="mx-auto max-w-7xl px-4 py-20 text-[#221812]">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-[#e85d04]">Precios</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Planes para empezar pequeño y crecer sin rehacer tu carta</h2>
        <p className="mt-4 text-base font-medium leading-8 text-[#6b594a]">Gratis para siempre, primer mes por 1 € en planes de pago y opciones trimestrales o anuales para incluir montaje inicial.</p>
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
            <article key={id} className={`relative flex flex-col rounded-[2rem] border p-6 shadow-sm ${plan.recommended ? "border-[#e85d04] bg-[#221812] text-white" : "border-[#eadfce] bg-white text-[#221812]"}`}>
              {plan.recommended ? <span className="absolute -top-3 left-6 rounded-full bg-[#e85d04] px-4 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">Recomendado</span> : null}
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl font-black">{plan.name}</h3>
                {paid ? <span className={`rounded-full px-3 py-1 text-xs font-black ${plan.recommended ? "bg-white/10 text-orange-100" : "bg-[#fff4e8] text-[#a3581c]"}`}>{interval === "monthly" ? "1 € primer mes" : interval === "quarterly" ? "2x3" : "10x12"}</span> : null}
              </div>
              <p className={`mt-3 text-sm font-semibold leading-7 ${plan.recommended ? "text-white/70" : "text-[#6b594a]"}`}>{plan.description}</p>
              <div className="mt-5">
                <p className="text-4xl font-black tracking-tight">{displayPriceForInterval(plan, interval)}</p>
                {paid ? <p className={`mt-1 text-xs font-bold ${plan.recommended ? "text-white/60" : "text-[#7b6a5b]"}`}>+ IVA · mensual: {plan.monthlyPrice} €/mes</p> : <p className={`mt-1 text-xs font-bold ${plan.recommended ? "text-white/60" : "text-[#7b6a5b]"}`}>Gratis para siempre</p>}
                {paid && interval === "yearly" ? <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#fff4e8] px-3 py-2 text-xs font-black text-[#a3581c]"><Coffee size={14} /> {plan.annualDailyCost} · menos que un café</p> : null}
                {paid && interval === "quarterly" ? <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#fff4e8] px-3 py-2 text-xs font-black text-[#a3581c]"><Gift size={14} /> Montaje inicial incluido en lanzamiento</p> : null}
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => <li key={feature} className="flex gap-2 text-sm font-semibold leading-6"><Check size={17} className={plan.recommended ? "mt-0.5 shrink-0 text-orange-200" : "mt-0.5 shrink-0 text-[#e85d04]"} />{feature}</li>)}
                {id === "restaurant-pro" ? <li className="flex gap-2 text-sm font-semibold leading-6"><Sparkles size={17} className="mt-0.5 shrink-0 text-orange-200" />Si necesitas más de 150 productos: consultar</li> : null}
              </ul>
              <Link href={href} className={`mt-7 rounded-full px-5 py-3 text-center text-sm font-black ${plan.recommended ? "bg-white text-[#221812]" : "bg-[#221812] text-white"}`}>{paid ? plan.cta : "Empezar gratis"}</Link>
            </article>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 rounded-[2rem] border border-orange-200 bg-[#fff4e8] p-6 md:grid-cols-3">
        <p className="text-sm font-black text-[#a3581c]">Primer mes por 1 € en planes de pago.</p>
        <p className="text-sm font-black text-[#a3581c]">Trimestral: paga 2 meses y usa 3.</p>
        <p className="text-sm font-black text-[#a3581c]">Próximamente: estadísticas avanzadas y QR por mesa.</p>
      </div>
    </section>
  );
}
