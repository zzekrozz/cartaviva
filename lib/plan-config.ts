import type { PlanTier } from "@/lib/cartaviva-data";

export type TrialType = "none" | "one-euro";
export type PlanId = PlanTier;
export type BillingInterval = "monthly" | "quarterly" | "yearly";

export type PlanConfig = {
  id: PlanTier;
  urlValue: string;
  name: string;
  shortName: string;
  monthlyPrice: number;
  quarterlyPrice: number | null;
  annualPrice: number | null;
  annualDailyCost: string | null;
  quarterlyNote: string | null;
  annualNote: string | null;
  oneEuroTrial: boolean;
  maxProducts: number;
  maxPhotos: number;
  maxExtraLanguages: number;
  hasPhotos: boolean;
  hasWeeklyMenu: boolean;
  hasIncludedSetupQuarterly: boolean;
  hasIncludedSetupYearly: boolean;
  qrBranding: "branded" | "clean";
  recommended?: boolean;
  description: string;
  dailyText?: string;
  features: string[];
  builderSummary: string;
  cta: string;
};

export const PLAN_CONFIGS: Record<PlanTier, PlanConfig> = {
  free: {
    id: "free",
    urlValue: "free",
    name: "Gratis",
    shortName: "Gratis",
    monthlyPrice: 0,
    quarterlyPrice: null,
    annualPrice: null,
    annualDailyCost: null,
    quarterlyNote: null,
    annualNote: "Gratis para siempre",
    oneEuroTrial: false,
    maxProducts: 20,
    maxPhotos: 0,
    maxExtraLanguages: 0,
    hasPhotos: false,
    hasWeeklyMenu: false,
    hasIncludedSetupQuarterly: false,
    hasIncludedSetupYearly: false,
    qrBranding: "branded",
    description: "Perfecto para empezar sin coste y probar tu carta digital con logo y portada del local.",
    features: ["Hasta 20 productos", "Sin fotos de productos", "Logo y portada del local", "2 categorías", "Alérgenos incluidos", "QR bonito con marca", "Botón WhatsApp", "Página pública", "1 idioma principal", "Marca visible"],
    builderSummary: "20 productos, logo y portada permitidos, sin fotos de productos, QR con marca y 1 idioma principal.",
    cta: "Empezar gratis"
  },
  "menu-day": {
    id: "menu-day",
    urlValue: "menu-day",
    name: "Menú Día",
    shortName: "Menú Día",
    monthlyPrice: 19,
    quarterlyPrice: 38,
    annualPrice: 190,
    annualDailyCost: "0,52 €/día",
    quarterlyNote: "Paga 2 meses y usa 3",
    annualNote: "Paga 10 meses y usa 12",
    oneEuroTrial: true,
    maxProducts: 40,
    maxPhotos: 30,
    maxExtraLanguages: 0,
    hasPhotos: true,
    hasWeeklyMenu: false,
    hasIncludedSetupQuarterly: true,
    hasIncludedSetupYearly: true,
    qrBranding: "clean",
    description: "Para bares y cafeterías que quieren enseñar el menú del día y actualizarlo rápido.",
    dailyText: "Poco más de 0,50 € al día para tener tu menú del día siempre actualizado.",
    features: ["Hasta 40 productos", "Hasta 30 fotos de productos", "Menú del día manual", "Productos agotados/ocultos", "Alérgenos incluidos", "QR limpio", "Botón WhatsApp", "Horario, dirección e Instagram", "1 idioma principal"],
    builderSummary: "40 productos, 30 fotos, menú del día manual y QR limpio.",
    cta: "Construir ahora gratis"
  },
  "carta-visual": {
    id: "carta-visual",
    urlValue: "visual",
    name: "Carta Visual",
    shortName: "Visual",
    monthlyPrice: 29,
    quarterlyPrice: 58,
    annualPrice: 290,
    annualDailyCost: "0,79 €/día",
    quarterlyNote: "Paga 2 meses y usa 3",
    annualNote: "Paga 10 meses y usa 12",
    oneEuroTrial: true,
    maxProducts: 80,
    maxPhotos: 60,
    maxExtraLanguages: 1,
    hasPhotos: true,
    hasWeeklyMenu: false,
    hasIncludedSetupQuarterly: true,
    hasIncludedSetupYearly: true,
    qrBranding: "clean",
    recommended: true,
    description: "Fotos, QR limpio, plantillas y 1 idioma extra para turistas.",
    dailyText: "Menos que un café al día para tener una carta visual con fotos.",
    features: ["Hasta 80 productos", "Hasta 60 fotos", "Categorías ilimitadas", "Menú del día", "Fotos opcionales en menú del día", "Productos agotados/ocultos", "Alérgenos incluidos", "Etiquetas base", "5 plantillas visuales", "1 idioma extra editable"],
    builderSummary: "80 productos, 60 fotos, 5 plantillas, miniweb, QR limpio y 1 idioma extra.",
    cta: "Construir ahora gratis"
  },
  "restaurant-pro": {
    id: "restaurant-pro",
    urlValue: "pro",
    name: "Restaurante Pro",
    shortName: "Pro",
    monthlyPrice: 49,
    quarterlyPrice: 98,
    annualPrice: 490,
    annualDailyCost: "1,34 €/día",
    quarterlyNote: "Paga 2 meses y usa 3",
    annualNote: "Paga 10 meses y usa 12",
    oneEuroTrial: true,
    maxProducts: 150,
    maxPhotos: 120,
    maxExtraLanguages: 3,
    hasPhotos: true,
    hasWeeklyMenu: true,
    hasIncludedSetupQuarterly: true,
    hasIncludedSetupYearly: true,
    qrBranding: "clean",
    description: "Para restaurantes turísticos o con cartas grandes: multiidioma, menú semanal y más personalización.",
    dailyText: "Personalización, idiomas editables y QR por sección por menos de dos cafés al día.",
    features: ["Hasta 150 productos", "Hasta 120 fotos", "Hasta 3 idiomas extra editables", "Tipografías editables", "QR por sección", "Menú semanal programado", "Diseño de QR para pegatina o mesa", "Plantillas premium", "Etiquetas personalizadas", "Colores avanzados"],
    builderSummary: "150 productos, 120 fotos, 3 idiomas extra, menú semanal, tipografías y QR por sección.",
    cta: "Construir ahora gratis"
  }
};

export const ORDERED_PLANS: PlanTier[] = ["free", "menu-day", "carta-visual", "restaurant-pro"];

export function getPlanConfig(plan?: string | null): PlanConfig {
  return PLAN_CONFIGS[toPlanTier(plan)];
}

export function toPlanTier(plan?: string | null): PlanTier {
  if (plan === "visual") return "carta-visual";
  if (plan === "pro") return "restaurant-pro";
  if (plan === "menu") return "menu-day";
  if (plan === "free" || plan === "menu-day" || plan === "carta-visual" || plan === "restaurant-pro") return plan;
  return "free";
}

export function toBillingInterval(value?: string | null): BillingInterval {
  if (value === "quarterly" || value === "yearly") return value;
  return "monthly";
}

export function isOneEuroTrial(trial?: string | null) {
  return trial === "one-euro";
}

export function discountedMonthlyPrice(plan: PlanTier) {
  const price = PLAN_CONFIGS[plan].monthlyPrice / 2;
  return price.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function displayPriceForInterval(plan: PlanConfig, interval: BillingInterval) {
  if (plan.id === "free") return "0 €";
  if (interval === "quarterly") return `${plan.quarterlyPrice} € / 3 meses`;
  if (interval === "yearly") return `${plan.annualPrice} € / año`;
  return `${plan.monthlyPrice} € / mes`;
}

export function countPhotos(state: { restaurant: { logoUrl?: string; coverUrl?: string }; dailyMenu: Record<string, any>; products: { imageUrl?: string }[] }) {
  let total = 0;
  ["coverImage", "startersImage", "mainsImage", "dessertsImage"].forEach((key) => {
    if (state.dailyMenu?.[key]) total += 1;
  });
  total += state.products.filter((product) => Boolean(product.imageUrl)).length;
  return total;
}

export function supportsProductPhotos(plan: PlanTier) {
  return plan !== "free";
}

export function supportsRestaurantBrandImages(_plan: PlanTier) {
  return true;
}

export function supportsDailyMenuPhotos(plan: PlanTier) {
  return plan === "carta-visual" || plan === "restaurant-pro";
}

export function getExtraLanguagesLimit(plan: PlanTier) {
  return PLAN_CONFIGS[plan].maxExtraLanguages;
}

export function supportsExtraLanguages(plan: PlanTier) {
  return getExtraLanguagesLimit(plan) > 0;
}

export function extraLanguagesPlanMessage(plan: PlanTier) {
  if (plan === "carta-visual") {
    return "Tu plan incluye 1 idioma extra editable. Puedes traducir y revisar los textos antes de publicar.";
  }
  if (plan === "restaurant-pro") {
    return "Tu plan incluye hasta 3 idiomas extra editables. Ideal para restaurantes turísticos.";
  }
  return "Idiomas extra disponibles desde Carta Visual.";
}
