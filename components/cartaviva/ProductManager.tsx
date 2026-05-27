import { useState } from "react";
import { ArrowDown, ArrowUp, Copy, ImageIcon, Plus, Trash2 } from "lucide-react";
import { allergenOptions, tagOptions, type Category, type Product, type ProductStatus } from "@/lib/cartaviva-data";
import type { ImageUploadContext } from "@/lib/image-tools";
import { ImageUploadField } from "@/components/cartaviva/ImageUploadField";

const presetTagOptions = tagOptions.filter((option) => option !== "Otro");

function TagGroup({
  product,
  onUpdate
}: {
  product: Product;
  onUpdate: (updates: Partial<Product>) => void;
}) {
  const selectedTag = product.tags[0] || "";
  const isCustom = Boolean(selectedTag) && !presetTagOptions.includes(selectedTag);
  const customValue = isCustom ? selectedTag : "";

  function toggleTag(option: string) {
    if (option === "Otro") {
      onUpdate({ tags: isCustom ? [] : [customValue] });
      return;
    }
    onUpdate({ tags: selectedTag === option ? [] : [option] });
  }

  return (
    <div className="rounded-[1.45rem] border border-[#eadfce] bg-[#fffdf9] p-4">
      <p className="mb-3 text-sm font-black text-[#221812]">Etiqueta principal</p>
      <div className="flex flex-wrap gap-2">
        {[...presetTagOptions, "Otro"].map((option) => {
          const active = option === "Otro" ? isCustom : selectedTag === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleTag(option)}
              className={`rounded-full px-3 py-2 text-xs font-black transition ${active ? "bg-[#221812] text-white" : "bg-[#f1e7d8] text-[#6b594a] hover:bg-[#fff1df]"}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {isCustom ? (
        <input
          value={customValue}
          onChange={(event) => onUpdate({ tags: event.target.value ? [event.target.value] : [] })}
          placeholder="Escribe tu etiqueta personalizada"
          className="mt-3 w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]"
        />
      ) : null}
    </div>
  );
}

function AllergenGroup({
  product,
  onUpdate
}: {
  product: Product;
  onUpdate: (updates: Partial<Product>) => void;
}) {
  const [draft, setDraft] = useState("");

  function toggleAllergen(value: string) {
    onUpdate({
      allergens: product.allergens.includes(value)
        ? product.allergens.filter((item) => item !== value)
        : [...product.allergens, value]
    });
  }

  function addCustomAllergen() {
    const value = draft.trim();
    if (!value || product.allergens.includes(value)) return;
    onUpdate({ allergens: [...product.allergens, value] });
    setDraft("");
  }

  return (
    <div className="rounded-[1.45rem] border border-[#eadfce] bg-[#fffdf9] p-4">
      <p className="mb-3 text-sm font-black text-[#221812]">Alérgenos</p>
      <div className="flex flex-wrap gap-2">
        {allergenOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggleAllergen(option)}
            className={`rounded-full px-3 py-2 text-xs font-black transition ${product.allergens.includes(option) ? "bg-[#221812] text-white" : "bg-[#f1e7d8] text-[#6b594a] hover:bg-[#fff1df]"}`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Mostaza, sésamo, moluscos..."
          className="min-w-0 flex-1 rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]"
        />
        <button type="button" onClick={addCustomAllergen} className="rounded-full bg-[#fff1df] px-4 py-3 text-sm font-black text-[#a3581c]">
          + Añadir alérgeno
        </button>
      </div>
    </div>
  );
}

function statusClass(status: ProductStatus) {
  if (status === "active") return "bg-[#effaf1] text-[#21663b]";
  if (status === "soldout") return "bg-[#fff1df] text-[#a3581c]";
  return "bg-stone-200 text-stone-700";
}

export function ProductManager({
  products,
  categories,
  categoryFilter,
  statusFilter,
  onCategoryFilterChange,
  onStatusFilterChange,
  onAdd,
  onUpdate,
  onDelete,
  onDuplicate,
  onMove,
  uploadContext,
  photosEnabled = true
}: {
  products: Product[];
  categories: Category[];
  categoryFilter: string;
  statusFilter: string;
  onCategoryFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Product>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (id: string, direction: "up" | "down" | "first" | "last") => void;
  uploadContext?: Omit<ImageUploadContext, "folder">;
  photosEnabled?: boolean;
}) {
  const realCategories = categories.filter((category) => category.id !== "daily");
  const photoMessage = "Las fotos de productos están disponibles desde Menú Día. Puedes probar un plan de pago por 1 € el primer mes.";

  return (
    <div className="space-y-4">
      <div className="rounded-[1.8rem] border border-[#eadfce] bg-[#fff9f1] p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-black text-[#221812]">Gestor de productos</p>
            <p className="mt-1 text-xs font-semibold text-[#8a796a]">Cafés, bebidas, tapas o platos. Todo cuenta como producto de carta.</p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <select value={categoryFilter} onChange={(event) => onCategoryFilterChange(event.target.value)} className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]">
              <option value="all">Todas las categorías</option>
              {realCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)} className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]">
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="soldout">Agotados</option>
              <option value="hidden">Ocultos</option>
            </select>
            <button type="button" onClick={onAdd} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e85d04] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:scale-[1.01]">
              <Plus size={16} /> Crear producto
            </button>
          </div>
        </div>
      </div>

      {products.map((product) => (
        <article key={product.id} className="overflow-hidden rounded-[2rem] border border-[#eadfce] bg-white shadow-sm transition hover:shadow-md">
          <div className="grid gap-0 lg:grid-cols-[180px_1fr]">
            <div className="bg-[#fff6eb] p-3">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt="" className="h-44 w-full rounded-[1.35rem] object-cover lg:h-full" />
              ) : (
                <div className="flex h-44 flex-col items-center justify-center rounded-[1.35rem] border border-dashed border-[#e8d8c2] text-center text-xs font-black uppercase tracking-[0.2em] text-[#a08d7d] lg:h-full">
                  <ImageIcon size={24} className="mb-2" /> Sin foto
                </div>
              )}
            </div>

            <div className="p-4 md:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${statusClass(product.status)}`}>
                  {product.status === "active" ? "Activo" : product.status === "soldout" ? "Agotado" : "Oculto"}
                </span>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => onMove(product.id, "first")} className="rounded-full bg-[#fff1df] px-3 py-2 text-xs font-black text-[#a3581c]">Arriba</button>
                  <button type="button" onClick={() => onMove(product.id, "up")} className="rounded-full bg-[#f1e7d8] px-3 py-2 text-xs font-black text-[#6b594a]"><ArrowUp size={14} className="inline" /> Subir</button>
                  <button type="button" onClick={() => onMove(product.id, "down")} className="rounded-full bg-[#f1e7d8] px-3 py-2 text-xs font-black text-[#6b594a]"><ArrowDown size={14} className="inline" /> Bajar</button>
                  <button type="button" onClick={() => onMove(product.id, "last")} className="rounded-full bg-[#fff1df] px-3 py-2 text-xs font-black text-[#a3581c]">Abajo</button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <input value={product.name} onChange={(event) => onUpdate(product.id, { name: event.target.value })} className="rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]" placeholder="Nombre" />
                <input value={product.price} onChange={(event) => onUpdate(product.id, { price: event.target.value })} className="rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]" placeholder="Precio" />
                <select value={product.categoryId} onChange={(event) => onUpdate(product.id, { categoryId: event.target.value })} className="rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]">
                  {realCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
                <select value={product.status} onChange={(event) => onUpdate(product.id, { status: event.target.value as ProductStatus })} className="rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]">
                  <option value="active">Activo</option>
                  <option value="soldout">Agotado</option>
                  <option value="hidden">Oculto</option>
                </select>
                <div className="md:col-span-2">
                  <ImageUploadField
                    label="Foto del producto"
                    hint="Se comprime antes de subir para ahorrar almacenamiento y cargar más rápido."
                    value={product.imageUrl}
                    onChange={(value) => onUpdate(product.id, { imageUrl: value })}
                    uploadContext={uploadContext ? { ...uploadContext, folder: `products/${product.id}` } : undefined}
                    maxWidth={1400}
                    disabled={!photosEnabled}
                    disabledMessage={photoMessage}
                  />
                </div>
                <textarea value={product.description} onChange={(event) => onUpdate(product.id, { description: event.target.value })} className="min-h-24 rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-semibold leading-6 outline-none focus:border-[#e85d04] md:col-span-2" placeholder="Descripción" />
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <TagGroup product={product} onUpdate={(updates) => onUpdate(product.id, updates)} />
                <AllergenGroup product={product} onUpdate={(updates) => onUpdate(product.id, updates)} />
              </div>

              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <button type="button" onClick={() => onDuplicate(product.id)} className="inline-flex items-center gap-2 rounded-full bg-[#fff1df] px-4 py-2 text-sm font-black text-[#a3581c]"><Copy size={15} /> Duplicar</button>
                <button type="button" onClick={() => onDelete(product.id)} className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-600"><Trash2 size={15} /> Borrar</button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
