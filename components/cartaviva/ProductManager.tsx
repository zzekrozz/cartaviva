import { ArrowDown, ArrowUp, Copy, Plus, Trash2 } from "lucide-react";
import { allergenOptions, tagOptions, type Category, type Product, type ProductStatus } from "@/lib/cartaviva-data";

function ChipGroup({
  title,
  selected,
  options,
  onToggle
}: {
  title: string;
  selected: string[];
  options: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-[#221812]">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`rounded-full px-3 py-2 text-xs font-bold ${
              selected.includes(option) ? "bg-[#221812] text-white" : "bg-[#f1e7d8] text-[#6b594a]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
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
  onMove
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
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-[1.7rem] border border-[#eadfce] bg-[#fff9f1] p-4 md:flex-row md:items-center md:justify-between">
        <div className="grid gap-3 md:grid-cols-2">
          <select value={categoryFilter} onChange={(event) => onCategoryFilterChange(event.target.value)} className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm">
            <option value="all">Todas las categorias</option>
            {categories.filter((category) => category.id !== "daily").map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)} className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm">
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="soldout">Agotados</option>
            <option value="hidden">Ocultos</option>
          </select>
        </div>
        <button type="button" onClick={onAdd} className="inline-flex items-center gap-2 rounded-full bg-[#e85d04] px-5 py-3 text-sm font-bold text-white">
          <Plus size={16} />
          Crear producto
        </button>
      </div>

      {products.map((product) => (
        <article key={product.id} className="rounded-[1.8rem] border border-[#eadfce] bg-white p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[140px_1fr]">
            <div className="rounded-[1.4rem] bg-[#fff6eb] p-2">
              {product.imageUrl ? <img src={product.imageUrl} alt="" className="h-32 w-full rounded-[1rem] object-cover" /> : <div className="flex h-32 items-center justify-center rounded-[1rem] border border-dashed border-[#e8d8c2] text-xs font-bold uppercase tracking-[0.2em] text-[#a08d7d]">Sin foto</div>}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <input value={product.name} onChange={(event) => onUpdate(product.id, { name: event.target.value })} className="rounded-2xl border border-[#eadfce] px-4 py-3 text-sm" placeholder="Nombre" />
              <input value={product.price} onChange={(event) => onUpdate(product.id, { price: event.target.value })} className="rounded-2xl border border-[#eadfce] px-4 py-3 text-sm" placeholder="Precio" />
              <select value={product.categoryId} onChange={(event) => onUpdate(product.id, { categoryId: event.target.value })} className="rounded-2xl border border-[#eadfce] px-4 py-3 text-sm">
                {categories.filter((category) => category.id !== "daily").map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
              <select value={product.status} onChange={(event) => onUpdate(product.id, { status: event.target.value as ProductStatus })} className="rounded-2xl border border-[#eadfce] px-4 py-3 text-sm">
                <option value="active">Activo</option>
                <option value="soldout">Agotado</option>
                <option value="hidden">Oculto</option>
              </select>
              <input value={product.imageUrl} onChange={(event) => onUpdate(product.id, { imageUrl: event.target.value })} className="rounded-2xl border border-[#eadfce] px-4 py-3 text-sm md:col-span-2" placeholder="Foto URL" />
              <textarea value={product.description} onChange={(event) => onUpdate(product.id, { description: event.target.value })} className="min-h-24 rounded-2xl border border-[#eadfce] px-4 py-3 text-sm md:col-span-2" placeholder="Descripcion" />
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <ChipGroup title="Etiquetas base" selected={product.tags} options={tagOptions} onToggle={(value) => onUpdate(product.id, { tags: product.tags.includes(value) ? product.tags.filter((item) => item !== value) : [...product.tags, value] })} />
            <ChipGroup title="Alergenos" selected={product.allergens} options={allergenOptions} onToggle={(value) => onUpdate(product.id, { allergens: product.allergens.includes(value) ? product.allergens.filter((item) => item !== value) : [...product.allergens, value] })} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => onDuplicate(product.id)} className="inline-flex items-center gap-2 rounded-full bg-[#fff1df] px-4 py-2 text-sm font-bold text-[#a3581c]"><Copy size={15} /> Duplicar</button>
            <button type="button" onClick={() => onMove(product.id, "up")} className="rounded-full bg-[#f1e7d8] px-4 py-2 text-sm font-bold text-[#6b594a]"><ArrowUp size={15} className="inline" /> Subir</button>
            <button type="button" onClick={() => onMove(product.id, "down")} className="rounded-full bg-[#f1e7d8] px-4 py-2 text-sm font-bold text-[#6b594a]"><ArrowDown size={15} className="inline" /> Bajar</button>
            <button type="button" onClick={() => onMove(product.id, "first")} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#6b594a]">Al principio</button>
            <button type="button" onClick={() => onMove(product.id, "last")} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#6b594a]">Al final</button>
            <button type="button" onClick={() => onDelete(product.id)} className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600"><Trash2 size={15} /> Borrar</button>
          </div>
        </article>
      ))}
    </div>
  );
}
