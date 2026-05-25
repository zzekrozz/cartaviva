"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Eye, Palette, QrCode, Settings2, Soup, Store, UtensilsCrossed } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import {
  buildPublicPath,
  defaultCartaVivaState,
  moveEntity,
  normalizeState,
  slugify,
  sortByOrder,
  STORAGE_KEY,
  uid,
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
import { QRPanel } from "@/components/cartaviva/QRPanel";
import { MobileMenuPreview } from "@/components/cartaviva/MobileMenuPreview";
import { SectionTabs } from "@/components/cartaviva/SectionTabs";

const steps: BuilderStep[] = [
  { id: "restaurant", label: "Restaurante", icon: Store },
  { id: "design", label: "Diseno", icon: Palette },
  { id: "categories", label: "Categorias", icon: Settings2 },
  { id: "products", label: "Productos", icon: UtensilsCrossed },
  { id: "daily-menu", label: "Menu del dia", icon: Soup },
  { id: "qr", label: "QR y publicar", icon: QrCode }
];

function Panel({
  eyebrow,
  title,
  text,
  children
}: {
  eyebrow: string;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-[#eadfce] bg-white p-5 shadow-sm md:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e85d04]">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-bold text-[#221812] md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-7 text-[#6b594a] md:text-base">{text}</p>
      <div className="mt-7">{children}</div>
    </section>
  );
}

export default function BuilderPage() {
  const [activeStep, setActiveStep] = useState<string>("restaurant");
  const [data, setData] = useState<CartaVivaState>(defaultCartaVivaState);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      setData(normalizeState(JSON.parse(stored) as CartaVivaState));
    } catch {
      setData(defaultCartaVivaState);
    }
  }, []);

  useEffect(() => {
    setSaveState("saving");
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    const timeout = window.setTimeout(() => setSaveState("saved"), 250);
    return () => window.clearTimeout(timeout);
  }, [data]);

  const publicPath = useMemo(() => buildPublicPath(data.restaurant.slug), [data.restaurant.slug]);
  const publicUrl = useMemo(() => `https://preview.local${publicPath}`, [publicPath]);

  const visibleProducts = useMemo(() => {
    return sortByOrder(data.products).filter((product) => {
      const categoryMatch = categoryFilter === "all" || product.categoryId === categoryFilter;
      const statusMatch = statusFilter === "all" || product.status === statusFilter;
      return categoryMatch && statusMatch;
    });
  }, [categoryFilter, data.products, statusFilter]);

  function updateRestaurant(field: keyof CartaVivaState["restaurant"], value: string) {
    setData((current) => {
      const restaurant = { ...current.restaurant, [field]: value };
      if (field === "name") restaurant.slug = slugify(value);
      return { ...current, restaurant };
    });
  }

  function updateSettings(patch: Partial<CartaVivaState["settings"]>) {
    setData((current) => ({ ...current, settings: { ...current.settings, ...patch } }));
  }

  function updateDailyMenu<K extends keyof CartaVivaState["dailyMenu"]>(field: K, value: CartaVivaState["dailyMenu"][K]) {
    setData((current) => ({ ...current, dailyMenu: { ...current.dailyMenu, [field]: value } }));
  }

  function addCategory() {
    const category: Category = {
      id: uid("cat"),
      name: "Nueva categoria",
      visible: true,
      order: data.categories.length,
      group: "comida"
    };
    setData((current) => ({ ...current, categories: [...current.categories, category] }));
  }

  function updateCategory(id: string, updates: Partial<Category>) {
    setData((current) => ({
      ...current,
      categories: current.categories.map((category) => category.id === id ? { ...category, ...updates } : category)
    }));
  }

  function moveCategory(id: string, direction: "up" | "down") {
    setData((current) => ({ ...current, categories: moveEntity(current.categories, id, direction) }));
  }

  function deleteCategory(id: string) {
    if (id === "daily") return;
    setData((current) => {
      const nextCategories = current.categories.filter((category) => category.id !== id).map((category, index) => ({ ...category, order: index }));
      const fallbackId = nextCategories.find((category) => category.id !== "daily")?.id || "daily";
      return {
        ...current,
        categories: nextCategories,
        products: current.products.map((product) => product.categoryId === id ? { ...product, categoryId: fallbackId } : product)
      };
    });
  }

  function addProduct() {
    const firstCategory = sortByOrder(data.categories).find((category) => category.id !== "daily")?.id || "daily";
    const product: Product = {
      id: uid("prod"),
      categoryId: firstCategory,
      name: "Nuevo producto",
      description: "Descripcion del item de carta.",
      price: "0,00 €",
      imageUrl: "",
      tags: [],
      allergens: [],
      status: "active",
      order: data.products.length
    };
    setData((current) => ({ ...current, products: [...current.products, product] }));
  }

  function updateProduct(id: string, updates: Partial<Product>) {
    setData((current) => ({
      ...current,
      products: current.products.map((product) => product.id === id ? { ...product, ...updates } : product)
    }));
  }

  function deleteProduct(id: string) {
    setData((current) => ({
      ...current,
      products: current.products.filter((product) => product.id !== id).map((product, index) => ({ ...product, order: index }))
    }));
  }

  function duplicateProduct(id: string) {
    setData((current) => {
      const source = current.products.find((product) => product.id === id);
      if (!source) return current;
      const duplicate: Product = { ...source, id: uid("prod"), name: `${source.name} copia`, order: current.products.length };
      return { ...current, products: [...current.products, duplicate] };
    });
  }

  function moveProduct(id: string, direction: "up" | "down" | "first" | "last") {
    setData((current) => ({ ...current, products: moveEntity(current.products, id, direction) }));
  }

  function restoreDemo() {
    setData(defaultCartaVivaState);
  }

  function clearChanges() {
    window.localStorage.removeItem(STORAGE_KEY);
    setData(defaultCartaVivaState);
  }

  function copyLink() {
    navigator.clipboard?.writeText(publicUrl);
  }

  function renderStep() {
    if (activeStep === "restaurant") {
      return (
        <Panel eyebrow="Paso 1" title="Informacion del restaurante" text="Nombre, portada, contacto, horario y color principal para dar presencia de miniweb profesional.">
          <RestaurantForm data={data} onChange={updateRestaurant} />
        </Panel>
      );
    }

    if (activeStep === "design") {
      return (
        <Panel eyebrow="Paso 2" title="Diseno y posicionamiento" text="Plantillas, branding del plan gratis, tipografia y ajustes visuales para que la preview parezca producto real.">
          <DesignSettings
            data={data}
            onTemplateChange={(value: MenuTemplate) => updateRestaurant("template", value)}
            onPlanChange={(value: PlanTier) => updateSettings({ plan: value, showBranding: value === "free" ? true : data.settings.showBranding })}
            onBooleanChange={(field, value) => updateSettings({ [field]: value })}
            onValueChange={(field, value) => updateSettings({ [field]: value })}
          />
        </Panel>
      );
    }

    if (activeStep === "categories") {
      return (
        <Panel eyebrow="Paso 3" title="Categorias y secciones" text="Organiza comida, bebidas, vinos, desayunos, cocteles o menu del dia con orden claro y visibilidad controlada.">
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
        <Panel eyebrow="Paso 4" title="Productos de carta" text="Incluye cafes, bebidas y platos. Puedes filtrar, duplicar, reordenar y dejar agotados u ocultos sin romper la vista publica.">
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
          />
        </Panel>
      );
    }

    if (activeStep === "daily-menu") {
      return (
        <Panel eyebrow="Paso 5" title="Menu del dia" text="Redisenado para destacar mas arriba y verse bien tanto en movil como en escritorio, con fotos opcionales por bloque.">
          <DailyMenuEditor data={data} onChange={updateDailyMenu} />
        </Panel>
      );
    }

    return (
      <Panel eyebrow="Paso 6" title="QR y publicar" text="URL simulada, tarjeta QR y logica visual por plan para que el MVP ya se pueda ensenar a un restaurante con confianza.">
        <QRPanel data={data} publicUrl={publicUrl} onCopyLink={copyLink} />
      </Panel>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf3] text-[#221812]">
      <header className="sticky top-0 z-50 border-b border-[#eadfce] bg-[#fffaf3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1560px] flex-wrap items-center justify-between gap-3 px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-white shadow-sm">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p className="text-lg font-bold">{BRAND_NAME} Builder</p>
              <p className="text-xs font-semibold text-[#7b6a5b]">Herramienta visual para crear la miniweb del restaurante.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#6b594a] shadow-sm">
              <CheckCircle2 size={16} className="text-[#e85d04]" />
              {saveState === "saving" ? "Guardando..." : "Guardado localmente"}
            </span>
            <Link href="/demo" className="rounded-full border border-[#d9cbb8] bg-white px-4 py-2 text-sm font-bold">Ver demo</Link>
            <Link href={publicPath} className="rounded-full border border-[#d9cbb8] bg-white px-4 py-2 text-sm font-bold">Vista publica</Link>
            <button type="button" onClick={restoreDemo} className="rounded-full bg-[#221812] px-4 py-2 text-sm font-bold text-white">Restaurar demo</button>
            <button type="button" onClick={clearChanges} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#6b594a]">Limpiar cambios</button>
          </div>
        </div>
      </header>

      <div className="px-4 pt-4 lg:hidden">
        <SectionTabs tabs={steps.map((step) => ({ id: step.id, label: step.label }))} activeId={activeStep} onChange={setActiveStep} />
      </div>

      <BuilderLayout
        sidebar={<div className="hidden lg:block"><BuilderSidebar steps={steps} activeStep={activeStep} onChange={setActiveStep} /></div>}
        editor={
          <div className="space-y-5">
            {renderStep()}
            <div className="rounded-[2rem] border border-[#eadfce] bg-white p-5 shadow-sm lg:hidden">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#a08d7d]">Preview movil</p>
                  <h2 className="text-2xl font-bold">Asi lo vera el cliente</h2>
                </div>
                <Eye size={18} className="text-[#e85d04]" />
              </div>
              <MobileMenuPreview data={data} branded={data.settings.showBranding} />
            </div>
          </div>
        }
        preview={
          <div className="sticky top-24 space-y-3">
            <div className="flex items-center justify-between px-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#a08d7d]">Preview movil</p>
                <h2 className="text-xl font-bold">Tiempo real</h2>
              </div>
              <Eye size={18} className="text-[#e85d04]" />
            </div>
            <MobileMenuPreview data={data} branded={data.settings.showBranding} />
          </div>
        }
      />
    </div>
  );
}
