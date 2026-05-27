export type ProductStatus = "active" | "soldout" | "hidden";
export type MenuTemplate =
  | "visual"
  | "elegant"
  | "compact"
  | "dark-premium"
  | "mediterranean";
export type MenuGroup =
  | "comida"
  | "bebidas"
  | "vinos"
  | "desayunos"
  | "cocteles"
  | "menu-dia"
  | "otro";
export type PlanTier = "free" | "menu-day" | "carta-visual" | "restaurant-pro";
export type LanguageCode = "es" | "en" | "fr" | "de" | "it" | "pt";
export type RestaurantStatus = "draft" | "demo" | "proposal" | "published";

export type Restaurant = {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  coverUrl: string;
  whatsapp: string;
  phone: string;
  address: string;
  instagram: string;
  schedule: string;
  showWhatsapp: boolean;
  showPhone: boolean;
  showAddress: boolean;
  showInstagram: boolean;
  showSchedule: boolean;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  template: MenuTemplate;
  titleFont: "fraunces" | "playfair" | "sora";
  bodyFont: "inter" | "manrope" | "plus-jakarta";
  buttonStyle: "rounded" | "pill" | "soft-shadow";
  borderRadiusStyle: "suave" | "medio" | "grande";
  visualDensity: "compacta" | "normal" | "amplia";
};

export type Category = {
  id: string;
  name: string;
  visible: boolean;
  order: number;
  group: MenuGroup;
  customGroupLabel?: string;
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  tags: string[];
  allergens: string[];
  status: ProductStatus;
  order: number;
};

export type DailyMenu = {
  enabled: boolean;
  title: string;
  price: string;
  dayLabel: string;
  schedule: string;
  starters: string;
  mains: string;
  desserts: string;
  drinkIncluded: boolean;
  note: string;
  showImages: boolean;
  coverImage: string;
  startersImage: string;
  mainsImage: string;
  dessertsImage: string;
};

export type WeeklyMenu = {
  id: string;
  weekday: number;
  enabled: boolean;
  title: string;
  price: string;
  schedule: string;
  starters: string;
  mains: string;
  desserts: string;
  drinkIncluded: boolean;
  note: string;
};

export type Settings = {
  plan: PlanTier;
  showAllergens: boolean;
  showTags: boolean;
  showBranding: boolean;
  fontPair: "editorial" | "modern";
  primaryLanguage: LanguageCode;
  extraLanguages: LanguageCode[];
  manualTranslationNotes: string;
  advancedCustomization: boolean;
};

export type TranslationBundle = {
  restaurant: Record<string, { description?: string; schedule?: string }>;
  categories: Record<string, Record<string, { name?: string }>>;
  products: Record<
    string,
    Record<string, { name?: string; description?: string }>
  >;
  dailyMenu: Record<
    string,
    {
      title?: string;
      starters?: string;
      mains?: string;
      desserts?: string;
      note?: string;
    }
  >;
};

export type CartaVivaState = {
  restaurant: Restaurant;
  categories: Category[];
  products: Product[];
  dailyMenu: DailyMenu;
  weeklyMenus: WeeklyMenu[];
  settings: Settings;
  translations: TranslationBundle;
  published: boolean;
  status?: RestaurantStatus;
};

export const STORAGE_KEY = "cartaviva-builder-state-v3";

export const menuGroupOptions: { value: MenuGroup; label: string }[] = [
  { value: "comida", label: "Comida" },
  { value: "bebidas", label: "Bebidas" },
  { value: "vinos", label: "Vinos" },
  { value: "desayunos", label: "Desayunos" },
  { value: "cocteles", label: "Cócteles" },
  { value: "menu-dia", label: "Menú del día" },
  { value: "otro", label: "Otro" },
];

export const templateOptions: {
  value: MenuTemplate;
  label: string;
  description: string;
}[] = [
  {
    value: "visual",
    label: "Visual",
    description:
      "Fotos visibles y tarjetas grandes para tapas, brunch y cafeterías.",
  },
  {
    value: "elegant",
    label: "Elegante",
    description: "Sobria, aire premium y foco en la lectura del producto.",
  },
  {
    value: "compact",
    label: "Compacta",
    description: "Rápida de escanear para bares con muchas referencias.",
  },
  {
    value: "dark-premium",
    label: "Oscura / Premium",
    description: "Pensada para vinos, cócteles y noche.",
  },
  {
    value: "mediterranean",
    label: "Mediterránea",
    description: "Clara, cálida y perfecta para costa o terraza.",
  },
];

export const planOptions: { value: PlanTier; label: string }[] = [
  { value: "free", label: "Gratis" },
  { value: "menu-day", label: "Menú Día" },
  { value: "carta-visual", label: "Carta Visual" },
  { value: "restaurant-pro", label: "Restaurante Pro" },
];

export const tagOptions = [
  "Recomendado",
  "Casero",
  "Nuevo",
  "Picante",
  "Vegano",
  "Vegetariano",
  "Sin gluten",
  "Sin lactosa",
  "Para compartir",
  "Especialidad",
  "Otro",
];

export const allergenOptions = [
  "Gluten",
  "Lactosa",
  "Huevo",
  "Frutos secos",
  "Marisco",
  "Pescado",
  "Soja",
];

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop";

export const defaultCartaVivaState: CartaVivaState = {
  restaurant: {
    name: "Casa Amelia",
    slug: "casa-amelia",
    description:
      "Cocina casera, tapas cuidadas y una miniweb de restaurante clara para comida, bebidas y menú del día.",
    logoUrl:
      "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop",
    coverUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop",
    whatsapp: "+34 600 123 456",
    phone: "+34 952 123 456",
    address: "Calle Aduar 14, Marbella",
    instagram: "@casaamelia",
    schedule: "Lunes a domingo · 12:00 - 23:30",
    showWhatsapp: true,
    showPhone: true,
    showAddress: true,
    showInstagram: true,
    showSchedule: true,
    primaryColor: "#e85d04",
    secondaryColor: "#221812",
    backgroundColor: "#fffaf3",
    template: "visual",
    titleFont: "fraunces",
    bodyFont: "manrope",
    buttonStyle: "pill",
    borderRadiusStyle: "medio",
    visualDensity: "normal",
  },
  categories: [
    {
      id: "daily",
      name: "Menú del día",
      visible: true,
      order: 0,
      group: "menu-dia",
      customGroupLabel: "",
    },
    { id: "tapas", name: "Tapas", visible: true, order: 1, group: "comida", customGroupLabel: "" },
    { id: "carnes", name: "Carnes", visible: true, order: 2, group: "comida", customGroupLabel: "" },
    {
      id: "postres",
      name: "Postres",
      visible: true,
      order: 3,
      group: "comida",
      customGroupLabel: "",
    },
    {
      id: "bebidas",
      name: "Bebidas",
      visible: true,
      order: 4,
      group: "bebidas",
      customGroupLabel: "",
    },
    { id: "cafes", name: "Cafés", visible: true, order: 5, group: "bebidas", customGroupLabel: "" },
  ],
  products: [
    {
      id: "p1",
      categoryId: "carnes",
      name: "Carrillada ibérica",
      description:
        "Cocinada a fuego lento con salsa casera y patatas panaderas.",
      price: "12,90 €",
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
      tags: ["Recomendado"],
      allergens: [],
      status: "active",
      order: 0,
    },
    {
      id: "p2",
      categoryId: "tapas",
      name: "Ensaladilla rusa",
      description: "Receta clásica con atún, huevo y mayonesa suave.",
      price: "4,90 €",
      imageUrl:
        "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop",
      tags: ["Casero"],
      allergens: ["Huevo", "Pescado"],
      status: "soldout",
      order: 1,
    },
    {
      id: "p3",
      categoryId: "tapas",
      name: "Gambas pil pil",
      description: "Gambas al ajillo con aceite de oliva y guindilla.",
      price: "9,80 €",
      imageUrl:
        "https://images.unsplash.com/photo-1625944525533-473f1cb7d3b6?q=80&w=1200&auto=format&fit=crop",
      tags: ["Picante", "Para compartir"],
      allergens: ["Marisco"],
      status: "active",
      order: 2,
    },
    {
      id: "p4",
      categoryId: "postres",
      name: "Tarta de queso casera",
      description: "Cremosa, dorada y servida con frutos rojos.",
      price: "5,50 €",
      imageUrl:
        "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1200&auto=format&fit=crop",
      tags: ["Casero", "Especialidad"],
      allergens: ["Lactosa", "Huevo"],
      status: "active",
      order: 3,
    },
    {
      id: "p5",
      categoryId: "bebidas",
      name: "Tinto de verano",
      description: "Refrescante, con cítricos y servido bien frio.",
      price: "3,80 €",
      imageUrl:
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop",
      tags: ["Nuevo"],
      allergens: [],
      status: "active",
      order: 4,
    },
    {
      id: "p6",
      categoryId: "bebidas",
      name: "Cerveza cana",
      description: "Caña fría servida en vaso helado.",
      price: "2,20 €",
      imageUrl: "",
      tags: [],
      allergens: ["Gluten"],
      status: "active",
      order: 5,
    },
    {
      id: "p7",
      categoryId: "bebidas",
      name: "Agua mineral",
      description: "Botella de agua mineral bien fría.",
      price: "1,90 €",
      imageUrl: "",
      tags: [],
      allergens: [],
      status: "active",
      order: 6,
    },
    {
      id: "p8",
      categoryId: "cafes",
      name: "Café solo",
      description: "Café intenso servido al momento.",
      price: "1,40 €",
      imageUrl: "",
      tags: [],
      allergens: [],
      status: "active",
      order: 7,
    },
    {
      id: "p9",
      categoryId: "cafes",
      name: "Café con leche",
      description: "Café con leche cremosa y espuma ligera.",
      price: "1,70 €",
      imageUrl: "",
      tags: [],
      allergens: ["Lactosa"],
      status: "active",
      order: 8,
    },
    {
      id: "p10",
      categoryId: "carnes",
      name: "Entrecot",
      description: "Pieza jugosa a la plancha con patata rústica.",
      price: "18,50 €",
      imageUrl:
        "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1200&auto=format&fit=crop",
      tags: ["Especialidad"],
      allergens: [],
      status: "active",
      order: 9,
    },
    {
      id: "p11",
      categoryId: "tapas",
      name: "Salmorejo cordobés",
      description: "Con huevo duro, jamon y aceite de oliva.",
      price: "5,20 €",
      imageUrl:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1200&auto=format&fit=crop",
      tags: ["Casero"],
      allergens: ["Gluten", "Huevo"],
      status: "active",
      order: 10,
    },
  ],
  dailyMenu: {
    enabled: true,
    title: "Menú casero de hoy",
    price: "12,90 €",
    dayLabel: "Lunes a viernes",
    schedule: "13:00 - 16:00",
    starters: "Salmorejo cordobés\nEnsaladilla rusa\nCrema de verduras",
    mains: "Carrillada ibérica\nMerluza a la plancha\nPollo al curry suave",
    desserts: "Tarta de queso\nFruta de temporada\nCafé",
    drinkIncluded: true,
    note: "Disponible hasta agotar existencias.",
    showImages: true,
    coverImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
    startersImage:
      "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop",
    mainsImage:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    dessertsImage:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1200&auto=format&fit=crop",
  },
  weeklyMenus: [
    {
      id: "wm-1",
      weekday: 1,
      enabled: true,
      title: "Menú del lunes",
      price: "12,90 €",
      schedule: "13:00 - 16:00",
      starters: "Salmorejo cordobés\nEnsaladilla rusa",
      mains: "Carrillada ibérica\nMerluza a la plancha",
      desserts: "Tarta de queso\nFruta de temporada",
      drinkIncluded: true,
      note: "Menú semanal preparado para el lunes.",
    },
    {
      id: "wm-2",
      weekday: 2,
      enabled: true,
      title: "Menú del martes",
      price: "12,90 €",
      schedule: "13:00 - 16:00",
      starters: "Crema de verduras\nPasta del día",
      mains: "Pollo al curry suave\nPescado del día",
      desserts: "Flan casero\nCafé",
      drinkIncluded: true,
      note: "Puedes programar cada día y dejarlo listo.",
    },
  ],
  settings: {
    plan: "carta-visual",
    showAllergens: true,
    showTags: true,
    showBranding: false,
    fontPair: "editorial",
    primaryLanguage: "es",
    extraLanguages: ["en", "de"],
    manualTranslationNotes:
      "Fase pro: revisar titulos, descripciones y etiquetas de cada idioma manualmente.",
    advancedCustomization: false,
  },
  translations: {
    restaurant: {
      en: {
        description:
          "A warm restaurant with homemade food, daily menu and Mediterranean details.",
        schedule: "Monday to Saturday · 12:00 - 23:30",
      },
      de: {
        description:
          "Ein gemütliches Restaurant mit hausgemachtem Essen, Tagesmenü und mediterranen Details.",
        schedule: "Montag bis Samstag · 12:00 - 23:30",
      },
    },
    categories: {
      tapas: { en: { name: "Tapas" }, de: { name: "Tapas" } },
      carnes: { en: { name: "Meat" }, de: { name: "Fleisch" } },
      postres: { en: { name: "Desserts" }, de: { name: "Desserts" } },
      bebidas: { en: { name: "Drinks" }, de: { name: "Getränke" } },
      cafes: { en: { name: "Coffee" }, de: { name: "Kaffee" } },
    },
    products: {},
    dailyMenu: {
      en: {
        title: "Homemade menu of the day",
        starters: "Cordoban salmorejo\nRussian salad\nVegetable cream",
        mains: "Iberian pork cheek\nGrilled hake\nMild chicken curry",
        desserts: "Cheesecake\nSeasonal fruit\nCoffee",
        note: "Available while stocks last.",
      },
      de: {
        title: "Hausgemachtes Tagesmenü",
        starters: "Salmorejo aus Córdoba\nRussischer Salat\nGemüsecreme",
        mains:
          "Iberische Schweinebäckchen\nSeehecht vom Grill\nMildes Hähnchencurry",
        desserts: "Käsekuchen\nObst der Saison\nKaffee",
        note: "Verfügbar solange der Vorrat reicht.",
      },
    },
  },
  published: true,
  status: "published",
};

export function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "mi-restaurante"
  );
}

export function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function normalizeState(state: CartaVivaState): CartaVivaState {
  return {
    ...defaultCartaVivaState,
    ...state,
    restaurant: { ...defaultCartaVivaState.restaurant, ...state.restaurant },
    dailyMenu: { ...defaultCartaVivaState.dailyMenu, ...state.dailyMenu },
    weeklyMenus: (state.weeklyMenus?.length
      ? state.weeklyMenus
      : defaultCartaVivaState.weeklyMenus
    ).map((menu, index) => ({
      ...menu,
      id: menu.id || uid("weekly"),
      weekday: typeof menu.weekday === "number" ? menu.weekday : index,
      enabled: menu.enabled ?? true,
      drinkIncluded: menu.drinkIncluded ?? true,
    })),
    settings: { ...defaultCartaVivaState.settings, ...state.settings },
    translations: {
      restaurant: {
        ...defaultCartaVivaState.translations.restaurant,
        ...(state.translations?.restaurant || {}),
      },
      categories: {
        ...defaultCartaVivaState.translations.categories,
        ...(state.translations?.categories || {}),
      },
      products: {
        ...defaultCartaVivaState.translations.products,
        ...(state.translations?.products || {}),
      },
      dailyMenu: {
        ...defaultCartaVivaState.translations.dailyMenu,
        ...(state.translations?.dailyMenu || {}),
      },
    },
    published: Boolean(state.published),
    status: state.status || (state.published ? "published" : "draft"),
    categories: (state.categories?.length
      ? state.categories
      : defaultCartaVivaState.categories
    ).map((category, index) => ({
      ...category,
      visible: category.visible ?? true,
      order: typeof category.order === "number" ? category.order : index,
      group: category.group ?? "comida",
      customGroupLabel: category.customGroupLabel ?? "",
    })),
    products: (state.products?.length
      ? state.products
      : defaultCartaVivaState.products
    ).map((product, index) => ({
      ...product,
      imageUrl: product.imageUrl ?? "",
      tags: product.tags ?? [],
      allergens: product.allergens ?? [],
      order: typeof product.order === "number" ? product.order : index,
      status: product.status ?? "active",
    })),
  };
}

export function sortByOrder<T extends { order: number }>(items: T[]) {
  return [...items].sort((a, b) => a.order - b.order);
}

export function reorderItems<T extends { order: number }>(
  items: T[],
  from: number,
  to: number,
) {
  const next = [...sortByOrder(items)];
  if (to < 0 || to >= next.length) return next;
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next.map((entry, index) => ({ ...entry, order: index }));
}

export function moveEntity<T extends { id: string; order: number }>(
  items: T[],
  id: string,
  direction: "up" | "down" | "first" | "last",
) {
  const ordered = sortByOrder(items);
  const index = ordered.findIndex((item) => item.id === id);
  if (index === -1) return ordered;
  const target =
    direction === "up"
      ? index - 1
      : direction === "down"
        ? index + 1
        : direction === "first"
          ? 0
          : ordered.length - 1;
  return reorderItems(ordered, index, target);
}

export function getVisibleCategories(categories: Category[]) {
  return sortByOrder(categories).filter((category) => category.visible);
}

export function getVisibleProducts(products: Product[], categoryId: string) {
  return sortByOrder(products).filter(
    (product) =>
      product.categoryId === categoryId && product.status !== "hidden",
  );
}

export function getTodaysWeeklyMenu(state: CartaVivaState, date = new Date()) {
  const weekday = date.getDay();
  return (
    (state.weeklyMenus || []).find(
      (menu) => menu.enabled && menu.weekday === weekday,
    ) || null
  );
}

export function weeklyMenuToDailyMenu(
  state: CartaVivaState,
  date = new Date(),
): DailyMenu {
  const weekly = getTodaysWeeklyMenu(state, date);
  if (!weekly) return state.dailyMenu;
  return {
    ...state.dailyMenu,
    enabled: true,
    title: weekly.title || state.dailyMenu.title,
    price: weekly.price || state.dailyMenu.price,
    dayLabel: "Hoy",
    schedule: weekly.schedule || state.dailyMenu.schedule,
    starters: weekly.starters || state.dailyMenu.starters,
    mains: weekly.mains || state.dailyMenu.mains,
    desserts: weekly.desserts || state.dailyMenu.desserts,
    drinkIncluded: weekly.drinkIncluded,
    note: weekly.note || state.dailyMenu.note,
  };
}

export function buildPublicPath(slug: string) {
  return `/carta/${slugify(slug)}`;
}
