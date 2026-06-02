import { planOptions, type PlanTier } from "@/lib/cartaviva-data";

const toneMap: Record<PlanTier, string> = {
  free: "bg-stone-200 text-stone-700",
  "menu-day": "bg-orange-100 text-orange-800",
  "carta-visual": "bg-[#221812] text-white",
  "restaurant-pro": "bg-emerald-100 text-emerald-800"
};

export function PlanBadge({ plan }: { plan: PlanTier }) {
  const label = planOptions.find((item) => item.value === plan)?.label || plan;
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${toneMap[plan]}`}>{label}</span>;
}
