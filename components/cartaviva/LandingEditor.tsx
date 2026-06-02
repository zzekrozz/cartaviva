"use client";

import { Globe, Image, Lock, MapPin, MessageCircle, Plus, Star, Trash2, X } from "lucide-react";
import { ImageUploadField } from "@/components/cartaviva/ImageUploadField";
import type { RestaurantLanding, Product } from "@/lib/cartaviva-data";
import type { ImageUploadContext } from "@/lib/image-tools";

type Props = {
  landing: RestaurantLanding;
  products: Product[];
  onChange: <K extends keyof RestaurantLanding>(field: K, value: RestaurantLanding[K]) => void;
  uploadContext?: Omit<ImageUploadContext, "folder">;
  planEnabled: boolean;
  maxGalleryPhotos: number;
};

export function LandingEditor({ landing, products, onChange, uploadContext, planEnabled, maxGalleryPhotos }: Props) {
  if (!planEnabled) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e8d8c2] bg-[#fffdf9] py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1df]">
          <Lock size={26} className="text-[#e85d04]" />
        </div>
        <h3 className="mt-4 text-xl font-black text-[#221812]">Miniweb disponible en Restaurante Web</h3>
        <p className="mt-2 max-w-sm text-sm text-[#6b594a]">
          Activa la miniweb editable para mostrar tu restaurante en Instagram, Google y WhatsApp.
          Incluye portada, historia, galería, destacados y ubicación.
        </p>
        <a
          href="/checkout?plan=pro"
          className="mt-6 flex items-center gap-2 rounded-xl bg-[#e85d04] px-6 py-3 text-sm font-black text-white transition hover:bg-[#c94e03]"
        >
          Activar Restaurante Web por 1 €
        </a>
      </div>
    );
  }

  const activeProducts = products.filter((p) => p.status === "active");
  const featuredIds = landing.featuredProductIds || [];
  const galleryImages = landing.galleryImages || [];

  function toggleFeatured(id: string) {
    const next = featuredIds.includes(id)
      ? featuredIds.filter((f) => f !== id)
      : featuredIds.length < 6 ? [...featuredIds, id] : featuredIds;
    onChange("featuredProductIds", next);
  }

  function addGalleryImage(url: string) {
    if (!url || galleryImages.length >= maxGalleryPhotos) return;
    onChange("galleryImages", [...galleryImages, url]);
  }

  function removeGalleryImage(index: number) {
    onChange("galleryImages", galleryImages.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      {/* Enable toggle */}
      <div className="flex items-center justify-between rounded-2xl border border-[#eadfce] bg-[#fff9f1] p-4">
        <div>
          <p className="font-black text-[#221812]">Miniweb activada</p>
          <p className="text-xs text-[#8a796a]">
            Activa la miniweb para usarla como enlace en Instagram, WhatsApp y Google Business.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange("enabled", !landing.enabled)}
          className={`flex h-8 w-14 flex-shrink-0 items-center rounded-full transition ${landing.enabled ? "bg-[#e85d04]" : "bg-[#d9cbb8]"}`}
        >
          <span className={`ml-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${landing.enabled ? "translate-x-6" : "translate-x-0"}`} />
        </button>
      </div>

      {/* Hero */}
      <div className="rounded-2xl border border-[#eadfce] bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-[#e85d04]">Portada</p>
        <h3 className="mt-1 text-lg font-black text-[#221812]">Hero / Encabezado</h3>
        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-black text-[#221812]">Título principal</label>
            <input
              value={landing.heroTitle}
              onChange={(e) => onChange("heroTitle", e.target.value)}
              placeholder={`Ej. "Cocina casera en el corazón de Marbella"`}
              className="w-full rounded-xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-black text-[#221812]">Subtítulo corto</label>
            <input
              value={landing.heroSubtitle}
              onChange={(e) => onChange("heroSubtitle", e.target.value)}
              placeholder="Tapas, menú del día y carta completa"
              className="w-full rounded-xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-black text-[#221812]">Botón principal</label>
              <input
                value={landing.primaryCta}
                onChange={(e) => onChange("primaryCta", e.target.value)}
                placeholder="Ver carta"
                className="w-full rounded-xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-black text-[#221812]">Botón secundario</label>
              <input
                value={landing.secondaryCta}
                onChange={(e) => onChange("secondaryCta", e.target.value)}
                placeholder="Cómo llegar"
                className="w-full rounded-xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="rounded-2xl border border-[#eadfce] bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-[#e85d04]">Historia</p>
        <h3 className="mt-1 text-lg font-black text-[#221812]">Historia del restaurante</h3>
        <p className="mb-4 mt-1 text-xs text-[#8a796a]">Máximo 600 caracteres. Aparece como bloque de texto bajo el hero.</p>
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-black text-[#221812]">Título</label>
            <input
              value={landing.storyTitle}
              onChange={(e) => onChange("storyTitle", e.target.value)}
              placeholder="Ej. Nuestra historia"
              className="w-full rounded-xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-black text-[#221812]">Texto</label>
            <textarea
              value={landing.storyText}
              onChange={(e) => onChange("storyText", e.target.value.slice(0, 600))}
              rows={4}
              placeholder="Cuéntanos quiénes sois, qué cocinais y qué hace especial vuestro restaurante..."
              className="w-full resize-none rounded-xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-semibold leading-6 outline-none focus:border-[#e85d04]"
            />
            <p className="mt-1 text-right text-[11px] text-[#a08d7d]">{(landing.storyText || "").length}/600</p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="rounded-2xl border border-[#eadfce] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#e85d04]">Galería</p>
            <h3 className="mt-0.5 text-lg font-black text-[#221812]">Fotos del restaurante</h3>
            <p className="mt-0.5 text-xs text-[#8a796a]">Máximo {maxGalleryPhotos} fotos · {galleryImages.length}/{maxGalleryPhotos} usadas</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {galleryImages.map((url, i) => (
            <div key={i} className="group relative overflow-hidden rounded-xl bg-[#fff6eb]" style={{ paddingBottom: "75%" }}>
              <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeGalleryImage(i)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow transition group-hover:opacity-100"
              >
                <X size={11} />
              </button>
            </div>
          ))}
          {galleryImages.length < maxGalleryPhotos && (
            <ImageUploadField
              label=""
              value=""
              onChange={addGalleryImage}
              uploadContext={uploadContext ? { ...uploadContext, folder: "gallery" } : undefined}
              maxWidth={1400}
            />
          )}
        </div>
      </div>

      {/* Featured products */}
      <div className="rounded-2xl border border-[#eadfce] bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-[#e85d04]">Destacados</p>
        <h3 className="mt-1 text-lg font-black text-[#221812]">Platos destacados</h3>
        <p className="mt-0.5 mb-4 text-xs text-[#8a796a]">
          Selecciona hasta 6 platos que aparecerán en la miniweb. {featuredIds.length}/6 seleccionados.
        </p>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {activeProducts.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#8a796a]">No tienes productos activos todavía.</p>
          ) : (
            activeProducts.map((product) => {
              const selected = featuredIds.includes(product.id);
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggleFeatured(product.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${selected ? "border-[#e85d04] bg-[#fff8f2]" : "border-[#eadfce] bg-[#fffdf9] hover:border-[#f0d0b0]"}`}
                >
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt="" className="h-10 w-10 flex-shrink-0 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#fff1df]">
                      <Star size={14} className="text-[#e85d04]" />
                    </div>
                  )}
                  <span className="flex-1 text-sm font-black text-[#221812]">{product.name}</span>
                  <span className="text-sm font-bold text-[#e85d04]">{product.price}</span>
                  {selected && <Star size={14} className="flex-shrink-0 text-[#e85d04]" fill="currentColor" />}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Location & links */}
      <div className="rounded-2xl border border-[#eadfce] bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-[#e85d04]">Ubicación y enlaces</p>
        <h3 className="mt-1 text-lg font-black text-[#221812]">Mapas y reservas</h3>
        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-black text-[#221812]">
              <MapPin size={12} /> Google Maps URL
            </label>
            <input
              value={landing.googleMapsUrl}
              onChange={(e) => onChange("googleMapsUrl", e.target.value)}
              placeholder="https://maps.google.com/..."
              type="url"
              className="w-full rounded-xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-black text-[#221812]">
              <Globe size={12} /> URL de reservas
            </label>
            <input
              value={landing.reservationUrl}
              onChange={(e) => onChange("reservationUrl", e.target.value)}
              placeholder="https://... (TheFork, El Tenedor, etc.)"
              type="url"
              className="w-full rounded-xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-black text-[#221812]">
              <Star size={12} /> Google Reviews URL
            </label>
            <input
              value={landing.googleReviewsUrl}
              onChange={(e) => onChange("googleReviewsUrl", e.target.value)}
              placeholder="https://g.page/tu-restaurante/review"
              type="url"
              className="w-full rounded-xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]"
            />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="rounded-2xl border border-[#eadfce] bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-[#e85d04]">SEO</p>
        <h3 className="mt-1 text-lg font-black text-[#221812]">Título y descripción para buscadores</h3>
        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-black text-[#221812]">Título SEO</label>
            <input
              value={landing.seoTitle}
              onChange={(e) => onChange("seoTitle", e.target.value)}
              placeholder="Restaurante Casa Amelia · Tapas y menú del día en Marbella"
              className="w-full rounded-xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-black text-[#221812]">Descripción SEO</label>
            <textarea
              value={landing.seoDescription}
              onChange={(e) => onChange("seoDescription", e.target.value.slice(0, 160))}
              rows={2}
              placeholder="Carta digital con fotos, menú del día y reservas. Cocina casera en el corazón de Marbella."
              className="w-full resize-none rounded-xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-semibold leading-6 outline-none focus:border-[#e85d04]"
            />
            <p className="mt-1 text-right text-[11px] text-[#a08d7d]">{(landing.seoDescription || "").length}/160</p>
          </div>
        </div>
      </div>
    </div>
  );
}
