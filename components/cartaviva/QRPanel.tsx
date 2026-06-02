import { Copy, Crown, Download, Globe2, QrCode, Sparkles } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { buildPublicPath, type CartaVivaState } from "@/lib/cartaviva-data";
import { PlanBadge } from "@/components/cartaviva/PlanBadge";
import { RealQrCode } from "@/components/cartaviva/RealQrCode";

type Props = {
  data: CartaVivaState;
  publicUrl: string;
  onCopyLink: () => void;
  isRegistered?: boolean;
};

export function QRPanel({ data, publicUrl, onCopyLink, isRegistered = false }: Props) {
  const isFree = data.settings.plan === "free";
  const isPro = data.settings.plan === "restaurant-pro";
  const sectionQrs = ["Carta completa", "Bebidas", "Vinos", "Menú del día"];
  const qrMode = !isRegistered ? "demo" : isFree ? "free" : "paid";

  const notice = qrMode === "demo"
    ? `Este QR es de prueba. Regístrate y activa tu plan para obtener el QR de tu negocio.`
    : qrMode === "free"
      ? `Este QR incluye marca de ${BRAND_NAME}. Activa un plan de pago para obtener QR limpio.`
      : "";

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="rounded-[2rem] border border-[#eadfce] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#e85d04]">Publicación</p>
              <h3 className="mt-2 text-3xl font-black text-[#221812]">URL y QR listos para enseñar</h3>
              <p className="mt-2 break-all rounded-[1rem] bg-[#fff7ee] px-4 py-3 text-sm font-bold text-[#6b594a]">{buildPublicPath(data.restaurant.slug)}</p>
            </div>
            <PlanBadge plan={data.settings.plan} />
          </div>
          <p className="mt-4 text-sm font-medium leading-7 text-[#6b594a]">
            {isRegistered
              ? "La URL pública se guarda en Supabase y la carta se abre por slug real del restaurante."
              : "En modo demo la URL es de prueba para que puedas enseñar el resultado antes de registrarte."}
          </p>
          {notice ? (
            <div className={`mt-4 rounded-[1.4rem] border p-4 text-sm font-black ${qrMode === "demo" ? "border-orange-200 bg-[#fff4e8] text-[#a3581c]" : "border-[#eadfce] bg-[#fffdf9] text-[#6b594a]"}`}>
              {notice}
            </div>
          ) : null}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <button type="button" onClick={onCopyLink} className="inline-flex items-center justify-center gap-2 rounded-[1.3rem] bg-[#221812] px-5 py-4 text-sm font-black text-white shadow-sm">
            <Copy size={16} /> Copiar enlace
          </button>
          <a href={publicUrl} className="inline-flex items-center justify-center gap-2 rounded-[1.3rem] border border-[#d9cbb8] bg-white px-5 py-4 text-sm font-black text-[#221812] shadow-sm">
            <Globe2 size={16} /> Vista pública
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.7rem] border border-[#eadfce] bg-[#fffdf9] p-4">
            <p className="text-sm font-black text-[#221812]">Demo</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#6b594a]">QR de prueba para enseñar el resultado antes de registrarte.</p>
          </div>
          <div className="rounded-[1.7rem] border border-[#eadfce] bg-[#fffdf9] p-4">
            <p className="text-sm font-black text-[#221812]">Gratis</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#6b594a]">QR real con marca visible de {BRAND_NAME}.</p>
          </div>
          <div className="rounded-[1.7rem] border border-[#eadfce] bg-[#fffdf9] p-4">
            <p className="text-sm font-black text-[#221812]">Pago</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#6b594a]">QR limpio para mesas, barra, escaparate o Instagram.</p>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-[#eadfce] bg-white p-5 shadow-sm">
          <p className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[#e85d04]"><QrCode size={16} /> QR para mesas</p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[1.6rem] border border-[#eadfce] bg-[#fffaf3] p-5 text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a08d7d]">Formato pegatina</p>
              <div className="mx-auto mt-4 flex h-32 w-32 items-center justify-center rounded-[2rem] border-4 border-[#221812] bg-white"><QrCode size={56} /></div>
              <p className="mt-4 text-sm font-black text-[#221812]">Escanea nuestra carta</p>
              <p className="text-xs font-semibold text-[#7b6a5b]">Ideal para mesas o barra</p>
            </div>
            <div className="rounded-[1.6rem] border border-[#eadfce] bg-[#221812] p-5 text-center text-white">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-200">Formato cartel</p>
              <div className="mx-auto mt-4 flex h-32 w-32 items-center justify-center rounded-[1.6rem] bg-white text-[#221812]"><QrCode size={58} /></div>
              <p className="mt-4 text-sm font-black">Carta digital con fotos</p>
              <p className="text-xs font-semibold text-white/60">Perfecto para puerta, barra o escaparate</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="inline-flex items-center gap-2 rounded-full bg-[#221812] px-4 py-2 text-sm font-black text-white">
              <Download size={15} /> Descargar QR
            </button>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff4e8] px-4 py-2 text-sm font-black text-[#a3581c]">
              <Sparkles size={15} /> Las pegatinas físicas pueden gestionarse aparte.
            </span>
          </div>
        </div>

        {isPro ? (
          <div className="rounded-[1.8rem] border border-[#eadfce] bg-white p-5 shadow-sm">
            <p className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[#e85d04]"><Crown size={16} /> QR por sección</p>
            <div className="grid gap-2 md:grid-cols-2">
              {sectionQrs.map((item) => (
                <div key={item} className="flex items-center justify-between rounded-[1.2rem] bg-[#fff7ee] px-4 py-3 text-sm font-black text-[#221812]">
                  {item}
                  <QrCode size={16} className="text-[#e85d04]" />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-[2.2rem] border border-[#eadfce] bg-white p-6 text-center shadow-[0_22px_70px_rgba(34,24,18,0.1)]">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-[#a08d7d]">Tarjeta QR</p>
        <h3 className="mt-3 text-3xl font-black text-[#221812]">Escanea nuestra carta</h3>
        <p className="mt-1 text-sm font-semibold text-[#6b594a]">{data.restaurant.name}</p>
        <div className="mt-5 flex justify-center rounded-[1.7rem] bg-[#fff7ee] p-5">
          <RealQrCode value={publicUrl} color={data.restaurant.primaryColor} fileName={`qr-${data.restaurant.slug || "carta"}.png`} showDownload={isRegistered && qrMode === "paid"} />
        </div>
        <p className="mt-4 text-sm font-black text-[#6b594a]">Carta digital con fotos y menú del día</p>
        <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[#8a796a]">
          {qrMode === "demo" ? "QR de prueba" : qrMode === "free" ? `Con marca ${BRAND_NAME}` : "QR limpio"}
        </p>
        <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full bg-[#fff3e3] px-3 py-2 text-xs font-black text-[#a3581c]">
          <Sparkles size={14} />
          <span className="truncate">{publicUrl.replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
    </div>
  );
}
