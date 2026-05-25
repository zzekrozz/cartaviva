"use client";

import { useEffect, useMemo, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  Globe2,
  Image,
  LayoutTemplate,
  Plus,
  QrCode,
  Save,
  Sparkles,
  Trash2,
  Utensils
} from "lucide-react";
import {
  allergenOptions,
  defaultCartaVivaState,
  slugify,
  STORAGE_KEY,
  tagOptions,
  type CartaVivaState,
  type Category,
  type Product,
  type ProductStatus
} from "@/lib/cartaviva-data";
import { FakeQr, MobilePreview } from "@/components/cartaviva/PublicMenuView";

const sections = [
  { id: "restaurante", label: "Mi restaurante", icon: Utensils },
  { id: "categorias", label: "Categorías", icon: LayoutTemplate },
  { id: "platos", label: "Platos", icon: Image },
  { id: "menu", label: "Menú del día", icon: Sparkles },
  { id: "diseno", label: "Diseño", icon: Eye },
  { id: "qr", label: "QR y publicar", icon: QrCode }
] as const;

type SectionId = (typeof sections)[number]["id"];

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[#221812]">{label}</span>
      {children}
    </label>
  );
}

function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#e85d04] ${props.className || ""}`} />;
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`min-h-24 w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#e85d04] ${props.className || ""}`} />;
}

function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#e85d04] ${props.className || ""}`} />;
}

function TogglePill({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-black transition ${active ? "bg-[#e85d04] text-white" : "bg-[#f1e7d8] text-[#6b594a] hover:bg-[#eadfce]"}`}
    >
      {children}
    </button>
  );
}

export default function BuilderPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("restaurante");
  const [data, setData] = useState<CartaVivaState>(defaultCartaVivaState);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setData(JSON.parse(stored) as CartaVivaState);
      } catch {
        setData(defaultCartaVivaState);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaved(true);
    const timeout = window.setTimeout(() => setSaved(false), 1400);
    return () => window.clearTimeout(timeout);
  }, [data]);

  const publicUrl = useMemo(() => `cartaviva.es/carta/${data.restaurant.slug}`, [data.restaurant.slug]);

  function updateRestaurant(field: keyof CartaVivaState["restaurant"], value: string) {
    setData((current) => {
      const nextRestaurant = { ...current.restaurant, [field]: value };
      if (field === "name") nextRestaurant.slug = slugify(value);
      return { ...current, restaurant: nextRestaurant };
    });
  }

  function addCategory() {
    const category: Category = {
      id: uid("cat"),
      name: "Nueva categoría",
      visible: true,
      order: data.categories.length
    };
    setData((current) => ({ ...current, categories: [...current.categories, category] }));
  }

  function updateCategory(id: string, updates: Partial<Category>) {
    setData((current) => ({
      ...current,
      categories: current.categories.map((category) => category.id === id ? { ...category, ...updates } : category)
    }));
  }

  function deleteCategory(id: string) {
    if (id === "daily") return;
    setData((current) => ({
      ...current,
      categories: current.categories.filter((category) => category.id !== id),
      products: current.products.map((product) => product.categoryId === id ? { ...product, categoryId: current.categories[0]?.id || "daily" } : product)
    }));
  }

  function addProduct() {
    const fallbackCategory = data.categories.find((category) => category.id !== "daily")?.id || data.categories[0]?.id || "daily";
    const product: Product = {
      id: uid("prod"),
      categoryId: fallbackCategory,
      name: "Nuevo plato",
      description: "Descripción breve del plato para que el cliente entienda qué va a pedir.",
      price: "0,00 €",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=900&auto=format&fit=crop",
      tags: [],
      allergens: [],
      status: "active"
    };
    setData((current) => ({ ...current, products: [product, ...current.products] }));
  }

  function updateProduct(id: string, updates: Partial<Product>) {
    setData((current) => ({
      ...current,
      products: current.products.map((product) => product.id === id ? { ...product, ...updates } : product)
    }));
  }

  function deleteProduct(id: string) {
    setData((current) => ({ ...current, products: current.products.filter((product) => product.id !== id) }));
  }

  function toggleProductList(id: string, field: "tags" | "allergens", value: string) {
    const product = data.products.find((item) => item.id === id);
    if (!product) return;
    const currentList = product[field];
    const nextList = currentList.includes(value) ? currentList.filter((item) => item !== value) : [...currentList, value];
    updateProduct(id, { [field]: nextList } as Partial<Product>);
  }

  function copyLink() {
    navigator.clipboard?.writeText(`https://${publicUrl}`);
    alert("Enlace copiado. Para el MVP es una URL simulada.");
  }

  function resetDemo() {
    setData(defaultCartaVivaState);
  }

  return (
    <div className="min-h-screen bg-[#fffaf3] text-[#221812]">
      <header className="sticky top-0 z-50 border-b border-[#eadfce] bg-[#fffaf3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#221812] shadow-sm">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p className="text-lg font-black">CartaViva Builder</p>
              <p className="text-xs font-semibold text-[#7b6a5b]">Crea tu carta, revisa la vista móvil y publica el QR.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#6b594a] shadow-sm">
              <CheckCircle2 size={16} className="text-[#e85d04]" /> {saved ? "Guardando..." : "Guardado localmente"}
            </span>
            <Link href="/demo" className="rounded-full border border-[#d9cbb8] bg-white px-4 py-2 text-sm font-black text-[#221812]">Ver carta</Link>
            <button onClick={resetDemo} className="rounded-full bg-[#221812] px-4 py-2 text-sm font-black text-white">Restaurar demo</button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 lg:grid-cols-[250px_1fr_430px] lg:px-8">
        <aside className="h-fit rounded-[2rem] border border-[#eadfce] bg-white p-3 shadow-sm lg:sticky lg:top-24">
          <p className="px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#a08d7d]">Panel</p>
          <nav className="grid gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black transition ${activeSection === section.id ? "bg-[#221812] text-white" : "text-[#6b594a] hover:bg-[#fff1df] hover:text-[#221812]"}`}
                >
                  <Icon size={18} /> {section.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="space-y-5">
          {activeSection === "restaurante" && (
            <PanelCard eyebrow="Datos principales" title="Mi restaurante" text="Esto será la cabecera de tu carta digital y la información que verá el cliente al escanear el QR.">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nombre del restaurante"><TextInput value={data.restaurant.name} onChange={(event) => updateRestaurant("name", event.target.value)} /></Field>
                <Field label="WhatsApp"><TextInput value={data.restaurant.whatsapp} onChange={(event) => updateRestaurant("whatsapp", event.target.value)} /></Field>
                <Field label="Descripción corta"><TextArea value={data.restaurant.description} onChange={(event) => updateRestaurant("description", event.target.value)} /></Field>
                <Field label="Imagen de portada URL"><TextArea value={data.restaurant.coverUrl} onChange={(event) => updateRestaurant("coverUrl", event.target.value)} /></Field>
                <Field label="Teléfono"><TextInput value={data.restaurant.phone} onChange={(event) => updateRestaurant("phone", event.target.value)} /></Field>
                <Field label="Dirección"><TextInput value={data.restaurant.address} onChange={(event) => updateRestaurant("address", event.target.value)} /></Field>
                <Field label="Instagram"><TextInput value={data.restaurant.instagram} onChange={(event) => updateRestaurant("instagram", event.target.value)} /></Field>
                <Field label="Horario"><TextInput value={data.restaurant.schedule} onChange={(event) => updateRestaurant("schedule", event.target.value)} /></Field>
                <Field label="Idioma principal"><Select value={data.restaurant.language} onChange={(event) => updateRestaurant("language", event.target.value)}><option>Español</option><option>English</option><option>Deutsch</option><option>Français</option></Select></Field>
                <Field label="Estilo base"><Select value={data.restaurant.theme} onChange={(event) => updateRestaurant("theme", event.target.value)}><option value="clasico">Clásico</option><option value="moderno">Moderno</option><option value="oscuro">Oscuro</option><option value="elegante">Elegante</option></Select></Field>
              </div>
            </PanelCard>
          )}

          {activeSection === "categorias" && (
            <PanelCard eyebrow="Estructura" title="Categorías de la carta" text="Crea secciones como carnes, postres, bebidas o lo que tenga sentido para el restaurante.">
              <div className="mb-4 flex justify-end"><ActionButton onClick={addCategory}><Plus size={16} /> Añadir categoría</ActionButton></div>
              <div className="space-y-3">
                {[...data.categories].sort((a, b) => a.order - b.order).map((category) => (
                  <div key={category.id} className="grid gap-3 rounded-3xl border border-[#eadfce] bg-[#fffaf3] p-4 md:grid-cols-[1fr_120px_110px_44px]">
                    <TextInput value={category.name} onChange={(event) => updateCategory(category.id, { name: event.target.value })} />
                    <TextInput type="number" value={category.order} onChange={(event) => updateCategory(category.id, { order: Number(event.target.value) })} />
                    <button onClick={() => updateCategory(category.id, { visible: !category.visible })} className={`rounded-2xl px-3 py-2 text-sm font-black ${category.visible ? "bg-green-100 text-green-800" : "bg-stone-200 text-stone-600"}`}>{category.visible ? "Visible" : "Oculta"}</button>
                    <button onClick={() => deleteCategory(category.id)} className="rounded-2xl bg-white text-red-500 disabled:opacity-30" disabled={category.id === "daily"}><Trash2 size={18} className="mx-auto" /></button>
                  </div>
                ))}
              </div>
            </PanelCard>
          )}

          {activeSection === "platos" && (
            <PanelCard eyebrow="Carta" title="Platos y productos" text="Añade fotos, precios, etiquetas, alérgenos y estados. Los platos ocultos no aparecen en la carta.">
              <div className="mb-4 flex justify-end"><ActionButton onClick={addProduct}><Plus size={16} /> Añadir plato</ActionButton></div>
              <div className="space-y-4">
                {data.products.map((product) => (
                  <div key={product.id} className="rounded-[1.7rem] border border-[#eadfce] bg-white p-4 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-[120px_1fr]">
                      <img src={product.imageUrl} alt="" className="h-28 w-full rounded-2xl object-cover" />
                      <div className="grid gap-3 md:grid-cols-2">
                        <Field label="Nombre"><TextInput value={product.name} onChange={(event) => updateProduct(product.id, { name: event.target.value })} /></Field>
                        <Field label="Precio"><TextInput value={product.price} onChange={(event) => updateProduct(product.id, { price: event.target.value })} /></Field>
                        <Field label="Categoría"><Select value={product.categoryId} onChange={(event) => updateProduct(product.id, { categoryId: event.target.value })}>{data.categories.filter((category) => category.id !== "daily").map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select></Field>
                        <Field label="Estado"><Select value={product.status} onChange={(event) => updateProduct(product.id, { status: event.target.value as ProductStatus })}><option value="active">Activo</option><option value="soldout">Agotado</option><option value="hidden">Oculto</option></Select></Field>
                        <Field label="Foto URL"><TextInput value={product.imageUrl} onChange={(event) => updateProduct(product.id, { imageUrl: event.target.value })} className="md:col-span-2" /></Field>
                        <div className="md:col-span-2"><Field label="Descripción"><TextArea value={product.description} onChange={(event) => updateProduct(product.id, { description: event.target.value })} /></Field></div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <ChipGroup title="Etiquetas" options={tagOptions} selected={product.tags} onToggle={(value) => toggleProductList(product.id, "tags", value)} />
                      <ChipGroup title="Alérgenos" options={allergenOptions} selected={product.allergens} onToggle={(value) => toggleProductList(product.id, "allergens", value)} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={() => updateProduct(product.id, { status: product.status === "soldout" ? "active" : "soldout" })} className="rounded-full bg-[#fff1df] px-4 py-2 text-sm font-black text-[#c2410c]">Marcar como agotado</button>
                      <button onClick={() => updateProduct(product.id, { status: product.status === "hidden" ? "active" : "hidden" })} className="rounded-full bg-[#f1e7d8] px-4 py-2 text-sm font-black text-[#6b594a]">Ocultar plato</button>
                      <button onClick={() => deleteProduct(product.id)} className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-600">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </PanelCard>
          )}

          {activeSection === "menu" && (
            <PanelCard eyebrow="Actualizable cada día" title="Menú del día" text="Ideal para bares y restaurantes que cambian primeros, segundos o platos disponibles cada mañana.">
              <div className="mb-5 flex items-center justify-between rounded-3xl bg-[#fff1df] p-4">
                <div><p className="font-black">Mostrar menú del día</p><p className="text-sm text-[#7b6a5b]">Si está activo aparecerá arriba de la carta.</p></div>
                <button onClick={() => setData((current) => ({ ...current, dailyMenu: { ...current.dailyMenu, enabled: !current.dailyMenu.enabled } }))} className={`rounded-full px-4 py-2 text-sm font-black ${data.dailyMenu.enabled ? "bg-[#e85d04] text-white" : "bg-white text-[#6b594a]"}`}>{data.dailyMenu.enabled ? "Activo" : "Inactivo"}</button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Título"><TextInput value={data.dailyMenu.title} onChange={(event) => setData((current) => ({ ...current, dailyMenu: { ...current.dailyMenu, title: event.target.value } }))} /></Field>
                <Field label="Precio"><TextInput value={data.dailyMenu.price} onChange={(event) => setData((current) => ({ ...current, dailyMenu: { ...current.dailyMenu, price: event.target.value } }))} /></Field>
                <Field label="Días disponibles"><TextInput value={data.dailyMenu.availableDays} onChange={(event) => setData((current) => ({ ...current, dailyMenu: { ...current.dailyMenu, availableDays: event.target.value } }))} /></Field>
                <Field label="Nota"><TextInput value={data.dailyMenu.note} onChange={(event) => setData((current) => ({ ...current, dailyMenu: { ...current.dailyMenu, note: event.target.value } }))} /></Field>
                <Field label="Primeros platos"><TextArea value={data.dailyMenu.starters} onChange={(event) => setData((current) => ({ ...current, dailyMenu: { ...current.dailyMenu, starters: event.target.value } }))} /></Field>
                <Field label="Segundos platos"><TextArea value={data.dailyMenu.mains} onChange={(event) => setData((current) => ({ ...current, dailyMenu: { ...current.dailyMenu, mains: event.target.value } }))} /></Field>
                <Field label="Postres"><TextArea value={data.dailyMenu.desserts} onChange={(event) => setData((current) => ({ ...current, dailyMenu: { ...current.dailyMenu, desserts: event.target.value } }))} /></Field>
                <div className="flex items-center gap-3 rounded-3xl border border-[#eadfce] bg-white p-4">
                  <input id="drink" type="checkbox" checked={data.dailyMenu.drinkIncluded} onChange={(event) => setData((current) => ({ ...current, dailyMenu: { ...current.dailyMenu, drinkIncluded: event.target.checked } }))} className="h-5 w-5" />
                  <label htmlFor="drink" className="font-black">Bebida incluida</label>
                </div>
              </div>
            </PanelCard>
          )}

          {activeSection === "diseno" && (
            <PanelCard eyebrow="Plantillas guiadas" title="Diseño" text="Opciones simples para que siempre quede bonito sin tener que diseñar desde cero.">
              <div className="space-y-6">
                <div><p className="mb-3 font-black">Plantilla</p><div className="flex flex-wrap gap-2"><TogglePill active={data.settings.template === "visual"} onClick={() => setData((current) => ({ ...current, settings: { ...current.settings, template: "visual" } }))}>Visual con fotos</TogglePill><TogglePill active={data.settings.template === "elegant"} onClick={() => setData((current) => ({ ...current, settings: { ...current.settings, template: "elegant" } }))}>Elegante</TogglePill><TogglePill active={data.settings.template === "compact"} onClick={() => setData((current) => ({ ...current, settings: { ...current.settings, template: "compact" } }))}>Compacta</TogglePill></div></div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Color principal"><TextInput type="color" value={data.settings.primaryColor} onChange={(event) => setData((current) => ({ ...current, settings: { ...current.settings, primaryColor: event.target.value } }))} className="h-14" /></Field>
                  <Field label="Fotos"><Select value={data.settings.showImages} onChange={(event) => setData((current) => ({ ...current, settings: { ...current.settings, showImages: event.target.value as "always" | "onClick" } }))}><option value="always">Mostrar fotos siempre</option><option value="onClick">Mostrar al abrir plato</option></Select></Field>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex items-center justify-between rounded-3xl bg-white p-4 font-black"><span>Mostrar alérgenos</span><input type="checkbox" checked={data.settings.showAllergens} onChange={(event) => setData((current) => ({ ...current, settings: { ...current.settings, showAllergens: event.target.checked } }))} className="h-5 w-5" /></label>
                  <label className="flex items-center justify-between rounded-3xl bg-white p-4 font-black"><span>Mostrar etiquetas</span><input type="checkbox" checked={data.settings.showTags} onChange={(event) => setData((current) => ({ ...current, settings: { ...current.settings, showTags: event.target.checked } }))} className="h-5 w-5" /></label>
                </div>
              </div>
            </PanelCard>
          )}

          {activeSection === "qr" && (
            <PanelCard eyebrow="Publicación" title="QR y publicar" text="Para este MVP el QR es visual. Después se puede convertir en descarga real en PDF/PNG.">
              <div className="grid gap-5 md:grid-cols-[1fr_260px]">
                <div className="space-y-4">
                  <div className="rounded-3xl bg-[#fff1df] p-5"><p className="text-sm font-black uppercase tracking-[0.18em] text-[#e85d04]">URL pública simulada</p><p className="mt-2 break-all text-xl font-black">{publicUrl}</p></div>
                  <div className="flex flex-wrap gap-2">
                    <ActionButton onClick={copyLink}><Globe2 size={16} /> Copiar enlace</ActionButton>
                    <button onClick={() => alert("Próximamente descarga en PDF/PNG")} className="rounded-full border border-[#d9cbb8] bg-white px-5 py-3 text-sm font-black">Descargar QR</button>
                    <button onClick={() => setData((current) => ({ ...current, published: !current.published }))} className={`rounded-full px-5 py-3 text-sm font-black ${data.published ? "bg-green-100 text-green-800" : "bg-stone-200 text-stone-700"}`}>{data.published ? "Publicado" : "No publicado"}</button>
                  </div>
                  <p className="text-sm leading-7 text-[#7b6a5b]">Este cartel se puede imprimir para mesas, barra o escaparate. La versión real podrá descargar PDF con el logo y varios tamaños.</p>
                </div>
                <div className="rounded-[2rem] border border-[#eadfce] bg-white p-5 text-center shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#a08d7d]">Cartel mesa</p>
                  <h3 className="mt-2 text-2xl font-black">Escanea nuestra carta</h3>
                  <p className="mb-4 mt-1 text-sm text-[#7b6a5b]">{data.restaurant.name}</p>
                  <div className="mx-auto w-fit"><FakeQr /></div>
                  <p className="mt-4 text-xs font-bold text-[#7b6a5b]">Español · English · Deutsch</p>
                </div>
              </div>
            </PanelCard>
          )}
        </section>

        <aside className="hidden lg:block">
          <div className="mb-3 flex items-center justify-between px-2">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#a08d7d]">Vista previa</p>
            <Save size={17} className="text-[#e85d04]" />
          </div>
          <MobilePreview data={data} />
        </aside>
      </main>
    </div>
  );
}

function PanelCard({ eyebrow, title, text, children }: { eyebrow: string; title: string; text: string; children: ReactNode }) {
  return (
    <div className="rounded-[2rem] border border-[#eadfce] bg-white p-5 shadow-sm md:p-7">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#e85d04]">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl leading-7 text-[#6b594a]">{text}</p>
      <div className="mt-7">{children}</div>
    </div>
  );
}

function ActionButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className="inline-flex items-center gap-2 rounded-full bg-[#e85d04] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:scale-[1.02]">{children}</button>;
}

function ChipGroup({ title, options, selected, onToggle }: { title: string; options: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <div>
      <p className="mb-2 text-sm font-black text-[#221812]">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button key={option} type="button" onClick={() => onToggle(option)} className={`rounded-full px-3 py-2 text-xs font-black ${selected.includes(option) ? "bg-[#221812] text-white" : "bg-[#f1e7d8] text-[#6b594a]"}`}>{option}</button>
        ))}
      </div>
    </div>
  );
}
