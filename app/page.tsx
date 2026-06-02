import Link from "next/link";
import { CheckCircle2, FileText, MessageCircle, QrCode, Smartphone, Sparkles, XCircle } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { PricingSection } from "@/components/cartaviva/PricingSection";

const benefits = [
  "Carta editable en minutos, sin diseñadores",
  "QR siempre actualizado",
  "Fotos reales de tus platos",
  "Menú del día editable desde el móvil",
  "WhatsApp, Instagram y dirección visibles",
  "Miniweb para Instagram y Google Business",
];

const pdfProblems = [
  "PDF pesado que tarda en abrir",
  "Difícil de editar sin diseñador",
  "Se ve mal en móvil",
  "No enseña fotos ni destacados",
  "Hay que reimprimir cada cambio",
];

const vivaWins = [
  "Miniweb rápida y visual",
  "Editable desde el panel en segundos",
  "Móvil-first, diseñada para QR de mesa",
  "Fotos, menú del día y platos destacados",
  "QR limpio descargable e imprimible",
];

const WA_NUMBER = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "34600000000";

export default function Home() {
  const waText = encodeURIComponent("Hola, me interesa MesaCarta para mi restaurante. ¿Podéis ayudarme?");
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waText}`;

  return (
    <main className="min-h-screen bg-[#fffaf3] text-[#221812]">
      <header className="sticky top-0 z-50 border-b border-[#eadfce] bg-[#fffaf3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-[#221812] text-white">
              <QrCode size={20} />
            </span>
            <span className="text-xl font-black">{BRAND_NAME}</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-bold text-[#6b594a] md:flex">
            <a href="#problema">Problema</a>
            <a href="#beneficios">Beneficios</a>
            <a href="#precios">Precios</a>
            <Link href="/carta/casa-amelia">Ver ejemplo</Link>
            <Link href="/montaje" className="text-[#e85d04]">Montaje</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href={waUrl} target="_blank" className="hidden items-center gap-1.5 rounded-full bg-[#25d366] px-4 py-2.5 text-sm font-black text-white sm:flex">
              <MessageCircle size={14} /> WhatsApp
            </Link>
            <Link href="/builder" className="rounded-full bg-[#e85d04] px-5 py-3 text-sm font-black text-white">
              Crear carta gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-[#fff4e8] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#a3581c]">
            <Sparkles size={15} /> Miniweb para restaurantes
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight md:text-6xl lg:text-7xl">
            Convierte el QR de tu restaurante en una miniweb visual.
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-semibold leading-9 text-[#6b594a]">
            {BRAND_NAME} reemplaza los PDFs lentos por una carta móvil editable con fotos, menú del día,
            horarios, ubicación y WhatsApp. Edítala tú mismo, sin diseñadores.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/builder" className="rounded-full bg-[#e85d04] px-6 py-4 text-sm font-black text-white shadow-sm">
              Crear carta gratis
            </Link>
            <Link href="/carta/casa-amelia" className="rounded-full bg-[#221812] px-6 py-4 text-sm font-black text-white shadow-sm">
              Ver ejemplo real
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
              <p className="text-2xl font-black">Móvil-first</p>
              <p className="text-xs font-bold text-[#6b594a]">Pensada para QR de mesa</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
              <p className="text-2xl font-black">1 €</p>
              <p className="text-xs font-bold text-[#6b594a]">Primer mes de prueba</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
              <p className="text-2xl font-black">49 €/mes</p>
              <p className="text-xs font-bold text-[#6b594a]">Plan Restaurante Web</p>
            </div>
          </div>
        </div>
        <div className="rounded-[2.8rem] border border-[#eadfce] bg-white p-4 shadow-2xl">
          <div className="overflow-hidden rounded-[2.2rem] bg-[#221812] text-white">
            <div className="h-64 bg-[linear-gradient(135deg,#e85d04,#f7b267)] p-5">
              <div className="flex justify-between">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">Carta móvil</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#221812]">QR listo</span>
              </div>
              <h2 className="mt-24 text-5xl font-black">Casa Amelia</h2>
              <p className="text-sm font-semibold text-white/80">Tapas caseras · Menú del día · Marbella</p>
            </div>
            <div className="space-y-3 p-5">
              {[
                ["Carrillada ibérica", "12,90 €"],
                ["Gambas pil pil", "9,80 €"],
                ["Tarta de queso", "5,50 €"],
              ].map(([name, price]) => (
                <div key={name} className="flex items-center gap-3 rounded-[1.4rem] bg-white/10 p-3">
                  <div className="h-16 w-16 rounded-[1.2rem] bg-white/20" />
                  <div className="flex-1">
                    <p className="font-black">{name}</p>
                    <p className="text-xs text-white/60">Foto, precio y alérgenos</p>
                  </div>
                  <p className="font-black">{price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problema */}
      <section id="problema" className="mx-auto max-w-7xl px-4 py-14">
        <div className="rounded-[2.5rem] border border-[#eadfce] bg-white p-8 shadow-sm md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e85d04]">El problema</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Tu QR probablemente abre un PDF lento, feo y difícil de cambiar.
          </h2>
          <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-[#6b594a]">
            {BRAND_NAME} convierte esa carta estática en una miniweb móvil que puedes editar cuando sube
            un precio, se agota un plato o quieres destacar lo que más margen te da.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-[2rem] border border-[#eadfce] bg-[#fffdf9] p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-[#a08d7d]" />
                <h3 className="text-xl font-black">PDF con QR</h3>
              </div>
              <div className="space-y-3">
                {pdfProblems.map((item) => (
                  <p key={item} className="flex items-center gap-2 text-sm font-bold text-[#6b594a]">
                    <XCircle size={16} className="text-red-400 flex-shrink-0" /> {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-orange-200 bg-[#fff4e8] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="text-[#e85d04]" />
                <h3 className="text-xl font-black">{BRAND_NAME}</h3>
              </div>
              <div className="space-y-3">
                {vivaWins.map((item) => (
                  <p key={item} className="flex items-center gap-2 text-sm font-black text-[#221812]">
                    <CheckCircle2 size={16} className="text-[#e85d04] flex-shrink-0" /> {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-[#e85d04]">Beneficios</p>
        <h2 className="mt-2 text-3xl font-black md:text-4xl">Sin PDFs. Sin imprimir. Sin diseñadores.</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-3 rounded-[1.5rem] border border-[#eadfce] bg-white p-5 text-sm font-black shadow-sm">
              <CheckCircle2 className="flex-shrink-0 text-[#e85d04]" size={19} />
              {benefit}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* Montaje CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="rounded-[2.5rem] border border-[#eadfce] bg-[#221812] p-8 text-white shadow-xl md:p-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#f0b35b]">Montaje asistido</p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                ¿No tienes tiempo para montarlo tú?
              </h2>
              <p className="mt-4 text-sm leading-8 text-white/70">
                Mandas tu carta actual y nosotros la subimos. Categorías, platos, precios, fotos y QR
                listos en 48 horas. Desde 99 €, pago único.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/montaje" className="flex items-center justify-center gap-2 rounded-full bg-[#e85d04] px-6 py-4 text-sm font-black text-white">
                Ver paquetes de montaje
              </Link>
              <Link href={waUrl} target="_blank" className="flex items-center justify-center gap-2 rounded-full bg-[#25d366] px-6 py-4 text-sm font-black text-white">
                <MessageCircle size={16} /> Hablar por WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#eadfce] px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm font-bold text-[#6b594a]">
          <p>{BRAND_NAME} · miniweb visual para restaurantes</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/legal/aviso-legal">Aviso legal</Link>
            <Link href="/legal/privacidad">Privacidad</Link>
            <Link href="/legal/terminos">Términos</Link>
            <Link href="/legal/cookies">Cookies</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
