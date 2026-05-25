import Link from "next/link";
import { ArrowRight, CalendarDays, EyeOff, ImageIcon, MessageCircle, Palette, QrCode, Smartphone, Sparkles } from "lucide-react";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { PricingSection } from "@/components/cartaviva/PricingSection";
import { MobileMenuPreview } from "@/components/cartaviva/MobileMenuPreview";
import { defaultCartaVivaState, templateOptions } from "@/lib/cartaviva-data";

const beforeAfter = [
  { title: "Antes", points: ["PDF viejo", "Carta dificil de actualizar", "Platos agotados siguen saliendo", "Clientes preguntando por WhatsApp"] },
  { title: "Despues", points: ["Carta viva", "Fotos y miniweb", "Menu del dia editable", "QR limpio listo para mesas"] }
];

const features = [
  { icon: ImageIcon, title: "Carta visual con fotos", text: "Una carta que se siente como miniweb del restaurante, no como documento subido deprisa." },
  { icon: CalendarDays, title: "Menu del dia editable", text: "Cambia precio, platos, bebida incluida y horario en segundos desde el movil." },
  { icon: EyeOff, title: "Productos agotados u ocultos", text: "Oculta o deja en gris lo que no puedes servir sin tocar el resto de la carta." },
  { icon: QrCode, title: "QR para mesas", text: "Un QR claro y presentable para barra, terraza, escaparate o redes." },
  { icon: MessageCircle, title: "Boton WhatsApp", text: "Contacto rapido para dudas, reservas sencillas o pedidos por mensaje si algun local lo usa asi." },
  { icon: Sparkles, title: "Miniweb del restaurante", text: "Portada, direccion, horario, Instagram, comida, bebidas y menu del dia en una sola experiencia." },
  { icon: Palette, title: "Plantillas visuales", text: "Cinco estilos reales para que cada negocio no se vea igual que el siguiente." },
  { icon: Smartphone, title: "Orden y experiencia movil", text: "Preview movil en tiempo real para revisar bien como compra el cliente con la vista." }
];

export default function HomePage() {
  return (
    <div className="min-h-screen text-[#221812]">
      <header className="sticky top-0 z-50 border-b border-[#eadfce] bg-[#fffaf3]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[1.4rem] bg-[#221812] text-white shadow-sm">M</div>
            <div>
              <p className="text-xl font-bold">{BRAND_NAME}</p>
              <p className="text-xs text-[#7b6a5b]">{BRAND_TAGLINE}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#6b594a] lg:flex">
            <a href="#funciones">Funciones</a>
            <a href="#menu-dia">Menu del dia</a>
            <a href="#plantillas">Plantillas</a>
            <a href="#precios">Precios</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/demo" className="hidden rounded-full border border-[#e2d2bf] bg-white px-4 py-2 text-sm font-bold md:inline-flex">Ver demo real</Link>
            <Link href="/builder" className="rounded-full bg-[#221812] px-5 py-3 text-sm font-bold text-white">Crear carta gratis</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="overflow-hidden px-5 pb-20 pt-14 md:pt-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div className="relative z-10">
              <span className="inline-flex rounded-full border border-[#e8d8c2] bg-white/80 px-4 py-2 text-sm font-bold text-[#7b6a5b] shadow-sm">
                Builder visual para restaurantes, bares y cafeterias
              </span>
              <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
                Tu carta digital, menu del dia y miniweb del restaurante en un solo QR.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6b594a] md:text-xl">
                Con fotos, productos agotados, alergenos, WhatsApp y una experiencia movil que no parece un PDF.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/builder" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e85d04] px-7 py-4 text-base font-bold text-white shadow-lg shadow-orange-200">
                  Crear carta gratis
                  <ArrowRight size={18} />
                </Link>
                <Link href="/demo" className="inline-flex items-center justify-center rounded-full border border-[#d9cbb8] bg-white px-7 py-4 text-base font-bold text-[#221812]">
                  Ver demo real
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[470px]">
              <div className="absolute -left-10 top-8 h-32 w-32 rounded-full bg-orange-200/50 blur-3xl" />
              <div className="absolute -right-10 bottom-6 h-40 w-40 rounded-full bg-[#f4d7a2]/50 blur-3xl" />
              <MobileMenuPreview data={defaultCartaVivaState} />
            </div>
          </div>
        </section>

        <section className="px-5 py-20">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
            {beforeAfter.map((block, index) => (
              <div key={block.title} className={`rounded-[2rem] border p-8 shadow-sm ${index === 0 ? "border-[#eadfce] bg-white" : "border-orange-200 bg-[#fff4e8]"}`}>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#e85d04]">{block.title}</p>
                <div className="mt-5 space-y-3">
                  {block.points.map((point) => (
                    <div key={point} className="rounded-[1.2rem] bg-white/80 px-4 py-3 text-base font-semibold text-[#5f4e42]">{point}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="funciones" className="px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#e85d04]">Funciones principales</p>
              <h2 className="mt-4 text-4xl font-bold md:text-5xl">Lo importante para que un restaurante diga: esto si lo uso.</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="rounded-[1.8rem] border border-[#eadfce] bg-white p-6 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[#fff1df] text-[#e85d04]"><Icon size={22} /></div>
                    <h3 className="mt-5 text-2xl font-bold text-[#221812]">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#6b594a]">{feature.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="menu-dia" className="px-5 py-20">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-[2.2rem] border border-[#eadfce] bg-white p-8 shadow-sm lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#e85d04]">Menu del dia</p>
              <h2 className="mt-4 text-4xl font-bold">Cambia el menu del dia desde el movil en segundos.</h2>
              <p className="mt-4 text-lg leading-8 text-[#6b594a]">
                El menu del dia va arriba del todo, con precio visible, bebida incluida, horario y bloques limpios para primeros, segundos y postres.
              </p>
            </div>
            <div className="rounded-[1.8rem] bg-[#fff7ee] p-4">
              <MobileMenuPreview data={defaultCartaVivaState} />
            </div>
          </div>
        </section>

        <section id="plantillas" className="px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#e85d04]">Plantillas</p>
              <h2 className="mt-4 text-4xl font-bold">Cinco estilos para que no parezca la misma carta en todos los locales.</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {templateOptions.map((template, index) => (
                <article key={template.value} className="overflow-hidden rounded-[1.8rem] border border-[#eadfce] bg-white shadow-sm">
                  <div className={`h-40 ${index === 0 ? "bg-gradient-to-br from-[#221812] via-[#8c4d1f] to-[#f3c98d]" : index === 1 ? "bg-gradient-to-br from-[#f8f0e4] via-[#d8c4a7] to-[#7b5a44]" : index === 2 ? "bg-gradient-to-br from-[#efe8dc] via-[#d1c4b2] to-[#938474]" : index === 3 ? "bg-gradient-to-br from-[#080706] via-[#221812] to-[#4c332a]" : "bg-gradient-to-br from-[#f9f1df] via-[#e9caa1] to-[#1f5f64]"} p-4`} />
                  <div className="p-5">
                    <h3 className="text-2xl font-bold text-[#221812]">{template.label}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#6b594a]">{template.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <PricingSection />

        <section className="px-5 py-20">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-[#221812] p-8 text-white shadow-xl">
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-white/70">Activacion Express opcional</p>
            <h2 className="mt-4 text-4xl font-bold">¿No quieres montarla tu?</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-white/75">
              Podemos prepararte la carta inicial en 48h. Servicio opcional para restaurantes que prefieren enviarnos su carta actual y recibir la carta digital preparada.
            </p>
            <p className="mt-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold">Proximamente o consultar</p>
          </div>
        </section>
      </main>
    </div>
  );
}
