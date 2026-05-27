import { ArrowDown, ArrowUp, Eye, EyeOff, Layers3, Plus, Trash2 } from "lucide-react";
import { menuGroupOptions, type Category, type MenuGroup } from "@/lib/cartaviva-data";

export function CategoryManager({
  categories,
  onAdd,
  onUpdate,
  onDelete,
  onMove
}: {
  categories: Category[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Category>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-[1.8rem] border border-[#eadfce] bg-[#fff9f1] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-white text-[#e85d04] shadow-sm"><Layers3 size={20} /></span>
          <div>
            <p className="text-sm font-black text-[#221812]">Estructura de la carta</p>
            <p className="text-xs font-semibold text-[#8a796a]">Comida, bebidas, vinos o desayunos con visibilidad y orden.</p>
          </div>
        </div>
        <button type="button" onClick={onAdd} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e85d04] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:scale-[1.01]">
          <Plus size={16} /> Crear categoría
        </button>
      </div>

      <div className="grid gap-3">
        {categories.map((category, index) => (
          <article key={category.id} className="rounded-[1.8rem] border border-[#eadfce] bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="grid gap-3 lg:grid-cols-[44px_1.1fr_210px_132px_auto] lg:items-start">
              <div className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] bg-[#fff1df] text-sm font-black text-[#a3581c]">{String(index + 1).padStart(2, "0")}</div>
              <input value={category.name} onChange={(event) => onUpdate(category.id, { name: event.target.value })} className="rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#e85d04] focus:bg-white" />
              <div className="space-y-3">
                <select
                  value={category.group}
                  onChange={(event) => onUpdate(category.id, { group: event.target.value as MenuGroup, customGroupLabel: event.target.value === "otro" ? (category.customGroupLabel || "") : "" })}
                  className="w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#e85d04] focus:bg-white"
                >
                  {menuGroupOptions.map((group) => <option key={group.value} value={group.value}>{group.label}</option>)}
                </select>
                {category.group === "otro" ? (
                  <input
                    value={category.customGroupLabel || ""}
                    onChange={(event) => onUpdate(category.id, { customGroupLabel: event.target.value })}
                    placeholder="Ej. Brunch, Helados, Menú infantil"
                    className="w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#e85d04] focus:bg-white"
                  />
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onUpdate(category.id, { visible: !category.visible })}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black ${
                  category.visible ? "bg-[#effaf1] text-[#21663b]" : "bg-stone-200 text-stone-700"
                }`}
              >
                {category.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                {category.visible ? "Visible" : "Oculta"}
              </button>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => onMove(category.id, "up")} className="rounded-2xl bg-[#fff1df] p-3 text-[#a3581c]"><ArrowUp size={16} /></button>
                <button type="button" onClick={() => onMove(category.id, "down")} className="rounded-2xl bg-[#fff1df] p-3 text-[#a3581c]"><ArrowDown size={16} /></button>
                <button type="button" onClick={() => onDelete(category.id)} disabled={category.id === "daily"} className="rounded-2xl bg-red-50 p-3 text-red-600 disabled:opacity-30"><Trash2 size={16} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
