import type { LucideIcon } from "lucide-react";

export type BuilderStep = { id: string; label: string; icon: LucideIcon };

export function BuilderSidebar({
  steps,
  activeStep,
  onChange
}: {
  steps: BuilderStep[];
  activeStep: string;
  onChange: (id: string) => void;
}) {
  return (
    <aside className="h-fit rounded-[2rem] border border-[#eadfce] bg-white p-3 shadow-sm lg:sticky lg:top-24">
      <p className="px-3 py-2 text-xs font-bold uppercase tracking-[0.28em] text-[#a08d7d]">Builder</p>
      <nav className="grid gap-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onChange(step.id)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                activeStep === step.id ? "bg-[#221812] text-white" : "text-[#6b594a] hover:bg-[#fff3e3]"
              }`}
            >
              <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${activeStep === step.id ? "bg-white/10" : "bg-[#fff1df]"}`}>
                <Icon size={16} />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.22em] opacity-70">{String(index + 1).padStart(2, "0")}</span>
                <span className="block text-sm font-bold">{step.label}</span>
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
