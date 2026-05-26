import { Crown, Languages, Paintbrush } from "lucide-react";
import { planOptions, type CartaVivaState, type MenuTemplate, type PlanTier } from "@/lib/cartaviva-data";
import { PlanBadge } from "@/components/cartaviva/PlanBadge";
import { TemplateSelector } from "@/components/cartaviva/TemplateSelector";

export function DesignSettings({
  data,
  onTemplateChange,
  onPlanChange,
  onBooleanChange,
  onValueChange
}: {
  data: CartaVivaState;
  onTemplateChange: (value: MenuTemplate) => void;
  onPlanChange: (value: PlanTier) => void;
  onBooleanChange: (field: "showAllergens" | "showTags" | "showBranding" | "advancedCustomization", value: boolean) => void;
  onValueChange: (field: "fontPair" | "manualTranslationNotes", value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-[#eadfce] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-[1.3rem] bg-[#fff1df] text-[#e85d04]"><Paintbrush size={22} /></span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#e85d04]">Plantillas visuales</p>
              <h3 className="text-2xl font-black text-[#221812]">Elige la personalidad del restaurante</h3>
            </div>
          </div>
          <PlanBadge plan={data.settings.plan} />
        </div>
        <div className="mt-5">
          <TemplateSelector value={data.restaurant.template} onChange={onTemplateChange} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <label className="rounded-[1.7rem] border border-[#eadfce] bg-white p-5 shadow-sm">
          <span className="mb-2 block text-sm font-black text-[#221812]">Plan visual para preview</span>
          <select value={data.settings.plan} onChange={(event) => onPlanChange(event.target.value as PlanTier)} className="w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]">
            {planOptions.map((plan) => <option key={plan.value} value={plan.value}>{plan.label}</option>)}
          </select>
        </label>
        <label className="rounded-[1.7rem] border border-[#eadfce] bg-white p-5 shadow-sm">
          <span className="mb-2 block text-sm font-black text-[#221812]">Pareja tipográfica</span>
          <select value={data.settings.fontPair} onChange={(event) => onValueChange("fontPair", event.target.value)} className="w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]">
            <option value="editorial">Editorial premium</option>
            <option value="modern">Moderna y limpia</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {[
          { key: "showAllergens", label: "Mostrar alérgenos", hint: "Incluido en todos los planes por salud." },
          { key: "showTags", label: "Mostrar etiquetas", hint: "Recomendado, casero, picante..." },
          { key: "showBranding", label: "Marca visible", hint: "Gratis/demo con marca; pago sin marca." },
          { key: "advancedCustomization", label: "Personalización avanzada", hint: "Idea para plan Pro: más control visual." }
        ].map((item) => (
          <label key={item.key} className="flex items-center justify-between gap-4 rounded-[1.7rem] border border-[#eadfce] bg-white p-5 shadow-sm">
            <span>
              <span className="block text-sm font-black text-[#221812]">{item.label}</span>
              <span className="mt-1 block text-xs font-semibold leading-5 text-[#8a796a]">{item.hint}</span>
            </span>
            <input
              type="checkbox"
              checked={Boolean(data.settings[item.key as keyof CartaVivaState["settings"]])}
              onChange={(event) => onBooleanChange(item.key as "showAllergens" | "showTags" | "showBranding" | "advancedCustomization", event.target.checked)}
              className="h-5 w-5 shrink-0 accent-[#e85d04]"
            />
          </label>
        ))}
      </div>

      <div className="rounded-[2rem] border border-[#eadfce] bg-[#fff9f1] p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-white text-[#e85d04]"><Languages size={20} /></span>
          <div>
            <p className="text-sm font-black text-[#221812]">Restaurante Pro: idiomas editables</p>
            <p className="text-xs font-semibold text-[#8a796a]">Visual de fase futura, sin traducción automática todavía.</p>
          </div>
        </div>
        <textarea value={data.settings.manualTranslationNotes} onChange={(event) => onValueChange("manualTranslationNotes", event.target.value)} className="min-h-28 w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-semibold leading-6 outline-none focus:border-[#e85d04]" />
        <div className="mt-4 flex items-center gap-2 rounded-[1.3rem] bg-white px-4 py-3 text-sm font-bold text-[#6b594a]">
          <Crown size={16} className="text-[#e85d04]" />
          49 €/mes + IVA: 2 idiomas extra editables manualmente, QR por sección y más personalización.
        </div>
      </div>
    </div>
  );
}
