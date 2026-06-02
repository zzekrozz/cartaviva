"use client";

import { useState } from "react";
import { MessageCircle, SendHorizonal } from "lucide-react";
import { ORDERED_PLANS, PLAN_CONFIGS } from "@/lib/plan-config";

const planLabels = ORDERED_PLANS.map((id) => ({ value: id, label: PLAN_CONFIGS[id].name }));

export function SetupRequestForm({ compact = false, defaultPlan = "carta-visual" }: { compact?: boolean; defaultPlan?: string }) {
  const [form, setForm] = useState({
    restaurant_name: "",
    contact_name: "",
    whatsapp: "",
    email: "",
    city: "",
    interested_plan: defaultPlan,
    current_menu_url: "",
    notes: ""
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/setup-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "No se pudo enviar la solicitud.");
      setStatus("sent");
      setMessage("Hemos recibido tu solicitud. Te contactaremos para preparar tu carta digital.");
    } catch (error: any) {
      setStatus("error");
      setMessage(error?.message || "No se pudo enviar la solicitud.");
    }
  }

  return (
    <form onSubmit={submit} className={`rounded-[2rem] border border-[#eadfce] bg-white ${compact ? "p-5" : "p-6 md:p-8"} shadow-sm`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#e85d04]">Montaje asistido</p>
          <h2 className="mt-2 text-2xl font-black text-[#221812] md:text-3xl">Quiero que me montéis la carta</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#6b594a]">
            Nos mandas tu carta por WhatsApp, PDF, foto, web o Instagram. La convertimos en una carta digital visual con fotos, menú del día y QR.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#fff4e8] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#a3581c]">
          <MessageCircle size={15} /> WhatsApp primero
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input required value={form.restaurant_name} onChange={(event) => update("restaurant_name", event.target.value)} placeholder="Nombre del restaurante" className="rounded-2xl border border-[#eadfce] px-4 py-3 text-sm font-semibold outline-none focus:border-[#e85d04]" />
        <input value={form.contact_name} onChange={(event) => update("contact_name", event.target.value)} placeholder="Persona de contacto" className="rounded-2xl border border-[#eadfce] px-4 py-3 text-sm font-semibold outline-none focus:border-[#e85d04]" />
        <input required value={form.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} placeholder="WhatsApp" className="rounded-2xl border border-[#eadfce] px-4 py-3 text-sm font-semibold outline-none focus:border-[#e85d04]" />
        <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="Email" className="rounded-2xl border border-[#eadfce] px-4 py-3 text-sm font-semibold outline-none focus:border-[#e85d04]" />
        <input value={form.city} onChange={(event) => update("city", event.target.value)} placeholder="Ciudad" className="rounded-2xl border border-[#eadfce] px-4 py-3 text-sm font-semibold outline-none focus:border-[#e85d04]" />
        <select value={form.interested_plan} onChange={(event) => update("interested_plan", event.target.value)} className="rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-black outline-none focus:border-[#e85d04]">
          {planLabels.map((plan) => <option key={plan.value} value={plan.value}>{plan.label}</option>)}
        </select>
        <input value={form.current_menu_url} onChange={(event) => update("current_menu_url", event.target.value)} placeholder="Enlace a carta, web o Instagram" className="md:col-span-2 rounded-2xl border border-[#eadfce] px-4 py-3 text-sm font-semibold outline-none focus:border-[#e85d04]" />
        <textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Comentarios: fotos, carta actual, alérgenos, si tienes menú del día..." className="min-h-28 md:col-span-2 rounded-2xl border border-[#eadfce] px-4 py-3 text-sm font-semibold outline-none focus:border-[#e85d04]" />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-xs font-semibold leading-6 text-[#7b6a5b]">Gratis: montaje opcional. Trimestral y anual: montaje inicial incluido durante lanzamiento, con límites razonables de productos, fotos y cambios.</p>
        <button type="submit" disabled={status === "sending"} className="inline-flex items-center gap-2 rounded-full bg-[#221812] px-5 py-3 text-sm font-black text-white disabled:opacity-60">
          <SendHorizonal size={16} /> {status === "sending" ? "Enviando..." : "Enviar solicitud"}
        </button>
      </div>
      {message ? <div className={`mt-4 rounded-2xl px-4 py-3 text-sm font-black ${status === "sent" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{message}</div> : null}
    </form>
  );
}
