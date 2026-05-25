import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Gratis",
    price: "0 €",
    note: "+ IVA",
    description: "Ideal para probar",
    items: [
      "Hasta 20 productos",
      "Sin fotos",
      "2 categorias",
      "Alergenos incluidos",
      "QR con marca de la plataforma",
      "Boton WhatsApp",
      "Pagina publica demo",
      "Marca visible"
    ]
  },
  {
    name: "Menu Dia",
    price: "19 €/mes",
    note: "+ IVA",
    description: "Para bares y restaurantes que cambian el menu a diario",
    items: [
      "Hasta 40 productos",
      "Hasta 30 fotos",
      "Menu del dia completo",
      "Fotos opcionales en menu del dia",
      "Productos agotados",
      "Ocultar productos",
      "Alergenos incluidos",
      "QR limpio",
      "Boton WhatsApp",
      "Horario, direccion e Instagram",
      "1 carta principal",
      "Sin marca visible"
    ]
  },
  {
    name: "Carta Visual",
    price: "29 €/mes",
    note: "+ IVA",
    description: "El plan recomendado para vender mejor",
    popular: true,
    items: [
      "Hasta 80 productos",
      "Hasta 60 fotos",
      "Categorias ilimitadas",
      "Menu del dia",
      "Fotos opcionales en menu del dia",
      "Productos agotados / ocultos",
      "Alergenos incluidos",
      "Etiquetas base",
      "Comida + bebidas",
      "QR limpio",
      "5 plantillas visuales",
      "Ordenar productos",
      "Colores personalizados",
      "Miniweb del restaurante"
    ]
  },
  {
    name: "Restaurante Pro",
    price: "49 €/mes",
    note: "+ IVA",
    description: "Personalizacion y multiidioma manual para negocios mas exigentes",
    items: [
      "Hasta 150 productos",
      "Hasta 120 fotos",
      "Varias secciones: comida, bebidas, vinos, desayunos, cocteles, menu del dia",
      "Alergenos incluidos",
      "2 idiomas extra editables manualmente",
      "Apartado para revisar y cambiar traducciones manualmente",
      "QR por seccion",
      "Tipografias editables",
      "Mas personalizacion visual",
      "Plantillas premium",
      "Etiquetas personalizadas",
      "Colores avanzados",
      "Si necesitas mas de 150 productos: consultar"
    ]
  }
];

export function PricingSection() {
  return (
    <section id="precios" className="px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#e85d04]">Precios claros</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#221812] md:text-5xl">
            Un MVP serio para ensenarlo hoy y crecer manana.
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#6b594a]">
            Sin pagos reales ni automatizaciones todavia. Solo lo que necesita un restaurante para empezar a usarlo.
          </p>
        </div>

        <div className="mt-10 grid gap-5 xl:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-[2rem] border p-7 shadow-sm ${
                plan.popular ? "border-[#e85d04] bg-white shadow-orange-100" : "border-[#eadfce] bg-[#fffdf9]"
              }`}
            >
              {plan.popular ? (
                <span className="absolute -top-3 left-6 rounded-full bg-[#e85d04] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white">
                  Recomendado
                </span>
              ) : null}
              <p className="text-2xl font-bold text-[#221812]">{plan.name}</p>
              <p className="mt-2 text-sm leading-6 text-[#6b594a]">{plan.description}</p>
              <div className="mt-6">
                <p className="text-4xl font-bold text-[#221812]">{plan.price}</p>
                <p className="mt-1 text-sm font-semibold text-[#7b6a5b]">{plan.note}</p>
              </div>
              <div className="mt-6 space-y-3">
                {plan.items.map((item) => (
                  <div key={item} className="flex gap-3 text-sm leading-6 text-[#5f4e42]">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fff1df] text-[#e85d04]">
                      <Check size={14} />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/builder"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition hover:scale-[1.01] ${
                  plan.popular ? "bg-[#e85d04] text-white" : "bg-[#221812] text-white"
                }`}
              >
                Crear carta gratis
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[1.8rem] border border-[#eadfce] bg-white px-6 py-5 text-center text-sm leading-7 text-[#6b594a] shadow-sm">
          <p>¿Necesitas mas de 150 productos, muchas fotos o varias cartas? Consultanos.</p>
          <p>Proximamente: importacion de carta con IA, traducciones automaticas y estadisticas.</p>
        </div>
      </div>
    </section>
  );
}
