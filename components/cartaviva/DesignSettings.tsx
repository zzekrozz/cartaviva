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
      <div className="rounded-[1.7rem] border border-[#eadfce] bg-[#fff9f1] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#e85d04]">Plantillas visuales</p>
            <h3 className="mt-1 text-2xl font-bold text-[#221812]">Elige la personalidad del restaurante</h3>
          </div>
          <PlanBadge plan={data.settings.plan} />
        </div>
        <div className="mt-5">
          <TemplateSelector value={data.restaurant.template} onChange={onTemplateChange} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="rounded-[1.6rem] border border-[#eadfce] bg-white p-4">
          <span className="mb-2 block text-sm font-bold text-[#221812]">Plan visual para preview</span>
          <select
            value={data.settings.plan}
            onChange={(event) => onPlanChange(event.target.value as PlanTier)}
            className="w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm"
          >
            {planOptions.map((plan) => <option key={plan.value} value={plan.value}>{plan.label}</option>)}
          </select>
        </label>
        <label className="rounded-[1.6rem] border border-[#eadfce] bg-white p-4">
          <span className="mb-2 block text-sm font-bold text-[#221812]">Pareja tipografica</span>
          <select
            value={data.settings.fontPair}
            onChange={(event) => onValueChange("fontPair", event.target.value)}
            className="w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm"
          >
            <option value="editorial">Editorial premium</option>
            <option value="modern">Moderna y limpia</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {[
          { key: "showAllergens", label: "Mostrar alergenos" },
          { key: "showTags", label: "Mostrar etiquetas" },
          { key: "showBranding", label: "Mostrar marca en version gratis/demo" },
          { key: "advancedCustomization", label: "Activar UI de personalizacion avanzada" }
        ].map((item) => (
          <label key={item.key} className="flex items-center justify-between rounded-[1.6rem] border border-[#eadfce] bg-white p-4 font-bold text-[#221812]">
            <span>{item.label}</span>
            <input
              type="checkbox"
              checked={Boolean(data.settings[item.key as keyof CartaVivaState["settings"]])}
              onChange={(event) => onBooleanChange(item.key as "showAllergens" | "showTags" | "showBranding" | "advancedCustomization", event.target.checked)}
              className="h-5 w-5"
            />
          </label>
        ))}
      </div>

      <label className="block rounded-[1.6rem] border border-[#eadfce] bg-white p-4">
        <span className="mb-2 block text-sm font-bold text-[#221812]">Revision manual de traducciones</span>
        <textarea
          value={data.settings.manualTranslationNotes}
          onChange={(event) => onValueChange("manualTranslationNotes", event.target.value)}
          className="min-h-28 w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm"
        />
      </label>
    </div>
  );
}
