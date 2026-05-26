import Link from "next/link";
import { BadgeEuro, CalendarCheck2, Coffee, Gift, Sparkles } from "lucide-react";
import { discountedMonthlyPrice, getPlanConfig, type TrialType } from "@/lib/plan-config";
import type { CartaVivaState } from "@/lib/cartaviva-data";

type Props = {
  data: CartaVivaState;
  trialType?: TrialType;
  compact?: boolean;
};

export function TrialPlanBanner({ data, trialType = "none", compact = false }: Props) {
  const plan = getPlanConfig(data.settings.plan);
  const isPaidTrial = trialType === "one-euro" && data.settings.plan !== "free";

  return (
    <div className={`overflow-hidden rounded-[1.8rem] border border-[#eadfce] bg-white shadow-sm ${compact ? "p-4" : "p-5"}`}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.25rem] bg-[#fff1df] text-[#e85d04]">
            {isPaidTrial ? <BadgeEuro size={21} /> : <Gift size={21} />}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#e85d04]">Plan actual</p>
              {plan.recommended ? <span className="rounded-full bg-[#221812] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-white">Recomendado</span> : null}
            </div>
            <h3 className="mt-1 text-2xl font-black text-[#221812]">
              {plan.name}{isPaidTrial ? " en prueba" : ""}
            </h3>
            <p className="mt-1 text-sm font-semibold leading-6 text-[#6b594a]">
              {data.settings.plan === "free"
                ? `Plan Gratis: ${plan.builderSummary}`
                : isPaidTrial
                  ? `${plan.name} en prueba: primer mes por 1 €. Luego ${plan.monthlyPrice} €/mes + IVA.`
                  : `${plan.name}: ${plan.builderSummary}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/probar" className="rounded-full bg-[#221812] px-4 py-2 text-sm font-black text-white">Ver planes</Link>
          {data.settings.plan !== "free" ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1df] px-4 py-2 text-sm font-black text-[#a3581c]"><CalendarCheck2 size={15} /> Anual: 2 meses gratis</span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1df] px-4 py-2 text-sm font-black text-[#a3581c]"><Coffee size={15} /> Desde 0,52 €/día</span>
          )}
        </div>
      </div>

      {isPaidTrial ? (
        <div className="mt-4 rounded-[1.4rem] bg-[#fff7ee] p-4">
          <p className="flex items-center gap-2 text-sm font-black text-[#221812]"><Sparkles size={16} className="text-[#e85d04]" /> Oferta de bienvenida</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-[#6b594a]">
            Continúa antes de que termine tu primer mes y consigue 50% de descuento durante 3 meses:
            <span className="ml-1 font-black text-[#221812]">{discountedMonthlyPrice(data.settings.plan)} €/mes + IVA</span> durante ese periodo.
          </p>
        </div>
      ) : null}
    </div>
  );
}
