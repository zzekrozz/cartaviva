"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, ExternalLink, MonitorSmartphone, RefreshCw, Smartphone } from "lucide-react";
import { DesktopMenuPreview } from "@/components/cartaviva/DesktopMenuPreview";
import { MobileMenuPreview } from "@/components/cartaviva/MobileMenuPreview";
import { buildPublicPath, defaultCartaVivaState, normalizeState, STORAGE_KEY, type CartaVivaState } from "@/lib/cartaviva-data";
import { RealQrCode } from "@/components/cartaviva/RealQrCode";

function loadLocalState(): CartaVivaState {
  if (typeof window === "undefined") return defaultCartaVivaState;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return defaultCartaVivaState;
  try {
    return normalizeState(JSON.parse(stored) as CartaVivaState);
  } catch {
    return defaultCartaVivaState;
  }
}

export default function BuilderPreviewPage() {
  const [data, setData] = useState<CartaVivaState>(defaultCartaVivaState);
  const [lastSync, setLastSync] = useState("");
  const [origin, setOrigin] = useState("https://preview.local");

  function refresh() {
    setData(loadLocalState());
    setLastSync(new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
  }

  useEffect(() => {
    setOrigin(window.location.origin);
    refresh();

    function handleStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) refresh();
    }

    const interval = window.setInterval(refresh, 1200);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const publicPath = buildPublicPath(data.restaurant.slug);
  const publicUrl = `${origin}${publicPath}`;

  function copyLink() {
    navigator.clipboard?.writeText(publicUrl);
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] text-[#221812]">
      <header className="sticky top-0 z-50 border-b border-[#eadfce] bg-[#fffaf3]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/builder" className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p className="text-lg font-black">Preview en tiempo real</p>
              <p className="max-w-2xl text-xs font-semibold text-[#7b6a5b]">
                Móvil primero: es la vista importante para QR. A la derecha ves escritorio para comprobar que también queda bien en ordenador.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#7b6a5b] shadow-sm">Sincronizado {lastSync || "ahora"}</span>
            <button type="button" onClick={refresh} className="inline-flex items-center gap-2 rounded-full border border-[#d9cbb8] bg-white px-4 py-2 text-sm font-black transition hover:-translate-y-0.5 hover:shadow-md">
              <RefreshCw size={15} /> Actualizar
            </button>
            <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-full border border-[#d9cbb8] bg-white px-4 py-2 text-sm font-black transition hover:-translate-y-0.5 hover:shadow-md"><Copy size={15} /> Copiar enlace</button>
            <Link href={publicPath} target="_blank" className="inline-flex items-center gap-2 rounded-full bg-[#221812] px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 hover:shadow-md">
              <ExternalLink size={15} /> Carta pública
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1500px] gap-5 px-4 py-5 lg:grid-cols-[minmax(360px,430px)_minmax(0,1fr)] lg:px-8">
        <article className="order-1 rounded-[2rem] border border-[#eadfce] bg-white p-4 shadow-[0_18px_60px_rgba(45,30,18,0.08)] lg:sticky lg:top-[92px] lg:max-h-[calc(100vh-112px)] lg:overflow-auto">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1dc] text-[#f25a00]"><Smartphone size={20} /></span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f25a00]">Vista principal</p>
                <h1 className="text-2xl font-black">Móvil / QR</h1>
              </div>
            </div>
            <span className="rounded-full bg-[#221812] px-3 py-1 text-xs font-black text-white">Prioridad</span>
          </div>
          <div className="mx-auto max-w-[390px] rounded-[2.4rem] border-[10px] border-[#221812] bg-[#221812] shadow-2xl">
            <div className="max-h-[calc(100vh-245px)] min-h-[640px] overflow-auto rounded-[1.8rem] bg-white">
              <MobileMenuPreview data={data} branded={data.settings.plan === "free"} />
            </div>
          </div>
          <p className="mt-4 text-center text-xs font-semibold text-[#7b6a5b]">
            Así lo verá un cliente al escanear el QR desde la mesa.
          </p>
          <div className="mt-4 flex justify-center rounded-[1.4rem] bg-[#fff7ee] p-4">
            <RealQrCode value={publicUrl} color={data.restaurant.primaryColor} fileName={`qr-${data.restaurant.slug || "carta"}.png`} showDownload />
          </div>
        </article>

        <article className="order-2 rounded-[2rem] border border-[#eadfce] bg-white p-4 shadow-[0_18px_60px_rgba(45,30,18,0.08)]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1dc] text-[#f25a00]"><MonitorSmartphone size={20} /></span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#a99686]">Comprobación secundaria</p>
                <h2 className="text-2xl font-black">Escritorio</h2>
              </div>
            </div>
            <span className="rounded-full bg-[#fff1dc] px-3 py-1 text-xs font-black text-[#9d5810]">Portátil / ordenador</span>
          </div>
          <div className="overflow-auto rounded-[1.6rem] border border-[#eadfce] bg-[#fffaf3] p-3">
            <div className="min-w-[760px]">
              <DesktopMenuPreview data={data} branded={data.settings.plan === "free"} />
            </div>
          </div>
          <p className="mt-4 text-xs font-semibold text-[#7b6a5b]">
            Úsala para detectar textos raros, fotos demasiado grandes o secciones que en ordenador pierden equilibrio.
          </p>
        </article>
      </section>
    </main>
  );
}
