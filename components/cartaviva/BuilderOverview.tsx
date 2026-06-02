"use client";

import { CheckCircle2, Circle, Image, Package, QrCode, Soup, Tag, Zap } from "lucide-react";
import type { CartaVivaState } from "@/lib/cartaviva-data";

type Props = {
  data: CartaVivaState;
  onNavigate: (step: string) => void;
};

export function BuilderOverview({ data, onNavigate }: Props) {
  const { restaurant, products, categories, dailyMenu, settings } = data;

  const productCount = products.length;
  const categoryCount = categories.filter(c => c.group !== "menu-dia").length;
  const photoCount = products.filter(p => p.imageUrl).length;
  const activeProducts = products.filter(p => p.status === "active").length;

  const planLabels: Record<string, string> = {
    free: "Gratis",
    "menu-day": "Menú Día",
    "carta-visual": "Carta Visual",
    "restaurant-pro": "Restaurante Pro",
  };

  type CheckItem = { label: string; done: boolean; step: string; hint: string };

  const checks: CheckItem[] = [
    {
      label: "Añade el nombre del restaurante",
      done: Boolean(restaurant.name && restaurant.name.trim().length > 2),
      step: "restaurant",
      hint: "Ajustes",
    },
    {
      label: "Añade WhatsApp o teléfono",
      done: Boolean(restaurant.whatsapp || restaurant.phone),
      step: "restaurant",
      hint: "Ajustes",
    },
    {
      label: "Crea al menos una categoría",
      done: categoryCount > 0,
      step: "categories",
      hint: "Categorías",
    },
    {
      label: "Añade al menos un producto",
      done: productCount > 0,
      step: "products",
      hint: "Productos",
    },
    {
      label: "Revisa el QR y publícala",
      done: Boolean(data.published),
      step: "qr",
      hint: "QR y publicación",
    },
  ];

  const doneCount = checks.filter(c => c.done).length;
  const allDone = doneCount === checks.length;

  const statCards = [
    {
      icon: <Package size={20} />,
      label: "Productos",
      value: productCount,
      sub: `${activeProducts} activos`,
      color: "bg-blue-50 text-blue-600",
      step: "products",
    },
    {
      icon: <Tag size={20} />,
      label: "Categorías",
      value: categoryCount,
      sub: "secciones de carta",
      color: "bg-violet-50 text-violet-600",
      step: "categories",
    },
    {
      icon: <Image size={20} />,
      label: "Fotos",
      value: photoCount,
      sub: "de productos",
      color: "bg-emerald-50 text-emerald-600",
      step: "products",
    },
    {
      icon: <Soup size={20} />,
      label: "Menú del día",
      value: dailyMenu.enabled ? "Activo" : "Inactivo",
      sub: dailyMenu.enabled ? dailyMenu.title || "sin título" : "desactivado",
      color: "bg-amber-50 text-amber-600",
      step: "daily-menu",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#221812] to-[#3a2010] p-6 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-white/50">Panel de tu carta</p>
            <h2 className="mt-1 text-2xl font-black">
              {restaurant.name || "Tu carta"}
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Plan:{" "}
              <span className="font-bold text-[#f0a060]">
                {planLabels[settings.plan] || settings.plan}
              </span>
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="rounded-xl bg-white/10 px-4 py-2 text-center">
              <p className="text-2xl font-black">{doneCount}/{checks.length}</p>
              <p className="text-xs text-white/60">pasos completados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => onNavigate(card.step)}
            className="group rounded-2xl border border-[#eadfce] bg-white p-4 text-left shadow-sm transition hover:border-[#e85d04] hover:shadow-md"
          >
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-2xl font-black text-[#221812]">{card.value}</p>
            <p className="text-xs font-bold text-[#6b594a]">{card.label}</p>
            <p className="mt-0.5 text-[11px] text-[#a08d7d]">{card.sub}</p>
          </button>
        ))}
      </div>

      {/* Checklist */}
      <div className="rounded-2xl border border-[#eadfce] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#e85d04]">Lista de tareas</p>
            <h3 className="mt-1 text-lg font-black text-[#221812]">
              {allDone ? "¡Carta lista para publicar! 🎉" : "Para publicar tu carta:"}
            </h3>
          </div>
          {allDone && (
            <button
              type="button"
              onClick={() => onNavigate("qr")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#e85d04] px-4 py-2 text-sm font-black text-white"
            >
              <QrCode size={14} /> Publicar ahora
            </button>
          )}
        </div>
        <div className="space-y-2">
          {checks.map((check) => (
            <button
              key={check.label}
              type="button"
              onClick={() => !check.done && onNavigate(check.step)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                check.done
                  ? "border-green-100 bg-green-50"
                  : "border-[#eadfce] bg-[#fffdf9] hover:border-[#e85d04] hover:bg-[#fff8f0]"
              }`}
            >
              {check.done ? (
                <CheckCircle2 size={18} className="flex-shrink-0 text-green-600" />
              ) : (
                <Circle size={18} className="flex-shrink-0 text-[#c4b09a]" />
              )}
              <span className={`flex-1 text-sm font-bold ${check.done ? "text-green-700 line-through decoration-green-400" : "text-[#221812]"}`}>
                {check.label}
              </span>
              {!check.done && (
                <span className="text-[11px] font-bold text-[#e85d04]">
                  → {check.hint}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => onNavigate("products")}
          className="flex flex-col items-center gap-2 rounded-2xl border border-[#eadfce] bg-white p-4 text-center shadow-sm transition hover:border-[#e85d04] hover:shadow-md"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Package size={18} />
          </span>
          <span className="text-xs font-black text-[#221812]">Añadir producto</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate("design")}
          className="flex flex-col items-center gap-2 rounded-2xl border border-[#eadfce] bg-white p-4 text-center shadow-sm transition hover:border-[#e85d04] hover:shadow-md"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Zap size={18} />
          </span>
          <span className="text-xs font-black text-[#221812]">Editar diseño</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate("daily-menu")}
          className="flex flex-col items-center gap-2 rounded-2xl border border-[#eadfce] bg-white p-4 text-center shadow-sm transition hover:border-[#e85d04] hover:shadow-md"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Soup size={18} />
          </span>
          <span className="text-xs font-black text-[#221812]">Menú del día</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate("qr")}
          className="flex flex-col items-center gap-2 rounded-2xl border border-[#eadfce] bg-white p-4 text-center shadow-sm transition hover:border-[#e85d04] hover:shadow-md"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1df] text-[#a3581c]">
            <QrCode size={18} />
          </span>
          <span className="text-xs font-black text-[#221812]">Ver QR</span>
        </button>
      </div>
    </div>
  );
}
