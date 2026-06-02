import Link from "next/link";
import { ArrowLeft, Check, MessageCircle, Package, Sparkles, Star } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { SetupRequestForm } from "@/components/cartaviva/SetupRequestForm";

const WA_NUMBER = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "34600000000";

const packages = [
  {
    id: "basic",
    name: "Carta básica",
    price: "99 €",
    description: "Tu carta organizada y lista en 48 horas.",
    ideal: "Bares y restaurantes que quieren dejar de usar PDF.",
    includes: [
      "Subida de categorías y productos",
      "Precios y alérgenos configurados",
      "QR listo para imprimir",
      "Revisión antes de publicar",
    ],
    plan: "Carta Día",
    highlight: false,
  },
  {
    id: "visual",
    name: "Carta visual",
    price: "149 €",
    description: "Carta con fotos, organización visual y menú del día.",
    ideal: "Restaurantes que quieren verse premium desde el móvil.",
    includes: [
      "Todo lo de Carta básica",
      "Subida de hasta 30 fotos de productos",
      "Menú del día configurado",
      "Categorías bien estructuradas",
      "Vista previa revisada contigo",
    ],
    plan: "Carta Visual",
    highlight: true,
  },
  {
    id: "miniweb",
    name: "Miniweb + carta",
    price: "249 €",
    description: "Carta completa + miniweb editable para Instagram, Google y WhatsApp.",
    ideal: "Restaurantes que quieren una presencia digital completa.",
    includes: [
      "Todo lo de Carta visual",
      "Miniweb con portada, historia y galería",
      "Horarios, dirección y Google Maps",
      "Platos destacados en la miniweb",
      "WhatsApp y redes sociales",
      "QR + enlace listo para compartir",
    ],
    plan: "Restaurante Web",
    highlight: false,
  },
];

const extras = [
  { name: "Traducción inicial (1 idioma)", price: "desde 49 €" },
  { name: "Actualización de carta", price: "desde 29 €" },
  { name: "Fotos adicionales (por sesión)", price: "consultar" },
];

export default function MontajePage() {
  const waText = encodeURIComponent("Hola, me interesa el montaje asistido de MesaCarta. ¿Podéis ayudarme?");
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waText}`;

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-8 text-[#221812]">
      <div className="mx-auto max-w-5xl space-y-10">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black shadow-sm">
          <ArrowLeft size={16} /> Volver
        </Link>

        {/* Hero */}
        <section className="overflow-hidden rounded-[2.5rem] border border-[#eadfce] bg-[#221812] p-7 text-white shadow-xl md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#f0b35b]">Montaje asistido</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            No tienes que hacerlo tú. Nosotros lo montamos.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
            Mandas tu carta actual por WhatsApp, PDF, foto o enlace. En 48 horas tienes la carta digital
            montada, revisada y lista para enseñar. Con QR y todo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={waUrl}
              target="_blank"
              className="flex items-center gap-2 rounded-full bg-[#25d366] px-6 py-3 text-sm font-black text-white"
            >
              <MessageCircle size={16} /> Hablar por WhatsApp
            </Link>
            <a
              href="#paquetes"
              className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-black text-white backdrop-blur"
            >
              Ver paquetes
            </a>
          </div>
        </section>

        {/* Packages */}
        <section id="paquetes" className="scroll-mt-10">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[#e85d04]">Paquetes</p>
          <h2 className="mt-2 text-3xl font-black">Elige lo que necesitas</h2>
          <p className="mt-2 text-sm text-[#6b594a]">
            Precio único por el montaje. El plan mensual se elige aparte desde 19 €/mes.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {packages.map((pkg) => (
              <article
                key={pkg.id}
                className={`relative flex flex-col rounded-[2rem] border p-6 shadow-sm ${
                  pkg.highlight
                    ? "border-[#e85d04] bg-[#221812] text-white"
                    : "border-[#eadfce] bg-white text-[#221812]"
                }`}
              >
                {pkg.highlight && (
                  <span className="absolute -top-3 left-6 flex items-center gap-1 rounded-full bg-[#e85d04] px-4 py-1 text-[11px] font-black uppercase tracking-wide text-white">
                    <Star size={11} /> Más popular
                  </span>
                )}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${pkg.highlight ? "text-[#f0b35b]" : "text-[#e85d04]"}`}>
                      Plan {pkg.plan}
                    </p>
                    <h3 className="mt-1 text-xl font-black">{pkg.name}</h3>
                  </div>
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${pkg.highlight ? "bg-white/10" : "bg-[#fff1df]"}`}>
                    <Package size={18} className={pkg.highlight ? "text-[#f0b35b]" : "text-[#e85d04]"} />
                  </div>
                </div>

                <p className={`mt-3 text-sm leading-7 ${pkg.highlight ? "text-white/70" : "text-[#6b594a]"}`}>
                  {pkg.description}
                </p>

                <div className={`mt-4 rounded-xl border p-3 text-xs ${pkg.highlight ? "border-white/10 bg-white/5 text-white/60" : "border-[#f0e8db] bg-[#fffdf9] text-[#8a796a]"}`}>
                  <p className="font-black">Ideal para:</p>
                  <p className="mt-1">{pkg.ideal}</p>
                </div>

                <ul className="mt-5 flex-1 space-y-2">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <Check size={14} className={`mt-0.5 flex-shrink-0 ${pkg.highlight ? "text-[#f0b35b]" : "text-[#e85d04]"}`} />
                      <span className={pkg.highlight ? "text-white/80" : "text-[#4a3a30]"}>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-dashed pt-5 ${pkg.highlight ? 'border-white/10' : 'border-[#eadfce]'}">
                  <p className="text-3xl font-black">{pkg.price}</p>
                  <p className={`mt-0.5 text-xs ${pkg.highlight ? "text-white/50" : "text-[#8a796a]"}`}>
                    Pago único · plan mensual aparte
                  </p>
                </div>

                <Link
                  href={waUrl}
                  target="_blank"
                  className={`mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition ${
                    pkg.highlight
                      ? "bg-[#e85d04] text-white hover:bg-[#c94e03]"
                      : "bg-[#221812] text-white hover:bg-[#3a2010]"
                  }`}
                >
                  <MessageCircle size={14} /> Solicitar este paquete
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Extras */}
        <section className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-[#e85d04]" />
            <h3 className="text-lg font-black">Servicios adicionales</h3>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {extras.map((extra) => (
              <div key={extra.name} className="rounded-xl border border-[#eadfce] bg-[#fffdf9] p-4">
                <p className="text-sm font-black text-[#221812]">{extra.name}</p>
                <p className="mt-1 text-lg font-black text-[#e85d04]">{extra.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Request form */}
        <section>
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[#e85d04]">Solicitar montaje</p>
          <h2 className="mt-2 text-3xl font-black">Cuéntanos qué necesitas</h2>
          <p className="mt-2 text-sm text-[#6b594a]">
            Rellena el formulario y te respondemos en menos de 24 horas.
          </p>
          <div className="mt-6">
            <SetupRequestForm />
          </div>
        </section>

        <p className="pb-4 text-center text-xs font-semibold text-[#7b6a5b]">
          {BRAND_NAME} no verifica precios, fotos ni alérgenos. El restaurante debe revisar la carta antes de publicarla.
        </p>
      </div>
    </main>
  );
}
