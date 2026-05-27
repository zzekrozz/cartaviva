"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ExternalLink, Eye, Palette, QrCode, Rocket, Store, UtensilsCrossed } from "lucide-react";
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
  type Product
} from "@/lib/cartaviva-data";
import { BuilderLayout } from "@/components/cartaviva/BuilderLayout";
import { BuilderSidebar, type BuilderStep } from "@/components/cartaviva/BuilderSidebar";
import { RestaurantForm } from "@/components/cartaviva/RestaurantForm";
import { SectionTabs } from "@/components/cartaviva/SectionTabs";
import { supportsProductPhotos } from "@/lib/plan-config";
import { BuilderProgress } from "@/components/cartaviva/BuilderProgress";
import { DemoModeBadge } from "@/components/cartaviva/DemoModeBadge";
import { SimpleDesignStep } from "@/components/cartaviva/SimpleDesignStep";
import { MenuStep } from "@/components/cartaviva/MenuStep";
import { PublishStep } from "@/components/cartaviva/PublishStep";

const steps: BuilderStep[] = [
  { id: "restaurant", label: "Restaurante", icon: Store },
  { id: "design", label: "Diseño", icon: Palette },
  { id: "menu", label: "Carta", icon: UtensilsCrossed },
  { id: "publish", label: "Publicar", icon: QrCode }
];

function Panel({ eyebrow, title, text, children }: { eyebrow: string; title: string; text: string; children: ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-[#eadfce] bg-white p-5 shadow-sm md:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e85d04]">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-black text-[#221812] md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-[#6b594a] md:text-base">{text}</p>
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
  const [origin, setOrigin] = useState("https://preview.local");
  const [planNotice, setPlanNotice] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setData(normalizeState(JSON.parse(stored) as CartaVivaState));
      } catch {
        setData(defaultCartaVivaState);
      }
    }
  }, []);

  useEffect(() => {
    setSaveState("saving");
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    const timeout = window.setTimeout(() => setSaveState("saved"), 250);
    return () => window.clearTimeout(timeout);
  }, [data]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);

  const productPhotosEnabled = supportsProductPhotos(data.settings.plan);
  const publicPath = useMemo(() => buildPublicPath(data.restaurant.slug), [data.restaurant.slug]);
  const publicUrl = useMemo(() => `${origin}${publicPath}`, [origin, publicPath]);

  const visibleProducts = useMemo(() => {
    return sortByOrder(data.products).filter((product) => {
      const categoryMatch = categoryFilter === "all" || product.categoryId === categoryFilter;
      const statusMatch = statusFilter === "all" || product.status === statusFilter;
      return categoryMatch && statusMatch;
    });
  }, [categoryFilter, data.products, statusFilter]);

  function updateRestaurant<K extends keyof CartaVivaState["restaurant"]>(field: K, value: CartaVivaState["restaurant"][K]) {
    setData((current) => {
      const restaurant = { ...current.restaurant, [field]: value };
      if (field === "name") restaurant.slug = slugify(String(value));
      return { ...current, restaurant };
    });
  }

  function updateTemplate(value: MenuTemplate) {
    updateRestaurant("template", value);
  }

  function addCategory() {
    const category: Category = { id: uid("cat"), name: "Nueva categoría", visible: true, order: data.categories.length, group: "comida", customGroupLabel: "" };
    setData((current) => ({ ...current, categories: [...current.categories, category] }));
  }

  function updateCategory(id: string, updates: Partial<Category>) {
    setData((current) => ({ ...current, categories: current.categories.map((category) => category.id === id ? { ...category, ...updates } : category) }));
  }

  function moveCategory(id: string, direction: "up" | "down") {
    setData((current) => ({ ...current, categories: moveEntity(current.categories, id, direction) }));
  }

  function deleteCategory(id: string) {
    if (id === "daily") return;
    setData((current) => {
      const nextCategories = current.categories.filter((category) => category.id !== id).map((category, index) => ({ ...category, order: index }));
      const fallbackId = nextCategories.find((category) => category.id !== "daily")?.id || "daily";
      return { ...current, categories: nextCategories, products: current.products.map((product) => product.categoryId === id ? { ...product, categoryId: fallbackId } : product) };
    });
  }

  function addProduct() {
    const firstCategory = sortByOrder(data.categories).find((category) => category.id !== "daily")?.id || "daily";
    const product: Product = { id: uid("prod"), categoryId: firstCategory, name: "Nuevo producto", description: "Descripción breve del plato o bebida.", price: "0,00 €", imageUrl: "", tags: [], allergens: [], status: "active", order: data.products.length };
    setData((current) => ({ ...current, products: [...current.products, product] }));
  }

  function updateProduct(id: string, updates: Partial<Product>) {
    if (!productPhotosEnabled && updates.imageUrl) {
      setPlanNotice("Las fotos de productos están disponibles en planes de pago. Puedes activar el primer mes por 1 € + IVA.");
      return;
    }
    setData((current) => ({ ...current, products: current.products.map((product) => product.id === id ? { ...product, ...updates } : product) }));
  }

  function deleteProduct(id: string) {
    setData((current) => ({ ...current, products: current.products.filter((product) => product.id !== id).map((product, index) => ({ ...product, order: index })) }));
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
    setPlanNotice("");
    setData(defaultCartaVivaState);
  }

  function copyLink() {
    navigator.clipboard?.writeText(publicUrl);
  }

  function markPublished() {
    setData((current) => ({ ...current, published: true, status: "published" }));
    setActiveStep("publish");
  }

  function clearFilters() {
    setCategoryFilter("all");
    setStatusFilter("all");
  }

  function renderStep() {
    if (activeStep === "restaurant") {
      return <Panel eyebrow="Paso 1" title="Datos del restaurante" text="Cambia nombre, zona, tipo de negocio, portada y datos visibles. Aquí se define la identidad de la carta."><RestaurantForm data={data} onChange={updateRestaurant} /></Panel>;
    }

    if (activeStep === "design") {
      return <Panel eyebrow="Paso 2" title="Diseño" text="Solo lo importante: plantilla y colores. Nada de controles escondidos que conviertan el producto en cabina de avión."><SimpleDesignStep data={data} onTemplateChange={updateTemplate} onRestaurantChange={updateRestaurant} /></Panel>;
    }

    if (activeStep === "menu") {
      return <Panel eyebrow="Paso 3" title="Carta" text="Edita categorías y productos desde una zona clara. Este es el corazón del producto."><MenuStep categories={sortByOrder(data.categories)} products={visibleProducts} categoryFilter={categoryFilter} statusFilter={statusFilter} onCategoryFilterChange={setCategoryFilter} onStatusFilterChange={setStatusFilter} onClearFilters={clearFilters} onAddCategory={addCategory} onUpdateCategory={updateCategory} onDeleteCategory={deleteCategory} onMoveCategory={moveCategory} onAddProduct={addProduct} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct} onDuplicateProduct={duplicateProduct} onMoveProduct={moveProduct} photosEnabled={productPhotosEnabled} /></Panel>;
    }

    return <Panel eyebrow="Paso 4" title="Publicar y facturar" text="URL pública, QR descargable, preview y activación. Aquí la demo deja de ser juguete y empieza a oler a producto."><PublishStep data={data} publicUrl={publicUrl} publicPath={publicPath} onCopyLink={copyLink} onMarkPublished={markPublished} /></Panel>;
  }

  return (
    <div className="min-h-screen bg-[#fffaf3] text-[#221812]">
      <header className="sticky top-0 z-50 border-b border-[#eadfce] bg-[#fffaf3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1560px] flex-wrap items-center justify-between gap-3 px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-white shadow-sm"><ArrowLeft size={18} /></Link>
            <div>
              <p className="text-lg font-black">{BRAND_NAME} Builder</p>
              <p className="text-xs font-semibold text-[#7b6a5b]">4 pasos: restaurante, diseño, carta y publicar.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#6b594a] shadow-sm"><CheckCircle2 size={16} className="text-[#e85d04]" />{saveState === "saving" ? "Guardando..." : "Guardado localmente"}</span>
            <Link href="/builder/preview" target="_blank" className="inline-flex items-center gap-2 rounded-full bg-[#221812] px-4 py-2 text-sm font-bold text-white"><Eye size={16} /> Preview</Link>
            <Link href={publicPath} target="_blank" className="hidden rounded-full border border-[#d9cbb8] bg-white px-4 py-2 text-sm font-bold md:inline-flex"><ExternalLink size={16} /> Carta pública</Link>
            <Link href="/checkout" className="inline-flex items-center gap-2 rounded-full bg-[#e85d04] px-4 py-2 text-sm font-black text-white"><Rocket size={16} /> Activar 1€</Link>
            <button type="button" onClick={restoreDemo} className="hidden rounded-full bg-white px-4 py-2 text-sm font-bold text-[#6b594a] md:inline-flex">Restaurar demo</button>
          </div>
        </div>
      </header>

      <div className="px-4 pt-4 lg:hidden"><SectionTabs tabs={steps.map((step) => ({ id: step.id, label: step.label }))} activeId={activeStep} onChange={setActiveStep} /></div>

      <BuilderLayout
        sidebar={<div className="hidden lg:block"><BuilderSidebar steps={steps} activeStep={activeStep} onChange={setActiveStep} /></div>}
        editor={<div className="space-y-5"><DemoModeBadge /><BuilderProgress data={data} />{planNotice ? <div className="rounded-[1.5rem] border border-orange-200 bg-[#fff4e8] px-5 py-4 text-sm font-black text-[#a3581c]">{planNotice}</div> : null}{renderStep()}</div>}
      />
    </div>
  );
}
