"use client";

import { MapPin, MessageCircle, Phone, Clock, Languages, BadgeCheck, Utensils, Flame } from "lucide-react";
import type { CartaVivaState, Category, Product } from "@/lib/cartaviva-data";
import { defaultCartaVivaState } from "@/lib/cartaviva-data";
import { useMemo, useState } from "react";

type Props = {
  data?: CartaVivaState;
  mode?: "phone" | "full";
};

function lines(value: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

function getVisibleCategories(categories: Category[]) {
  return [...categories].filter((category) => category.visible).sort((a, b) => a.order - b.order);
}

function getProductsForCategory(products: Product[], categoryId: string) {
  return products.filter((product) => product.categoryId === categoryId && product.status !== "hidden");
}

function formatWhatsapp(value: string) {
  return value.replace(/[^0-9]/g, "");
}

function ProductCard({ product, showAllergens, showTags, showImages }: { product: Product; showAllergens: boolean; showTags: boolean; showImages: boolean }) {
  const soldOut = product.status === "soldout";

  return (
    <article className={`grid gap-3 rounded-[1.5rem] border bg-white p-3 shadow-sm transition ${showImages ? "grid-cols-[86px_1fr]" : "grid-cols-1"} ${soldOut ? "opacity-55 grayscale" : ""}`}>
      {showImages && (
        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=900&auto=format&fit=crop"}
          alt={product.name}
          className="h-24 w-24 rounded-2xl object-cover"
        />
      )}
      <div className="min-w-0">
        <div className="mb-1 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {soldOut && <span className="rounded-full bg-stone-200 px-2 py-1 text-[10px] font-black uppercase text-stone-700">Agotado</span>}
            {showTags && product.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-orange-100 px-2 py-1 text-[10px] font-black uppercase text-[#c2410c]">{tag}</span>
            ))}
          </div>
          <span className="whitespace-nowrap text-base font-black text-[#221812]">{product.price}</span>
        </div>
        <h3 className="truncate text-base font-black text-[#221812]">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#7b6a5b]">{product.description}</p>
        {showAllergens && product.allergens.length > 0 && (
          <p className="mt-2 text-[11px] font-bold text-[#9a7d63]">Alérgenos: {product.allergens.join(", ")}</p>
        )}
      </div>
    </article>
  );
}

function DailyMenuCard({ data }: { data: CartaVivaState }) {
  if (!data.dailyMenu.enabled) return null;

  return (
    <section className="rounded-[1.7rem] border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-[#e85d04] px-3 py-1 text-[11px] font-black uppercase text-white">
            <Flame size={13} /> Hoy
          </div>
          <h2 className="text-xl font-black text-[#221812]">{data.dailyMenu.title}</h2>
          <p className="text-xs font-bold text-[#8b735f]">{data.dailyMenu.availableDays}</p>
        </div>
        <p className="rounded-2xl bg-white px-4 py-2 text-lg font-black text-[#221812] shadow-sm">{data.dailyMenu.price}</p>
      </div>

      <div className="grid gap-3 text-sm text-[#5d4b3d] sm:grid-cols-3">
        <div>
          <p className="mb-1 font-black text-[#221812]">Primeros</p>
          {lines(data.dailyMenu.starters).map((item) => <p key={item}>• {item}</p>)}
        </div>
        <div>
          <p className="mb-1 font-black text-[#221812]">Segundos</p>
          {lines(data.dailyMenu.mains).map((item) => <p key={item}>• {item}</p>)}
        </div>
        <div>
          <p className="mb-1 font-black text-[#221812]">Postres</p>
          {lines(data.dailyMenu.desserts).map((item) => <p key={item}>• {item}</p>)}
        </div>
      </div>
      <p className="mt-3 rounded-2xl bg-white/70 p-3 text-xs font-semibold leading-5 text-[#7b6a5b]">
        {data.dailyMenu.drinkIncluded ? "Bebida incluida. " : "Bebida no incluida. "}{data.dailyMenu.note}
      </p>
    </section>
  );
}

export default function PublicMenuView({ data = defaultCartaVivaState, mode = "full" }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("daily");
  const categories = useMemo(() => getVisibleCategories(data.categories), [data.categories]);
  const accent = data.settings.primaryColor || "#e85d04";
  const showImages = data.settings.showImages === "always";
  const wrapperClass = mode === "phone" ? "h-full overflow-y-auto bg-[#fffaf3]" : "min-h-screen bg-[#fffaf3]";
  const contentClass = mode === "phone" ? "" : "mx-auto max-w-4xl px-4 py-6 md:py-10";

  return (
    <div className={wrapperClass}>
      <div className={contentClass}>
        <div className="overflow-hidden bg-[#fffaf3] shadow-sm md:rounded-[2rem] md:border md:border-[#eadfce]">
          <header className="relative h-52 bg-cover bg-center md:h-72" style={{ backgroundImage: `url('${data.restaurant.coverUrl}')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white md:p-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] backdrop-blur">
                <Utensils size={14} /> Carta digital
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">{data.restaurant.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85 md:text-base">{data.restaurant.description}</p>
            </div>
          </header>

          <div className="border-b border-[#eadfce] bg-white/70 px-4 py-3 backdrop-blur md:px-8">
            <div className="flex flex-wrap gap-2 text-xs font-bold text-[#6b594a]">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fff5e8] px-3 py-1"><MapPin size={13} /> {data.restaurant.address}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fff5e8] px-3 py-1"><Clock size={13} /> {data.restaurant.schedule}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fff5e8] px-3 py-1"><Languages size={13} /> {data.restaurant.language}</span>
            </div>
          </div>

          <nav className="sticky top-0 z-20 flex gap-2 overflow-x-auto border-b border-[#eadfce] bg-[#fffaf3]/95 px-4 py-4 text-sm font-black backdrop-blur md:px-8">
            {data.dailyMenu.enabled && (
              <button
                type="button"
                onClick={() => setActiveCategory("daily")}
                className="whitespace-nowrap rounded-full px-4 py-2 text-white"
                style={{ backgroundColor: activeCategory === "daily" ? accent : "#221812" }}
              >
                Menú de hoy
              </button>
            )}
            {categories.filter((category) => category.id !== "daily").map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className="whitespace-nowrap rounded-full px-4 py-2 transition"
                style={{ backgroundColor: activeCategory === category.id ? accent : "#f1e7d8", color: activeCategory === category.id ? "white" : "#6b594a" }}
              >
                {category.name}
              </button>
            ))}
          </nav>

          <main className="space-y-4 px-4 py-5 md:px-8 md:py-8">
            {activeCategory === "daily" ? (
              <DailyMenuCard data={data} />
            ) : (
              <section className="space-y-3">
                {getProductsForCategory(data.products, activeCategory).length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-[#d8c7b2] bg-white/70 p-8 text-center">
                    <p className="text-lg font-black text-[#221812]">No hay platos visibles todavía</p>
                    <p className="mt-2 text-sm text-[#7b6a5b]">Añade productos a esta categoría desde el builder.</p>
                  </div>
                ) : (
                  getProductsForCategory(data.products, activeCategory).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      showAllergens={data.settings.showAllergens}
                      showTags={data.settings.showTags}
                      showImages={showImages}
                    />
                  ))
                )}
              </section>
            )}
          </main>

          <footer className="border-t border-[#eadfce] bg-white px-4 py-5 md:px-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${formatWhatsapp(data.restaurant.whatsapp)}?text=Hola,%20he%20visto%20vuestra%20carta%20digital`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black text-white"
                style={{ backgroundColor: accent }}
              >
                <MessageCircle size={18} /> Reservar por WhatsApp
              </a>
              <a href={`tel:${data.restaurant.phone}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#d9cbb8] bg-[#fffaf3] px-5 py-3 text-sm font-black text-[#221812]">
                <Phone size={18} /> Llamar
              </a>
            </div>
            <p className="mt-4 flex items-center justify-center gap-1 text-xs font-bold text-[#8b735f]"><BadgeCheck size={14} /> Carta creada con CartaViva</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
