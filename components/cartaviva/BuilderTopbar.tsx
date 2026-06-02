"use client";

import Link from "next/link";
import { ArrowLeft, Check, Cloud, CloudOff, Copy, Eye, EyeOff, ExternalLink, Loader2, QrCode, Save, UploadCloud } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import type { CartaVivaState } from "@/lib/cartaviva-data";

type SaveStatus = "saved" | "saving" | "unsaved" | "error" | "demo";

function StatusBadge({ status }: { status: SaveStatus }) {
  const configs: Record<SaveStatus, { icon: React.ReactNode; label: string; cls: string }> = {
    saved: { icon: <Check size={13} />, label: "Guardado", cls: "bg-green-50 text-green-700 border border-green-200" },
    saving: { icon: <Loader2 size={13} className="animate-spin" />, label: "Guardando...", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
    unsaved: { icon: <Cloud size={13} />, label: "Sin guardar", cls: "bg-[#fff4e8] text-[#a3581c] border border-[#f0d7b9]" },
    error: { icon: <CloudOff size={13} />, label: "Error al guardar", cls: "bg-red-50 text-red-600 border border-red-200" },
    demo: { icon: <Cloud size={13} />, label: "Modo demo", cls: "bg-purple-50 text-purple-700 border border-purple-200" },
  };
  const { icon, label, cls } = configs[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${cls}`}>
      {icon}{label}
    </span>
  );
}

function normalizeStatus(msg: string): SaveStatus {
  if (msg.toLowerCase().includes("guardando") || msg.toLowerCase().includes("publicando")) return "saving";
  if (msg.toLowerCase().includes("error")) return "error";
  if (msg.toLowerCase().includes("demo")) return "demo";
  if (msg.toLowerCase().includes("sin guardar") || msg.toLowerCase().includes("cambios")) return "unsaved";
  return "saved";
}

type Props = {
  data: CartaVivaState;
  statusMessage: string;
  saving: boolean;
  publicPath: string;
  previewVisible: boolean;
  onTogglePreview: () => void;
  onSave: () => void;
  onPublish: () => void;
  onCopyLink: () => void;
  onGoToQR: () => void;
  restaurantName?: string;
};

export function BuilderTopbar({
  data,
  statusMessage,
  saving,
  publicPath,
  previewVisible,
  onTogglePreview,
  onSave,
  onPublish,
  onCopyLink,
  onGoToQR,
  restaurantName,
}: Props) {
  const planLabels: Record<string, string> = {
    free: "Gratis",
    "menu-day": "Menú Día",
    "carta-visual": "Carta Visual",
    "restaurant-pro": "Pro",
  };
  const planCls: Record<string, string> = {
    free: "bg-stone-100 text-stone-600",
    "menu-day": "bg-blue-50 text-blue-700",
    "carta-visual": "bg-violet-50 text-violet-700",
    "restaurant-pro": "bg-amber-50 text-amber-700",
  };
  const plan = data.settings.plan;
  const displayName = restaurantName || data.restaurant.name || "Mi carta";

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfce] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 lg:px-6">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#f4eadc] text-[#6b594a] transition hover:bg-[#e85d04] hover:text-white"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="hidden min-w-0 sm:block">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#a3581c]">{BRAND_NAME}</span>
              <span className="text-[#d9cbb8]">/</span>
              <span className="max-w-[160px] truncate text-sm font-bold text-[#221812]">{displayName}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <StatusBadge status={normalizeStatus(statusMessage)} />
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${planCls[plan] || planCls.free}`}>
                {planLabels[plan] || plan}
              </span>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex flex-shrink-0 items-center gap-2">
          {/* Preview toggle */}
          <button
            type="button"
            onClick={onTogglePreview}
            title={previewVisible ? "Ocultar preview" : "Mostrar preview"}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
              previewVisible
                ? "bg-[#221812] text-white"
                : "bg-[#f4eadc] text-[#6b594a] hover:bg-[#221812] hover:text-white"
            }`}
          >
            {previewVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

          {/* Secondary actions - hidden on very small */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={onCopyLink}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-[#f4eadc] px-3 text-xs font-bold text-[#6b594a] transition hover:bg-[#fff1df]"
            >
              <Copy size={14} /> Copiar enlace
            </button>
            <button
              type="button"
              onClick={onGoToQR}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4eadc] text-[#6b594a] transition hover:bg-[#fff1df]"
              title="Ver QR"
            >
              <QrCode size={16} />
            </button>
            <Link
              href={publicPath}
              target="_blank"
              className="flex h-9 items-center gap-1.5 rounded-xl bg-[#f4eadc] px-3 text-xs font-bold text-[#6b594a] transition hover:bg-[#fff1df]"
            >
              <ExternalLink size={14} /> Ver carta
            </Link>
          </div>

          {/* Primary actions */}
          <button
            type="button"
            disabled={saving}
            onClick={onSave}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-[#221812] px-3 text-xs font-bold text-white transition hover:bg-[#3a2a20] disabled:opacity-50"
          >
            <Save size={14} />
            <span className="hidden sm:inline">Guardar</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={onPublish}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-[#e85d04] px-3 text-xs font-bold text-white transition hover:bg-[#c94e03] disabled:opacity-50"
          >
            <UploadCloud size={14} />
            <span className="hidden sm:inline">Publicar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
