"use client";

import { useEffect, useState } from "react";
import { HelpCircle, X } from "lucide-react";

const STEPS = [
  { id: "restaurant", title: "Datos del restaurante", text: "Empieza poniendo el nombre, descripción y WhatsApp." },
  { id: "design", title: "Diseño", text: "Elige una plantilla y color principal." },
  { id: "categories", title: "Categorías", text: "Crea categorías como Tapas, Bebidas o Postres." },
  { id: "products", title: "Productos", text: "Añade productos, precios, alérgenos y fotos si tu plan lo permite." },
  { id: "daily-menu", title: "Menú del día", text: "Activa el menú del día y cámbialo cuando quieras." },
  { id: "qr", title: "QR", text: "Publica tu carta y descarga el QR para tus mesas." },
  { id: "setup", title: "¿Prefieres que la montemos por ti?", text: "Puedes crear la carta tú mismo o enviarnos tu carta actual para prepararla por ti." }
];

export function TutorialGuide({ activeStep, onStepChange, storageKey = "mesacarta_tutorial_completed" }: { activeStep: string; onStepChange: (step: string) => void; storageKey?: string }) {
  const [open, setOpen] = useState(false);
  const currentIndex = Math.max(0, STEPS.findIndex((step) => step.id === activeStep));
  const current = STEPS[currentIndex] || STEPS[0];

  useEffect(() => {
    const completed = window.localStorage.getItem(storageKey);
    if (!completed) setOpen(true);
  }, [storageKey]);

  function close() {
    window.localStorage.setItem(storageKey, "true");
    window.localStorage.setItem(`${storageKey}_at`, new Date().toISOString());
    setOpen(false);
  }

  function next() {
    if (currentIndex >= STEPS.length - 1) {
      close();
      return;
    }
    const nextStep = STEPS[currentIndex + 1];
    window.localStorage.setItem(`${storageKey}_last_step`, nextStep.id);
    onStepChange(nextStep.id);
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#6b594a] shadow-sm"><HelpCircle size={16} /> Repetir tutorial</button>
      {open ? (
        <div className="fixed bottom-5 right-5 z-[80] max-w-sm rounded-[2rem] border border-[#eadfce] bg-white p-5 text-[#221812] shadow-[0_25px_80px_rgba(34,24,18,0.18)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#e85d04]">Tutorial {currentIndex + 1}/{STEPS.length}</p>
              <h3 className="mt-2 text-2xl font-black">{current.title}</h3>
            </div>
            <button type="button" onClick={close} className="rounded-full bg-[#fff4e8] p-2 text-[#a3581c]"><X size={16} /></button>
          </div>
          <p className="mt-3 text-sm font-semibold leading-7 text-[#6b594a]">{current.text}</p>
          <div className="mt-5 flex gap-2">
            <button type="button" onClick={next} className="rounded-full bg-[#e85d04] px-5 py-3 text-sm font-black text-white">{currentIndex >= STEPS.length - 1 ? "Terminar" : "Siguiente"}</button>
            <button type="button" onClick={close} className="rounded-full bg-[#221812] px-5 py-3 text-sm font-black text-white">Saltar</button>
          </div>
        </div>
      ) : null}
    </>
  );
}
