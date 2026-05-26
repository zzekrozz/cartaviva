import type { ReactNode } from "react";
import { ImageIcon, Store } from "lucide-react";
import type { CartaVivaState } from "@/lib/cartaviva-data";
import type { ImageUploadContext } from "@/lib/image-tools";
import { ImageUploadField } from "@/components/cartaviva/ImageUploadField";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block rounded-[1.6rem] border border-[#eadfce] bg-white p-4 shadow-sm">
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
  return <textarea {...props} className={`min-h-24 w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-semibold leading-6 outline-none transition focus:border-[#e85d04] focus:bg-white ${props.className || ""}`} />;
}

export function RestaurantForm({ data, onChange, uploadContext, photosEnabled = true }: { data: CartaVivaState; onChange: (field: keyof CartaVivaState["restaurant"], value: string) => void; uploadContext?: Omit<ImageUploadContext, "folder">; photosEnabled?: boolean }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="rounded-[2rem] border border-[#eadfce] bg-[#fff9f1] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-[1.3rem] bg-white text-[#e85d04]"><Store size={22} /></span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#e85d04]">Identidad</p>
              <h3 className="text-2xl font-black text-[#221812]">Datos base del restaurante</h3>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium leading-7 text-[#6b594a]">Esto aparece en la cabecera de la carta pública: nombre, descripción, imagen, datos de contacto y color principal.</p>
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-[#eadfce] bg-white shadow-sm">
          <div className="relative h-40">
            {data.restaurant.coverUrl ? <img src={data.restaurant.coverUrl} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-[#fff1df] text-[#a3581c]"><ImageIcon /></div>}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">Preview portada</p>
              <p className="text-xl font-black">{data.restaurant.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre"><Input value={data.restaurant.name} onChange={(event) => onChange("name", event.target.value)} /></Field>
        <Field label="WhatsApp"><Input value={data.restaurant.whatsapp} onChange={(event) => onChange("whatsapp", event.target.value)} /></Field>
        <Field label="Descripción corta" hint="Una frase que venda el estilo del local."><Textarea value={data.restaurant.description} onChange={(event) => onChange("description", event.target.value)} /></Field>
        <ImageUploadField label="Logo o imagen del local" hint="Sube desde móvil/PC o pega una URL. Se optimiza antes de guardar." value={data.restaurant.logoUrl} onChange={(value) => onChange("logoUrl", value)} uploadContext={uploadContext ? { ...uploadContext, folder: "logos" } : undefined} maxWidth={900} disabled={!photosEnabled} disabledMessage="Las fotos están disponibles desde Menú Día. Puedes probarlo por 1 € el primer mes." />
        <ImageUploadField label="Foto de portada" hint="Imagen grande de cabecera. Ideal: sala, terraza o plato estrella." value={data.restaurant.coverUrl} onChange={(value) => onChange("coverUrl", value)} uploadContext={uploadContext ? { ...uploadContext, folder: "covers" } : undefined} maxWidth={1800} disabled={!photosEnabled} disabledMessage="Las fotos están disponibles desde Menú Día. Puedes probarlo por 1 € el primer mes." />
        <Field label="Teléfono"><Input value={data.restaurant.phone} onChange={(event) => onChange("phone", event.target.value)} /></Field>
        <Field label="Dirección"><Input value={data.restaurant.address} onChange={(event) => onChange("address", event.target.value)} /></Field>
        <Field label="Instagram"><Input value={data.restaurant.instagram} onChange={(event) => onChange("instagram", event.target.value)} /></Field>
        <Field label="Horario"><Input value={data.restaurant.schedule} onChange={(event) => onChange("schedule", event.target.value)} /></Field>
        <Field label="Color principal"><Input type="color" value={data.restaurant.primaryColor} onChange={(event) => onChange("primaryColor", event.target.value)} className="h-14 p-2" /></Field>
      </div>
    </div>
  );
}
