import {
  defaultCartaVivaState,
  normalizeState,
  slugify,
  type CartaVivaState,
  type Category,
  type DailyMenu,
  type MenuGroup,
  type MenuTemplate,
  type PlanTier,
  type Product,
  type ProductStatus,
  type WeeklyMenu
} from "@/lib/cartaviva-data";

export type RestaurantRow = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  whatsapp: string | null;
  phone: string | null;
  address: string | null;
  instagram: string | null;
  schedule: string | null;
  show_whatsapp?: boolean | null;
  show_phone?: boolean | null;
  show_address?: boolean | null;
  show_instagram?: boolean | null;
  show_schedule?: boolean | null;
  template: MenuTemplate | null;
  primary_color: string | null;
  secondary_color?: string | null;
  background_color?: string | null;
  title_font?: "fraunces" | "playfair" | "sora" | null;
  body_font?: "inter" | "manrope" | "plus-jakarta" | null;
  button_style?: "rounded" | "pill" | "soft-shadow" | null;
  border_radius_style?: "suave" | "medio" | "grande" | null;
  visual_density?: "compacta" | "normal" | "amplia" | null;
  plan: PlanTier | null;
  selected_plan?: PlanTier | null;
  trial_type?: string | null;
  trial_started_at?: string | null;
  trial_ends_at?: string | null;
  discount_expires_at?: string | null;
  discount_used?: boolean | null;
  status: "draft" | "demo" | "proposal" | "published" | null;
  proposal_token?: string | null;
  proposal_expires_at?: string | null;
  watermark_enabled?: boolean | null;
  claimed_by?: string | null;
  is_proposal?: boolean | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  subscription_status?: string | null;
  current_period_end?: string | null;
  billing_interval?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CategoryRow = {
  id: string;
  restaurant_id: string;
  name: string;
  group_name: MenuGroup | null;
  group_label?: string | null;
  visible: boolean | null;
  sort_order: number | null;
};

export type ProductRow = {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: string | null;
  image_url: string | null;
  status: ProductStatus | null;
  tags: string[] | null;
  allergens: string[] | null;
  sort_order: number | null;
};

export type DailyMenuRow = {
  id?: string;
  restaurant_id: string;
  enabled: boolean | null;
  title: string | null;
  price: string | null;
  availability: string | null;
  schedule: string | null;
  starters: string[] | null;
  mains: string[] | null;
  desserts: string[] | null;
  drink_included: boolean | null;
  note: string | null;
  show_images: boolean | null;
  cover_image?: string | null;
  starters_image?: string | null;
  mains_image?: string | null;
  desserts_image?: string | null;
};

export type WeeklyMenuRow = {
  id: string;
  restaurant_id: string;
  weekday: number | null;
  enabled: boolean | null;
  title: string | null;
  price: string | null;
  schedule: string | null;
  starters: string[] | null;
  mains: string[] | null;
  desserts: string[] | null;
  drink_included: boolean | null;
  note: string | null;
};

export type CategoryTranslationRow = { category_id: string; restaurant_id: string; language: string; name: string | null };
export type ProductTranslationRow = { product_id: string; restaurant_id: string; language: string; name: string | null; description: string | null };
export type DailyMenuTranslationRow = { daily_menu_id?: string; restaurant_id: string; language: string; title: string | null; starters: string[] | null; mains: string[] | null; desserts: string[] | null; note: string | null };
export type RestaurantTranslationRow = { restaurant_id: string; language: string; description: string | null; schedule: string | null };

export type TranslationRows = {
  categoryTranslations?: CategoryTranslationRow[];
  productTranslations?: ProductTranslationRow[];
  dailyMenuTranslations?: DailyMenuTranslationRow[];
  restaurantTranslations?: RestaurantTranslationRow[];
};

export function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const value = Math.random() * 16 | 0;
    const result = char === "x" ? value : (value & 0x3 | 0x8);
    return result.toString(16);
  });
}

export function linesToArray(value: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

export function arrayToLines(value: string[] | null | undefined) {
  return (value || []).join("\n");
}

export function stateFromRows(
  restaurant: RestaurantRow,
  categories: CategoryRow[],
  products: ProductRow[],
  dailyMenu?: DailyMenuRow | null,
  weeklyMenus: WeeklyMenuRow[] = [],
  translationRows: TranslationRows = {}
): CartaVivaState {
  const plan = restaurant.selected_plan || restaurant.plan || "free";
  const translations = { restaurant: {}, categories: {}, products: {}, dailyMenu: {} } as CartaVivaState["translations"];

  (translationRows.restaurantTranslations || []).forEach((row) => {
    translations.restaurant[row.language] = { description: row.description || "", schedule: row.schedule || "" };
  });
  (translationRows.categoryTranslations || []).forEach((row) => {
    translations.categories[row.category_id] = translations.categories[row.category_id] || {};
    translations.categories[row.category_id][row.language] = { name: row.name || "" };
  });
  (translationRows.productTranslations || []).forEach((row) => {
    translations.products[row.product_id] = translations.products[row.product_id] || {};
    translations.products[row.product_id][row.language] = { name: row.name || "", description: row.description || "" };
  });
  (translationRows.dailyMenuTranslations || []).forEach((row) => {
    translations.dailyMenu[row.language] = {
      title: row.title || "",
      starters: arrayToLines(row.starters),
      mains: arrayToLines(row.mains),
      desserts: arrayToLines(row.desserts),
      note: row.note || ""
    };
  });

  return normalizeState({
    restaurant: {
      ...defaultCartaVivaState.restaurant,
      name: restaurant.name || defaultCartaVivaState.restaurant.name,
      slug: restaurant.slug || slugify(restaurant.name),
      description: restaurant.description || "",
      logoUrl: restaurant.logo_url || "",
      coverUrl: restaurant.cover_url || defaultCartaVivaState.restaurant.coverUrl,
      whatsapp: restaurant.whatsapp || "",
      phone: restaurant.phone || "",
      address: restaurant.address || "",
      instagram: restaurant.instagram || "",
      schedule: restaurant.schedule || "",
      showWhatsapp: restaurant.show_whatsapp ?? true,
      showPhone: restaurant.show_phone ?? true,
      showAddress: restaurant.show_address ?? true,
      showInstagram: restaurant.show_instagram ?? true,
      showSchedule: restaurant.show_schedule ?? true,
      primaryColor: restaurant.primary_color || "#e85d04",
      secondaryColor: restaurant.secondary_color || "#221812",
      backgroundColor: restaurant.background_color || "#fffaf3",
      template: restaurant.template || "visual",
      titleFont: restaurant.title_font || "fraunces",
      bodyFont: restaurant.body_font || "manrope",
      buttonStyle: restaurant.button_style || "pill",
      borderRadiusStyle: restaurant.border_radius_style || "medio",
      visualDensity: restaurant.visual_density || "normal"
    },
    categories: categories.map((category, index): Category => ({
      id: category.id,
      name: category.name,
      visible: category.visible ?? true,
      order: typeof category.sort_order === "number" ? category.sort_order : index,
      group: category.group_name || "comida",
      customGroupLabel: category.group_label || ""
    })),
    products: products.map((product, index): Product => ({
      id: product.id,
      categoryId: product.category_id,
      name: product.name,
      description: product.description || "",
      price: product.price || "",
      imageUrl: product.image_url || "",
      status: product.status || "active",
      tags: product.tags || [],
      allergens: product.allergens || [],
      order: typeof product.sort_order === "number" ? product.sort_order : index
    })),
    dailyMenu: dailyMenu ? {
      ...defaultCartaVivaState.dailyMenu,
      enabled: dailyMenu.enabled ?? true,
      title: dailyMenu.title || defaultCartaVivaState.dailyMenu.title,
      price: dailyMenu.price || defaultCartaVivaState.dailyMenu.price,
      dayLabel: dailyMenu.availability || defaultCartaVivaState.dailyMenu.dayLabel,
      schedule: dailyMenu.schedule || defaultCartaVivaState.dailyMenu.schedule,
      starters: arrayToLines(dailyMenu.starters),
      mains: arrayToLines(dailyMenu.mains),
      desserts: arrayToLines(dailyMenu.desserts),
      drinkIncluded: dailyMenu.drink_included ?? true,
      note: dailyMenu.note || "",
      showImages: dailyMenu.show_images ?? false,
      coverImage: dailyMenu.cover_image || defaultCartaVivaState.dailyMenu.coverImage,
      startersImage: dailyMenu.starters_image || "",
      mainsImage: dailyMenu.mains_image || "",
      dessertsImage: dailyMenu.desserts_image || ""
    } : defaultCartaVivaState.dailyMenu,
    weeklyMenus: weeklyMenus.map((menu, index): WeeklyMenu => ({
      id: menu.id,
      weekday: typeof menu.weekday === "number" ? menu.weekday : index,
      enabled: menu.enabled ?? true,
      title: menu.title || `Menú día ${index + 1}`,
      price: menu.price || "",
      schedule: menu.schedule || "",
      starters: arrayToLines(menu.starters),
      mains: arrayToLines(menu.mains),
      desserts: arrayToLines(menu.desserts),
      drinkIncluded: menu.drink_included ?? true,
      note: menu.note || ""
    })),
    settings: {
      ...defaultCartaVivaState.settings,
      plan,
      showBranding: plan === "free",
      extraLanguages: Object.keys(translations.restaurant).filter((lang) => lang !== "es") as any
    },
    translations,
    published: restaurant.status === "published",
    status: restaurant.status || "draft"
  });
}

export function restaurantPayloadFromState(state: CartaVivaState, ownerId: string, restaurantId?: string) {
  return {
    ...(restaurantId ? { id: restaurantId } : {}),
    owner_id: ownerId,
    name: state.restaurant.name,
    slug: slugify(state.restaurant.slug || state.restaurant.name),
    description: state.restaurant.description,
    logo_url: state.restaurant.logoUrl,
    cover_url: state.restaurant.coverUrl,
    whatsapp: state.restaurant.whatsapp,
    phone: state.restaurant.phone,
    address: state.restaurant.address,
    instagram: state.restaurant.instagram,
    schedule: state.restaurant.schedule,
    show_whatsapp: state.restaurant.showWhatsapp,
    show_phone: state.restaurant.showPhone,
    show_address: state.restaurant.showAddress,
    show_instagram: state.restaurant.showInstagram,
    show_schedule: state.restaurant.showSchedule,
    template: state.restaurant.template,
    primary_color: state.restaurant.primaryColor,
    secondary_color: state.restaurant.secondaryColor,
    background_color: state.restaurant.backgroundColor,
    title_font: state.restaurant.titleFont,
    body_font: state.restaurant.bodyFont,
    button_style: state.restaurant.buttonStyle,
    border_radius_style: state.restaurant.borderRadiusStyle,
    visual_density: state.restaurant.visualDensity,
    plan: state.settings.plan,
    selected_plan: state.settings.plan,
    status: state.status || (state.published ? "published" : "draft"),
    watermark_enabled: state.settings.showBranding,
    updated_at: new Date().toISOString()
  };
}

export function categoriesPayloadFromState(state: CartaVivaState, restaurantId: string) {
  return state.categories.map((category) => ({
    id: category.id,
    restaurant_id: restaurantId,
    name: category.name,
    group_name: category.group,
    group_label: category.customGroupLabel || null,
    visible: category.visible,
    sort_order: category.order
  }));
}

export function productsPayloadFromState(state: CartaVivaState, restaurantId: string) {
  return state.products.map((product) => ({
    id: product.id,
    restaurant_id: restaurantId,
    category_id: product.categoryId,
    name: product.name,
    description: product.description,
    price: product.price,
    image_url: product.imageUrl,
    status: product.status,
    tags: product.tags,
    allergens: product.allergens,
    sort_order: product.order
  }));
}

export function dailyMenuPayloadFromState(state: CartaVivaState, restaurantId: string) {
  return {
    restaurant_id: restaurantId,
    enabled: state.dailyMenu.enabled,
    title: state.dailyMenu.title,
    price: state.dailyMenu.price,
    availability: state.dailyMenu.dayLabel,
    schedule: state.dailyMenu.schedule,
    starters: linesToArray(state.dailyMenu.starters),
    mains: linesToArray(state.dailyMenu.mains),
    desserts: linesToArray(state.dailyMenu.desserts),
    drink_included: state.dailyMenu.drinkIncluded,
    note: state.dailyMenu.note,
    show_images: state.dailyMenu.showImages,
    cover_image: state.dailyMenu.coverImage,
    starters_image: state.dailyMenu.startersImage,
    mains_image: state.dailyMenu.mainsImage,
    desserts_image: state.dailyMenu.dessertsImage
  };
}


export function weeklyMenusPayloadFromState(state: CartaVivaState, restaurantId: string) {
  return (state.weeklyMenus || []).map((menu) => ({
    id: menu.id,
    restaurant_id: restaurantId,
    weekday: menu.weekday,
    enabled: menu.enabled,
    title: menu.title,
    price: menu.price,
    schedule: menu.schedule,
    starters: linesToArray(menu.starters || ""),
    mains: linesToArray(menu.mains || ""),
    desserts: linesToArray(menu.desserts || ""),
    drink_included: menu.drinkIncluded,
    note: menu.note
  }));
}

export function restaurantTranslationsPayloadFromState(state: CartaVivaState, restaurantId: string) {
  return Object.entries(state.translations.restaurant || {}).map(([language, value]) => ({
    restaurant_id: restaurantId,
    language,
    description: value.description || "",
    schedule: value.schedule || ""
  }));
}

export function categoryTranslationsPayloadFromState(state: CartaVivaState, restaurantId: string) {
  return Object.entries(state.translations.categories || {}).flatMap(([categoryId, byLang]) =>
    Object.entries(byLang || {}).map(([language, value]) => ({
      category_id: categoryId,
      restaurant_id: restaurantId,
      language,
      name: value.name || ""
    }))
  );
}

export function productTranslationsPayloadFromState(state: CartaVivaState, restaurantId: string) {
  return Object.entries(state.translations.products || {}).flatMap(([productId, byLang]) =>
    Object.entries(byLang || {}).map(([language, value]) => ({
      product_id: productId,
      restaurant_id: restaurantId,
      language,
      name: value.name || "",
      description: value.description || ""
    }))
  );
}

export function dailyMenuTranslationsPayloadFromState(state: CartaVivaState, restaurantId: string) {
  return Object.entries(state.translations.dailyMenu || {}).map(([language, value]) => ({
    restaurant_id: restaurantId,
    language,
    title: value.title || "",
    starters: linesToArray(value.starters || ""),
    mains: linesToArray(value.mains || ""),
    desserts: linesToArray(value.desserts || ""),
    note: value.note || ""
  }));
}

export function cloneStateForDatabase(source: CartaVivaState = defaultCartaVivaState): CartaVivaState {
  const normalized = normalizeState(source);
  const categoryMap = new Map<string, string>();
  const categories = normalized.categories.map((category) => {
    const id = uuid();
    categoryMap.set(category.id, id);
    return { ...category, id };
  });

  const fallbackCategoryId = categories.find((category) => category.group !== "menu-dia")?.id || categories[0]?.id || uuid();
  const products = normalized.products.map((product) => ({
    ...product,
    id: uuid(),
    categoryId: categoryMap.get(product.categoryId) || fallbackCategoryId
  }));

  const translations = {
    ...normalized.translations,
    categories: Object.fromEntries(categories.map((category) => [category.id, normalized.translations.categories[Array.from(categoryMap.entries()).find(([, mapped]) => mapped === category.id)?.[0] || category.id] || {}])),
    products: Object.fromEntries(products.map((product) => [product.id, normalized.translations.products[normalized.products.find((source) => categoryMap.get(source.categoryId) === product.categoryId && source.name === product.name)?.id || product.id] || {}]))
  };

  return normalizeState({
    ...normalized,
    translations,
    restaurant: {
      ...normalized.restaurant,
      slug: `${slugify(normalized.restaurant.slug || normalized.restaurant.name)}-${Math.random().toString(16).slice(2, 6)}`
    },
    categories,
    products,
    published: false,
    status: "draft",
    settings: { ...normalized.settings, plan: normalized.settings.plan || "free", showBranding: normalized.settings.plan === "free" }
  });
}

export function cloneDefaultStateForDatabase(): CartaVivaState {
  return cloneStateForDatabase(defaultCartaVivaState);
}
