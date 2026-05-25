export type ProductStatus = "active" | "soldout" | "hidden";
export type MenuTemplate = "visual" | "elegant" | "compact" | "dark-premium" | "mediterranean";
export type MenuGroup = "comida" | "bebidas" | "vinos" | "desayunos" | "cocteles" | "menu-dia";
export type PlanTier = "free" | "menu-day" | "carta-visual" | "restaurant-pro";

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
  primaryColor: string;
  template: MenuTemplate;
};

export type Category = {
  id: string;
  name: string;
  visible: boolean;
  order: number;
  group: MenuGroup;
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

export type Settings = {
  plan: PlanTier;
  showAllergens: boolean;
  showTags: boolean;
  showBranding: boolean;
  fontPair: "editorial" | "modern";
  extraLanguages: string[];
  manualTranslationNotes: string;
  advancedCustomization: boolean;
};

export type CartaVivaState = {
  restaurant: Restaurant;
  categories: Category[];
  products: Product[];
  dailyMenu: DailyMenu;
  settings: Settings;
  published: boolean;
};

export const STORAGE_KEY = "cartaviva-builder-state-v3";

export const menuGroupOptions: { value: MenuGroup; label: string }[] = [
  { value: "comida", label: "Comida" },
  { value: "bebidas", label: "Bebidas" },
  { value: "vinos", label: "Vinos" },
  { value: "desayunos", label: "Desayunos" },
  { value: "cocteles", label: "Cocteles" },
  { value: "menu-dia", label: "Menu del dia" }
];

export const templateOptions: { value: MenuTemplate; label: string; description: string }[] = [
  { value: "visual", label: "Visual", description: "Fotos visibles y tarjetas grandes para tapas, brunch y cafeterias." },
  { value: "elegant", label: "Elegante", description: "Sobria, aire premium y foco en la lectura del producto." },
  { value: "compact", label: "Compacta", description: "Rapida de escanear para bares con muchas referencias." },
  { value: "dark-premium", label: "Oscura / Premium", description: "Pensada para vinos, cocteles y noche." },
  { value: "mediterranean", label: "Mediterranea", description: "Clara, calida y perfecta para costa o terraza." }
];

export const planOptions: { value: PlanTier; label: string }[] = [
  { value: "free", label: "Gratis" },
  { value: "menu-day", label: "Menu Dia" },
  { value: "carta-visual", label: "Carta Visual" },
  { value: "restaurant-pro", label: "Restaurante Pro" }
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
  "Especialidad"
];

export const allergenOptions = [
  "Gluten",
  "Lactosa",
  "Huevo",
  "Frutos secos",
  "Marisco",
  "Pescado",
  "Soja"
];

export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop";

export const defaultCartaVivaState: CartaVivaState = {
  restaurant: {
    name: "Casa Amelia",
    slug: "casa-amelia",
    description: "Cocina casera, tapas cuidadas y una miniweb de restaurante clara para comida, bebidas y menu del dia.",
    logoUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop",
    whatsapp: "+34 600 123 456",
    phone: "+34 952 123 456",
    address: "Calle Aduar 14, Marbella",
    instagram: "@casaamelia",
    schedule: "Lunes a domingo · 12:00 - 23:30",
    primaryColor: "#e85d04",
    template: "visual"
  },
  categories: [
    { id: "daily", name: "Menu del dia", visible: true, order: 0, group: "menu-dia" },
    { id: "tapas", name: "Tapas", visible: true, order: 1, group: "comida" },
    { id: "carnes", name: "Carnes", visible: true, order: 2, group: "comida" },
    { id: "postres", name: "Postres", visible: true, order: 3, group: "comida" },
    { id: "bebidas", name: "Bebidas", visible: true, order: 4, group: "bebidas" },
    { id: "cafes", name: "Cafes", visible: true, order: 5, group: "bebidas" }
  ],
  products: [
    {
      id: "p1",
      categoryId: "carnes",
      name: "Carrillada iberica",
      description: "Cocinada a fuego lento con salsa casera y patatas panaderas.",
      price: "12,90 €",
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
      tags: ["Recomendado"],
      allergens: [],
      status: "active",
      order: 0
    },
    {
      id: "p2",
      categoryId: "tapas",
      name: "Ensaladilla rusa",
      description: "Receta clasica con atun, huevo y mayonesa suave.",
      price: "4,90 €",
      imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop",
      tags: ["Casero"],
      allergens: ["Huevo", "Pescado"],
      status: "soldout",
      order: 1
    },
    {
      id: "p3",
      categoryId: "tapas",
      name: "Gambas pil pil",
      description: "Gambas al ajillo con aceite de oliva y guindilla.",
      price: "9,80 €",
      imageUrl: "https://images.unsplash.com/photo-1625944525533-473f1cb7d3b6?q=80&w=1200&auto=format&fit=crop",
      tags: ["Picante", "Para compartir"],
      allergens: ["Marisco"],
      status: "active",
      order: 2
    },
    {
      id: "p4",
      categoryId: "postres",
      name: "Tarta de queso casera",
      description: "Cremosa, dorada y servida con frutos rojos.",
      price: "5,50 €",
      imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1200&auto=format&fit=crop",
      tags: ["Casero", "Especialidad"],
      allergens: ["Lactosa", "Huevo"],
      status: "active",
      order: 3
    },
    {
      id: "p5",
      categoryId: "bebidas",
      name: "Tinto de verano",
      description: "Refrescante, con citricos y servido bien frio.",
      price: "3,80 €",
      imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop",
      tags: ["Nuevo"],
      allergens: [],
      status: "active",
      order: 4
    },
    {
      id: "p6",
      categoryId: "bebidas",
      name: "Cerveza cana",
      description: "Cana fria servida en vaso helado.",
      price: "2,20 €",
      imageUrl: "",
      tags: [],
      allergens: ["Gluten"],
      status: "active",
      order: 5
    },
    {
      id: "p7",
      categoryId: "bebidas",
      name: "Agua mineral",
      description: "Botella de agua mineral bien fria.",
      price: "1,90 €",
      imageUrl: "",
      tags: [],
      allergens: [],
      status: "active",
      order: 6
    },
    {
      id: "p8",
      categoryId: "cafes",
      name: "Cafe solo",
      description: "Cafe intenso servido al momento.",
      price: "1,40 €",
      imageUrl: "",
      tags: [],
      allergens: [],
      status: "active",
      order: 7
    },
    {
      id: "p9",
      categoryId: "cafes",
      name: "Cafe con leche",
      description: "Cafe con leche cremosa y espuma ligera.",
      price: "1,70 €",
      imageUrl: "",
      tags: [],
      allergens: ["Lactosa"],
      status: "active",
      order: 8
    },
    {
      id: "p10",
      categoryId: "carnes",
      name: "Entrecot",
      description: "Pieza jugosa a la plancha con patata rustica.",
      price: "18,50 €",
      imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1200&auto=format&fit=crop",
      tags: ["Especialidad"],
      allergens: [],
      status: "active",
      order: 9
    },
    {
      id: "p11",
      categoryId: "tapas",
      name: "Salmorejo cordobes",
      description: "Con huevo duro, jamon y aceite de oliva.",
      price: "5,20 €",
      imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1200&auto=format&fit=crop",
      tags: ["Casero"],
      allergens: ["Gluten", "Huevo"],
      status: "active",
      order: 10
    }
  ],
  dailyMenu: {
    enabled: true,
    title: "Menu casero de hoy",
    price: "12,90 €",
    dayLabel: "Lunes a viernes",
    schedule: "13:00 - 16:00",
    starters: "Salmorejo cordobes\nEnsaladilla rusa\nCrema de verduras",
    mains: "Carrillada iberica\nMerluza a la plancha\nPollo al curry suave",
    desserts: "Tarta de queso\nFruta de temporada\nCafe",
    drinkIncluded: true,
    note: "Disponible hasta agotar existencias.",
    showImages: true,
    coverImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
    startersImage: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop",
    mainsImage: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    dessertsImage: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1200&auto=format&fit=crop"
  },
  settings: {
    plan: "carta-visual",
    showAllergens: true,
    showTags: true,
    showBranding: false,
    fontPair: "editorial",
    extraLanguages: ["English", "Deutsch"],
    manualTranslationNotes: "Fase pro: revisar titulos, descripciones y etiquetas de cada idioma manualmente.",
    advancedCustomization: false
  },
  published: true
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "mi-restaurante";
}

export function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export function splitLines(value: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

export function normalizeState(state: CartaVivaState): CartaVivaState {
  return {
    ...defaultCartaVivaState,
    ...state,
    restaurant: { ...defaultCartaVivaState.restaurant, ...state.restaurant },
    dailyMenu: { ...defaultCartaVivaState.dailyMenu, ...state.dailyMenu },
    settings: { ...defaultCartaVivaState.settings, ...state.settings },
    categories: (state.categories?.length ? state.categories : defaultCartaVivaState.categories).map((category, index) => ({
      visible: true,
      order: index,
      group: "comida",
      ...category
    })),
    products: (state.products?.length ? state.products : defaultCartaVivaState.products).map((product, index) => ({
      imageUrl: "",
      tags: [],
      allergens: [],
      order: index,
      status: "active",
      ...product
    }))
  };
}

export function sortByOrder<T extends { order: number }>(items: T[]) {
  return [...items].sort((a, b) => a.order - b.order);
}

export function reorderItems<T extends { order: number }>(items: T[], from: number, to: number) {
  const next = [...sortByOrder(items)];
  if (to < 0 || to >= next.length) return next;
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next.map((entry, index) => ({ ...entry, order: index }));
}

export function moveEntity<T extends { id: string; order: number }>(items: T[], id: string, direction: "up" | "down" | "first" | "last") {
  const ordered = sortByOrder(items);
  const index = ordered.findIndex((item) => item.id === id);
  if (index === -1) return ordered;
  const target =
    direction === "up" ? index - 1 :
    direction === "down" ? index + 1 :
    direction === "first" ? 0 :
    ordered.length - 1;
  return reorderItems(ordered, index, target);
}

export function getVisibleCategories(categories: Category[]) {
  return sortByOrder(categories).filter((category) => category.visible);
}

export function getVisibleProducts(products: Product[], categoryId: string) {
  return sortByOrder(products).filter((product) => product.categoryId === categoryId && product.status !== "hidden");
}

export function buildPublicPath(slug: string) {
  return `/carta/${slugify(slug)}`;
}
