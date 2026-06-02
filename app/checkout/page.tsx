import Link from "next/link";
import { ArrowLeft, CreditCard, ShieldCheck, Sparkles } from "lucide-react";

export default function CheckoutPlaceholderPage() {
  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-8 text-[#221812]">
      <div className="mx-auto max-w-3xl">
        <Link href="/builder" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black shadow-sm"><ArrowLeft size={16} /> Volver al builder</Link>
        <section className="mt-8 overflow-hidden rounded-[2.5rem] border border-[#eadfce] bg-white shadow-xl">
          <div className="bg-[#221812] p-8 text-white md:p-10">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-orange-100"><Sparkles size={15} /> Activación Pro</p>
            <h1 className="mt-5 text-4xl font-black md:text-5xl">Stripe se conectará aquí</h1>
            <p className="mt-4 text-base font-semibold leading-8 text-white/70">Este placeholder deja el flujo preparado: builder → checkout → carta activa → QR limpio. El siguiente paso es crear Stripe Checkout Session en el servidor.</p>
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
            <div className="rounded-[1.7rem] bg-[#fff7ee] p-5"><CreditCard className="text-[#e85d04]" /><p className="mt-4 text-lg font-black">1€ + IVA</p><p className="text-sm font-semibold text-[#6b594a]">Primer mes</p></div>
            <div className="rounded-[1.7rem] bg-[#fff7ee] p-5"><ShieldCheck className="text-[#e85d04]" /><p className="mt-4 text-lg font-black">49€/mes + IVA</p><p className="text-sm font-semibold text-[#6b594a]">Después</p></div>
            <div className="rounded-[1.7rem] bg-[#fff7ee] p-5"><Sparkles className="text-[#e85d04]" /><p className="mt-4 text-lg font-black">Supabase ready</p><p className="text-sm font-semibold text-[#6b594a]">plan_status: pro</p></div>
          </div>
          <div className="border-t border-[#eadfce] p-6 md:p-8">
            <p className="text-sm font-semibold leading-7 text-[#6b594a]">TODO técnico: crear una ruta segura que llame a Stripe Checkout, guardar stripe_customer_id y stripe_subscription_id, y activar la carta al recibir el webhook de pago confirmado.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
