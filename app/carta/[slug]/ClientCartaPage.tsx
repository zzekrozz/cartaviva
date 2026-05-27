"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Pencil } from "lucide-react";
import { PublicMenuView } from "@/components/cartaviva/PublicMenuView";
import { defaultCartaVivaState, normalizeState, STORAGE_KEY, type CartaVivaState } from "@/lib/cartaviva-data";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/client";
import { loadPublishedRestaurantBySlug } from "@/lib/supabase/queries";

export default function ClientCartaPage({ slug }: { slug: string }) {
  const [data, setData] = useState<CartaVivaState>(defaultCartaVivaState);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"demo" | "local" | "supabase">("demo");
  const [notFound, setNotFound] = useState(false);
  const [publicUrl, setPublicUrl] = useState("");

  useEffect(() => {
    setPublicUrl(window.location.href);
    async function load() {
      try {
        if (hasSupabaseConfig()) {
          const supabase = createBrowserSupabaseClient();
          const published = await loadPublishedRestaurantBySlug(supabase, slug);
          if (published) {
            setData(published);
            setSource("supabase");
            setLoading(false);
            return;
          }
        }

        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = normalizeState(JSON.parse(stored) as CartaVivaState);
          if (parsed.restaurant.slug === slug) {
            setData(parsed);
            setSource("local");
            setLoading(false);
            return;
          }
        }

        if (slug === defaultCartaVivaState.restaurant.slug || slug === "casa-amelia") {
          setData(defaultCartaVivaState);
          setSource("demo");
        } else {
          setNotFound(true);
        }
      } catch {
        setData(defaultCartaVivaState);
        setSource("demo");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#fffaf3] text-[#221812]"><div className="rounded-[2rem] bg-white p-8 text-center shadow-sm"><Loader2 className="mx-auto animate-spin text-[#e85d04]" /><p className="mt-4 font-bold">Cargando carta pública...</p></div></main>;
  }

  if (notFound) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf3] px-4 text-[#221812]">
        <div className="max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#e85d04]">Carta no publicada</p>
          <h1 className="mt-3 text-3xl font-black">Esta carta todavía no está disponible</h1>
          <p className="mt-3 text-sm font-semibold leading-7 text-[#6b594a]">Publica la carta desde el builder para que el QR y la URL funcionen públicamente.</p>
          <Link href="/dashboard" className="mt-6 inline-flex rounded-full bg-[#221812] px-5 py-3 text-sm font-black text-white">Ir al dashboard</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf3]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <Link href={source === "supabase" ? "/dashboard" : "/builder"} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#221812] shadow-sm">
          <ArrowLeft size={16} /> {source === "supabase" ? "Dashboard" : "Builder"}
        </Link>
        <div className="hidden rounded-full bg-white px-4 py-2 text-xs font-bold text-[#7b6a5b] sm:block">/carta/{slug}</div>
        <Link href={source === "supabase" ? "/dashboard" : "/builder"} className="inline-flex items-center gap-2 rounded-full bg-[#e85d04] px-4 py-2 text-sm font-bold text-white shadow-sm">
          <Pencil size={16} /> Editar
        </Link>
      </div>
      <PublicMenuView data={data} showBranding={data.settings.plan === "free"} publicUrl={publicUrl} />
    </main>
  );
}
