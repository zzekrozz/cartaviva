import Link from "next/link";
import { Camera, CheckCircle2, MessageCircle, QrCode, ShieldAlert, Smartphone, Sparkles, Utensils } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { PricingSection } from "@/components/cartaviva/PricingSection";
import { SetupRequestForm } from "@/components/cartaviva/SetupRequestForm";

const benefits = [
  "Fotos de tus platos",
  "Menú del día actualizado",
  "Alérgenos visibles",
  "Productos agotados u ocultos",
  "QR para mesas, barra, escaparate o Instagram",
  "WhatsApp directo",
  "Idiomas según plan"
];

const steps = [
  { title: "Nos mandas tu carta", text: "PDF, foto, Word, enlace, carta actual o WhatsApp.", icon: MessageCircle },
  { title: "La montamos por ti", text: "Organizamos categorías, productos, precios, fotos, alérgenos y menú del día.", icon: Sparkles },
  { title: "Recibes tu carta y tu QR", text: "Lista para mesas, barra, Instagram, escaparate o propuesta comercial.", icon: QrCode }
];

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
            <a href="#fotos">Fotos</a>
            <a href="#montaje">Montaje</a>
            <a href="#precios">Precios</a>
            <Link href="/demo">Demo</Link>
          </nav>
          <Link href="/probar" className="rounded-full bg-[#e85d04] px-5 py-3 text-sm font-black text-white">Crear carta visual</Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-20">
        <div>
          <p className="inline-flex rounded-full border border-orange-200 bg-[#fff4e8] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#a3581c]">Carta digital visual para restaurantes</p>
          <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">No vendas platos a ciegas. Enséñalos.</h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-9 text-[#6b594a]">Crea una carta digital visual con fotos, menú del día, alérgenos, WhatsApp y QR. Y si no quieres montarla tú, la preparamos por ti.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/probar" className="rounded-full bg-[#e85d04] px-6 py-4 text-sm font-black text-white shadow-sm">Crear mi carta visual</Link>
            <Link href="/montaje" className="rounded-full bg-[#221812] px-6 py-4 text-sm font-black text-white shadow-sm">Quiero que me montéis la carta</Link>
            <Link href="/demo" className="rounded-full border border-[#d9cbb8] bg-white px-6 py-4 text-sm font-black shadow-sm">Ver demo real</Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white p-4 shadow-sm"><p className="text-2xl font-black">0 €</p><p className="text-xs font-bold text-[#6b594a]">Gratis para siempre</p></div>
            <div className="rounded-[1.5rem] bg-white p-4 shadow-sm"><p className="text-2xl font-black">1 €</p><p className="text-xs font-bold text-[#6b594a]">Primer mes de pago</p></div>
            <div className="rounded-[1.5rem] bg-white p-4 shadow-sm"><p className="text-2xl font-black">2x3</p><p className="text-xs font-bold text-[#6b594a]">Trimestral: paga 2, usa 3</p></div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-4 -top-4 h-28 w-28 rounded-full bg-[#e85d04]/20 blur-2xl" />
          <div className="rounded-[2.8rem] border border-[#eadfce] bg-white p-4 shadow-2xl">
            <div className="overflow-hidden rounded-[2.2rem] bg-[#221812] text-white">
              <div className="h-56 bg-[linear-gradient(135deg,#e85d04,#f7b267)] p-5">
                <div className="flex justify-between"><span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">Menú del día</span><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#221812]">12,90 €</span></div>
                <h2 className="mt-20 text-4xl font-black">Casa Amelia</h2>
                <p className="text-sm font-semibold text-white/80">Tapas caseras, fotos reales y QR para mesa</p>
              </div>
              <div className="space-y-3 p-5">
                {["Carrillada ibérica", "Gambas pil pil", "Tarta de queso casera"].map((name, index) => <div key={name} className="flex items-center gap-3 rounded-[1.4rem] bg-white/10 p-3"><div className="h-16 w-16 rounded-[1.2rem] bg-white/20" /><div className="flex-1"><p className="font-black">{name}</p><p className="text-xs text-white/60">Foto, precio, alérgenos y estado</p></div><p className="font-black">{index === 0 ? "14,50 €" : index === 1 ? "9,90 €" : "5,50 €"}</p></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="fotos" className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-[2.5rem] border border-[#eadfce] bg-white p-8 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e85d04]">Gancho principal</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Cuando un cliente pregunta “¿cómo es este plato?”, tu carta debería poder responder.</h2>
            <p className="mt-4 text-base font-medium leading-8 text-[#6b594a]">Con {BRAND_NAME}, tus clientes pueden ver fotos, precios, alérgenos, productos agotados y menú del día desde el móvil. No es un PDF con QR: es una carta viva.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => <div key={benefit} className="flex items-center gap-3 rounded-[1.5rem] border border-[#eadfce] bg-white p-4 text-sm font-black shadow-sm"><CheckCircle2 className="text-[#e85d04]" size={18} /> {benefit}</div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-[2.5rem] border border-[#eadfce] bg-[#221812] p-8 text-white shadow-xl md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-200">Empieza poco a poco</p>
              <h2 className="mt-3 text-4xl font-black">Empieza con tus platos estrella</h2>
              <p className="mt-4 text-sm font-semibold leading-8 text-white/70">No hace falta fotografiar toda la carta el primer día. Puedes empezar con tus productos más vendidos y añadir fotos poco a poco.</p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black text-orange-100"><ShieldAlert size={15} /> Usa fotos propias o autorizadas por el restaurante.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[Camera, Utensils, Smartphone].map((Icon, index) => <div key={index} className="rounded-[1.8rem] border border-white/10 bg-white/10 p-5 backdrop-blur"><Icon className="text-orange-200" /><p className="mt-4 text-lg font-black">{index === 0 ? "Foto" : index === 1 ? "Producto" : "Carta móvil"}</p><p className="mt-2 text-sm leading-7 text-white/65">{index === 0 ? "Muestra cómo llega el plato." : index === 1 ? "Precio, alérgenos y etiquetas." : "QR listo para mesa o Instagram."}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="montaje" className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e85d04]">Montaje asistido</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">No tienes que montarla tú</h2>
          <p className="mt-4 text-base font-medium leading-8 text-[#6b594a]">Nos envías tu carta actual por WhatsApp, PDF, foto o enlace. Nosotros la convertimos en una carta digital visual con fotos, menú del día y QR.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => <div key={step.title} className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm"><step.icon className="text-[#e85d04]" /><p className="mt-5 text-xs font-black uppercase tracking-[0.24em] text-[#a08d7d]">Paso {index + 1}</p><h3 className="mt-2 text-2xl font-black">{step.title}</h3><p className="mt-2 text-sm font-semibold leading-7 text-[#6b594a]">{step.text}</p></div>)}
        </div>
        <div className="mt-8"><SetupRequestForm /></div>
      </section>

      <PricingSection />

      <footer className="border-t border-[#eadfce] px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm font-bold text-[#6b594a]">
          <p>{BRAND_NAME} · carta digital visual con fotos, menú del día y QR</p>
          <div className="flex flex-wrap gap-4"><Link href="/legal/aviso-legal">Aviso legal</Link><Link href="/legal/privacidad">Privacidad</Link><Link href="/legal/terminos">Términos</Link><Link href="/legal/alergenos">Alérgenos</Link></div>
        </div>
      </footer>
    </main>
  );
}
