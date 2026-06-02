"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Globe,
  Home,
  Languages,
  Loader2,
  Monitor,
  Palette,
  QrCode,
  Settings,
  Smartphone,
  Soup,
  Tag,
  UtensilsCrossed,
} from "lucide-react";
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
  type Product,
} from "@/lib/cartaviva-data";
import { BuilderLayout } from "@/components/cartaviva/BuilderLayout";
import { BuilderSidebar, type BuilderStep } from "@/components/cartaviva/BuilderSidebar";
import { BuilderTopbar } from "@/components/cartaviva/BuilderTopbar";
import { BuilderOverview } from "@/components/cartaviva/BuilderOverview";
import { RestaurantForm } from "@/components/cartaviva/RestaurantForm";
import { DesignSettings } from "@/components/cartaviva/DesignSettings";
import { CategoryManager } from "@/components/cartaviva/CategoryManager";
import { ProductManager } from "@/components/cartaviva/ProductManager";
import { DailyMenuEditor } from "@/components/cartaviva/DailyMenuEditor";
import { WeeklyMenuEditor } from "@/components/cartaviva/WeeklyMenuEditor";
import { QRPanel } from "@/components/cartaviva/QRPanel";
import { LandingEditor } from "@/components/cartaviva/LandingEditor";
import { SectionTabs } from "@/components/cartaviva/SectionTabs";
import { TranslationEditor } from "@/components/cartaviva/TranslationEditor";
import { MobileMenuPreview } from "@/components/cartaviva/MobileMenuPreview";
import { DesktopMenuPreview } from "@/components/cartaviva/DesktopMenuPreview";
import { getPlanConfig, supportsDailyMenuPhotos, supportsProductPhotos, supportsLanding, PLAN_CONFIGS } from "@/lib/plan-config";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/client";
import { getCurrentUser, loadRestaurantState, saveRestaurantState, upsertProfile } from "@/lib/supabase/queries";
import { uuid } from "@/lib/supabase/mappers";

const steps: BuilderStep[] = [
  { id: "overview", label: "Inicio", icon: Home, subtitle: "Resumen de tu carta" },
  { id: "design", label: "Diseño", icon: Palette, subtitle: "Plantilla y colores" },
  { id: "categories", label: "Categorías", icon: Tag, subtitle: "Estructura de la carta" },
  { id: "products", label: "Productos", icon: UtensilsCrossed, subtitle: "Platos y bebidas" },
  { id: "daily-menu", label: "Menú del día", icon: Soup, subtitle: "Menú destacado" },
  { id: "languages", label: "Idiomas", icon: Languages, subtitle: "Traducciones" },
  { id: "landing", label: "Miniweb", icon: Globe, subtitle: "Página del restaurante" },
  { id: "qr", label: "QR y publicar", icon: QrCode, subtitle: "Compartir carta" },
  { id: "restaurant", label: "Ajustes", icon: Settings, subtitle: "Datos del local" },
];

function Panel({ eyebrow, title, text, children }: { eyebrow: string; title: string; text?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#eadfce] bg-white p-5 shadow-sm md:p-7">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e85d04]">{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-black text-[#221812] md:text-3xl">{title}</h1>
      {text && <p className="mt-1.5 max-w-2xl text-sm leading-7 text-[#6b594a]">{text}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function stripImagesForFree(state: CartaVivaState): CartaVivaState {
  return normalizeState({
    ...state,
    products: state.products.map((p) => ({ ...p, imageUrl: "" })),
    dailyMenu: { ...state.dailyMenu, coverImage: "", startersImage: "", mainsImage: "", dessertsImage: "", showImages: false },
  });
}

function applyPlanToState(state: CartaVivaState, plan: PlanTier): CartaVivaState {
  const next = normalizeState({ ...state, settings: { ...state.settings, plan, showBranding: plan === "free" } });
  return plan === "free" ? stripImagesForFree(next) : next;
}

export default function SavedBuilderClient({ restaurantId }: { restaurantId: string }) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<string>("overview");
  const [data, setData] = useState<CartaVivaState>(defaultCartaVivaState);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Sin guardar");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [origin, setOrigin] = useState("https://preview.local");
  const [error, setError] = useState("");
  const [planNotice, setPlanNotice] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");

  useEffect(() => { setOrigin(window.location.origin); }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);

  useEffect(() => {
    async function load() {
      if (!hasSupabaseConfig()) {
        setError("Faltan las variables de Supabase.");
        setLoading(false);
        return;
      }
      try {
        const supabase = createBrowserSupabaseClient();
        const currentUser = await getCurrentUser(supabase);
        if (!currentUser) { router.push(`/login?next=/builder/${restaurantId}`); return; }
        setUser(currentUser);
        await upsertProfile(supabase, currentUser);
        const result = await loadRestaurantState(supabase, restaurantId, currentUser.id);
        setData(result.state);
        setStatusMessage(result.state.published ? "Publicado" : "Guardado");
      } catch (err: any) {
        setError(err?.message || "No se pudo cargar la carta.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [restaurantId, router]);

  const planConfig = getPlanConfig(data.settings.plan);
  const productPhotosEnabled = supportsProductPhotos(data.settings.plan);
  const landingEnabled = supportsLanding(data.settings.plan);
  const maxGalleryPhotos = PLAN_CONFIGS[data.settings.plan].maxGalleryPhotos;
  const dailyMenuPhotosEnabled = supportsDailyMenuPhotos(data.settings.plan);
  const publicPath = useMemo(() => buildPublicPath(data.restaurant.slug), [data.restaurant.slug]);
  const publicUrl = useMemo(() => `${origin}${publicPath}`, [origin, publicPath]);

  const visibleProducts = useMemo(() => {
    return sortByOrder(data.products).filter((p) => {
      const catOk = categoryFilter === "all" || p.categoryId === categoryFilter;
      const statusOk = statusFilter === "all" || p.status === statusFilter;
      return catOk && statusOk;
    });
  }, [categoryFilter, data.products, statusFilter]);

  const saveToSupabase = useCallback(async (publish = false) => {
    if (!user?.id) { router.push(`/login?next=/builder/${restaurantId}`); return; }
    setSaving(true);
    setStatusMessage(publish ? "Publicando..." : "Guardando...");
    setError("");
    try {
      const supabase = createBrowserSupabaseClient();
      const saved = await saveRestaurantState(supabase, data, user.id, restaurantId, publish);
      setData(saved);
      setStatusMessage(publish ? "Publicado" : "Guardado");
    } catch (err: any) {
      setError(err?.message || "No se pudo guardar.");
      setStatusMessage("Error al guardar");
    } finally {
      setSaving(false);
    }
  }, [data, restaurantId, router, user?.id]);

  function updateRestaurant<K extends keyof CartaVivaState["restaurant"]>(field: K, value: CartaVivaState["restaurant"][K]) {
    setStatusMessage("Cambios sin guardar");
    setData((cur) => {
      const restaurant = { ...cur.restaurant, [field]: value };
      if (field === "name") restaurant.slug = slugify(String(value));
      return { ...cur, restaurant };
    });
  }

  function updateSettings(patch: Partial<CartaVivaState["settings"]>) {
    setStatusMessage("Cambios sin guardar");
    setData((cur) => ({ ...cur, settings: { ...cur.settings, ...patch } }));
  }

  function updateSettingField<K extends keyof CartaVivaState["settings"]>(field: K, value: CartaVivaState["settings"][K]) {
    updateSettings({ [field]: value } as Partial<CartaVivaState["settings"]>);
  }

  function updateDailyMenu<K extends keyof CartaVivaState["dailyMenu"]>(field: K, value: CartaVivaState["dailyMenu"][K]) {
    const photoFields = ["coverImage", "startersImage", "mainsImage", "dessertsImage", "showImages"];
    if (!dailyMenuPhotosEnabled && photoFields.includes(String(field)) && value) {
      setPlanNotice("Las fotos del menú del día están disponibles desde Carta Visual.");
      return;
    }
    setStatusMessage("Cambios sin guardar");
    setData((cur) => ({ ...cur, dailyMenu: { ...cur.dailyMenu, [field]: value } }));
  }

  function updateLanding<K extends keyof CartaVivaState["landing"]>(field: K, value: CartaVivaState["landing"][K]) {
    setStatusMessage("Cambios sin guardar");
    setData((cur) => ({ ...cur, landing: { ...cur.landing, [field]: value } }));
  }

  function addCategory() {
    const category: Category = { id: uuid(), name: "Nueva categoría", visible: true, order: data.categories.length, group: "comida", customGroupLabel: "" };
    setStatusMessage("Cambios sin guardar");
    setData((cur) => ({ ...cur, categories: [...cur.categories, category] }));
  }

  function updateCategory(id: string, updates: Partial<Category>) {
    setStatusMessage("Cambios sin guardar");
    setData((cur) => ({ ...cur, categories: cur.categories.map((c) => c.id === id ? { ...c, ...updates } : c) }));
  }

  function moveCategory(id: string, direction: "up" | "down") {
    setStatusMessage("Cambios sin guardar");
    setData((cur) => ({ ...cur, categories: moveEntity(cur.categories, id, direction) }));
  }

  function deleteCategory(id: string) {
    setStatusMessage("Cambios sin guardar");
    setData((cur) => {
      const nextCats = cur.categories.filter((c) => c.id !== id).map((c, i) => ({ ...c, order: i }));
      const fallback = nextCats.find((c) => c.group !== "menu-dia")?.id || nextCats[0]?.id || id;
      return { ...cur, categories: nextCats, products: cur.products.map((p) => p.categoryId === id ? { ...p, categoryId: fallback } : p) };
    });
  }

  function addProduct() {
    if (data.products.length >= planConfig.maxProducts) {
      setPlanNotice(`El plan ${planConfig.name} incluye hasta ${planConfig.maxProducts} productos.`);
      return;
    }
    const firstCat = sortByOrder(data.categories).find((c) => c.group !== "menu-dia")?.id || data.categories[0]?.id || uuid();
    const product: Product = { id: uuid(), categoryId: firstCat, name: "Nuevo producto", description: "", price: "0,00 €", imageUrl: "", tags: [], allergens: [], status: "active", order: data.products.length };
    setStatusMessage("Cambios sin guardar");
    setData((cur) => ({ ...cur, products: [...cur.products, product] }));
  }

  function updateProduct(id: string, updates: Partial<Product>) {
    if (!productPhotosEnabled && updates.imageUrl) {
      setPlanNotice("Las fotos de productos están disponibles desde Menú Día.");
      return;
    }
    setStatusMessage("Cambios sin guardar");
    setData((cur) => ({ ...cur, products: cur.products.map((p) => p.id === id ? { ...p, ...updates } : p) }));
  }

  function deleteProduct(id: string) {
    setStatusMessage("Cambios sin guardar");
    setData((cur) => ({ ...cur, products: cur.products.filter((p) => p.id !== id).map((p, i) => ({ ...p, order: i })) }));
  }

  function duplicateProduct(id: string) {
    setStatusMessage("Cambios sin guardar");
    setData((cur) => {
      const src = cur.products.find((p) => p.id === id);
      if (!src) return cur;
      return { ...cur, products: [...cur.products, { ...src, id: uuid(), name: `${src.name} copia`, order: cur.products.length }] };
    });
  }

  function moveProduct(id: string, direction: "up" | "down" | "first" | "last") {
    setStatusMessage("Cambios sin guardar");
    setData((cur) => ({ ...cur, products: moveEntity(cur.products, id, direction) }));
  }

  function clearFilters() { setCategoryFilter("all"); setStatusFilter("all"); }
  function copyLink() { navigator.clipboard?.writeText(publicUrl); }

  function navigateTo(step: string) {
    setActiveStep(step);
    if (step === "products") setTimeout(() => addProduct(), 50);
  }

  function renderStep() {
    if (activeStep === "overview") {
      return <BuilderOverview data={data} onNavigate={setActiveStep} />;
    }

    if (activeStep === "restaurant") {
      return (
        <Panel eyebrow="Ajustes" title="Datos del restaurante" text="Nombre, contacto, horario y logo. Se muestran en la carta pública.">
          <RestaurantForm data={data} onChange={updateRestaurant} uploadContext={{ restaurantId }} />
        </Panel>
      );
    }

    if (activeStep === "design") {
      return (
        <Panel eyebrow="Diseño" title="Plantilla y apariencia" text="Elige cómo se verá tu carta: plantilla, colores y tipografía.">
          <DesignSettings
            data={data}
            onTemplateChange={(value: MenuTemplate) => updateRestaurant("template", value)}
            onPlanChange={(value: PlanTier) => setData((cur) => applyPlanToState(cur, value))}
            onBooleanChange={(field, value) => updateSettingField(field, value)}
            onValueChange={(field, value) => updateSettingField(field, value)}
            onRestaurantChange={updateRestaurant}
          />
        </Panel>
      );
    }

    if (activeStep === "categories") {
      return (
        <Panel eyebrow="Categorías" title="Estructura de la carta" text="Organiza comida, bebidas, vinos, desayunos o menú del día.">
          <CategoryManager
            categories={sortByOrder(data.categories)}
            onAdd={addCategory}
            onUpdate={updateCategory}
            onDelete={deleteCategory}
            onMove={moveCategory}
          />
        </Panel>
      );
    }

    if (activeStep === "products") {
      return (
        <Panel eyebrow="Productos" title="Platos y bebidas" text="Añade, edita y organiza todos los productos de tu carta.">
          <ProductManager
            products={visibleProducts}
            allProducts={data.products}
            categories={sortByOrder(data.categories)}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            onCategoryFilterChange={setCategoryFilter}
            onStatusFilterChange={setStatusFilter}
            onClearFilters={clearFilters}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onDelete={deleteProduct}
            onDuplicate={duplicateProduct}
            onMove={moveProduct}
            uploadContext={{ restaurantId }}
            photosEnabled={productPhotosEnabled}
          />
        </Panel>
      );
    }

    if (activeStep === "daily-menu") {
      return (
        <Panel eyebrow="Menú del día" title="Menú destacado" text="Aparece en la parte superior de la carta. Optimizado para móvil.">
          <DailyMenuEditor data={data} onChange={updateDailyMenu} uploadContext={{ restaurantId }} photosEnabled={dailyMenuPhotosEnabled} />
          <div className="mt-6">
            <WeeklyMenuEditor
              data={data}
              onChange={(weeklyMenus) => setData({ ...data, weeklyMenus })}
              onUseToday={(menu) => setData({ ...data, dailyMenu: { ...data.dailyMenu, title: menu.title, price: menu.price, schedule: menu.schedule, starters: menu.starters, mains: menu.mains, desserts: menu.desserts, drinkIncluded: menu.drinkIncluded, note: menu.note } })}
            />
          </div>
        </Panel>
      );
    }

    if (activeStep === "languages") {
      return (
        <Panel eyebrow="Idiomas" title="Idiomas de la carta" text="Traduce categorías, productos y menú del día a otros idiomas.">
          <TranslationEditor data={data} onChange={setData} onNotice={setPlanNotice} />
        </Panel>
      );
    }

    if (activeStep === "landing") {
      return (
        <Panel eyebrow="Miniweb" title="Página del restaurante" text="Una miniweb editable para Instagram, Google Business y WhatsApp. Incluye portada, historia, galería y destacados.">
          <LandingEditor
            landing={data.landing}
            products={data.products}
            onChange={updateLanding}
            uploadContext={{ restaurantId }}
            planEnabled={landingEnabled}
            maxGalleryPhotos={maxGalleryPhotos}
          />
        </Panel>
      );
    }

    if (activeStep === "qr") {
      return (
        <Panel eyebrow="Publicación" title="QR y carta pública" text="Copia el enlace, descarga el QR y publica tu carta.">
          <QRPanel data={data} publicUrl={publicUrl} onCopyLink={copyLink} isRegistered />
        </Panel>
      );
    }

    return null;
  }

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf3]">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <Loader2 className="mx-auto animate-spin text-[#e85d04]" size={32} />
          <p className="mt-4 font-black text-[#221812]">Cargando carta...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf3] px-4">
        <div className="max-w-xl rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#e85d04]">Error</p>
          <h1 className="mt-3 text-2xl font-black text-[#221812]">No se pudo abrir el builder</h1>
          <p className="mt-3 text-sm leading-7 text-[#6b594a]">{error}</p>
          <Link href="/dashboard" className="mt-6 inline-flex rounded-xl bg-[#221812] px-5 py-3 text-sm font-black text-white">Volver al dashboard</Link>
        </div>
      </main>
    );
  }

  // ── Preview content ──────────────────────────────────────────
  const previewContent = (
    <div className="space-y-3">
      {/* Preview mode toggle */}
      <div className="flex items-center justify-between rounded-xl border border-[#eadfce] bg-white px-3 py-2">
        <p className="text-xs font-black text-[#221812]">Vista previa</p>
        <div className="flex rounded-lg border border-[#eadfce] p-0.5">
          <button
            type="button"
            onClick={() => setPreviewMode("mobile")}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition ${previewMode === "mobile" ? "bg-[#221812] text-white" : "text-[#6b594a]"}`}
            title="Vista móvil"
          >
            <Smartphone size={13} />
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode("desktop")}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition ${previewMode === "desktop" ? "bg-[#221812] text-white" : "text-[#6b594a]"}`}
            title="Vista escritorio"
          >
            <Monitor size={13} />
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl">
        {previewMode === "mobile" ? (
          <MobileMenuPreview data={data} branded={data.settings.showBranding} />
        ) : (
          <DesktopMenuPreview data={data} branded={data.settings.showBranding} />
        )}
      </div>
      <p className="text-center text-[10px] text-[#a08d7d]">La preview se actualiza en tiempo real</p>
    </div>
  );

  // ── Main render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fffaf3] text-[#221812]">
      <BuilderTopbar
        data={data}
        statusMessage={statusMessage}
        saving={saving}
        publicPath={publicPath}
        previewVisible={previewVisible}
        onTogglePreview={() => setPreviewVisible((v) => !v)}
        onSave={() => saveToSupabase(false)}
        onPublish={() => saveToSupabase(true)}
        onCopyLink={copyLink}
        onGoToQR={() => setActiveStep("qr")}
        restaurantName={data.restaurant.name}
      />

      {/* Mobile nav tabs */}
      <div className="overflow-x-auto border-b border-[#eadfce] bg-white px-4 py-2 lg:hidden">
        <div className="flex gap-1">
          {steps.map((step) => {
            const Icon = step.icon;
            const active = activeStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${active ? "bg-[#221812] text-white" : "text-[#6b594a] hover:bg-[#f4eadc]"}`}
              >
                <Icon size={12} /> {step.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Plan notice */}
      {planNotice && (
        <div className="mx-auto max-w-[1600px] px-4 pt-4 lg:px-6">
          <div className="flex items-start justify-between gap-3 rounded-2xl border border-amber-200 bg-[#fff4e8] px-5 py-4">
            <p className="text-sm font-bold text-[#a3581c]">{planNotice}</p>
            <button type="button" onClick={() => setPlanNotice("")} className="flex-shrink-0 rounded-lg p-1 hover:bg-amber-100 text-[#a3581c]">
              ✕
            </button>
          </div>
        </div>
      )}

      <BuilderLayout
        previewVisible={previewVisible}
        preview={previewContent}
        sidebar={
          <div className="hidden lg:block">
            <BuilderSidebar steps={steps} activeStep={activeStep} onChange={setActiveStep} />
          </div>
        }
        editor={<div className="space-y-5">{renderStep()}</div>}
      />
    </div>
  );
}
