import Link from "next/link";
import { ArrowLeft, Camera, QrCode, Sparkles } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { SetupRequestForm } from "@/components/cartaviva/SetupRequestForm";

export default function MontajePage() {
  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-8 text-[#221812]">
      <div className="mx-auto max-w-6xl space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black shadow-sm"><ArrowLeft size={16} /> Volver</Link>
        <section className="overflow-hidden rounded-[2.5rem] border border-[#eadfce] bg-[#221812] p-6 text-white shadow-xl md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#f0b35b]">Montaje asistido</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">No tienes que pelearte con el builder. Lo montamos contigo.</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/75">Nos mandas tu carta actual por WhatsApp, PDF, foto o enlace. Preparamos la estructura, categorías, productos, fotos, menú del día y QR para que puedas enseñarlo sin humo de freidora digital.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[{ icon: Camera, title: "Fotos y carta actual", text: "Puedes empezar con tus platos estrella, no hace falta tener toda la carta perfecta." }, { icon: Sparkles, title: "Carta visual", text: "Organizamos productos, precios, alérgenos y menú del día con estilo premium." }, { icon: QrCode, title: "QR listo", text: "Recibes enlace y QR para mesas, barra, Instagram o escaparate." }].map((item) => (
              <div key={item.title} className="rounded-[1.8rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <item.icon className="text-[#f0b35b]" />
                <h2 className="mt-4 text-xl font-black">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-white/70">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
        <SetupRequestForm />
        <p className="text-center text-xs font-semibold text-[#7b6a5b]">{BRAND_NAME} no verifica precios, fotos ni alérgenos. El restaurante debe revisar la carta antes de publicarla.</p>
      </div>
    </main>
  );
}
