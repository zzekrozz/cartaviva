"use client";

import { Languages, Wand2 } from "lucide-react";
import type { CartaVivaState, LanguageCode } from "@/lib/cartaviva-data";
import { extraLanguagesPlanMessage, getExtraLanguagesLimit, getPlanConfig, supportsExtraLanguages } from "@/lib/plan-config";

const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: "en", label: "Inglés", flag: "🇬🇧" },
  { code: "fr", label: "Francés", flag: "🇫🇷" },
  { code: "de", label: "Alemán", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Portugués", flag: "🇵🇹" }
];

type Props = {
  data: CartaVivaState;
  onChange: (next: CartaVivaState) => void;
  onNotice?: (message: string) => void;
};

function Textarea({ value, onChange, placeholder }: { value?: string; onChange: (value: string) => void; placeholder?: string }) {
  return <textarea value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={3} className="w-full rounded-[1.2rem] border border-[#eadfce] bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#e85d04]" />;
}

export function TranslationEditor({ data, onChange, onNotice }: Props) {
  const plan = getPlanConfig(data.settings.plan);
  const maxExtraLanguages = getExtraLanguagesLimit(data.settings.plan);
  const canUseLanguages = supportsExtraLanguages(data.settings.plan);
  const selected = (data.settings.extraLanguages || []).filter((lang) => lang !== "es") as LanguageCode[];
  const activeLanguages = selected.length ? selected : ["en"] as LanguageCode[];
  const activeLanguage = activeLanguages[0];

  function setLanguages(next: LanguageCode[]) {
    if (!canUseLanguages) {
      onNotice?.("Los idiomas extra están disponibles desde Carta Visual.");
      return;
    }
    if (next.length > maxExtraLanguages) {
      onNotice?.(`Tu plan incluye hasta ${maxExtraLanguages} idioma${maxExtraLanguages === 1 ? "" : "s"} extra editable${maxExtraLanguages === 1 ? "" : "s"}.`);
      return;
    }
    onChange({ ...data, settings: { ...data.settings, extraLanguages: next } });
  }

  function updateRestaurantTranslation(language: string, patch: Record<string, string>) {
    onChange({
      ...data,
      translations: {
        ...data.translations,
        restaurant: {
          ...data.translations.restaurant,
          [language]: { ...(data.translations.restaurant[language] || {}), ...patch }
        }
      }
    });
  }

  function updateCategoryTranslation(categoryId: string, language: string, name: string) {
    onChange({
      ...data,
      translations: {
        ...data.translations,
        categories: {
          ...data.translations.categories,
          [categoryId]: { ...(data.translations.categories[categoryId] || {}), [language]: { name } }
        }
      }
    });
  }

  function updateProductTranslation(productId: string, language: string, patch: Record<string, string>) {
    onChange({
      ...data,
      translations: {
        ...data.translations,
        products: {
          ...data.translations.products,
          [productId]: {
            ...(data.translations.products[productId] || {}),
            [language]: { ...(data.translations.products[productId]?.[language] || {}), ...patch }
          }
        }
      }
    });
  }

  function updateDailyTranslation(language: string, patch: Record<string, string>) {
    onChange({
      ...data,
      translations: {
        ...data.translations,
        dailyMenu: {
          ...data.translations.dailyMenu,
          [language]: { ...(data.translations.dailyMenu[language] || {}), ...patch }
        }
      }
    });
  }

  async function autoTranslateDemo() {
    if (!canUseLanguages) {
      onNotice?.("Los idiomas extra están disponibles desde Carta Visual.");
      return;
    }
    try {
      const response = await fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: data.restaurant.description, target: activeLanguage }) });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Traducción automática no disponible.");
      updateRestaurantTranslation(activeLanguage, { description: json.text });
      onNotice?.("Descripción traducida automáticamente. Revisa el texto antes de publicar.");
    } catch (error: any) {
      onNotice?.(error?.message || "Traducción automática no configurada todavía.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.8rem] border border-[#eadfce] bg-[#fffaf3] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-black text-[#221812]"><Languages size={17} className="text-[#e85d04]" /> Idiomas editables</p>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-[#6b594a]">El idioma principal es ES. Los idiomas extra solo se desbloquean en los planes compatibles y se revisan manualmente antes de publicar.</p>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#6b594a] shadow-sm">Plan actual: {plan.name}</span>
        </div>
        {!canUseLanguages ? (
          <div className="mt-4 rounded-[1.4rem] border border-orange-200 bg-[#fff4e8] p-4 text-sm font-black text-[#a3581c]">
            Idiomas extra disponibles desde Carta Visual.
          </div>
        ) : (
          <div className="mt-4 rounded-[1.4rem] border border-emerald-200 bg-emerald-50 p-4 text-sm font-black text-emerald-800">
            {extraLanguagesPlanMessage(data.settings.plan)}
          </div>
        )}
        {!canUseLanguages ? null : (
        <div className="mt-4 flex flex-wrap gap-2">
          {LANGUAGES.map((language) => {
            const active = selected.includes(language.code);
            return (
              <button key={language.code} type="button" onClick={() => setLanguages(active ? selected.filter((code) => code !== language.code) : [...selected, language.code])} className={`rounded-full px-4 py-2 text-sm font-black transition ${active ? "bg-[#221812] text-white" : "bg-white text-[#6b594a] shadow-sm"}`}>
                {language.flag} {language.label}
              </button>
            );
          })}
        </div>
        )}
      </div>

      {!canUseLanguages ? (
        <section className="rounded-[1.8rem] border border-[#eadfce] bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-black text-[#221812]">Editor de idiomas</h3>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#6b594a]">
            {extraLanguagesPlanMessage(data.settings.plan)}
          </p>
        </section>
      ) : null}

      {canUseLanguages ? activeLanguages.map((language) => (
        <section key={language} className="rounded-[1.8rem] border border-[#eadfce] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-2xl font-black">Traducciones · {LANGUAGES.find((entry) => entry.code === language)?.label || language.toUpperCase()}</h3>
            <button type="button" onClick={autoTranslateDemo} className="inline-flex items-center gap-2 rounded-full bg-[#e85d04] px-4 py-2 text-sm font-black text-white"><Wand2 size={16} /> Traducir descripción</button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-black text-[#6b594a]">Descripción del restaurante<Textarea value={data.translations.restaurant[language]?.description} onChange={(value) => updateRestaurantTranslation(language, { description: value })} placeholder={data.restaurant.description} /></label>
            <label className="space-y-2 text-sm font-black text-[#6b594a]">Horario<Textarea value={data.translations.restaurant[language]?.schedule} onChange={(value) => updateRestaurantTranslation(language, { schedule: value })} placeholder={data.restaurant.schedule} /></label>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[#fffaf3] p-4">
              <p className="text-sm font-black text-[#221812]">Categorías</p>
              <div className="mt-3 space-y-3">
                {data.categories.map((category) => <input key={category.id} value={data.translations.categories[category.id]?.[language]?.name || ""} onChange={(event) => updateCategoryTranslation(category.id, language, event.target.value)} placeholder={category.name} className="w-full rounded-[1rem] border border-[#eadfce] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]" />)}
              </div>
            </div>
            <div className="rounded-[1.5rem] bg-[#fffaf3] p-4">
              <p className="text-sm font-black text-[#221812]">Menú del día</p>
              <div className="mt-3 space-y-3">
                <input value={data.translations.dailyMenu[language]?.title || ""} onChange={(event) => updateDailyTranslation(language, { title: event.target.value })} placeholder={data.dailyMenu.title} className="w-full rounded-[1rem] border border-[#eadfce] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]" />
                <Textarea value={data.translations.dailyMenu[language]?.starters} onChange={(value) => updateDailyTranslation(language, { starters: value })} placeholder={data.dailyMenu.starters} />
                <Textarea value={data.translations.dailyMenu[language]?.mains} onChange={(value) => updateDailyTranslation(language, { mains: value })} placeholder={data.dailyMenu.mains} />
                <Textarea value={data.translations.dailyMenu[language]?.desserts} onChange={(value) => updateDailyTranslation(language, { desserts: value })} placeholder={data.dailyMenu.desserts} />
                <Textarea value={data.translations.dailyMenu[language]?.note} onChange={(value) => updateDailyTranslation(language, { note: value })} placeholder={data.dailyMenu.note} />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-[#fffaf3] p-4">
            <p className="text-sm font-black text-[#221812]">Productos</p>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              {data.products.map((product) => (
                <div key={product.id} className="rounded-[1.2rem] border border-[#eadfce] bg-white p-3">
                  <input value={data.translations.products[product.id]?.[language]?.name || ""} onChange={(event) => updateProductTranslation(product.id, language, { name: event.target.value })} placeholder={product.name} className="w-full rounded-[0.9rem] border border-[#eadfce] px-3 py-2 text-sm font-bold outline-none focus:border-[#e85d04]" />
                  <textarea value={data.translations.products[product.id]?.[language]?.description || ""} onChange={(event) => updateProductTranslation(product.id, language, { description: event.target.value })} placeholder={product.description} rows={2} className="mt-2 w-full rounded-[0.9rem] border border-[#eadfce] px-3 py-2 text-sm font-semibold outline-none focus:border-[#e85d04]" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )) : null}
    </div>
  );
}
