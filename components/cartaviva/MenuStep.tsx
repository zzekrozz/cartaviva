import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Layers3, UtensilsCrossed } from "lucide-react";
import { CategoryManager } from "@/components/cartaviva/CategoryManager";
import { ProductManager } from "@/components/cartaviva/ProductManager";
import type { Category, Product } from "@/lib/cartaviva-data";

function Fold({ title, subtitle, icon, defaultOpen = true, children }: { title: string; subtitle: string; icon: ReactNode; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#eadfce] bg-white shadow-sm">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-4 bg-[#fff9f1] px-5 py-4 text-left">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-white text-[#e85d04] shadow-sm">{icon}</span>
          <div>
            <p className="text-lg font-black text-[#221812]">{title}</p>
            <p className="text-xs font-semibold text-[#8a796a]">{subtitle}</p>
          </div>
        </div>
        {open ? <ChevronUp /> : <ChevronDown />}
      </button>
      {open ? <div className="p-4 md:p-5">{children}</div> : null}
    </section>
  );
}

export function MenuStep(props: {
  categories: Category[];
  products: Product[];
  categoryFilter: string;
  statusFilter: string;
  onCategoryFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onClearFilters: () => void;
  onAddCategory: () => void;
  onUpdateCategory: (id: string, updates: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
  onMoveCategory: (id: string, direction: "up" | "down") => void;
  onAddProduct: () => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onDuplicateProduct: (id: string) => void;
  onMoveProduct: (id: string, direction: "up" | "down" | "first" | "last") => void;
  photosEnabled: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-[1.8rem] border border-[#eadfce] bg-[#fff9f1] p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#e85d04]">Carta</p>
        <h3 className="mt-2 text-2xl font-black text-[#221812]">Categorías y productos en un solo sitio</h3>
        <p className="mt-2 text-sm font-semibold leading-7 text-[#6b594a]">Primero ordena las secciones, luego edita los platos. Todo en tarjetas claras, sin esconder la caja registradora dentro de un laberinto.</p>
      </div>
      <Fold title="Categorías" subtitle="Tapas, bebidas, cafés, postres o menú del día" icon={<Layers3 size={20} />}>
        <CategoryManager categories={props.categories} onAdd={props.onAddCategory} onUpdate={props.onUpdateCategory} onDelete={props.onDeleteCategory} onMove={props.onMoveCategory} />
      </Fold>
      <Fold title="Productos y platos" subtitle="Nombre, precio, foto, estado, alérgenos y etiqueta" icon={<UtensilsCrossed size={20} />} defaultOpen>
        <ProductManager
          products={props.products}
          categories={props.categories}
          categoryFilter={props.categoryFilter}
          statusFilter={props.statusFilter}
          onCategoryFilterChange={props.onCategoryFilterChange}
          onStatusFilterChange={props.onStatusFilterChange}
          onClearFilters={props.onClearFilters}
          onAdd={props.onAddProduct}
          onUpdate={props.onUpdateProduct}
          onDelete={props.onDeleteProduct}
          onDuplicate={props.onDuplicateProduct}
          onMove={props.onMoveProduct}
          photosEnabled={props.photosEnabled}
        />
      </Fold>
    </div>
  );
}
