"use client";

import { Copy, CalendarDays, Lock } from "lucide-react";
import type { CartaVivaState, WeeklyMenu } from "@/lib/cartaviva-data";
import { uid } from "@/lib/cartaviva-data";
import { getPlanConfig } from "@/lib/plan-config";

const dayLabels: Record<number, string> = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

const displayOrder = [1, 2, 3, 4, 5, 6, 0];

type Props = {
  data: CartaVivaState;
  onChange: (weeklyMenus: WeeklyMenu[]) => void;
  onUseToday?: (menu: WeeklyMenu) => void;
};

function blankMenu(day: number): WeeklyMenu {
  return { id: uid("weekly"), weekday: day, enabled: true, title: `Menú del ${dayLabels[day].toLowerCase()}`, price: "", schedule: "13:00 - 16:00", starters: "", mains: "", desserts: "", drinkIncluded: true, note: "" };
}

export function WeeklyMenuEditor({ data, onChange, onUseToday }: Props) {
  const plan = getPlanConfig(data.settings.plan);
  const isPro = plan.id === "restaurant-pro";
  const menus = displayOrder.map((weekday) => data.weeklyMenus.find((menu) => menu.weekday === weekday) || blankMenu(weekday));

  function update(weekday: number, patch: Partial<WeeklyMenu>) {
    const existing = data.weeklyMenus.find((menu) => menu.weekday === weekday) || blankMenu(weekday);
    const next = [...data.weeklyMenus.filter((menu) => menu.weekday !== weekday), { ...existing, ...patch }].sort((a, b) => displayOrder.indexOf(a.weekday) - displayOrder.indexOf(b.weekday));
    onChange(next);
  }

  function duplicateFromPrevious(index: number) {
    const previous = menus[(index + menus.length - 1) % menus.length];
    const weekday = menus[index].weekday;
    update(weekday, { ...previous, id: menus[index].id, weekday, title: `Menú del ${dayLabels[weekday].toLowerCase()}` });
  }

  return (
    <div className="space-y-5">
      <div className={`rounded-[1.8rem] border p-5 ${isPro ? "border-[#eadfce] bg-[#fffaf3]" : "border-orange-200 bg-[#fff4e8]"}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-[#e85d04]"><CalendarDays size={16} /> Menú semanal programado</p>
            <h3 className="mt-2 text-2xl font-black text-[#221812]">Prepara toda la semana una vez</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#6b594a]">El plan Pro muestra automáticamente el menú que corresponde al día. Si no hay menú programado, se usa el menú manual.</p>
          </div>
          {!isPro ? <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#a3581c]"><Lock size={16} /> Incluido en Pro 49 €/mes</span> : null}
        </div>
      </div>

      <div className={`grid gap-4 ${!isPro ? "pointer-events-none opacity-55" : ""}`}>
        {menus.map((menu, index) => (
          <article key={menu.weekday} className="rounded-[1.8rem] border border-[#eadfce] bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#a08d7d]">{dayLabels[menu.weekday]}</p>
                <input value={menu.title} onChange={(event) => update(menu.weekday, { title: event.target.value })} className="mt-1 w-full bg-transparent text-xl font-black text-[#221812] outline-none" />
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => duplicateFromPrevious(index)} className="inline-flex items-center gap-2 rounded-full bg-[#fff4e8] px-3 py-2 text-xs font-black text-[#a3581c]"><Copy size={14} /> Duplicar anterior</button>
                <button type="button" onClick={() => onUseToday?.(menu)} className="rounded-full bg-[#221812] px-3 py-2 text-xs font-black text-white">Usar este menú hoy</button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <input value={menu.price} onChange={(event) => update(menu.weekday, { price: event.target.value })} placeholder="Precio" className="rounded-2xl border border-[#eadfce] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]" />
              <input value={menu.schedule} onChange={(event) => update(menu.weekday, { schedule: event.target.value })} placeholder="Horario" className="rounded-2xl border border-[#eadfce] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]" />
              <label className="flex items-center gap-2 rounded-2xl border border-[#eadfce] px-4 py-3 text-sm font-black text-[#6b594a]"><input type="checkbox" checked={menu.enabled} onChange={(event) => update(menu.weekday, { enabled: event.target.checked })} /> Visible</label>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <textarea value={menu.starters} onChange={(event) => update(menu.weekday, { starters: event.target.value })} placeholder="Primeros, uno por línea" className="min-h-28 rounded-2xl border border-[#eadfce] px-4 py-3 text-sm outline-none focus:border-[#e85d04]" />
              <textarea value={menu.mains} onChange={(event) => update(menu.weekday, { mains: event.target.value })} placeholder="Segundos, uno por línea" className="min-h-28 rounded-2xl border border-[#eadfce] px-4 py-3 text-sm outline-none focus:border-[#e85d04]" />
              <textarea value={menu.desserts} onChange={(event) => update(menu.weekday, { desserts: event.target.value })} placeholder="Postres, uno por línea" className="min-h-28 rounded-2xl border border-[#eadfce] px-4 py-3 text-sm outline-none focus:border-[#e85d04]" />
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-[220px_1fr]">
              <label className="flex items-center gap-2 rounded-2xl border border-[#eadfce] px-4 py-3 text-sm font-black text-[#6b594a]"><input type="checkbox" checked={menu.drinkIncluded} onChange={(event) => update(menu.weekday, { drinkIncluded: event.target.checked })} /> Bebida incluida</label>
              <input value={menu.note} onChange={(event) => update(menu.weekday, { note: event.target.value })} placeholder="Nota del día" className="rounded-2xl border border-[#eadfce] px-4 py-3 text-sm font-bold outline-none focus:border-[#e85d04]" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
