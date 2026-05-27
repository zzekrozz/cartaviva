import { Crown, Languages, Paintbrush, SlidersHorizontal } from "lucide-react";
import { planOptions, type CartaVivaState, type MenuTemplate, type PlanTier } from "@/lib/cartaviva-data";
import { PlanBadge } from "@/components/cartaviva/PlanBadge";
import { TemplateSelector } from "@/components/cartaviva/TemplateSelector";
import { extraLanguagesPlanMessage, supportsAdvancedCustomization } from "@/lib/plan-config";

type AdvancedRestaurantField =
  | "titleFont"
  | "bodyFont"
  | "primaryColor"
  | "secondaryColor"
  | "backgroundColor"
  | "buttonStyle"
  | "borderRadiusStyle"
  | "visualDensity";

export function DesignSettings({
  data,
  onTemplateChange,
  onPlanChange,
  onBooleanChange,
  onValueChange,
  onRestaurantChange,
}: {
  data: CartaVivaState;
  onTemplateChange: (value: MenuTemplate) => void;
  onPlanChange: (value: PlanTier) => void;
  onBooleanChange: (field: "showAllergens" | "showTags" | "advancedCustomization", value: boolean) => void;
  onValueChange: (field: "fontPair" | "manualTranslationNotes", value: string) => void;
  onRestaurantChange: <K extends AdvancedRestaurantField>(field: K, value: CartaVivaState["restaurant"][K]) => void;
}) {
  const isPro = supportsAdvancedCustomization(data.settings.plan);

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
          <span className="mb-2 block text-sm font-black text-[#221812]">Estilo base de texto</span>
          <select value={data.settings.fontPair} onChange={(event) => onValueChange("fontPair", event.target.value)} className="w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]">
            <option value="editorial">Editorial premium</option>
            <option value="modern">Moderna y limpia</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {[
          { key: "showAllergens", label: "Mostrar alérgenos", hint: "Incluido en todos los planes por salud y claridad." },
          { key: "showTags", label: "Mostrar etiquetas", hint: "Recomendado, casero, picante y otras señales visuales." },
        ].map((item) => (
          <label key={item.key} className="flex items-center justify-between gap-4 rounded-[1.7rem] border border-[#eadfce] bg-white p-5 shadow-sm">
            <span>
              <span className="block text-sm font-black text-[#221812]">{item.label}</span>
              <span className="mt-1 block text-xs font-semibold leading-5 text-[#8a796a]">{item.hint}</span>
            </span>
            <input
              type="checkbox"
              checked={Boolean(data.settings[item.key as keyof CartaVivaState["settings"]])}
              onChange={(event) => onBooleanChange(item.key as "showAllergens" | "showTags" | "advancedCustomization", event.target.checked)}
              className="h-5 w-5 shrink-0 accent-[#e85d04]"
            />
          </label>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-[#eadfce] bg-[#fff9f1] p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-white text-[#e85d04]"><Languages size={20} /></span>
            <div>
              <p className="text-sm font-black text-[#221812]">Idiomas de la carta</p>
              <p className="text-xs font-semibold text-[#8a796a]">Categorías, productos, descripciones y menú del día se traducen de forma manual.</p>
            </div>
          </div>
          <textarea value={data.settings.manualTranslationNotes} onChange={(event) => onValueChange("manualTranslationNotes", event.target.value)} className="min-h-28 w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-semibold leading-6 outline-none focus:border-[#e85d04]" placeholder="Notas internas para revisar textos, tono o palabras específicas del restaurante." />
          <div className="mt-4 flex items-center gap-2 rounded-[1.3rem] bg-white px-4 py-3 text-sm font-bold text-[#6b594a]">
            <Crown size={16} className="text-[#e85d04]" />
            {extraLanguagesPlanMessage(data.settings.plan)}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#eadfce] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-[#fff1df] text-[#e85d04]"><SlidersHorizontal size={20} /></span>
            <div>
              <p className="text-sm font-black text-[#221812]">Marca y alcance del plan</p>
              <p className="text-xs font-semibold text-[#8a796a]">La marca visible se aplica sola en gratis. En planes de pago el QR y la carta salen limpios.</p>
            </div>
          </div>
          <div className={`rounded-[1.4rem] border p-4 ${data.settings.plan === "free" ? "border-orange-200 bg-[#fff4e8]" : "border-emerald-200 bg-emerald-50"}`}>
            <p className="text-sm font-black text-[#221812]">{data.settings.plan === "free" ? "Marca visible obligatoria" : "Marca oculta automáticamente"}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#6b594a]">
              {data.settings.plan === "free"
                ? "La carta pública y el QR muestran MesaCarta en el plan gratis."
                : "No hace falta activar ni desactivar nada: los planes de pago muestran la carta sin marca visible."}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#eadfce] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-[#fff1df] text-[#e85d04]"><Crown size={20} /></span>
          <div>
            <p className="text-sm font-black text-[#221812]">Personalización avanzada</p>
            <p className="text-xs font-semibold text-[#8a796a]">Tipografías, colores, densidad y acabados visuales reales para la preview y la carta pública.</p>
          </div>
        </div>

        {!isPro ? (
          <div className="rounded-[1.4rem] border border-orange-200 bg-[#fff4e8] p-4 text-sm font-black text-[#a3581c]">
            Personalización avanzada disponible en Restaurante Pro.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <label className="space-y-2 text-sm font-black text-[#221812]">
                Tipografía de títulos
                <select value={data.restaurant.titleFont} onChange={(event) => onRestaurantChange("titleFont", event.target.value as CartaVivaState["restaurant"]["titleFont"])} className="w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]">
                  <option value="fraunces">Fraunces</option>
                  <option value="playfair">Playfair Display</option>
                  <option value="sora">Sora</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-black text-[#221812]">
                Tipografía de texto
                <select value={data.restaurant.bodyFont} onChange={(event) => onRestaurantChange("bodyFont", event.target.value as CartaVivaState["restaurant"]["bodyFont"])} className="w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]">
                  <option value="inter">Inter</option>
                  <option value="manrope">Manrope</option>
                  <option value="plus-jakarta">Plus Jakarta Sans</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-black text-[#221812]">
                Estilo de botones
                <select value={data.restaurant.buttonStyle} onChange={(event) => onRestaurantChange("buttonStyle", event.target.value as CartaVivaState["restaurant"]["buttonStyle"])} className="w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]">
                  <option value="rounded">Redondeado</option>
                  <option value="pill">Píldora</option>
                  <option value="soft-shadow">Sombra suave</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-black text-[#221812]">
                Radio de bordes
                <select value={data.restaurant.borderRadiusStyle} onChange={(event) => onRestaurantChange("borderRadiusStyle", event.target.value as CartaVivaState["restaurant"]["borderRadiusStyle"])} className="w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]">
                  <option value="suave">Suave</option>
                  <option value="medio">Medio</option>
                  <option value="grande">Grande</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-black text-[#221812]">
                Densidad visual
                <select value={data.restaurant.visualDensity} onChange={(event) => onRestaurantChange("visualDensity", event.target.value as CartaVivaState["restaurant"]["visualDensity"])} className="w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]">
                  <option value="compacta">Compacta</option>
                  <option value="normal">Normal</option>
                  <option value="amplia">Amplia</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-2 text-sm font-black text-[#221812]">
                Color principal
                <input type="color" value={data.restaurant.primaryColor} onChange={(event) => onRestaurantChange("primaryColor", event.target.value)} className="h-14 w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] p-2" />
              </label>
              <label className="space-y-2 text-sm font-black text-[#221812]">
                Color secundario
                <input type="color" value={data.restaurant.secondaryColor} onChange={(event) => onRestaurantChange("secondaryColor", event.target.value)} className="h-14 w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] p-2" />
              </label>
              <label className="space-y-2 text-sm font-black text-[#221812]">
                Fondo
                <input type="color" value={data.restaurant.backgroundColor} onChange={(event) => onRestaurantChange("backgroundColor", event.target.value)} className="h-14 w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] p-2" />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
