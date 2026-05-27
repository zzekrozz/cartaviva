import Link from "next/link";
import { CheckCircle2, FileText, QrCode, Smartphone, Sparkles, XCircle } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";

const benefits = [
  "Cambios en minutos",
  "QR siempre actualizado",
  "Fotos y platos destacados",
  "Diseño móvil primero",
  "WhatsApp, Instagram y dirección visibles",
  "Sin depender de diseñadores"
];

const pdfProblems = ["PDF pesado", "Difícil de editar", "Mal en móvil", "No vende platos", "Hay que reenviar o reimprimir"];
const vivaWins = ["Miniweb rápida", "Editable desde panel", "Móvil-first", "Fotos y destacados", "QR limpio descargable"];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffaf3] text-[#221812]">
      <header className="sticky top-0 z-50 border-b border-[#eadfce] bg-[#fffaf3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-[#221812] text-white"><QrCode size={20} /></span>
            <span className="text-xl font-black">{BRAND_NAME}</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-bold text-[#6b594a] md:flex">
            <a href="#problema">Problema</a>
            <a href="#beneficios">Beneficios</a>
            <a href="#precio">Precio</a>
            <Link href="/carta/casa-amelia">Ejemplo</Link>
          </nav>
          <Link href="/builder" className="rounded-full bg-[#e85d04] px-5 py-3 text-sm font-black text-white">Crear demo gratis</Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-[#fff4e8] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#a3581c]"><Sparkles size={15} /> SaaS para restaurantes</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">Tu carta QR, pero bonita, editable y lista para vender.</h1>
          <p className="mt-6 max-w-2xl text-lg font-semibold leading-9 text-[#6b594a]">Crea una miniweb móvil para tu restaurante. Cambia platos, precios y fotos sin rehacer PDFs ni imprimir cartas nuevas.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/builder" className="rounded-full bg-[#e85d04] px-6 py-4 text-sm font-black text-white shadow-sm">Crear demo gratis</Link>
            <Link href="/carta/casa-amelia" className="rounded-full bg-[#221812] px-6 py-4 text-sm font-black text-white shadow-sm">Ver ejemplo real</Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white p-4 shadow-sm"><p className="text-2xl font-black">Móvil-first</p><p className="text-xs font-bold text-[#6b594a]">Pensada para QR de mesa</p></div>
            <div className="rounded-[1.5rem] bg-white p-4 shadow-sm"><p className="text-2xl font-black">1€</p><p className="text-xs font-bold text-[#6b594a]">Primer mes + IVA</p></div>
            <div className="rounded-[1.5rem] bg-white p-4 shadow-sm"><p className="text-2xl font-black">49€/mes</p><p className="text-xs font-bold text-[#6b594a]">Después + IVA</p></div>
          </div>
        </div>
        <div className="rounded-[2.8rem] border border-[#eadfce] bg-white p-4 shadow-2xl">
          <div className="overflow-hidden rounded-[2.2rem] bg-[#221812] text-white">
            <div className="h-64 bg-[linear-gradient(135deg,#e85d04,#f7b267)] p-5">
              <div className="flex justify-between"><span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">Carta móvil</span><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#221812]">QR listo</span></div>
              <h2 className="mt-24 text-5xl font-black">Casa Amelia</h2>
              <p className="text-sm font-semibold text-white/80">Tapas caseras, fotos reales y miniweb propia</p>
            </div>
            <div className="space-y-3 p-5">
              {[["Carrillada ibérica", "12,90 €"], ["Gambas pil pil", "9,80 €"], ["Tarta de queso", "5,50 €"]].map(([name, price]) => <div key={name} className="flex items-center gap-3 rounded-[1.4rem] bg-white/10 p-3"><div className="h-16 w-16 rounded-[1.2rem] bg-white/20" /><div className="flex-1"><p className="font-black">{name}</p><p className="text-xs text-white/60">Foto, precio y alérgenos</p></div><p className="font-black">{price}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="problema" className="mx-auto max-w-7xl px-4 py-14">
        <div className="rounded-[2.5rem] border border-[#eadfce] bg-white p-8 shadow-sm md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e85d04]">Problema</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Tu QR actual probablemente abre un PDF lento, feo y difícil de cambiar.</h2>
          <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-[#6b594a]">CartaViva convierte esa carta estática en una miniweb móvil que puedes editar cuando sube un precio, se agota un plato o quieres destacar lo que más margen deja.</p>
        </div>
      </section>

      <section id="beneficios" className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => <div key={benefit} className="flex items-center gap-3 rounded-[1.5rem] border border-[#eadfce] bg-white p-5 text-sm font-black shadow-sm"><CheckCircle2 className="text-[#e85d04]" size={19} /> {benefit}</div>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-[2.2rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3"><FileText className="text-[#a08d7d]" /><h3 className="text-2xl font-black">PDF con QR</h3></div>
            <div className="mt-5 space-y-3">{pdfProblems.map((item) => <p key={item} className="flex items-center gap-2 text-sm font-bold text-[#6b594a]"><XCircle size={16} className="text-red-500" /> {item}</p>)}</div>
          </div>
          <div className="rounded-[2.2rem] border border-orange-200 bg-[#fff4e8] p-6 shadow-sm">
            <div className="flex items-center gap-3"><Smartphone className="text-[#e85d04]" /><h3 className="text-2xl font-black">{BRAND_NAME}</h3></div>
            <div className="mt-5 space-y-3">{vivaWins.map((item) => <p key={item} className="flex items-center gap-2 text-sm font-black text-[#221812]"><CheckCircle2 size={16} className="text-[#e85d04]" /> {item}</p>)}</div>
          </div>
        </div>
      </section>

      <section id="precio" className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-[2.5rem] bg-[#221812] p-8 text-white shadow-xl md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-200">Precio</p>
          <h2 className="mt-3 text-4xl font-black md:text-5xl">Demo gratis. Pro por 1€ el primer mes.</h2>
          <p className="mt-4 max-w-3xl text-sm font-semibold leading-8 text-white/70">Después 49€/mes + IVA. Incluye carta publicada sin marca de agua, QR descargable, productos visuales, cambios ilimitados y URL pública.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Link href="/builder" className="rounded-full bg-[#e85d04] px-6 py-4 text-sm font-black text-white">Crea tu carta gratis</Link><Link href="/checkout" className="rounded-full bg-white px-6 py-4 text-sm font-black text-[#221812]">Activar por 1€</Link></div>
        </div>
      </section>

      <footer className="border-t border-[#eadfce] px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm font-bold text-[#6b594a]"><p>{BRAND_NAME} · carta QR visual y editable</p><div className="flex flex-wrap gap-4"><Link href="/legal/aviso-legal">Aviso legal</Link><Link href="/legal/privacidad">Privacidad</Link><Link href="/legal/terminos">Términos</Link></div></div>
      </footer>
    </main>
  );
}
