"use client";

import type { LucideIcon } from "lucide-react";

export type BuilderStep = { id: string; label: string; icon: LucideIcon; subtitle?: string };

export function BuilderSidebar({
  steps,
  activeStep,
  onChange,
}: {
  steps: BuilderStep[];
  activeStep: string;
  onChange: (id: string) => void;
}) {
  return (
    <aside className="h-fit lg:sticky lg:top-20">
      <nav className="rounded-2xl border border-[#eadfce] bg-white p-2 shadow-sm">
        {steps.map((step) => {
          const Icon = step.icon;
          const selected = activeStep === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onChange(step.id)}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                selected
                  ? "bg-[#fff1df] text-[#221812]"
                  : "text-[#6b594a] hover:bg-[#fffdf9]"
              }`}
            >
              <span
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition ${
                  selected
                    ? "bg-[#e85d04] text-white"
                    : "bg-[#f4eadc] text-[#a3581c] group-hover:bg-[#fff1df]"
                }`}
              >
                <Icon size={15} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-black">{step.label}</span>
                {step.subtitle && (
                  <span className="block truncate text-[10px] text-[#a08d7d]">{step.subtitle}</span>
                )}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
