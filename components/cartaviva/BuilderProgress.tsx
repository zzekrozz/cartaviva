import { CheckCircle2, CircleAlert } from "lucide-react";
import type { CartaVivaState } from "@/lib/cartaviva-data";

export function getBuilderProgress(data: CartaVivaState) {
  const checks = [
    { label: "Nombre", done: Boolean(data.restaurant.name?.trim()) },
    { label: "Diseño", done: Boolean(data.restaurant.template) },
    { label: "Carta con productos", done: data.categories.length >= 1 && data.products.length >= 3 },
    { label: "Imagen principal", done: Boolean(data.restaurant.coverUrl) },
    { label: "Publicar", done: Boolean(data.published) }
  ];
  const done = checks.filter((item) => item.done).length;
  const percent = Math.round((done / checks.length) * 100);
  return { checks, percent };
}

export function BuilderProgress({ data }: { data: CartaVivaState }) {
  const { checks, percent } = getBuilderProgress(data);
  return (
    <section className="rounded-[1.7rem] border border-[#eadfce] bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#e85d04]">Progreso</p>
          <h2 className="mt-1 text-2xl font-black text-[#221812]">Tu carta está al {percent}%</h2>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-[#f1e7d8] md:w-64">
          <div className="h-full rounded-full bg-[#e85d04] transition-all" style={{ width: `${percent}%` }} />
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {checks.map((check) => (
          <div key={check.label} className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${check.done ? "bg-[#effaf1] text-[#21663b]" : "bg-[#fff4e8] text-[#a3581c]"}`}>
            {check.done ? <CheckCircle2 size={15} /> : <CircleAlert size={15} />}
            {check.done ? check.label : `Falta ${check.label.toLowerCase()}`}
          </div>
        ))}
      </div>
    </section>
  );
}
