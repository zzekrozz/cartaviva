"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Cloud, Eye, Loader2, Palette, QrCode, Save, Settings2, Languages, Soup, Store, UploadCloud, UtensilsCrossed } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import {
  buildPublicPath,
  defaultCartaVivaState,
  moveEntity,
  normalizeState,
  slugify,
  sortByOrder,
  type CartaVivaState,
  type Category,
  type MenuTemplate,
  type PlanTier,
  type Product
} from "@/lib/cartaviva-data";
import { BuilderLayout } from "@/components/cartaviva/BuilderLayout";
import { BuilderSidebar, type BuilderStep } from "@/components/cartaviva/BuilderSidebar";
import { RestaurantForm } from "@/components/cartaviva/RestaurantForm";
import { DesignSettings } from "@/components/cartaviva/DesignSettings";
import { CategoryManager } from "@/components/cartaviva/CategoryManager";
import { ProductManager } from "@/components/cartaviva/ProductManager";
import { DailyMenuEditor } from "@/components/cartaviva/DailyMenuEditor";
import { WeeklyMenuEditor } from "@/components/cartaviva/WeeklyMenuEditor";
import { QRPanel } from "@/components/cartaviva/QRPanel";
import { MobileMenuPreview } from "@/components/cartaviva/MobileMenuPreview";
import { SectionTabs } from "@/components/cartaviva/SectionTabs";
import { TrialPlanBanner } from "@/components/cartaviva/TrialPlanBanner";
import { TranslationEditor } from "@/components/cartaviva/TranslationEditor";
import { TutorialGuide } from "@/components/cartaviva/TutorialGuide";
import { getPlanConfig, type TrialType } from "@/lib/plan-config";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/client";
import { getCurrentUser, loadRestaurantState, saveRestaurantState, upsertProfile } from "@/lib/supabase/queries";
import { uuid } from "@/lib/supabase/mappers";

const steps: BuilderStep[] = [
  { id: "restaurant", label: "Restaurante", icon: Store },
  { id: "design", label: "Diseño", icon: Palette },
  { id: "categories", label: "Categorías", icon: Settings2 },
  { id: "products", label: "Productos", icon: UtensilsCrossed },
  { id: "daily-menu", label: "Menú del día", icon: Soup },
  { id: "languages", label: "Idiomas", icon: Languages },
  { id: "qr", label: "QR y publicar", icon: QrCode }
];

function Panel({ eyebrow, title, text, children }: { eyebrow: string; title: string; text: string; children: ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-[#eadfce] bg-white p-5 shadow-sm md:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e85d04]">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-bold text-[#221812] md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-7 text-[#6b594a] md:text-base">{text}</p>
      <div className="mt-7">{children}</div>
    </section>
  );
}

function stripImagesForFree(state: CartaVivaState): CartaVivaState {
  return normalizeState({
    ...state,
    restaurant: { ...state.restaurant, logoUrl: "", coverUrl: "" },
    products: state.products.map((product) => ({ ...product, imageUrl: "" })),
    dailyMenu: { ...state.dailyMenu, coverImage: "", startersImage: "", mainsImage: "", dessertsImage: "", showImages: false }
  });
}

function applyPlanToState(state: CartaVivaState, plan: PlanTier): CartaVivaState {
  const next = normalizeState({ ...state, settings: { ...state.settings, plan, showBranding: plan === "free" } });
  return plan === "free" ? stripImagesForFree(next) : next;
}

export default function SavedBuilderClient({ restaurantId }: { restaurantId: string }) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<string>("restaurant");
  const [data, setData] = useState<CartaVivaState>(defaultCartaVivaState);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Sin guardar");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [origin, setOrigin] = useState("https://preview.local");
  const [error, setError] = useState("");
  const [trialType, setTrialType] = useState<TrialType>("none");
  const [planNotice, setPlanNotice] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    async function load() {
      if (!hasSupabaseConfig()) {
        setError("Faltan las variables de Supabase. Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.");
        setLoading(false);
        return;
      }

      try {
        const supabase = createBrowserSupabaseClient();
        const currentUser = await getCurrentUser(supabase);
        if (!currentUser) {
          router.push(`/login?next=/builder/${restaurantId}`);
          return;
        }
        setUser(currentUser);
        await upsertProfile(supabase, currentUser);
        const result = await loadRestaurantState(supabase, restaurantId, currentUser.id);
        setData(result.state);
        setTrialType(result.restaurant.trial_type === "one-euro" ? "one-euro" : "none");
        setStatusMessage(result.state.published ? "Publicado" : "Cargado desde Supabase");
      } catch (err: any) {
        setError(err?.message || "No se pudo cargar la carta.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [restaurantId, router]);

  const planConfig = getPlanConfig(data.settings.plan);
  const photosEnabled = planConfig.hasPhotos;
  const publicPath = useMemo(() => buildPublicPath(data.restaurant.slug), [data.restaurant.slug]);
  const publicUrl = useMemo(() => `${origin}${publicPath}`, [origin, publicPath]);

  const visibleProducts = useMemo(() => {
    return sortByOrder(data.products).filter((product) => {
      const categoryMatch = categoryFilter === "all" || product.categoryId === categoryFilter;
      const statusMatch = statusFilter === "all" || product.status === statusFilter;
      return categoryMatch && statusMatch;
    });
  }, [categoryFilter, data.products, statusFilter]);

  const saveToSupabase = useCallback(async (publish = false) => {
    if (!user?.id) {
      router.push(`/login?next=/builder/${restaurantId}`);
      return;
    }

    setSaving(true);
    setStatusMessage(publish ? "Publicando..." : "Guardando...");
    setError("");

    try {
      const supabase = createBrowserSupabaseClient();
      const saved = await saveRestaurantState(supabase, data, user.id, restaurantId, publish);
      setData(saved);
      setStatusMessage(publish ? "Publicado en Supabase" : "Guardado en Supabase");
    } catch (err: any) {
      setError(err?.message || "No se pudo guardar.");
      setStatusMessage("Error al guardar");
    } finally {
      setSaving(false);
    }
  }, [data, restaurantId, router, user?.id]);

  function updateRestaurant(field: keyof CartaVivaState["restaurant"], value: string) {
    setStatusMessage("Cambios sin guardar");
    setData((current) => {
      const restaurant = { ...current.restaurant, [field]: value };
      if (field === "name") restaurant.slug = slugify(value);
      return { ...current, restaurant };
    });
  }

  function updateSettings(patch: Partial<CartaVivaState["settings"]>) {
    setStatusMessage("Cambios sin guardar");
    setData((current) => ({ ...current, settings: { ...current.settings, ...patch } }));
  }

  function updateDailyMenu<K extends keyof CartaVivaState["dailyMenu"]>(field: K, value: CartaVivaState["dailyMenu"][K]) {
    setStatusMessage("Cambios sin guardar");
    setData((current) => ({ ...current, dailyMenu: { ...current.dailyMenu, [field]: value } }));
  }

  function addCategory() {
    const category: Category = { id: uuid(), name: "Nueva categoría", visible: true, order: data.categories.length, group: "comida" };
    setStatusMessage("Cambios sin guardar");
    setData((current) => ({ ...current, categories: [...current.categories, category] }));
  }

  function updateCategory(id: string, updates: Partial<Category>) {
    setStatusMessage("Cambios sin guardar");
    setData((current) => ({ ...current, categories: current.categories.map((category) => category.id === id ? { ...category, ...updates } : category) }));
  }

  function moveCategory(id: string, direction: "up" | "down") {
    setStatusMessage("Cambios sin guardar");
    setData((current) => ({ ...current, categories: moveEntity(current.categories, id, direction) }));
  }

  function deleteCategory(id: string) {
    setStatusMessage("Cambios sin guardar");
    setData((current) => {
      const nextCategories = current.categories.filter((category) => category.id !== id).map((category, index) => ({ ...category, order: index }));
      const fallbackId = nextCategories.find((category) => category.group !== "menu-dia")?.id || nextCategories[0]?.id || id;
      return {
        ...current,
        categories: nextCategories,
        products: current.products.map((product) => product.categoryId === id ? { ...product, categoryId: fallbackId } : product)
      };
    });
  }

  function addProduct() {
    if (data.products.length >= planConfig.maxProducts) {
      setPlanNotice(`El plan ${planConfig.name} incluye hasta ${planConfig.maxProducts} productos. Cambia de plan para ampliar tu carta.`);
      return;
    }
    const firstCategory = sortByOrder(data.categories).find((category) => category.group !== "menu-dia")?.id || data.categories[0]?.id || uuid();
    const product: Product = {
      id: uuid(),
      categoryId: firstCategory,
      name: "Nuevo producto",
      description: "Descripción del ítem de carta.",
      price: "0,00 €",
      imageUrl: "",
      tags: [],
      allergens: [],
      status: "active",
      order: data.products.length
    };
    setStatusMessage("Cambios sin guardar");
    setData((current) => ({ ...current, products: [...current.products, product] }));
  }

  function updateProduct(id: string, updates: Partial<Product>) {
    setStatusMessage("Cambios sin guardar");
    setData((current) => ({ ...current, products: current.products.map((product) => product.id === id ? { ...product, ...updates } : product) }));
  }

  function deleteProduct(id: string) {
    setStatusMessage("Cambios sin guardar");
    setData((current) => ({ ...current, products: current.products.filter((product) => product.id !== id).map((product, index) => ({ ...product, order: index })) }));
  }

  function duplicateProduct(id: string) {
    setStatusMessage("Cambios sin guardar");
    setData((current) => {
      const source = current.products.find((product) => product.id === id);
      if (!source) return current;
      const duplicate: Product = { ...source, id: uuid(), name: `${source.name} copia`, order: current.products.length };
      return { ...current, products: [...current.products, duplicate] };
    });
  }

  function moveProduct(id: string, direction: "up" | "down" | "first" | "last") {
    setStatusMessage("Cambios sin guardar");
    setData((current) => ({ ...current, products: moveEntity(current.products, id, direction) }));
  }

  function copyLink() {
    navigator.clipboard?.writeText(publicUrl);
  }

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  function renderStep() {
    if (activeStep === "restaurant") {
      return <Panel eyebrow="Paso 1" title="Información del restaurante" text="Nombre, portada, contacto, horario y color principal. Estos datos ya se guardan en Supabase."><RestaurantForm data={data} onChange={updateRestaurant} uploadContext={{ restaurantId }} photosEnabled={photosEnabled} /></Panel>;
    }

    if (activeStep === "design") {
      return (
        <Panel eyebrow="Paso 2" title="Diseño y posicionamiento" text="Plantillas, branding, plan visual y ajustes de la carta pública.">
          <DesignSettings
            data={data}
            onTemplateChange={(value: MenuTemplate) => updateRestaurant("template", value)}
            onPlanChange={(value: PlanTier) => updateSettings({ plan: value, showBranding: value === "free" })}
            onBooleanChange={(field, value) => updateSettings({ [field]: value })}
            onValueChange={(field, value) => updateSettings({ [field]: value })}
          />
        </Panel>
      );
    }

    if (activeStep === "categories") {
      return <Panel eyebrow="Paso 3" title="Categorías y secciones" text="Organiza comida, bebidas, vinos, desayunos, cócteles o menú del día."><CategoryManager categories={sortByOrder(data.categories)} onAdd={addCategory} onUpdate={updateCategory} onDelete={deleteCategory} onMove={moveCategory} /></Panel>;
    }

    if (activeStep === "products") {
      return (
        <Panel eyebrow="Paso 4" title="Productos de carta" text="Cafés, bebidas y platos. Filtra, duplica, reordena y marca agotados u ocultos.">
          <ProductManager
            products={visibleProducts}
            categories={sortByOrder(data.categories)}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            onCategoryFilterChange={setCategoryFilter}
            onStatusFilterChange={setStatusFilter}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onDelete={deleteProduct}
            onDuplicate={duplicateProduct}
            onMove={moveProduct}
            uploadContext={{ restaurantId }}
            photosEnabled={photosEnabled}
          />
        </Panel>
      );
    }

    if (activeStep === "daily-menu") {
      return <Panel eyebrow="Paso 5" title="Menú del día" text="Destacado arriba, optimizado para móvil y con fotos opcionales."><DailyMenuEditor data={data} onChange={updateDailyMenu} uploadContext={{ restaurantId }} photosEnabled={photosEnabled} />
          <div className="mt-6"><WeeklyMenuEditor data={data} onChange={(weeklyMenus) => setData({ ...data, weeklyMenus })} onUseToday={(menu) => setData({ ...data, dailyMenu: { ...data.dailyMenu, title: menu.title, price: menu.price, schedule: menu.schedule, starters: menu.starters, mains: menu.mains, desserts: menu.desserts, drinkIncluded: menu.drinkIncluded, note: menu.note } })} /></div></Panel>;
    }

    if (activeStep === "languages") {
      return <Panel eyebrow="Paso 6" title="Idiomas" text="Traducciones manuales para Restaurante Pro, guardadas en Supabase y visibles en la carta pública."><TranslationEditor data={data} onChange={setData} onNotice={setPlanNotice} /></Panel>;
    }

    return <Panel eyebrow="Paso 7" title="QR y publicar" text="Copia el enlace, revisa el QR y publica la carta para que sea visible por slug."><QRPanel data={data} publicUrl={publicUrl} onCopyLink={copyLink} /></Panel>;
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#fffaf3] text-[#221812]"><div className="rounded-[2rem] bg-white p-8 text-center shadow-sm"><Loader2 className="mx-auto animate-spin text-[#e85d04]" /><p className="mt-4 font-bold">Cargando carta guardada...</p></div></main>;
  }

  if (error) {
    return <main className="flex min-h-screen items-center justify-center bg-[#fffaf3] px-4 text-[#221812]"><div className="max-w-xl rounded-[2rem] bg-white p-8 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.28em] text-[#e85d04]">Supabase</p><h1 className="mt-3 text-3xl font-black">No se pudo abrir el builder</h1><p className="mt-3 text-sm leading-7 text-[#6b594a]">{error}</p><Link href="/dashboard" className="mt-6 inline-flex rounded-full bg-[#221812] px-5 py-3 text-sm font-black text-white">Volver al dashboard</Link></div></main>;
  }

  return (
    <div className="min-h-screen bg-[#fffaf3] text-[#221812]">
      <header className="sticky top-0 z-50 border-b border-[#eadfce] bg-[#fffaf3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1560px] flex-wrap items-center justify-between gap-3 px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-white shadow-sm"><ArrowLeft size={18} /></Link>
            <div>
              <p className="text-lg font-bold">{BRAND_NAME} Builder</p>
              <p className="text-xs font-semibold text-[#7b6a5b]">Guardado real con cuenta · {user?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#6b594a] shadow-sm"><Cloud size={16} className="text-[#e85d04]" />{statusMessage}</span>
            <button type="button" disabled={saving} onClick={() => saveToSupabase(false)} className="inline-flex items-center gap-2 rounded-full bg-[#221812] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"><Save size={16} /> Guardar</button>
            <button type="button" disabled={saving} onClick={() => saveToSupabase(true)} className="inline-flex items-center gap-2 rounded-full bg-[#e85d04] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"><UploadCloud size={16} /> Publicar</button>
            <Link href={publicPath} className="rounded-full border border-[#d9cbb8] bg-white px-4 py-2 text-sm font-bold">Vista pública</Link>
            <TutorialGuide activeStep={activeStep} onStepChange={setActiveStep} storageKey={`mesacarta_tutorial_completed_${restaurantId}`} />
            <button type="button" onClick={signOut} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#6b594a]">Salir</button>
          </div>
        </div>
      </header>

      <div className="px-4 pt-4 lg:hidden">
        <SectionTabs tabs={steps.map((step) => ({ id: step.id, label: step.label }))} activeId={activeStep} onChange={setActiveStep} />
      </div>

      <BuilderLayout
        sidebar={<div className="hidden lg:block"><BuilderSidebar steps={steps} activeStep={activeStep} onChange={setActiveStep} /></div>}
        editor={<div className="space-y-5"><TrialPlanBanner data={data} trialType={trialType} />{planNotice ? <div className="rounded-[1.5rem] border border-orange-200 bg-[#fff4e8] px-5 py-4 text-sm font-black text-[#a3581c]">{planNotice}</div> : null}{renderStep()}<div className="rounded-[2rem] border border-[#eadfce] bg-white p-5 shadow-sm lg:hidden"><div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.26em] text-[#a08d7d]">Preview móvil</p><h2 className="text-2xl font-bold">Así lo verá el cliente</h2></div><Eye size={18} className="text-[#e85d04]" /></div><MobileMenuPreview data={data} branded={data.settings.showBranding} /></div></div>}
        preview={<div className="sticky top-24 space-y-3"><div className="flex items-center justify-between px-2"><div><p className="text-xs font-bold uppercase tracking-[0.26em] text-[#a08d7d]">Preview móvil</p><h2 className="text-xl font-bold">Tiempo real</h2></div><Eye size={18} className="text-[#e85d04]" /></div><MobileMenuPreview data={data} branded={data.settings.showBranding} /></div>}
      />
    </div>
  );
}
