import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
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
      <div className="flex justify-end">
        <button type="button" onClick={onAdd} className="inline-flex items-center gap-2 rounded-full bg-[#e85d04] px-5 py-3 text-sm font-bold text-white">
          <Plus size={16} />
          Crear categoria
        </button>
      </div>
      {categories.map((category) => (
        <div key={category.id} className="grid gap-3 rounded-[1.7rem] border border-[#eadfce] bg-white p-4 md:grid-cols-[1.2fr_200px_130px_auto]">
          <input
            value={category.name}
            onChange={(event) => onUpdate(category.id, { name: event.target.value })}
            className="rounded-2xl border border-[#eadfce] px-4 py-3 text-sm"
          />
          <select
            value={category.group}
            onChange={(event) => onUpdate(category.id, { group: event.target.value as MenuGroup })}
            className="rounded-2xl border border-[#eadfce] px-4 py-3 text-sm"
          >
            {menuGroupOptions.map((group) => <option key={group.value} value={group.value}>{group.label}</option>)}
          </select>
          <button
            type="button"
            onClick={() => onUpdate(category.id, { visible: !category.visible })}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold ${
              category.visible ? "bg-[#effaf1] text-[#21663b]" : "bg-stone-200 text-stone-700"
            }`}
          >
            {category.visible ? <Eye size={16} /> : <EyeOff size={16} />}
            {category.visible ? "Visible" : "Oculta"}
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => onMove(category.id, "up")} className="rounded-2xl bg-[#fff1df] p-3 text-[#a3581c]"><ArrowUp size={16} /></button>
            <button type="button" onClick={() => onMove(category.id, "down")} className="rounded-2xl bg-[#fff1df] p-3 text-[#a3581c]"><ArrowDown size={16} /></button>
            <button type="button" onClick={() => onDelete(category.id)} disabled={category.id === "daily"} className="rounded-2xl bg-red-50 p-3 text-red-600 disabled:opacity-30"><Trash2 size={16} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
