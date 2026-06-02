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
  maxGalleryPhotos: number;
  maxExtraLanguages: number;
  maxStorageMB: number;
  hasPhotos: boolean;
  hasWeeklyMenu: boolean;
  hasLanding: boolean;
  hasIncludedSetupQuarterly: boolean;
  hasIncludedSetupYearly: boolean;
  qrBranding: "branded" | "clean";
  recommended?: boolean;
  promise: string;
  description: string;
  dailyText?: string;
  features: string[];
  upgradeMessage?: string;
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
    maxGalleryPhotos: 0,
    maxExtraLanguages: 0,
    maxStorageMB: 20,
    hasPhotos: false,
    hasWeeklyMenu: false,
    hasLanding: false,
    hasIncludedSetupQuarterly: false,
    hasIncludedSetupYearly: false,
    qrBranding: "branded",
    promise: "Prueba tu carta QR sin pagar.",
    description: "Perfecto para empezar sin coste y ver cómo queda tu carta con logo y portada del local.",
    features: [
      "Hasta 20 productos",
      "Sin fotos de productos",
      "Logo y portada del local",
      "Alérgenos incluidos",
      "QR con marca MesaCarta",
      "Botón WhatsApp",
      "Página pública",
      "1 idioma principal",
    ],
    upgradeMessage: "Sube a Carta Día para añadir fotos de productos y eliminar la marca.",
    builderSummary: "20 productos, logo y portada permitidos, sin fotos de productos, QR con marca y 1 idioma.",
    cta: "Empezar gratis",
  },
  "menu-day": {
    id: "menu-day",
    urlValue: "menu-day",
    name: "Carta Día",
    shortName: "Carta Día",
    monthlyPrice: 19,
    quarterlyPrice: 38,
    annualPrice: 190,
    annualDailyCost: "0,52 €/día",
    quarterlyNote: "Paga 2 meses y usa 3",
    annualNote: "Paga 10 meses y usa 12",
    oneEuroTrial: true,
    maxProducts: 40,
    maxPhotos: 30,
    maxGalleryPhotos: 0,
    maxExtraLanguages: 0,
    maxStorageMB: 150,
    hasPhotos: true,
    hasWeeklyMenu: false,
    hasLanding: false,
    hasIncludedSetupQuarterly: true,
    hasIncludedSetupYearly: true,
    qrBranding: "clean",
    promise: "Ideal para bares con menú diario.",
    description: "Carta QR editable, menú del día manual, fotos de productos y QR limpio sin marca.",
    dailyText: "Poco más de 0,50 € al día para tener tu menú del día siempre actualizado.",
    features: [
      "Hasta 40 productos",
      "Hasta 30 fotos de productos",
      "Menú del día manual",
      "Productos agotados u ocultos",
      "Alérgenos incluidos",
      "QR limpio sin marca",
      "Botón WhatsApp",
      "Horario, dirección e Instagram",
      "1 idioma principal",
    ],
    upgradeMessage: "Sube a Carta Visual para añadir más fotos, plantillas y un idioma extra.",
    builderSummary: "40 productos, 30 fotos, menú del día manual y QR limpio.",
    cta: "Construir gratis",
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
    maxGalleryPhotos: 5,
    maxExtraLanguages: 1,
    maxStorageMB: 300,
    hasPhotos: true,
    hasWeeklyMenu: false,
    hasLanding: false,
    hasIncludedSetupQuarterly: true,
    hasIncludedSetupYearly: true,
    qrBranding: "clean",
    recommended: true,
    promise: "Carta bonita con fotos y diseño profesional.",
    description: "Fotos, QR limpio, plantillas visuales y 1 idioma extra para restaurantes que quieren verse premium.",
    dailyText: "Menos que un café al día para tener una carta visual con fotos.",
    features: [
      "Hasta 80 productos",
      "Hasta 60 fotos",
      "Categorías ilimitadas",
      "Menú del día con fotos opcionales",
      "Productos agotados u ocultos",
      "Alérgenos incluidos",
      "Etiquetas base",
      "6 plantillas visuales",
      "1 idioma extra editable",
      "QR limpio sin marca",
    ],
    upgradeMessage: "Sube a Restaurante Web para activar la miniweb, galería, menú semanal y hasta 3 idiomas.",
    builderSummary: "80 productos, 60 fotos, 6 plantillas, QR limpio y 1 idioma extra.",
    cta: "Construir gratis",
  },
  "restaurant-pro": {
    id: "restaurant-pro",
    urlValue: "pro",
    name: "Restaurante Web",
    shortName: "Web",
    monthlyPrice: 49,
    quarterlyPrice: 98,
    annualPrice: 490,
    annualDailyCost: "1,34 €/día",
    quarterlyNote: "Paga 2 meses y usa 3",
    annualNote: "Paga 10 meses y usa 12",
    oneEuroTrial: true,
    maxProducts: 150,
    maxPhotos: 120,
    maxGalleryPhotos: 15,
    maxExtraLanguages: 3,
    maxStorageMB: 750,
    hasPhotos: true,
    hasWeeklyMenu: true,
    hasLanding: true,
    hasIncludedSetupQuarterly: true,
    hasIncludedSetupYearly: true,
    qrBranding: "clean",
    promise: "Miniweb editable para tu restaurante.",
    description: "Carta QR + miniweb editable con portada, historia, galería, ubicación, horarios y destacados.",
    dailyText: "Por menos de dos cafés al día: carta QR + miniweb completa para Instagram, WhatsApp y Google.",
    features: [
      "Hasta 150 productos",
      "Hasta 120 fotos",
      "Galería miniweb hasta 15 fotos",
      "Miniweb editable con plantillas",
      "Platos destacados en miniweb",
      "Historia del restaurante",
      "Enlace a Google Maps",
      "Hasta 3 idiomas extra editables",
      "Tipografías editables",
      "Menú semanal programado",
      "QR por sección",
      "Colores avanzados",
    ],
    upgradeMessage: "",
    builderSummary: "150 productos, 120 fotos, galería, miniweb, 3 idiomas, menú semanal y QR por sección.",
    cta: "Construir gratis",
  },
};

export const ORDERED_PLANS: PlanTier[] = ["free", "menu-day", "carta-visual", "restaurant-pro"];

export function getPlanConfig(plan?: string | null): PlanConfig {
  return PLAN_CONFIGS[toPlanTier(plan)];
}

export function toPlanTier(plan?: string | null): PlanTier {
  if (plan === "visual") return "carta-visual";
  if (plan === "pro" || plan === "web") return "restaurant-pro";
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

export function displayRecurringPrice(plan: PlanConfig, interval: BillingInterval) {
  if (plan.id === "free") return "0 €";
  if (interval === "quarterly") return `${plan.quarterlyPrice} € / trimestre`;
  if (interval === "yearly") return `${plan.annualPrice} € / año`;
  return `${plan.monthlyPrice} € / mes`;
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

export function supportsLanding(plan: PlanTier) {
  return plan === "restaurant-pro";
}

export function supportsWeeklyMenu(plan: PlanTier) {
  return plan === "restaurant-pro";
}

export function getExtraLanguagesLimit(plan: PlanTier) {
  return PLAN_CONFIGS[plan].maxExtraLanguages;
}

export function supportsExtraLanguages(plan: PlanTier) {
  return getExtraLanguagesLimit(plan) > 0;
}

export function supportsAdvancedCustomization(plan: PlanTier) {
  return plan === "restaurant-pro";
}

export function getPhotoCount(products: { imageUrl?: string }[], dailyMenu?: Record<string, unknown>) {
  let total = products.filter((p) => Boolean(p.imageUrl)).length;
  if (dailyMenu) {
    ["coverImage", "startersImage", "mainsImage", "dessertsImage"].forEach((key) => {
      if (dailyMenu[key]) total += 1;
    });
  }
  return total;
}

export function isAtPhotoLimit(plan: PlanTier, currentCount: number) {
  return currentCount >= PLAN_CONFIGS[plan].maxPhotos;
}

export function photoLimitMessage(plan: PlanTier): string {
  const config = PLAN_CONFIGS[plan];
  if (plan === "free") return "El plan Gratis no incluye fotos de productos.";
  return `Has alcanzado el límite de ${config.maxPhotos} fotos de tu plan ${config.name}. ${config.upgradeMessage || ""}`;
}

export function extraLanguagesPlanMessage(plan: PlanTier) {
  if (plan === "carta-visual") return "Tu plan incluye 1 idioma extra editable.";
  if (plan === "restaurant-pro") return "Tu plan incluye hasta 3 idiomas extra editables. Ideal para restaurantes turísticos.";
  return "Idiomas extra disponibles desde Carta Visual.";
}

export function countPhotos(state: { restaurant: { logoUrl?: string; coverUrl?: string }; dailyMenu: Record<string, unknown>; products: { imageUrl?: string }[] }) {
  let total = 0;
  ["coverImage", "startersImage", "mainsImage", "dessertsImage"].forEach((key) => {
    if (state.dailyMenu?.[key]) total += 1;
  });
  total += state.products.filter((p) => Boolean(p.imageUrl)).length;
  return total;
}

export function getAutomaticCouponId(plan: PlanTier) {
  if (plan === "menu-day") return process.env.STRIPE_COUPON_MENU_DAY_FIRST_MONTH_1EUR || null;
  if (plan === "carta-visual") return process.env.STRIPE_COUPON_VISUAL_FIRST_MONTH_1EUR || null;
  if (plan === "restaurant-pro") return process.env.STRIPE_COUPON_PRO_FIRST_MONTH_1EUR || null;
  return null;
}

export function getTrialPriceId(plan: PlanId) {
  if (plan === "menu-day") return process.env.STRIPE_PRICE_MENU_DAY_TRIAL_ONE_EURO || null;
  if (plan === "carta-visual") return process.env.STRIPE_PRICE_VISUAL_TRIAL_ONE_EURO || null;
  if (plan === "restaurant-pro") return process.env.STRIPE_PRICE_PRO_TRIAL_ONE_EURO || null;
  return null;
}
