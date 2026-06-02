import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { MessageCircle, Sparkles, X } from "lucide-react";
import { PublicMenuView } from "@/components/cartaviva/PublicMenuView";
import { loadProposalRestaurantBySlug } from "@/lib/supabase/queries";
import { defaultCartaVivaState } from "@/lib/cartaviva-data";
import { BRAND_NAME } from "@/lib/brand";

function publicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
}

const WA_NUMBER = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "34600000000";

export default async function ProposalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = publicSupabase();
  let data = defaultCartaVivaState;
  if (supabase) {
    const loaded = await loadProposalRestaurantBySlug(supabase, slug).catch(() => null);
    if (!loaded) notFound();
    data = loaded;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const publicUrl = `${appUrl}/propuesta/${slug}`;
  const restaurantName = data.restaurant.name || "tu restaurante";
  const waText = encodeURIComponent(`Hola, he visto la propuesta de carta digital para ${restaurantName} y me interesa. ¿Podéis montármela?`);
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waText}`;

  return (
    <div className="relative min-h-screen bg-[#fffaf3]">
      {/* Proposal banner */}
      <div className="sticky top-0 z-50 border-b border-[#f0d7b9] bg-[#fff4e8]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#e85d04] text-white">
              <Sparkles size={14} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-black text-[#221812]">
                Vista de demostración preparada con {BRAND_NAME}
              </p>
              <p className="hidden text-[10px] text-[#8a796a] sm:block">
                Así quedaría la carta digital de {restaurantName}. Lista para activar hoy.
              </p>
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <Link
              href={waUrl}
              target="_blank"
              className="flex items-center gap-1.5 rounded-full bg-[#25d366] px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-[#1fb855]"
            >
              <MessageCircle size={13} /> WhatsApp
            </Link>
            <Link
              href="/montaje"
              className="flex items-center gap-1.5 rounded-full bg-[#e85d04] px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-[#c94e03]"
            >
              Quiero activar esta carta
            </Link>
          </div>
        </div>
      </div>

      {/* Carta */}
      <PublicMenuView data={data} publicUrl={publicUrl} showBranding proposal />

      {/* Bottom CTA */}
      <div className="border-t border-[#eadfce] bg-[#221812] px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-widest text-[#f0b35b]">
            ¿Te gusta cómo queda?
          </p>
          <h2 className="mt-3 text-3xl font-black">
            Te la dejamos montada y lista.
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Mandas tu carta actual y nosotros subimos categorías, platos, precios y fotos.
            Recibes enlace y QR para usar desde hoy.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={waUrl}
              target="_blank"
              className="flex items-center gap-2 rounded-full bg-[#25d366] px-6 py-3 text-sm font-black text-white"
            >
              <MessageCircle size={16} /> Hablar por WhatsApp
            </Link>
            <Link
              href="/montaje"
              className="flex items-center gap-2 rounded-full bg-[#e85d04] px-6 py-3 text-sm font-black text-white"
            >
              Ver paquetes de montaje
            </Link>
          </div>
          <p className="mt-6 text-xs text-white/40">
            {BRAND_NAME} · carta digital para restaurantes
          </p>
        </div>
      </div>
    </div>
  );
}
