import type { LucideIcon } from "lucide-react";

export type BuilderStep = { id: string; label: string; icon: LucideIcon };

export function BuilderSidebar({ steps, activeStep, onChange }: { steps: BuilderStep[]; activeStep: string; onChange: (id: string) => void }) {
  return (
    <aside className="h-fit rounded-[2.2rem] border border-[#eadfce] bg-white/90 p-3 shadow-[0_20px_60px_rgba(34,24,18,0.08)] backdrop-blur lg:sticky lg:top-24">
      <div className="rounded-[1.7rem] bg-[#221812] p-4 text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-white/50">Builder</p>
        <h2 className="mt-2 text-2xl font-black leading-tight">Carta paso a paso</h2>
        <p className="mt-2 text-xs font-semibold leading-5 text-white/60">Edita, mira la preview y publica sin perderte en formularios.</p>
      </div>
      <nav className="mt-3 grid gap-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const selected = activeStep === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onChange(step.id)}
              className={`group flex items-center gap-3 rounded-[1.45rem] px-4 py-3 text-left transition ${
                selected ? "bg-[#fff1df] text-[#221812] shadow-sm ring-1 ring-[#f0d7b9]" : "text-[#6b594a] hover:bg-[#fff9f1]"
              }`}
            >
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-[1.15rem] transition ${selected ? "bg-[#e85d04] text-white" : "bg-[#f4eadc] text-[#a3581c] group-hover:bg-[#fff1df]"}`}>
                <Icon size={17} />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-black uppercase tracking-[0.22em] opacity-65">Paso {String(index + 1).padStart(2, "0")}</span>
                <span className="block text-sm font-black">{step.label}</span>
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
