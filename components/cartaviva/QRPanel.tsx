import { Copy, Globe2, QrCode } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { buildPublicPath, type CartaVivaState } from "@/lib/cartaviva-data";
import { PlanBadge } from "@/components/cartaviva/PlanBadge";
import { FakeQr } from "@/components/cartaviva/PublicMenuView";

export function QRPanel({
  data,
  publicUrl,
  onCopyLink
}: {
  data: CartaVivaState;
  publicUrl: string;
  onCopyLink: () => void;
}) {
  const isFree = data.settings.plan === "free";

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <div className="rounded-[1.7rem] border border-[#eadfce] bg-[#fff7ee] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#e85d04]">URL publica</p>
              <p className="mt-2 break-all text-2xl font-bold text-[#221812]">{buildPublicPath(data.restaurant.slug)}</p>
            </div>
            <PlanBadge plan={data.settings.plan} />
          </div>
          <p className="mt-3 text-sm leading-7 text-[#6b594a]">
            Vista simulada para MVP. Gratis muestra marca, los planes de pago muestran QR limpio.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onCopyLink} className="inline-flex items-center gap-2 rounded-full bg-[#221812] px-5 py-3 text-sm font-bold text-white">
            <Copy size={16} />
            Copiar enlace
          </button>
          <a href={publicUrl} className="inline-flex items-center gap-2 rounded-full border border-[#d9cbb8] bg-white px-5 py-3 text-sm font-bold text-[#221812]">
            <Globe2 size={16} />
            Vista publica
          </a>
        </div>

        <div className="rounded-[1.7rem] border border-dashed border-[#d8cab6] bg-white p-5 text-sm leading-7 text-[#6b594a]">
          <p>Gratis: QR con marca visible de {BRAND_NAME}.</p>
          <p>Pago: QR limpio, mas profesional para mesas, barra y escaparate.</p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#a08d7d]">Tarjeta QR</p>
        <h3 className="mt-3 text-2xl font-bold text-[#221812]">Escanea nuestra carta</h3>
        <p className="mt-1 text-sm text-[#6b594a]">{data.restaurant.name}</p>
        <div className="mt-5 flex justify-center">
          <FakeQr color={data.restaurant.primaryColor} />
        </div>
        <p className="mt-4 text-sm font-semibold text-[#6b594a]">Carta digital con fotos y menu del dia</p>
        {isFree ? <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-[#8a796a]">Con marca {BRAND_NAME}</p> : <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-[#8a796a]">QR limpio</p>}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#fff3e3] px-3 py-2 text-xs font-bold text-[#a3581c]">
          <QrCode size={14} />
          {publicUrl.replace(/^https?:\/\//, "")}
        </div>
      </div>
    </div>
  );
}
