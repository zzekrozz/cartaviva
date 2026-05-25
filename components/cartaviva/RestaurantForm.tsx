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

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm outline-none focus:border-[#e85d04] ${props.className || ""}`} />;
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`min-h-24 w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm outline-none focus:border-[#e85d04] ${props.className || ""}`} />;
}

export function RestaurantForm({
  data,
  onChange
}: {
  data: CartaVivaState;
  onChange: (field: keyof CartaVivaState["restaurant"], value: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Nombre">
        <Input value={data.restaurant.name} onChange={(event) => onChange("name", event.target.value)} />
      </Field>
      <Field label="WhatsApp">
        <Input value={data.restaurant.whatsapp} onChange={(event) => onChange("whatsapp", event.target.value)} />
      </Field>
      <Field label="Descripcion corta">
        <Textarea value={data.restaurant.description} onChange={(event) => onChange("description", event.target.value)} />
      </Field>
      <Field label="Logo URL">
        <Input value={data.restaurant.logoUrl} onChange={(event) => onChange("logoUrl", event.target.value)} />
      </Field>
      <Field label="Portada URL">
        <Textarea value={data.restaurant.coverUrl} onChange={(event) => onChange("coverUrl", event.target.value)} />
      </Field>
      <Field label="Telefono">
        <Input value={data.restaurant.phone} onChange={(event) => onChange("phone", event.target.value)} />
      </Field>
      <Field label="Direccion">
        <Input value={data.restaurant.address} onChange={(event) => onChange("address", event.target.value)} />
      </Field>
      <Field label="Instagram">
        <Input value={data.restaurant.instagram} onChange={(event) => onChange("instagram", event.target.value)} />
      </Field>
      <Field label="Horario">
        <Input value={data.restaurant.schedule} onChange={(event) => onChange("schedule", event.target.value)} />
      </Field>
      <Field label="Color principal">
        <Input type="color" value={data.restaurant.primaryColor} onChange={(event) => onChange("primaryColor", event.target.value)} className="h-14" />
      </Field>
    </div>
  );
}
