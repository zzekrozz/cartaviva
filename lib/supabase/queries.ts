import {
  categoriesPayloadFromState,
  categoryTranslationsPayloadFromState,
  cloneStateForDatabase,
  dailyMenuPayloadFromState,
  dailyMenuTranslationsPayloadFromState,
  productTranslationsPayloadFromState,
  productsPayloadFromState,
  restaurantPayloadFromState,
  restaurantTranslationsPayloadFromState,
  stateFromRows,
  weeklyMenusPayloadFromState,
  type CategoryRow,
  type DailyMenuRow,
  type ProductRow,
  type RestaurantRow,
  type WeeklyMenuRow
} from "@/lib/supabase/mappers";
import { slugify, type CartaVivaState } from "@/lib/cartaviva-data";

export async function getCurrentUser(supabase: any) {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data?.user || null;
}

export async function upsertProfile(supabase: any, user: any) {
  if (!user?.id) return;
  await supabase.from("profiles").upsert({ id: user.id, email: user.email, updated_at: new Date().toISOString() }, { onConflict: "id" });
}


async function loadTranslations(supabase: any, restaurantId: string) {
  const [restaurantTranslations, categoryTranslations, productTranslations, dailyMenuTranslations] = await Promise.all([
    supabase.from("restaurant_translations").select("*").eq("restaurant_id", restaurantId),
    supabase.from("category_translations").select("*").eq("restaurant_id", restaurantId),
    supabase.from("product_translations").select("*").eq("restaurant_id", restaurantId),
    supabase.from("daily_menu_translations").select("*").eq("restaurant_id", restaurantId)
  ]);

  [restaurantTranslations, categoryTranslations, productTranslations, dailyMenuTranslations].forEach((result) => {
    if (result.error && result.error.code !== "42P01") throw result.error;
  });

  return {
    restaurantTranslations: restaurantTranslations.data || [],
    categoryTranslations: categoryTranslations.data || [],
    productTranslations: productTranslations.data || [],
    dailyMenuTranslations: dailyMenuTranslations.data || []
  };
}

async function saveTranslations(supabase: any, state: CartaVivaState, restaurantId: string) {
  await Promise.all([
    supabase.from("restaurant_translations").delete().eq("restaurant_id", restaurantId),
    supabase.from("category_translations").delete().eq("restaurant_id", restaurantId),
    supabase.from("product_translations").delete().eq("restaurant_id", restaurantId),
    supabase.from("daily_menu_translations").delete().eq("restaurant_id", restaurantId)
  ]);

  const restaurantTranslations = restaurantTranslationsPayloadFromState(state, restaurantId);
  const categoryTranslations = categoryTranslationsPayloadFromState(state, restaurantId);
  const productTranslations = productTranslationsPayloadFromState(state, restaurantId);
  const dailyMenuTranslations = dailyMenuTranslationsPayloadFromState(state, restaurantId);

  const inserts = [
    restaurantTranslations.length ? supabase.from("restaurant_translations").insert(restaurantTranslations) : null,
    categoryTranslations.length ? supabase.from("category_translations").insert(categoryTranslations) : null,
    productTranslations.length ? supabase.from("product_translations").insert(productTranslations) : null,
    dailyMenuTranslations.length ? supabase.from("daily_menu_translations").insert(dailyMenuTranslations) : null
  ].filter(Boolean);

  const results = await Promise.all(inserts);
  results.forEach((result: any) => { if (result?.error) throw result.error; });
}

export async function loadUserRestaurants(supabase: any, ownerId: string): Promise<RestaurantRow[]> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", ownerId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function loadRestaurantState(supabase: any, restaurantId: string, ownerId: string): Promise<{ state: CartaVivaState; restaurant: RestaurantRow }> {
  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", restaurantId)
    .eq("owner_id", ownerId)
    .single();

  if (restaurantError) throw restaurantError;

  const [{ data: categories, error: categoriesError }, { data: products, error: productsError }, { data: dailyMenu, error: dailyMenuError }, { data: weeklyMenus, error: weeklyMenusError }, translations] = await Promise.all([
    supabase.from("categories").select("*").eq("restaurant_id", restaurantId).order("sort_order", { ascending: true }),
    supabase.from("products").select("*").eq("restaurant_id", restaurantId).order("sort_order", { ascending: true }),
    supabase.from("daily_menus").select("*").eq("restaurant_id", restaurantId).maybeSingle(),
    supabase.from("weekly_menus").select("*").eq("restaurant_id", restaurantId).order("weekday", { ascending: true }),
    loadTranslations(supabase, restaurantId)
  ]);

  if (categoriesError) throw categoriesError;
  if (productsError) throw productsError;
  if (dailyMenuError) throw dailyMenuError;
  if (weeklyMenusError && weeklyMenusError.code !== "42P01") throw weeklyMenusError;

  return {
    restaurant,
    state: stateFromRows(restaurant, categories as CategoryRow[], products as ProductRow[], dailyMenu as DailyMenuRow | null, (weeklyMenus || []) as WeeklyMenuRow[], translations)
  };
}

export async function loadPublishedRestaurantBySlug(supabase: any, slug: string): Promise<CartaVivaState | null> {
  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slugify(slug))
    .eq("status", "published")
    .maybeSingle();

  if (restaurantError) throw restaurantError;
  if (!restaurant) return null;

  const [{ data: categories, error: categoriesError }, { data: products, error: productsError }, { data: dailyMenu, error: dailyMenuError }, { data: weeklyMenus, error: weeklyMenusError }, translations] = await Promise.all([
    supabase.from("categories").select("*").eq("restaurant_id", restaurant.id).order("sort_order", { ascending: true }),
    supabase.from("products").select("*").eq("restaurant_id", restaurant.id).order("sort_order", { ascending: true }),
    supabase.from("daily_menus").select("*").eq("restaurant_id", restaurant.id).maybeSingle(),
    supabase.from("weekly_menus").select("*").eq("restaurant_id", restaurant.id).order("weekday", { ascending: true }),
    loadTranslations(supabase, restaurant.id)
  ]);

  if (categoriesError) throw categoriesError;
  if (productsError) throw productsError;
  if (dailyMenuError) throw dailyMenuError;
  if (weeklyMenusError && weeklyMenusError.code !== "42P01") throw weeklyMenusError;

  return stateFromRows(restaurant, categories as CategoryRow[], products as ProductRow[], dailyMenu as DailyMenuRow | null, (weeklyMenus || []) as WeeklyMenuRow[], translations);
}

export async function createRestaurantFromDemo(supabase: any, ownerId: string, sourceState?: CartaVivaState, trialType?: string | null) {
  const restaurantId = crypto.randomUUID();
  const state = cloneStateForDatabase(sourceState);

  const now = new Date();
  const trialEnds = new Date(now);
  trialEnds.setMonth(trialEnds.getMonth() + 1);
  const discountEnds = new Date(trialEnds);
  discountEnds.setMonth(discountEnds.getMonth() + 3);

  const restaurantPayload = {
    ...restaurantPayloadFromState(state, ownerId, restaurantId),
    name: state.restaurant.name || "Mi restaurante",
    slug: state.restaurant.slug,
    status: "draft",
    ...(trialType === "one-euro" && state.settings.plan !== "free" ? {
      trial_type: "one-euro",
      trial_started_at: now.toISOString(),
      trial_ends_at: trialEnds.toISOString(),
      discount_expires_at: discountEnds.toISOString(),
      discount_used: false
    } : {})
  };

  const { error: restaurantError } = await supabase.from("restaurants").insert(restaurantPayload);
  if (restaurantError) throw restaurantError;

  const { error: categoriesError } = await supabase.from("categories").insert(categoriesPayloadFromState(state, restaurantId));
  if (categoriesError) throw categoriesError;

  const { error: productsError } = await supabase.from("products").insert(productsPayloadFromState(state, restaurantId));
  if (productsError) throw productsError;

  const { error: dailyError } = await supabase.from("daily_menus").insert(dailyMenuPayloadFromState(state, restaurantId));
  if (dailyError) throw dailyError;

  const weeklyPayload = weeklyMenusPayloadFromState(state, restaurantId);
  if (weeklyPayload.length) {
    const { error: weeklyError } = await supabase.from("weekly_menus").insert(weeklyPayload);
    if (weeklyError && weeklyError.code !== "42P01") throw weeklyError;
  }

  await saveTranslations(supabase, state, restaurantId);

  return restaurantId;
}

export async function saveRestaurantState(supabase: any, state: CartaVivaState, ownerId: string, restaurantId: string, publish = false) {
  const nextState = { ...state, published: publish ? true : state.published };

  const { error: restaurantError } = await supabase
    .from("restaurants")
    .upsert(restaurantPayloadFromState(nextState, ownerId, restaurantId), { onConflict: "id" });

  if (restaurantError) throw restaurantError;

  await Promise.all([
    supabase.from("restaurant_translations").delete().eq("restaurant_id", restaurantId),
    supabase.from("category_translations").delete().eq("restaurant_id", restaurantId),
    supabase.from("product_translations").delete().eq("restaurant_id", restaurantId),
    supabase.from("daily_menu_translations").delete().eq("restaurant_id", restaurantId)
  ]);

  const { error: productsDeleteError } = await supabase.from("products").delete().eq("restaurant_id", restaurantId);
  if (productsDeleteError) throw productsDeleteError;

  const { error: categoriesDeleteError } = await supabase.from("categories").delete().eq("restaurant_id", restaurantId);
  if (categoriesDeleteError) throw categoriesDeleteError;

  const categoriesPayload = categoriesPayloadFromState(nextState, restaurantId);
  if (categoriesPayload.length) {
    const { error } = await supabase.from("categories").insert(categoriesPayload);
    if (error) throw error;
  }

  const productsPayload = productsPayloadFromState(nextState, restaurantId);
  if (productsPayload.length) {
    const { error } = await supabase.from("products").insert(productsPayload);
    if (error) throw error;
  }

  const { error: dailyError } = await supabase
    .from("daily_menus")
    .upsert(dailyMenuPayloadFromState(nextState, restaurantId), { onConflict: "restaurant_id" });

  if (dailyError) throw dailyError;

  const { error: weeklyDeleteError } = await supabase.from("weekly_menus").delete().eq("restaurant_id", restaurantId);
  if (weeklyDeleteError && weeklyDeleteError.code !== "42P01") throw weeklyDeleteError;
  const weeklyPayload = weeklyMenusPayloadFromState(nextState, restaurantId);
  if (weeklyPayload.length) {
    const { error: weeklyError } = await supabase.from("weekly_menus").insert(weeklyPayload);
    if (weeklyError && weeklyError.code !== "42P01") throw weeklyError;
  }

  await saveTranslations(supabase, nextState, restaurantId);

  return nextState;
}

export async function loadProposalRestaurantBySlug(supabase: any, slug: string): Promise<CartaVivaState | null> {
  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slugify(slug))
    .eq("is_proposal", true)
    .maybeSingle();

  if (restaurantError) throw restaurantError;
  if (!restaurant) return null;

  const [{ data: categories, error: categoriesError }, { data: products, error: productsError }, { data: dailyMenu, error: dailyMenuError }, { data: weeklyMenus, error: weeklyMenusError }, translations] = await Promise.all([
    supabase.from("categories").select("*").eq("restaurant_id", restaurant.id).order("sort_order", { ascending: true }),
    supabase.from("products").select("*").eq("restaurant_id", restaurant.id).order("sort_order", { ascending: true }),
    supabase.from("daily_menus").select("*").eq("restaurant_id", restaurant.id).maybeSingle(),
    supabase.from("weekly_menus").select("*").eq("restaurant_id", restaurant.id).order("weekday", { ascending: true }),
    loadTranslations(supabase, restaurant.id)
  ]);

  if (categoriesError) throw categoriesError;
  if (productsError) throw productsError;
  if (dailyMenuError) throw dailyMenuError;
  if (weeklyMenusError && weeklyMenusError.code !== "42P01") throw weeklyMenusError;

  return stateFromRows(restaurant, categories as CategoryRow[], products as ProductRow[], dailyMenu as DailyMenuRow | null, (weeklyMenus || []) as WeeklyMenuRow[], translations);
}

export async function duplicateRestaurantAsProposal(supabase: any, source: CartaVivaState, ownerId: string) {
  const restaurantId = crypto.randomUUID();
  const state = cloneStateForDatabase(source);
  state.status = "proposal";
  state.published = false;
  state.settings.showBranding = true;

  const slug = `propuesta-${slugify(source.restaurant.slug || source.restaurant.name)}-${Math.random().toString(16).slice(2, 6)}`;
  const payload = {
    ...restaurantPayloadFromState(state, ownerId, restaurantId),
    slug,
    status: "proposal",
    is_proposal: true,
    watermark_enabled: true,
    proposal_token: crypto.randomUUID(),
    proposal_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
  };

  const { error: restaurantError } = await supabase.from("restaurants").insert(payload);
  if (restaurantError) throw restaurantError;

  const { error: categoriesError } = await supabase.from("categories").insert(categoriesPayloadFromState(state, restaurantId));
  if (categoriesError) throw categoriesError;

  const { error: productsError } = await supabase.from("products").insert(productsPayloadFromState(state, restaurantId));
  if (productsError) throw productsError;

  const { error: dailyError } = await supabase.from("daily_menus").insert(dailyMenuPayloadFromState(state, restaurantId));
  if (dailyError) throw dailyError;

  const weeklyPayload = weeklyMenusPayloadFromState(state, restaurantId);
  if (weeklyPayload.length) {
    const { error: weeklyError } = await supabase.from("weekly_menus").insert(weeklyPayload);
    if (weeklyError && weeklyError.code !== "42P01") throw weeklyError;
  }

  await saveTranslations(supabase, state, restaurantId);

  return { id: restaurantId, slug };
}

export async function convertProposalToPublished(supabase: any, restaurantId: string, ownerId: string) {
  const { error } = await supabase
    .from("restaurants")
    .update({ status: "published", is_proposal: false, watermark_enabled: false, updated_at: new Date().toISOString() })
    .eq("id", restaurantId)
    .eq("owner_id", ownerId);
  if (error) throw error;
}

