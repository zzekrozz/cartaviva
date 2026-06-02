"use client";

import { useState } from "react";
import {
  AlignJustify,
  Copy,
  Eye,
  EyeOff,
  Grid2X2,
  ImageIcon,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import {
  allergenOptions,
  tagOptions,
  type Category,
  type Product,
  type ProductStatus,
} from "@/lib/cartaviva-data";
import type { ImageUploadContext } from "@/lib/image-tools";
import { ImageUploadField } from "@/components/cartaviva/ImageUploadField";

function statusBadge(status: ProductStatus) {
  if (status === "active") return "bg-green-50 text-green-700";
  if (status === "soldout") return "bg-amber-50 text-amber-700";
  return "bg-stone-100 text-stone-500";
}
function statusLabel(status: ProductStatus) {
  if (status === "active") return "Activo";
  if (status === "soldout") return "Agotado";
  return "Oculto";
}

function ProductCard({
  product,
  categories,
  onSelect,
  onUpdate,
  onDuplicate,
  onDelete,
  compact,
}: {
  product: Product;
  categories: Category[];
  onSelect: () => void;
  onUpdate: (updates: Partial<Product>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  compact: boolean;
}) {
  const cat = categories.find((c) => c.id === product.categoryId);

  if (compact) {
    return (
      <article className="group relative overflow-hidden rounded-2xl border border-[#eadfce] bg-white shadow-sm transition hover:border-[#e85d04] hover:shadow-md">
        <div
          className="relative cursor-pointer overflow-hidden bg-[#fff6eb]"
          style={{ paddingBottom: "60%" }}
          onClick={onSelect}
        >
          {product.imageUrl ? (
            <img src={product.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon size={24} className="text-[#c4b09a]" />
            </div>
          )}
          {product.status !== "active" && (
            <div className="absolute inset-0 flex items-end bg-black/30 p-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${product.status === "soldout" ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-700"}`}>
                {statusLabel(product.status)}
              </span>
            </div>
          )}
        </div>
        <div className="cursor-pointer p-3" onClick={onSelect}>
          <p className="truncate text-sm font-black text-[#221812]">{product.name}</p>
          <p className="mt-0.5 text-sm font-bold text-[#e85d04]">{product.price}</p>
          {cat && <p className="mt-0.5 truncate text-[11px] text-[#a08d7d]">{cat.name}</p>}
          {product.tags[0] && (
            <span className="mt-1 inline-block rounded-full bg-[#fff1df] px-2 py-0.5 text-[10px] font-black text-[#a3581c]">{product.tags[0]}</span>
          )}
        </div>
        <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 transition group-hover:opacity-100">
          <button type="button" onClick={(e) => { e.stopPropagation(); onUpdate({ status: product.status === "hidden" ? "active" : "hidden" }); }} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm text-[#6b594a] hover:text-[#e85d04]">
            {product.status === "hidden" ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm text-[#6b594a] hover:text-[#e85d04]">
            <Copy size={13} />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(); }} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm text-red-500 hover:text-red-700">
            <Trash2 size={13} />
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex items-center gap-3 rounded-2xl border border-[#eadfce] bg-white px-4 py-3 shadow-sm transition hover:border-[#e85d04] hover:shadow-md">
      <div className="h-14 w-14 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl bg-[#fff6eb]" onClick={onSelect}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center"><ImageIcon size={16} className="text-[#c4b09a]" /></div>
        )}
      </div>
      <div className="min-w-0 flex-1 cursor-pointer" onClick={onSelect}>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-black text-[#221812]">{product.name}</p>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${statusBadge(product.status)}`}>{statusLabel(product.status)}</span>
          {product.tags[0] && <span className="rounded-full bg-[#fff1df] px-2 py-0.5 text-[10px] font-black text-[#a3581c]">{product.tags[0]}</span>}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-[#e85d04]">{product.price}</span>
          {cat && <span className="text-xs text-[#a08d7d]">{cat.name}</span>}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
        <button type="button" onClick={() => onUpdate({ status: product.status === "soldout" ? "active" : "soldout" })} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#fff1df] text-[#6b594a]" title="Agotado"><ShoppingBag size={14} /></button>
        <button type="button" onClick={() => onUpdate({ status: product.status === "hidden" ? "active" : "hidden" })} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#fff1df] text-[#6b594a]" title="Ocultar">{product.status === "hidden" ? <Eye size={14} /> : <EyeOff size={14} />}</button>
        <button type="button" onClick={onDuplicate} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#fff1df] text-[#6b594a]"><Copy size={14} /></button>
        <button type="button" onClick={onDelete} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
      </div>
    </article>
  );
}

const presetTags = tagOptions.filter((t) => t !== "Otro");

function ProductDrawer({
  product,
  categories,
  onUpdate,
  onClose,
  onDelete,
  onDuplicate,
  uploadContext,
  photosEnabled,
}: {
  product: Product;
  categories: Category[];
  onUpdate: (updates: Partial<Product>) => void;
  onClose: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  uploadContext?: Omit<ImageUploadContext, "folder">;
  photosEnabled: boolean;
}) {
  const realCats = categories.filter((c) => c.group !== "menu-dia");
  const [draft, setDraft] = useState("");
  const selectedTag = product.tags[0] || "";
  const isCustomTag = Boolean(selectedTag) && !presetTags.includes(selectedTag);

  function toggleTag(opt: string) {
    if (opt === "Otro") { onUpdate({ tags: isCustomTag ? [] : ["Etiqueta personalizada"] }); return; }
    onUpdate({ tags: selectedTag === opt ? [] : [opt] });
  }

  function toggleAllergen(val: string) {
    onUpdate({ allergens: product.allergens.includes(val) ? product.allergens.filter((a) => a !== val) : [...product.allergens, val] });
  }

  function addCustomAllergen() {
    const v = draft.trim();
    if (!v || product.allergens.includes(v)) return;
    onUpdate({ allergens: [...product.allergens, v] });
    setDraft("");
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[520px] flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eadfce] bg-white px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#a3581c]">Editar producto</p>
            <p className="mt-0.5 max-w-[280px] truncate text-base font-black text-[#221812]">{product.name || "Sin nombre"}</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4eadc] text-[#6b594a] hover:bg-[#eadfce]"><X size={16} /></button>
        </div>

        <div className="flex-1 space-y-5 p-5">
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-black text-[#221812]">Nombre</label>
              <input value={product.name} onChange={(e) => onUpdate({ name: e.target.value })} placeholder="Ej. Carrillada ibérica" className="w-full rounded-xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-black text-[#221812]">Precio</label>
                <input value={product.price} onChange={(e) => onUpdate({ price: e.target.value })} placeholder="12,90 €" className="w-full rounded-xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-black text-[#221812]">Estado</label>
                <select value={product.status} onChange={(e) => onUpdate({ status: e.target.value as ProductStatus })} className="w-full rounded-xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]">
                  <option value="active">✅ Activo</option>
                  <option value="soldout">⏸ Agotado</option>
                  <option value="hidden">🙈 Oculto</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-black text-[#221812]">Categoría</label>
              <select value={product.categoryId} onChange={(e) => onUpdate({ categoryId: e.target.value })} className="w-full rounded-xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]">
                {realCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-black text-[#221812]">Descripción</label>
              <p className="mb-1 text-[11px] text-[#a08d7d]">Opcional. Se muestra bajo el nombre en la carta.</p>
              <textarea value={product.description} onChange={(e) => onUpdate({ description: e.target.value })} rows={3} placeholder="Ingredientes, elaboración, origen..." className="w-full resize-none rounded-xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-semibold leading-6 outline-none focus:border-[#e85d04]" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black text-[#221812]">Foto del producto</label>
            <p className="mb-2 text-[11px] text-[#a08d7d]">Se comprime automáticamente antes de subir.</p>
            <ImageUploadField label="Foto del producto" value={product.imageUrl} onChange={(value) => onUpdate({ imageUrl: value })} uploadContext={uploadContext ? { ...uploadContext, folder: `products/${product.id}` } : undefined} maxWidth={1400} disabled={!photosEnabled} disabledMessage="Las fotos de productos están disponibles desde Menú Día." />
          </div>

          <div className="rounded-xl border border-[#eadfce] bg-[#fffdf9] p-4">
            <p className="mb-1 text-xs font-black text-[#221812]">Etiqueta principal</p>
            <p className="mb-3 text-[11px] text-[#a08d7d]">Aparece como badge en la carta. Solo una a la vez.</p>
            <div className="flex flex-wrap gap-2">
              {[...presetTags, "Otro"].map((opt) => {
                const active = opt === "Otro" ? isCustomTag : selectedTag === opt;
                return <button key={opt} type="button" onClick={() => toggleTag(opt)} className={`rounded-full px-3 py-1.5 text-xs font-black transition ${active ? "bg-[#221812] text-white" : "bg-[#f1e7d8] text-[#6b594a] hover:bg-[#fff1df]"}`}>{opt}</button>;
              })}
            </div>
            {isCustomTag && <input value={selectedTag} onChange={(e) => onUpdate({ tags: e.target.value ? [e.target.value] : [] })} placeholder="Escribe tu etiqueta" className="mt-3 w-full rounded-xl border border-[#eadfce] bg-white px-4 py-2 text-sm font-bold outline-none focus:border-[#e85d04]" />}
          </div>

          <div className="rounded-xl border border-[#eadfce] bg-[#fffdf9] p-4">
            <p className="mb-1 text-xs font-black text-[#221812]">Alérgenos</p>
            <p className="mb-3 text-[11px] text-[#a08d7d]">Ayudan a tus clientes a decidir con seguridad.</p>
            <div className="flex flex-wrap gap-2">
              {allergenOptions.map((opt) => (
                <button key={opt} type="button" onClick={() => toggleAllergen(opt)} className={`rounded-full px-3 py-1.5 text-xs font-black transition ${product.allergens.includes(opt) ? "bg-[#221812] text-white" : "bg-[#f1e7d8] text-[#6b594a] hover:bg-[#fff1df]"}`}>{opt}</button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustomAllergen()} placeholder="Mostaza, sésamo..." className="min-w-0 flex-1 rounded-xl border border-[#eadfce] bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[#e85d04]" />
              <button type="button" onClick={addCustomAllergen} className="rounded-xl bg-[#fff1df] px-3 py-2 text-xs font-black text-[#a3581c]">+ Añadir</button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-[#eadfce] bg-white px-5 py-4">
          <div className="flex gap-2">
            <button type="button" onClick={onDuplicate} className="flex items-center gap-1.5 rounded-xl bg-[#fff1df] px-4 py-2.5 text-xs font-black text-[#a3581c]"><Copy size={13} /> Duplicar</button>
            <button type="button" onClick={() => { onDelete(); onClose(); }} className="flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-black text-red-600"><Trash2 size={13} /> Borrar</button>
          </div>
          <button type="button" onClick={onClose} className="flex items-center gap-1.5 rounded-xl bg-[#221812] px-5 py-2.5 text-xs font-black text-white">Listo</button>
        </div>
      </div>
    </>
  );
}

export function ProductManager({
  products,
  allProducts,
  categories,
  categoryFilter,
  statusFilter,
  onCategoryFilterChange,
  onStatusFilterChange,
  onClearFilters,
  onAdd,
  onUpdate,
  onDelete,
  onDuplicate,
  onMove,
  uploadContext,
  photosEnabled = true,
}: {
  products: Product[];
  allProducts: Product[];
  categories: Category[];
  categoryFilter: string;
  statusFilter: string;
  onCategoryFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onClearFilters: () => void;
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Product>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (id: string, direction: "up" | "down" | "first" | "last") => void;
  uploadContext?: Omit<ImageUploadContext, "folder">;
  photosEnabled?: boolean;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"compact" | "list">("compact");
  const [search, setSearch] = useState("");

  const realCats = categories.filter((c) => c.group !== "menu-dia");
  const selectedProduct = products.find((p) => p.id === selectedId) ?? null;

  const filtered = products.filter((p) => {
    if (!search) return true;
    return p.name.toLowerCase().includes(search.toLowerCase()) || (p.description || "").toLowerCase().includes(search.toLowerCase());
  });

  const totalCount = allProducts.length;
  const hasFilters = categoryFilter !== "all" || statusFilter !== "all" || search.length > 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#eadfce] bg-[#fff9f1] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black text-[#221812]">
            {hasFilters ? `Mostrando ${filtered.length} de ${totalCount}` : `${totalCount} producto${totalCount !== 1 ? "s" : ""}`}
          </p>
          <p className="text-xs text-[#8a796a]">Pulsa un producto para editarlo en detalle</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-[#eadfce] bg-white p-0.5">
            <button type="button" onClick={() => setViewMode("compact")} className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${viewMode === "compact" ? "bg-[#221812] text-white" : "text-[#6b594a]"}`} title="Grid"><Grid2X2 size={14} /></button>
            <button type="button" onClick={() => setViewMode("list")} className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${viewMode === "list" ? "bg-[#221812] text-white" : "text-[#6b594a]"}`} title="Lista"><AlignJustify size={14} /></button>
          </div>
          <button type="button" onClick={onAdd} className="flex items-center gap-2 rounded-xl bg-[#e85d04] px-4 py-2 text-sm font-black text-white transition hover:bg-[#c94e03]">
            <Plus size={15} /> Añadir producto
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[160px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a08d7d]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar producto..." className="w-full rounded-xl border border-[#eadfce] bg-white py-2.5 pl-9 pr-4 text-sm font-bold outline-none focus:border-[#e85d04]" />
          {search && <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a08d7d]"><X size={13} /></button>}
        </div>
        <select value={categoryFilter} onChange={(e) => onCategoryFilterChange(e.target.value)} className="rounded-xl border border-[#eadfce] bg-white px-3 py-2.5 text-sm font-bold outline-none focus:border-[#e85d04]">
          <option value="all">Todas las categorías</option>
          {realCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)} className="rounded-xl border border-[#eadfce] bg-white px-3 py-2.5 text-sm font-bold outline-none focus:border-[#e85d04]">
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="soldout">Agotados</option>
          <option value="hidden">Ocultos</option>
        </select>
        {hasFilters && <button type="button" onClick={() => { onClearFilters(); setSearch(""); }} className="rounded-xl border border-[#eadfce] bg-white px-3 py-2.5 text-xs font-bold text-[#6b594a] hover:bg-[#fff1df]">Limpiar filtros</button>}
      </div>

      {/* Empty state */}
      {totalCount === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e8d8c2] bg-[#fffdf9] py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1df]"><Package size={28} className="text-[#e85d04]" /></div>
          <h3 className="mt-4 text-xl font-black text-[#221812]">Aún no tienes productos</h3>
          <p className="mt-2 max-w-xs text-sm text-[#6b594a]">Empieza añadiendo tus platos, bebidas o productos principales.</p>
          <button type="button" onClick={onAdd} className="mt-6 flex items-center gap-2 rounded-xl bg-[#e85d04] px-6 py-3 text-sm font-black text-white"><Plus size={15} /> Añadir primer producto</button>
        </div>
      )}

      {/* No filter results */}
      {totalCount > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#eadfce] bg-white py-12 text-center">
          <Search size={24} className="text-[#c4b09a]" />
          <p className="mt-3 font-black text-[#221812]">Sin resultados</p>
          <button type="button" onClick={() => { onClearFilters(); setSearch(""); }} className="mt-4 rounded-xl bg-[#fff1df] px-4 py-2 text-sm font-black text-[#a3581c]">Limpiar filtros</button>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && viewMode === "compact" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} categories={categories} onSelect={() => setSelectedId(product.id)} onUpdate={(u) => onUpdate(product.id, u)} onDuplicate={() => onDuplicate(product.id)} onDelete={() => onDelete(product.id)} compact />
          ))}
          <button type="button" onClick={onAdd} className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#e8d8c2] bg-[#fffdf9] p-4 text-center transition hover:border-[#e85d04] hover:bg-[#fff8f0]" style={{ minHeight: 160 }}>
            <Plus size={20} className="text-[#c4b09a]" />
            <span className="text-xs font-black text-[#a08d7d]">Añadir</span>
          </button>
        </div>
      )}

      {/* List */}
      {filtered.length > 0 && viewMode === "list" && (
        <div className="space-y-2">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} categories={categories} onSelect={() => setSelectedId(product.id)} onUpdate={(u) => onUpdate(product.id, u)} onDuplicate={() => onDuplicate(product.id)} onDelete={() => onDelete(product.id)} compact={false} />
          ))}
        </div>
      )}

      {/* Drawer */}
      {selectedProduct && (
        <ProductDrawer
          product={selectedProduct}
          categories={categories}
          onUpdate={(u) => onUpdate(selectedProduct.id, u)}
          onClose={() => setSelectedId(null)}
          onDelete={() => { onDelete(selectedProduct.id); setSelectedId(null); }}
          onDuplicate={() => { onDuplicate(selectedProduct.id); setSelectedId(null); }}
          uploadContext={uploadContext}
          photosEnabled={photosEnabled}
        />
      )}
    </div>
  );
}
