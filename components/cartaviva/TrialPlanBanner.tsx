import Link from "next/link";
import { BadgeEuro, CalendarCheck2, Gift } from "lucide-react";
import { displayRecurringPrice, getPlanConfig, type TrialType } from "@/lib/plan-config";
import type { CartaVivaState } from "@/lib/cartaviva-data";

type Props = {
  data: CartaVivaState;
  trialType?: TrialType;
  compact?: boolean;
};

export function TrialPlanBanner({ data, trialType = "none", compact = false }: Props) {
  const plan = getPlanConfig(data.settings.plan);
  const isPaidTrial = trialType === "one-euro" && data.settings.plan !== "free";
  const recurringPrice = displayRecurringPrice(plan, "monthly");

  return (
    <div className={`overflow-hidden rounded-[1.9rem] border border-[#eadfce] bg-white shadow-sm ${compact ? "p-4" : "p-5"}`}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.25rem] bg-[#fff1df] text-[#e85d04]">
            {isPaidTrial ? <BadgeEuro size={21} /> : <Gift size={21} />}
          </span>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#e85d04]">Plan actual</p>
            <h3 className="mt-1 text-2xl font-black text-[#221812]">
              {plan.name}
              {isPaidTrial ? " en prueba" : ""}
            </h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#6b594a]">
              {data.settings.plan === "free"
                ? "Plan gratis activo. Puedes construir con logo y portada, enseñar la demo y activar un plan de pago cuando lo necesites."
                : `Puedes construir gratis y activar este plan por 1 € + IVA el primer mes. Después ${recurringPrice} + IVA.`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isPaidTrial ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1df] px-4 py-2 text-sm font-black text-[#a3581c]">
              <CalendarCheck2 size={15} />
              Primer mes por 1 € + IVA
            </span>
          ) : null}
          <Link href="/probar" className="rounded-full bg-[#221812] px-4 py-2 text-sm font-black text-white">Ver planes</Link>
          {data.settings.plan !== "free" ? (
            <Link href="/dashboard" className="rounded-full bg-[#e85d04] px-4 py-2 text-sm font-black text-white">Activar por 1 €</Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
