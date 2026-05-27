import Link from "next/link";
import { CheckCircle2, Copy, ExternalLink, Eye, Rocket, ShieldCheck } from "lucide-react";
import type { CartaVivaState } from "@/lib/cartaviva-data";
import { RealQrCode } from "@/components/cartaviva/RealQrCode";

export function PublishStep({ data, publicUrl, publicPath, onCopyLink, onMarkPublished }: { data: CartaVivaState; publicUrl: string; publicPath: string; onCopyLink: () => void; onMarkPublished: () => void }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        <section className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#e85d04]">Publicar</p>
          <h2 className="mt-3 text-4xl font-black text-[#221812]">Tu carta ya parece producto real</h2>
          <p className="mt-3 text-sm font-semibold leading-7 text-[#6b594a]">Activa la carta para quitar marca de agua, guardar con cuenta y usar el QR en mesas, barra, Instagram o escaparate.</p>
          <div className="mt-5 rounded-[1.3rem] bg-[#fff7ee] px-4 py-3 text-sm font-black text-[#6b594a]">
            Tu carta pública: <span className="text-[#221812]">{publicPath}</span>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#eadfce] bg-[#221812] p-6 text-white shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-200">Plan Pro</p>
              <h3 className="mt-2 text-3xl font-black">Primer mes por 1€ + IVA</h3>
              <p className="mt-2 text-sm font-semibold leading-7 text-white/70">Después 49€/mes + IVA. Miniweb móvil, QR descargable, cambios ilimitados y carta viva sin PDFs torpes.</p>
            </div>
            <Link href="/checkout" className="inline-flex items-center gap-2 rounded-full bg-[#e85d04] px-5 py-3 text-sm font-black text-white"><Rocket size={16} /> Activar por 1€</Link>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          <Link href={publicPath} target="_blank" className="inline-flex items-center justify-center gap-2 rounded-[1.3rem] border border-[#d9cbb8] bg-white px-5 py-4 text-sm font-black shadow-sm"><ExternalLink size={16} /> Abrir carta pública</Link>
          <Link href="/builder/preview" target="_blank" className="inline-flex items-center justify-center gap-2 rounded-[1.3rem] bg-[#221812] px-5 py-4 text-sm font-black text-white shadow-sm"><Eye size={16} /> Abrir preview</Link>
          <button type="button" onClick={onCopyLink} className="inline-flex items-center justify-center gap-2 rounded-[1.3rem] bg-white px-5 py-4 text-sm font-black shadow-sm"><Copy size={16} /> Copiar enlace</button>
          <button type="button" onClick={onMarkPublished} className="inline-flex items-center justify-center gap-2 rounded-[1.3rem] bg-[#fff4e8] px-5 py-4 text-sm font-black text-[#a3581c] shadow-sm"><CheckCircle2 size={16} /> Marcar como revisada</button>
        </section>

        <section className="rounded-[2rem] border border-[#eadfce] bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 text-[#e85d04]" />
            <div>
              <p className="text-lg font-black text-[#221812]">Preparado para Supabase + Stripe</p>
              <p className="mt-2 text-sm font-semibold leading-7 text-[#6b594a]">El siguiente paso técnico será guardar usuarios/restaurantes en Supabase y enviar este botón a Stripe Checkout. Campos previstos: plan_status, stripe_customer_id y stripe_subscription_id.</p>
            </div>
          </div>
        </section>
      </div>

      <aside className="rounded-[2.2rem] border border-[#eadfce] bg-white p-6 text-center shadow-[0_22px_70px_rgba(34,24,18,0.1)] xl:sticky xl:top-28 xl:self-start">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-[#a08d7d]">QR de mesa</p>
        <h3 className="mt-3 text-3xl font-black text-[#221812]">Escanea nuestra carta</h3>
        <p className="mt-1 text-sm font-semibold text-[#6b594a]">{data.restaurant.name}</p>
        <div className="mt-5 flex justify-center rounded-[1.7rem] bg-[#fff7ee] p-5">
          <RealQrCode value={publicUrl} color={data.restaurant.primaryColor} fileName={`qr-${data.restaurant.slug || "carta"}.png`} showDownload />
        </div>
      </aside>
    </div>
  );
}
