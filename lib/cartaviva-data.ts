export type ProductStatus = "active" | "soldout" | "hidden";
export type MenuTemplate = "visual" | "elegant" | "compact";
export type ImageMode = "always" | "onClick";

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
  language: string;
  theme: "clasico" | "moderno" | "oscuro" | "elegante";
};

export type Category = {
  id: string;
  name: string;
  visible: boolean;
  order: number;
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
};

export type DailyMenu = {
  enabled: boolean;
  title: string;
  price: string;
  starters: string;
  mains: string;
  desserts: string;
  drinkIncluded: boolean;
  note: string;
  availableDays: string;
};

export type Settings = {
  template: MenuTemplate;
  showImages: ImageMode;
  showAllergens: boolean;
  showTags: boolean;
  primaryColor: string;
};

export type CartaVivaState = {
  restaurant: Restaurant;
  categories: Category[];
  products: Product[];
  dailyMenu: DailyMenu;
  settings: Settings;
  published: boolean;
};

export const STORAGE_KEY = "cartaviva-builder-state-v1";

export const tagOptions = [
  "Recomendado",
  "Casero",
  "Nuevo",
  "Picante",
  "Vegano",
  "Sin gluten",
  "Para compartir"
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

export const defaultCartaVivaState: CartaVivaState = {
  restaurant: {
    name: "Casa Amelia",
    slug: "casa-amelia",
    description: "Cocina casera, tapas cuidadas y platos de temporada para disfrutar sin complicaciones.",
    logoUrl: "",
    coverUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
    whatsapp: "+34 600 123 456",
    phone: "+34 952 123 456",
    address: "Marbella, Málaga",
    instagram: "@casaamelia",
    schedule: "Lunes a domingo · 12:00 - 23:30",
    language: "Español",
    theme: "clasico"
  },
  categories: [
    { id: "daily", name: "Menú del día", visible: true, order: 0 },
    { id: "tapas", name: "Tapas", visible: true, order: 1 },
    { id: "meats", name: "Carnes", visible: true, order: 2 },
    { id: "desserts", name: "Postres", visible: true, order: 3 },
    { id: "drinks", name: "Bebidas", visible: true, order: 4 }
  ],
  products: [
    {
      id: "p1",
      categoryId: "meats",
      name: "Carrillada ibérica",
      description: "Cocinada a fuego lento con salsa casera y patatas panaderas.",
      price: "12,90 €",
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=900&auto=format&fit=crop",
      tags: ["Recomendado"],
      allergens: [],
      status: "active"
    },
    {
      id: "p2",
      categoryId: "desserts",
      name: "Tarta de queso casera",
      description: "Cremosa, dorada y servida con mermelada de frutos rojos.",
      price: "5,50 €",
      imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=900&auto=format&fit=crop",
      tags: ["Casero"],
      allergens: ["Lactosa", "Huevo"],
      status: "active"
    },
    {
      id: "p3",
      categoryId: "drinks",
      name: "Tinto de verano premium",
      description: "Refrescante, con cítricos y servido bien frío.",
      price: "3,80 €",
      imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=900&auto=format&fit=crop",
      tags: ["Nuevo"],
      allergens: [],
      status: "active"
    },
    {
      id: "p4",
      categoryId: "tapas",
      name: "Ensaladilla rusa",
      description: "Receta clásica con patata, atún, huevo y mayonesa suave.",
      price: "4,90 €",
      imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=900&auto=format&fit=crop",
      tags: ["Casero"],
      allergens: ["Huevo", "Pescado"],
      status: "soldout"
    },
    {
      id: "p5",
      categoryId: "tapas",
      name: "Gambas pil pil",
      description: "Gambas al ajillo con aceite de oliva, guindilla y pan crujiente.",
      price: "9,80 €",
      imageUrl: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=900&auto=format&fit=crop",
      tags: ["Picante", "Para compartir"],
      allergens: ["Marisco"],
      status: "active"
    }
  ],
  dailyMenu: {
    enabled: true,
    title: "Menú casero de hoy",
    price: "12,90 €",
    starters: "Salmorejo cordobés\nEnsaladilla rusa\nPasta del día",
    mains: "Carrillada ibérica\nMerluza a la plancha\nPollo al curry suave",
    desserts: "Tarta de queso\nFruta de temporada\nCafé",
    drinkIncluded: true,
    note: "Disponible de 13:00 a 16:00 o hasta agotar existencias.",
    availableDays: "Lunes a viernes"
  },
  settings: {
    template: "visual",
    showImages: "always",
    showAllergens: true,
    showTags: true,
    primaryColor: "#e85d04"
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
