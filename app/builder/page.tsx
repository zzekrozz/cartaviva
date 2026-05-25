"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  LayoutDashboard,
  Menu as MenuIcon,
  Plus,
  QrCode,
  Save,
  Settings,
  Sparkles,
  Trash2,
  Utensils,
  X
} from "lucide-react";
import PublicMenuView from "@/components/cartaviva/PublicMenuView";
import {
  allergenOptions,
  CartaVivaState,
  Category,
  defaultCartaVivaState,
  Product,
  ProductStatus,
  slugify,
  STORAGE_KEY,
  tagOptions
} from "@/lib/cartaviva-data";

type Section = "restaurante" | "categorias" | "platos" | "menu" | "diseno" | "qr";

const sections: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "restaurante", label: "Mi restaurante", icon: LayoutDashboard },
  { id: "categorias", label: "Categorías", icon: MenuIcon },
  { id: "platos", label: "Platos", icon: Utensils },
  { id: "menu", label: "Menú del día", icon: CalendarDays },
  { id: "diseno", label: "Diseño", icon: Settings },
  { id: "qr", label: "QR y publicar", icon: QrCode }
];

const inputClass = "w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-semibold text-[#221812] outline-none transition focus:border-[#e85d04] focus:ring-4 focus:ring-orange-100";
const labelClass = "mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#8b735f]";
const cardClass = "rounded-[1.7rem] border border-[#eadfce] bg-white p-5 shadow-sm";

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function getInitialState(): CartaVivaState {
  if (typeof window === "undefined") return defaultCartaVivaState;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultCartaVivaState;
    return { ...defaultCartaVivaState, ...JSON.parse(saved) } as CartaVivaState;
  } catch {
    return defaultCartaVivaState;
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <input className={inputClass} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
}

function TextArea({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (value: string) => void; placeholder?: string; rows?: number }) {
  return <textarea className={`${inputClass} min-h-28 resize-y`} rows={rows} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${checked ? "border-orange-200 bg-orange-50 text-[#c2410c]" : "border-[#eadfce] bg-white text-[#6b594a]"}`}
    >
      {label}
      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${checked ? "bg-[#e85d04] text-white" : "bg-[#eee1d0] text-[#7b6a5b]"}`}>
        {checked ? <Check size={14} /> : null}
      </span>
    </button>
  );
}

function MultiSelect({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (value: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(active ? selected.filter((item) => item !== option) : [...selected, option])}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${active ? "bg-[#221812] text-white" : "bg-[#f3eadf] text-[#6b594a] hover:bg-[#eadfce]"}`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function MiniQR() {
  const cells = Array.from({ length: 81 }, (_, i) => i);
  return (
    <div className="grid h-36 w-36 grid-cols-9 gap-1 rounded-3xl bg-white p-3 shadow-sm">
      {cells.map((cell) => {
        const active = cell % 2 === 0 || cell % 7 === 0 || [0, 1, 2, 9, 18, 6, 7, 8, 17, 26, 54, 63, 72, 73, 74].includes(cell);
        return <span key={cell} className={`rounded-[3px] ${active ? "bg-[#221812]" : "bg-[#f3eadf]"}`} />;
      })}
    </div>
  );
}

function RestaurantSection({ state, setState }: { state: CartaVivaState; setState: React.Dispatch<React.SetStateAction<CartaVivaState>> }) {
  const updateRestaurant = (key: keyof CartaVivaState["restaurant"], value: string) => {
    setState((current) => ({
      ...current,
      restaurant: {
        ...current.restaurant,
        [key]: value,
        slug: key === "name" ? slugify(value) : current.restaurant.slug
      }
    }));
  };

  return (
    <section className={cardClass}>
      <div className="mb-5">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#e85d04]">Paso 1</p>
        <h2 className="mt-1 text-3xl font-black tracking-tight">Datos del restaurante</h2>
        <p className="mt-2 text-sm leading-6 text-[#7b6a5b]">Esto aparecerá en la portada de la carta y en los botones de contacto.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre">
          <TextInput value={state.restaurant.name} onChange={(value) => updateRestaurant("name", value)} />
        </Field>
        <Field label="Slug / URL">
          <TextInput value={state.restaurant.slug} onChange={(value) => updateRestaurant("slug", slugify(value))} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Descripción corta">
            <TextArea value={state.restaurant.description} onChange={(value) => updateRestaurant("description", value)} rows={3} />
          </Field>
        </div>
        <Field label="Imagen de portada URL">
          <TextInput value={state.restaurant.coverUrl} onChange={(value) => updateRestaurant("coverUrl", value)} />
        </Field>
        <Field label="Logo URL opcional">
          <TextInput value={state.restaurant.logoUrl} onChange={(value) => updateRestaurant("logoUrl", value)} placeholder="Puedes dejarlo vacío" />
        </Field>
        <Field label="WhatsApp">
          <TextInput value={state.restaurant.whatsapp} onChange={(value) => updateRestaurant("whatsapp", value)} />
        </Field>
        <Field label="Teléfono">
          <TextInput value={state.restaurant.phone} onChange={(value) => updateRestaurant("phone", value)} />
        </Field>
        <Field label="Dirección">
          <TextInput value={state.restaurant.address} onChange={(value) => updateRestaurant("address", value)} />
        </Field>
        <Field label="Instagram">
          <TextInput value={state.restaurant.instagram} onChange={(value) => updateRestaurant("instagram", value)} />
        </Field>
        <Field label="Horario">
          <TextInput value={state.restaurant.schedule} onChange={(value) => updateRestaurant("schedule", value)} />
        </Field>
        <Field label="Idioma principal">
          <select className={inputClass} value={state.restaurant.language} onChange={(event) => updateRestaurant("language", event.target.value)}>
            <option>Español</option>
            <option>Inglés</option>
            <option>Francés</option>
            <option>Alemán</option>
          </select>
        </Field>
      </div>
    </section>
  );
}

function CategoriesSection({ state, setState }: { state: CartaVivaState; setState: React.Dispatch<React.SetStateAction<CartaVivaState>> }) {
  const categories = [...state.categories].sort((a, b) => a.order - b.order);

  const updateCategory = (id: string, patch: Partial<Category>) => {
    setState((current) => ({ ...current, categories: current.categories.map((category) => category.id === id ? { ...category, ...patch } : category) }));
  };

  const addCategory = () => {
    const newCategory: Category = { id: uid("cat"), name: "Nueva categoría", visible: true, order: state.categories.length };
    setState((current) => ({ ...current, categories: [...current.categories, newCategory] }));
  };

  const deleteCategory = (id: string) => {
    setState((current) => ({
      ...current,
      categories: current.categories.filter((category) => category.id !== id),
      products: current.products.filter((product) => product.categoryId !== id)
    }));
  };

  return (
    <section className={cardClass}>
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#e85d04]">Carta</p>
          <h2 className="mt-1 text-3xl font-black tracking-tight">Categorías</h2>
          <p className="mt-2 text-sm leading-6 text-[#7b6a5b]">Crea secciones como tapas, carnes, postres, vinos o menú especial.</p>
        </div>
        <button type="button" onClick={addCategory} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#221812] px-5 py-3 text-sm font-black text-white">
          <Plus size={17} /> Añadir categoría
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((category, index) => (
          <div key={category.id} className="grid gap-3 rounded-3xl border border-[#eadfce] bg-[#fffaf3] p-3 md:grid-cols-[1fr_120px_100px_44px] md:items-center">
            <input className={inputClass} value={category.name} onChange={(event) => updateCategory(category.id, { name: event.target.value })} />
            <input className={inputClass} type="number" value={category.order} onChange={(event) => updateCategory(category.id, { order: Number(event.target.value) })} aria-label={`Orden ${index + 1}`} />
            <button type="button" onClick={() => updateCategory(category.id, { visible: !category.visible })} className={`inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-black ${category.visible ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-600"}`}>
              {category.visible ? <Eye size={16} /> : <EyeOff size={16} />} {category.visible ? "Visible" : "Oculta"}
            </button>
            <button type="button" onClick={() => deleteCategory(category.id)} className="inline-flex h-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Trash2 size={17} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductsSection({ state, setState }: { state: CartaVivaState; setState: React.Dispatch<React.SetStateAction<CartaVivaState>> }) {
  const [selectedId, setSelectedId] = useState(state.products[0]?.id || "");
  const product = state.products.find((item) => item.id === selectedId) || state.products[0];

  useEffect(() => {
    if (!selectedId && state.products[0]) setSelectedId(state.products[0].id);
  }, [selectedId, state.products]);

  const updateProduct = (id: string, patch: Partial<Product>) => {
    setState((current) => ({ ...current, products: current.products.map((item) => item.id === id ? { ...item, ...patch } : item) }));
  };

  const addProduct = () => {
    const firstCategory = state.categories.find((category) => category.id !== "daily") || state.categories[0];
    const newProduct: Product = {
      id: uid("prod"),
      categoryId: firstCategory?.id || "tapas",
      name: "Nuevo plato",
      description: "Descripción corta del plato.",
      price: "0,00 €",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=900&auto=format&fit=crop",
      tags: [],
      allergens: [],
      status: "active"
    };
    setState((current) => ({ ...current, products: [...current.products, newProduct] }));
    setSelectedId(newProduct.id);
  };

  const deleteProduct = (id: string) => {
    setState((current) => ({ ...current, products: current.products.filter((item) => item.id !== id) }));
    setSelectedId(state.products.find((item) => item.id !== id)?.id || "");
  };

  if (!product) {
    return (
      <section className={cardClass}>
        <h2 className="text-3xl font-black">Platos</h2>
        <button type="button" onClick={addProduct} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#e85d04] px-5 py-3 text-sm font-black text-white"><Plus size={17} /> Crear primer plato</button>
      </section>
    );
  }

  return (
    <section className={cardClass}>
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#e85d04]">Productos</p>
          <h2 className="mt-1 text-3xl font-black tracking-tight">Platos y bebidas</h2>
          <p className="mt-2 text-sm leading-6 text-[#7b6a5b]">Añade fotos, etiquetas, alérgenos y marca agotados en segundos.</p>
        </div>
        <button type="button" onClick={addProduct} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#221812] px-5 py-3 text-sm font-black text-white">
          <Plus size={17} /> Añadir plato
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[230px_1fr]">
        <div className="space-y-2 rounded-3xl bg-[#fffaf3] p-3">
          {state.products.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`w-full rounded-2xl px-3 py-3 text-left text-sm font-black transition ${item.id === product.id ? "bg-[#221812] text-white" : "bg-white text-[#6b594a] hover:bg-[#f3eadf]"}`}
            >
              <span className="block truncate">{item.name}</span>
              <span className="text-xs opacity-70">{item.price} · {item.status === "active" ? "Activo" : item.status === "soldout" ? "Agotado" : "Oculto"}</span>
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre del plato">
            <TextInput value={product.name} onChange={(value) => updateProduct(product.id, { name: value })} />
          </Field>
          <Field label="Precio">
            <TextInput value={product.price} onChange={(value) => updateProduct(product.id, { price: value })} />
          </Field>
          <Field label="Categoría">
            <select className={inputClass} value={product.categoryId} onChange={(event) => updateProduct(product.id, { categoryId: event.target.value })}>
              {state.categories.filter((category) => category.id !== "daily").map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </Field>
          <Field label="Estado">
            <select className={inputClass} value={product.status} onChange={(event) => updateProduct(product.id, { status: event.target.value as ProductStatus })}>
              <option value="active">Activo</option>
              <option value="soldout">Agotado</option>
              <option value="hidden">Oculto</option>
            </select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Descripción">
              <TextArea value={product.description} onChange={(value) => updateProduct(product.id, { description: value })} rows={3} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Foto URL">
              <TextInput value={product.imageUrl} onChange={(value) => updateProduct(product.id, { imageUrl: value })} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <span className={labelClass}>Etiquetas</span>
            <MultiSelect options={tagOptions} selected={product.tags} onChange={(value) => updateProduct(product.id, { tags: value })} />
          </div>
          <div className="md:col-span-2">
            <span className={labelClass}>Alérgenos</span>
            <MultiSelect options={allergenOptions} selected={product.allergens} onChange={(value) => updateProduct(product.id, { allergens: value })} />
          </div>
          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => updateProduct(product.id, { status: "soldout" })} className="flex-1 rounded-full bg-stone-100 px-5 py-3 text-sm font-black text-stone-700">Marcar como agotado</button>
            <button type="button" onClick={() => updateProduct(product.id, { status: "hidden" })} className="flex-1 rounded-full bg-[#fff3e9] px-5 py-3 text-sm font-black text-[#c2410c]">Ocultar plato</button>
            <button type="button" onClick={() => deleteProduct(product.id)} className="flex-1 rounded-full bg-red-50 px-5 py-3 text-sm font-black text-red-600">Eliminar</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function DailyMenuSection({ state, setState }: { state: CartaVivaState; setState: React.Dispatch<React.SetStateAction<CartaVivaState>> }) {
  const updateDaily = (key: keyof CartaVivaState["dailyMenu"], value: string | boolean) => {
    setState((current) => ({ ...current, dailyMenu: { ...current.dailyMenu, [key]: value } }));
  };

  return (
    <section className={cardClass}>
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#e85d04]">Diario</p>
          <h2 className="mt-1 text-3xl font-black tracking-tight">Menú del día</h2>
          <p className="mt-2 text-sm leading-6 text-[#7b6a5b]">Cambia el menú cada mañana y márcalo como destacado en la carta.</p>
        </div>
        <Toggle checked={state.dailyMenu.enabled} onChange={(value) => updateDaily("enabled", value)} label={state.dailyMenu.enabled ? "Publicado" : "Oculto"} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Título">
          <TextInput value={state.dailyMenu.title} onChange={(value) => updateDaily("title", value)} />
        </Field>
        <Field label="Precio">
          <TextInput value={state.dailyMenu.price} onChange={(value) => updateDaily("price", value)} />
        </Field>
        <Field label="Días disponibles">
          <TextInput value={state.dailyMenu.availableDays} onChange={(value) => updateDaily("availableDays", value)} />
        </Field>
        <div className="pt-6">
          <Toggle checked={state.dailyMenu.drinkIncluded} onChange={(value) => updateDaily("drinkIncluded", value)} label="Bebida incluida" />
        </div>
        <Field label="Primeros platos">
          <TextArea value={state.dailyMenu.starters} onChange={(value) => updateDaily("starters", value)} rows={4} />
        </Field>
        <Field label="Segundos platos">
          <TextArea value={state.dailyMenu.mains} onChange={(value) => updateDaily("mains", value)} rows={4} />
        </Field>
        <Field label="Postres">
          <TextArea value={state.dailyMenu.desserts} onChange={(value) => updateDaily("desserts", value)} rows={4} />
        </Field>
        <Field label="Nota del menú">
          <TextArea value={state.dailyMenu.note} onChange={(value) => updateDaily("note", value)} rows={4} />
        </Field>
      </div>
    </section>
  );
}

function DesignSection({ state, setState }: { state: CartaVivaState; setState: React.Dispatch<React.SetStateAction<CartaVivaState>> }) {
  const updateSettings = (key: keyof CartaVivaState["settings"], value: string | boolean) => {
    setState((current) => ({ ...current, settings: { ...current.settings, [key]: value } }));
  };

  return (
    <section className={cardClass}>
      <div className="mb-5">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#e85d04]">Estilo</p>
        <h2 className="mt-1 text-3xl font-black tracking-tight">Diseño de la carta</h2>
        <p className="mt-2 text-sm leading-6 text-[#7b6a5b]">Opciones simples para que todo se vea bien sin tocar código.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Plantilla">
          <select className={inputClass} value={state.settings.template} onChange={(event) => updateSettings("template", event.target.value)}>
            <option value="visual">Visual con fotos</option>
            <option value="elegant">Elegante</option>
            <option value="compact">Compacta</option>
          </select>
        </Field>
        <Field label="Color principal">
          <input className={`${inputClass} h-[46px] p-2`} type="color" value={state.settings.primaryColor} onChange={(event) => updateSettings("primaryColor", event.target.value)} />
        </Field>
        <Field label="Fotos">
          <select className={inputClass} value={state.settings.showImages} onChange={(event) => updateSettings("showImages", event.target.value)}>
            <option value="always">Mostrar fotos siempre</option>
            <option value="onClick">Ocultar fotos en vista compacta</option>
          </select>
        </Field>
        <div className="grid gap-3 pt-6">
          <Toggle checked={state.settings.showAllergens} onChange={(value) => updateSettings("showAllergens", value)} label="Mostrar alérgenos" />
          <Toggle checked={state.settings.showTags} onChange={(value) => updateSettings("showTags", value)} label="Mostrar etiquetas" />
        </div>
      </div>
    </section>
  );
}

function QRSection({ state, setState }: { state: CartaVivaState; setState: React.Dispatch<React.SetStateAction<CartaVivaState>> }) {
  const publicUrl = `https://cartaviva.es/carta/${state.restaurant.slug}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(publicUrl); } catch {}
  };

  return (
    <section className={cardClass}>
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#e85d04]">Publicación</p>
          <h2 className="mt-1 text-3xl font-black tracking-tight">QR y enlace público</h2>
          <p className="mt-2 text-sm leading-6 text-[#7b6a5b]">De momento es una demo local. Luego aquí irá el QR real descargable.</p>
        </div>
        <Toggle checked={state.published} onChange={(value) => setState((current) => ({ ...current, published: value }))} label={state.published ? "Publicado" : "No publicado"} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          <div className="rounded-3xl bg-[#fffaf3] p-4">
            <span className={labelClass}>URL simulada</span>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input className={inputClass} value={publicUrl} readOnly />
              <button type="button" onClick={copy} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#221812] px-5 py-3 text-sm font-black text-white"><Copy size={17} /> Copiar</button>
            </div>
          </div>
          <div className="rounded-3xl border border-dashed border-[#d8c7b2] bg-white p-5">
            <h3 className="text-xl font-black">Cartel para mesa</h3>
            <p className="mt-2 text-sm leading-6 text-[#7b6a5b]">En la siguiente fase podrás descargar esto como PDF para imprimirlo en mesas, barra o escaparate.</p>
            <button type="button" className="mt-4 rounded-full bg-[#e85d04] px-5 py-3 text-sm font-black text-white">Descargar QR próximamente</button>
          </div>
        </div>

        <div className="rounded-[2rem] bg-[#221812] p-5 text-center text-white shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-white/65">{state.restaurant.name}</p>
          <h3 className="mt-2 text-2xl font-black">Escanea nuestra carta</h3>
          <div className="mx-auto my-5 flex justify-center"><MiniQR /></div>
          <p className="text-sm font-bold text-white/75">Menú · Fotos · Idiomas · WhatsApp</p>
        </div>
      </div>
    </section>
  );
}

export default function BuilderPage() {
  const [state, setState] = useState<CartaVivaState>(defaultCartaVivaState);
  const [section, setSection] = useState<Section>("restaurante");
  const [mobilePreview, setMobilePreview] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(getInitialState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const previewLink = useMemo(() => `/carta/${state.restaurant.slug}`, [state.restaurant.slug]);

  const resetDemo = () => {
    setState(defaultCartaVivaState);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCartaVivaState));
  };

  return (
    <div className="min-h-screen bg-[#fffaf3] text-[#221812]">
      <header className="sticky top-0 z-50 border-b border-[#eadfce] bg-[#fffaf3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#221812] text-white"><ArrowLeft size={18} /></Link>
            <div>
              <p className="text-lg font-black">CartaViva Builder</p>
              <p className="text-xs font-bold text-[#8b735f]">Guardado localmente · MVP</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Link href={previewLink} className="rounded-full border border-[#d9cbb8] bg-white px-5 py-2.5 text-sm font-black text-[#221812]">Ver carta</Link>
            <button type="button" onClick={resetDemo} className="rounded-full bg-[#fff3e9] px-5 py-2.5 text-sm font-black text-[#c2410c]">Reset demo</button>
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-black text-green-700"><Save size={16} /> Guardado</div>
          </div>
          <button type="button" onClick={() => setMobilePreview(true)} className="rounded-full bg-[#221812] px-4 py-2.5 text-sm font-black text-white lg:hidden">Vista previa</button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-5 px-4 py-5 lg:grid-cols-[240px_minmax(0,1fr)_420px]">
        <aside className="rounded-[1.7rem] border border-[#eadfce] bg-white p-3 shadow-sm lg:sticky lg:top-20 lg:h-fit">
          <div className="mb-3 rounded-3xl bg-[#221812] p-4 text-white">
            <p className="flex items-center gap-2 text-sm font-black"><Sparkles size={16} /> Demo activa</p>
            <p className="mt-1 text-xs leading-5 text-white/65">Edita campos y mira la carta cambiar en directo.</p>
          </div>
          <nav className="grid gap-2">
            {sections.map((item) => {
              const Icon = item.icon;
              const active = item.id === section;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-black transition ${active ? "bg-[#e85d04] text-white" : "text-[#6b594a] hover:bg-[#fff3e9] hover:text-[#221812]"}`}
                >
                  <span className="flex items-center gap-2"><Icon size={17} /> {item.label}</span>
                  {active ? <ChevronDown size={16} /> : null}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 space-y-5">
          {section === "restaurante" && <RestaurantSection state={state} setState={setState} />}
          {section === "categorias" && <CategoriesSection state={state} setState={setState} />}
          {section === "platos" && <ProductsSection state={state} setState={setState} />}
          {section === "menu" && <DailyMenuSection state={state} setState={setState} />}
          {section === "diseno" && <DesignSection state={state} setState={setState} />}
          {section === "qr" && <QRSection state={state} setState={setState} />}

          <div className="rounded-[1.7rem] border border-[#eadfce] bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 text-xl font-black"><BadgeCheck size={20} /> Siguiente fase</h3>
            <p className="mt-2 text-sm leading-6 text-[#7b6a5b]">Cuando este flujo esté validado, añadimos login, base de datos, QR real descargable, planes de pago, traducción automática editable y subida de fotos.</p>
          </div>
        </main>

        <aside className="hidden lg:sticky lg:top-20 lg:block lg:h-[calc(100vh-6rem)]">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#8b735f]">Vista previa</p>
            <Link href={previewLink} className="text-sm font-black text-[#e85d04]">Abrir</Link>
          </div>
          <div className="h-full overflow-hidden rounded-[2.5rem] border-[10px] border-[#1c1511] bg-[#fffaf3] shadow-2xl">
            <PublicMenuView data={state} mode="phone" />
          </div>
        </aside>
      </div>

      {mobilePreview && (
        <div className="fixed inset-0 z-[80] bg-[#221812]/70 p-4 backdrop-blur lg:hidden">
          <div className="mx-auto flex h-full max-w-md flex-col overflow-hidden rounded-[2rem] bg-[#fffaf3]">
            <div className="flex items-center justify-between border-b border-[#eadfce] p-3">
              <p className="font-black">Vista previa</p>
              <button type="button" onClick={() => setMobilePreview(false)} className="rounded-full bg-[#221812] p-2 text-white"><X size={18} /></button>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden"><PublicMenuView data={state} mode="phone" /></div>
          </div>
        </div>
      )}
    </div>
  );
}
