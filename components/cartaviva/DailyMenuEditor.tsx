import { CalendarDays, Coffee, Eye, ImageIcon, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { FALLBACK_IMAGE, splitLines, type CartaVivaState } from "@/lib/cartaviva-data";
import type { ImageUploadContext } from "@/lib/image-tools";
import { ImageUploadField } from "@/components/cartaviva/ImageUploadField";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block rounded-[1.5rem] border border-[#eadfce] bg-white p-4 shadow-sm">
      <span className="mb-1 block text-sm font-black text-[#221812]">{label}</span>
      {hint ? <span className="mb-3 block text-xs font-semibold leading-5 text-[#8a796a]">{hint}</span> : null}
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#e85d04] focus:bg-white ${props.className || ""}`} />;
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`min-h-28 w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-semibold leading-6 outline-none transition focus:border-[#e85d04] focus:bg-white ${props.className || ""}`} />;
}

function PreviewBlock({ title, value }: { title: string; value: string }) {
  const items = splitLines(value);
  return (
    <div className="rounded-[1.3rem] border border-[#f1ddc5] bg-white p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#e85d04]">{title}</p>
      <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-[#5f4e42]">
        {items.slice(0, 4).map((item) => <li key={item}>• {item}</li>)}
        {!items.length ? <li className="text-[#a08d7d]">Añade opciones para esta parte.</li> : null}
      </ul>
    </div>
  );
}

export function DailyMenuEditor({
  data,
  onChange,
  uploadContext,
  photosEnabled = true
}: {
  data: CartaVivaState;
  onChange: <K extends keyof CartaVivaState["dailyMenu"]>(field: K, value: CartaVivaState["dailyMenu"][K]) => void;
  uploadContext?: Omit<ImageUploadContext, "folder">;
  photosEnabled?: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-[#eadfce] bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1fr_340px]">
          <div className="p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-[#fff1df] text-[#e85d04]"><CalendarDays size={22} /></span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.26em] text-[#e85d04]">Función estrella</p>
                  <h3 className="text-2xl font-black text-[#221812]">Menú del día destacado</h3>
                </div>
              </div>
              <button type="button" onClick={() => onChange("enabled", !data.dailyMenu.enabled)} className={`rounded-full px-5 py-3 text-sm font-black shadow-sm ${data.dailyMenu.enabled ? "bg-[#e85d04] text-white" : "bg-[#f1e7d8] text-[#6b594a]"}`}>
                {data.dailyMenu.enabled ? "Activo" : "Inactivo"}
              </button>
            </div>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-[#6b594a]">
              Pensado para bares y restaurantes que cambian la oferta a diario: precio arriba, bloques limpios y fotos opcionales sin obligar a subir imagen para todo.
            </p>
          </div>
          <div className="relative min-h-[230px] overflow-hidden bg-[#221812]">
            <img src={data.dailyMenu.coverImage || FALLBACK_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
            <div className="relative flex h-full flex-col justify-end p-5 text-white">
              <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-[#221812]">{data.dailyMenu.price}</span>
              <h4 className="mt-3 text-2xl font-black">{data.dailyMenu.title}</h4>
              <p className="text-sm font-semibold text-white/75">{data.dailyMenu.dayLabel} · {data.dailyMenu.schedule}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Título"><Input value={data.dailyMenu.title} onChange={(event) => onChange("title", event.target.value)} /></Field>
        <Field label="Precio"><Input value={data.dailyMenu.price} onChange={(event) => onChange("price", event.target.value)} /></Field>
        <Field label="Día o disponibilidad"><Input value={data.dailyMenu.dayLabel} onChange={(event) => onChange("dayLabel", event.target.value)} /></Field>
        <Field label="Horario"><Input value={data.dailyMenu.schedule} onChange={(event) => onChange("schedule", event.target.value)} /></Field>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Field label="Primeros" hint="Una opción por línea"><Textarea value={data.dailyMenu.starters} onChange={(event) => onChange("starters", event.target.value)} /></Field>
        <Field label="Segundos" hint="Una opción por línea"><Textarea value={data.dailyMenu.mains} onChange={(event) => onChange("mains", event.target.value)} /></Field>
        <Field label="Postres" hint="Una opción por línea"><Textarea value={data.dailyMenu.desserts} onChange={(event) => onChange("desserts", event.target.value)} /></Field>
      </div>

      <div className="rounded-[2rem] border border-[#eadfce] bg-[#fff7ee] p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#221812] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white">Primeros</span>
          <span className="rounded-full border border-[#f0d7b9] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#a3581c]">Segundos</span>
          <span className="rounded-full border border-[#f0d7b9] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#a3581c]">Postres</span>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          <PreviewBlock title="Primeros" value={data.dailyMenu.starters} />
          <PreviewBlock title="Segundos" value={data.dailyMenu.mains} />
          <PreviewBlock title="Postres" value={data.dailyMenu.desserts} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center justify-between rounded-[1.6rem] border border-[#eadfce] bg-white p-4 font-black text-[#221812] shadow-sm">
          <span className="flex items-center gap-2"><Coffee size={18} className="text-[#e85d04]" /> Bebida incluida</span>
          <input type="checkbox" checked={data.dailyMenu.drinkIncluded} onChange={(event) => onChange("drinkIncluded", event.target.checked)} className="h-5 w-5 accent-[#e85d04]" />
        </label>
        <label className="flex items-center justify-between rounded-[1.6rem] border border-[#eadfce] bg-white p-4 font-black text-[#221812] shadow-sm">
          <span className="flex items-center gap-2"><ImageIcon size={18} className="text-[#e85d04]" /> Mostrar fotos en menú del día</span>
          <input type="checkbox" checked={data.dailyMenu.showImages} onChange={(event) => onChange("showImages", event.target.checked)} className="h-5 w-5 accent-[#e85d04]" />
        </label>
      </div>

      <Field label="Nota del día" hint="Aparece al final del bloque destacado."><Textarea value={data.dailyMenu.note} onChange={(event) => onChange("note", event.target.value)} /></Field>

      <div className="grid gap-4 md:grid-cols-2">
        <ImageUploadField label="Foto principal del menú" hint="Opcional. Se usa como portada del bloque de menú del día." value={data.dailyMenu.coverImage} onChange={(value) => onChange("coverImage", value)} uploadContext={uploadContext ? { ...uploadContext, folder: "daily-menu/cover" } : undefined} maxWidth={1600} disabled={!photosEnabled} disabledMessage="Las fotos están disponibles desde Menú Día. Puedes probarlo por 1 € el primer mes." />
        <ImageUploadField label="Foto primeros" hint="Opcional." value={data.dailyMenu.startersImage} onChange={(value) => onChange("startersImage", value)} uploadContext={uploadContext ? { ...uploadContext, folder: "daily-menu/starters" } : undefined} maxWidth={1200} disabled={!photosEnabled} disabledMessage="Las fotos están disponibles desde Menú Día. Puedes probarlo por 1 € el primer mes." />
        <ImageUploadField label="Foto segundos" hint="Opcional." value={data.dailyMenu.mainsImage} onChange={(value) => onChange("mainsImage", value)} uploadContext={uploadContext ? { ...uploadContext, folder: "daily-menu/mains" } : undefined} maxWidth={1200} disabled={!photosEnabled} disabledMessage="Las fotos están disponibles desde Menú Día. Puedes probarlo por 1 € el primer mes." />
        <ImageUploadField label="Foto postres" hint="Opcional." value={data.dailyMenu.dessertsImage} onChange={(value) => onChange("dessertsImage", value)} uploadContext={uploadContext ? { ...uploadContext, folder: "daily-menu/desserts" } : undefined} maxWidth={1200} disabled={!photosEnabled} disabledMessage="Las fotos están disponibles desde Menú Día. Puedes probarlo por 1 € el primer mes." />
      </div>

      <div className="flex items-start gap-3 rounded-[1.6rem] border border-[#f0d7b9] bg-[#fff4e8] p-4 text-sm font-semibold leading-7 text-[#6b594a]">
        <Sparkles className="mt-1 shrink-0 text-[#e85d04]" size={18} />
        <p>En la carta pública el menú se muestra arriba como bloque visual. En móvil se lee con chips y tarjetas limpias, sin tres columnas estrechas.</p>
      </div>
    </div>
  );
}
