"use client";

import { motion } from "framer-motion";
import {
  QrCode,
  Camera,
  Languages,
  CalendarDays,
  Sparkles,
  Check,
  Utensils,
  MessageCircle,
  Eye,
  BadgeEuro
} from "lucide-react";

const menuItems = [
  {
    category: "Menú del día",
    name: "Carrillada ibérica",
    description: "Cocinada a fuego lento con salsa casera y patatas panaderas.",
    price: "12,90 €",
    tag: "Recomendado",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=900&auto=format&fit=crop"
  },
  {
    category: "Postres",
    name: "Tarta de queso casera",
    description: "Cremosa, dorada y servida con mermelada de frutos rojos.",
    price: "5,50 €",
    tag: "Casero",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=900&auto=format&fit=crop"
  },
  {
    category: "Bebidas",
    name: "Tinto de verano premium",
    description: "Refrescante, con cítricos y servido bien frío.",
    price: "3,80 €",
    tag: "Nuevo",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=900&auto=format&fit=crop"
  }
];

const features = [
  {
    icon: Camera,
    title: "Carta con fotos",
    text: "Enseña tus platos como se merecen. No más PDFs fríos ni listas interminables."
  },
  {
    icon: CalendarDays,
    title: "Menú del día editable",
    text: "Cambia primeros, segundos, postres y precio cada mañana desde el móvil."
  },
  {
    icon: Languages,
    title: "Multiidioma",
    text: "Carta en español, inglés, francés o alemán. Perfecto para zonas turísticas."
  },
  {
    icon: QrCode,
    title: "QR para mesas",
    text: "Descarga el QR, imprímelo y ponlo en mesas, barra, escaparate o Instagram."
  },
  {
    icon: Eye,
    title: "Platos agotados",
    text: "Marca productos como agotados u ocúltalos al instante sin reimprimir nada."
  },
  {
    icon: MessageCircle,
    title: "Reservas por WhatsApp",
    text: "Botón directo para que el cliente pregunte, reserve o contacte contigo."
  }
];

const plans = [
  {
    name: "Inicio",
    price: "Gratis",
    description: "Para probar la carta con hasta 10 platos.",
    items: ["1 carta", "Hasta 10 platos", "QR básico", "Marca CartaViva"]
  },
  {
    name: "Pro",
    price: "89 €/año",
    description: "Para restaurantes que quieren carta visual completa.",
    popular: true,
    items: ["Platos ilimitados", "Fotos", "Menú del día", "Productos agotados", "Multiidioma", "QR descargable"]
  },
  {
    name: "Premium",
    price: "149 €/año",
    description: "Para restaurantes turísticos y cartas más cuidadas.",
    items: ["Todo lo Pro", "Traducción editable", "QR por mesa", "Carteles imprimibles", "Estadísticas", "Soporte prioritario"]
  }
];

export default function CartaVivaLanding() {
  return (
    <div className="min-h-screen bg-[#fffaf3] text-[#221812]">
      <header className="sticky top-0 z-40 border-b border-[#eadfce] bg-[#fffaf3]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#221812] text-white shadow-sm">
              <Utensils size={20} />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">CartaViva</p>
              <p className="-mt-1 text-xs text-[#7b6a5b]">Carta digital con fotos y QR</p>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-medium text-[#6b594a] md:flex">
            <a href="#demo" className="hover:text-[#221812]">Demo</a>
            <a href="#funciones" className="hover:text-[#221812]">Funciones</a>
            <a href="#precios" className="hover:text-[#221812]">Precios</a>
          </nav>

          <button className="rounded-full bg-[#221812] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:scale-[1.02]">
            Crear carta gratis
          </button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-5 py-16 md:py-24">
          <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-200/40 blur-3xl" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="relative z-10"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white/70 px-4 py-2 text-sm font-semibold text-[#6b594a] shadow-sm">
                <Sparkles size={16} />
                Tu carta deja de ser un PDF y empieza a vender
              </div>

              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                Una carta digital bonita, viva y lista para escanear.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6b594a] md:text-xl">
                Crea una carta visual para tu restaurante con fotos, menú del día, platos agotados, idiomas y QR para tus mesas. Sin apps raras. Sin PDFs tristes.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button className="rounded-full bg-[#e85d04] px-7 py-4 text-base font-black text-white shadow-lg shadow-orange-200 transition hover:scale-[1.02]">
                  Probar demo gratis
                </button>
                <button className="rounded-full border border-[#d9cbb8] bg-white px-7 py-4 text-base font-black text-[#221812] transition hover:scale-[1.02]">
                  Ver ejemplo de carta
                </button>
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-sm text-[#6b594a]">
                <div className="rounded-2xl bg-white/70 p-4 shadow-sm">
                  <p className="text-2xl font-black text-[#221812]">10</p>
                  <p>platos gratis</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-4 shadow-sm">
                  <p className="text-2xl font-black text-[#221812]">QR</p>
                  <p>descargable</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-4 shadow-sm">
                  <p className="text-2xl font-black text-[#221812]">89€</p>
                  <p>plan anual Pro</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              id="demo"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="relative z-10 mx-auto w-full max-w-md"
            >
              <div className="rounded-[2.5rem] border border-[#e8ddcd] bg-[#1c1511] p-3 shadow-2xl">
                <div className="overflow-hidden rounded-[2rem] bg-[#fffaf3]">
                  <div className="relative h-44 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop')" }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/5" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">Demo restaurante</p>
                      <h2 className="text-2xl font-black">Casa Amelia</h2>
                      <p className="text-sm text-white/85">Carta visual · Menú del día · QR</p>
                    </div>
                  </div>

                  <div className="flex gap-2 overflow-x-auto px-4 py-4 text-sm font-bold">
                    {['Hoy', 'Tapas', 'Carnes', 'Postres', 'Bebidas'].map((item, idx) => (
                      <span key={item} className={`whitespace-nowrap rounded-full px-4 py-2 ${idx === 0 ? 'bg-[#e85d04] text-white' : 'bg-[#f1e7d8] text-[#6b594a]'}`}>{item}</span>
                    ))}
                  </div>

                  <div className="space-y-3 px-4 pb-5">
                    {menuItems.map((item) => (
                      <div key={item.name} className="grid grid-cols-[88px_1fr] gap-3 rounded-3xl bg-white p-3 shadow-sm">
                        <img src={item.image} alt="" className="h-24 w-24 rounded-2xl object-cover" />
                        <div className="min-w-0">
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <span className="rounded-full bg-orange-100 px-2 py-1 text-[10px] font-black uppercase text-[#c2410c]">{item.tag}</span>
                            <span className="font-black text-[#221812]">{item.price}</span>
                          </div>
                          <h3 className="truncate text-base font-black">{item.name}</h3>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#7b6a5b]">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 -top-5 hidden rounded-3xl bg-white p-4 shadow-xl md:block">
                <QrCode size={42} />
                <p className="mt-2 text-xs font-black">QR listo</p>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="funciones" className="px-5 py-14">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-black uppercase tracking-[0.25em] text-[#e85d04]">Funciones</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Todo lo que una carta moderna necesita.</h2>
              <p className="mt-4 text-[#6b594a]">Pensado para restaurantes, bares, cafeterías y negocios que quieren enseñar mejor lo que venden.</p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1df] text-[#e85d04]">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-xl font-black">{feature.title}</h3>
                    <p className="mt-2 leading-7 text-[#6b594a]">{feature.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-5 py-14">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] bg-[#221812] p-7 text-white md:grid-cols-[0.9fr_1.1fr] md:p-10">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
                <BadgeEuro size={16} />
                Setup hecho por ti
              </div>
              <h2 className="text-4xl font-black tracking-tight">¿No quieren rellenar nada? Se la montas tú.</h2>
              <p className="mt-4 leading-8 text-white/75">
                El restaurante te manda su carta actual, logo, horarios, WhatsApp y fotos. Tú lo conviertes en una carta digital profesional y ellos solo tienen que compartir el QR.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["49 €", "Setup básico", "Carta desde PDF o foto"],
                ["89 €", "Setup Pro", "Carta completa + QR bonito"],
                ["149 €", "Premium", "Carta + idiomas + materiales"]
              ].map(([price, title, text]) => (
                <div key={title} className="rounded-3xl bg-white/10 p-5">
                  <p className="text-3xl font-black">{price}</p>
                  <h3 className="mt-3 font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="precios" className="px-5 py-14">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-black uppercase tracking-[0.25em] text-[#e85d04]">Precios</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Planes simples, sin mensualidad pesada.</h2>
              <p className="mt-4 text-[#6b594a]">Empieza gratis y sube cuando necesites fotos, idiomas, menú del día y más control.</p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {plans.map((plan) => (
                <div key={plan.name} className={`relative rounded-[2rem] border p-7 shadow-sm ${plan.popular ? 'border-[#e85d04] bg-white shadow-orange-100' : 'border-[#eadfce] bg-white'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-7 rounded-full bg-[#e85d04] px-4 py-2 text-xs font-black uppercase tracking-wider text-white">Más interesante</div>
                  )}
                  <h3 className="text-2xl font-black">{plan.name}</h3>
                  <p className="mt-2 text-[#6b594a]">{plan.description}</p>
                  <p className="mt-6 text-4xl font-black">{plan.price}</p>
                  <ul className="mt-6 space-y-3">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-[#5e4f43]">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fff1df] text-[#e85d04]"><Check size={15} /></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button className={`mt-8 w-full rounded-full px-5 py-3 font-black transition hover:scale-[1.02] ${plan.popular ? 'bg-[#e85d04] text-white' : 'bg-[#221812] text-white'}`}>
                    {plan.name === 'Inicio' ? 'Crear gratis' : 'Elegir plan'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#eadfce] px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-[#7b6a5b] md:flex-row">
          <p className="font-bold text-[#221812]">CartaViva</p>
          <p>Cartas digitales visuales para restaurantes, bares y cafeterías.</p>
        </div>
      </footer>
    </div>
  );
}
