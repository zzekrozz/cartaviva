import type { ReactNode } from "react";
import type { CartaVivaState } from "@/lib/cartaviva-data";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#221812]">{label}</span>
      {children}
    </label>
  );
}

export function DailyMenuEditor({
  data,
  onChange
}: {
  data: CartaVivaState;
  onChange: <K extends keyof CartaVivaState["dailyMenu"]>(field: K, value: CartaVivaState["dailyMenu"][K]) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-[1.7rem] border border-[#eadfce] bg-[#fff7ee] p-4">
        <div>
          <p className="font-bold text-[#221812]">Activar menu del dia</p>
          <p className="text-sm text-[#6b594a]">Aparece arriba de la carta publica como bloque destacado.</p>
        </div>
        <button type="button" onClick={() => onChange("enabled", !data.dailyMenu.enabled)} className={`rounded-full px-4 py-2 text-sm font-bold ${data.dailyMenu.enabled ? "bg-[#e85d04] text-white" : "bg-white text-[#6b594a]"}`}>
          {data.dailyMenu.enabled ? "Activo" : "Inactivo"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Titulo"><input value={data.dailyMenu.title} onChange={(event) => onChange("title", event.target.value)} className="w-full rounded-2xl border border-[#eadfce] px-4 py-3 text-sm" /></Field>
        <Field label="Precio"><input value={data.dailyMenu.price} onChange={(event) => onChange("price", event.target.value)} className="w-full rounded-2xl border border-[#eadfce] px-4 py-3 text-sm" /></Field>
        <Field label="Dia o texto"><input value={data.dailyMenu.dayLabel} onChange={(event) => onChange("dayLabel", event.target.value)} className="w-full rounded-2xl border border-[#eadfce] px-4 py-3 text-sm" /></Field>
        <Field label="Horario"><input value={data.dailyMenu.schedule} onChange={(event) => onChange("schedule", event.target.value)} className="w-full rounded-2xl border border-[#eadfce] px-4 py-3 text-sm" /></Field>
        <Field label="Primeros"><textarea value={data.dailyMenu.starters} onChange={(event) => onChange("starters", event.target.value)} className="min-h-28 w-full rounded-2xl border border-[#eadfce] px-4 py-3 text-sm" /></Field>
        <Field label="Segundos"><textarea value={data.dailyMenu.mains} onChange={(event) => onChange("mains", event.target.value)} className="min-h-28 w-full rounded-2xl border border-[#eadfce] px-4 py-3 text-sm" /></Field>
        <Field label="Postres"><textarea value={data.dailyMenu.desserts} onChange={(event) => onChange("desserts", event.target.value)} className="min-h-28 w-full rounded-2xl border border-[#eadfce] px-4 py-3 text-sm" /></Field>
        <Field label="Nota"><textarea value={data.dailyMenu.note} onChange={(event) => onChange("note", event.target.value)} className="min-h-28 w-full rounded-2xl border border-[#eadfce] px-4 py-3 text-sm" /></Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center justify-between rounded-[1.6rem] border border-[#eadfce] bg-white p-4 font-bold">
          <span>Bebida incluida</span>
          <input type="checkbox" checked={data.dailyMenu.drinkIncluded} onChange={(event) => onChange("drinkIncluded", event.target.checked)} className="h-5 w-5" />
        </label>
        <label className="flex items-center justify-between rounded-[1.6rem] border border-[#eadfce] bg-white p-4 font-bold">
          <span>Mostrar fotos en menu del dia</span>
          <input type="checkbox" checked={data.dailyMenu.showImages} onChange={(event) => onChange("showImages", event.target.checked)} className="h-5 w-5" />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Foto principal del menu"><input value={data.dailyMenu.coverImage} onChange={(event) => onChange("coverImage", event.target.value)} className="w-full rounded-2xl border border-[#eadfce] px-4 py-3 text-sm" /></Field>
        <Field label="Foto primeros"><input value={data.dailyMenu.startersImage} onChange={(event) => onChange("startersImage", event.target.value)} className="w-full rounded-2xl border border-[#eadfce] px-4 py-3 text-sm" /></Field>
        <Field label="Foto segundos"><input value={data.dailyMenu.mainsImage} onChange={(event) => onChange("mainsImage", event.target.value)} className="w-full rounded-2xl border border-[#eadfce] px-4 py-3 text-sm" /></Field>
        <Field label="Foto postres"><input value={data.dailyMenu.dessertsImage} onChange={(event) => onChange("dessertsImage", event.target.value)} className="w-full rounded-2xl border border-[#eadfce] px-4 py-3 text-sm" /></Field>
      </div>
    </div>
  );
}
