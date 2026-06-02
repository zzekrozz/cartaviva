import { CheckCircle2 } from "lucide-react";
import { templateOptions, type MenuTemplate } from "@/lib/cartaviva-data";

const previewMap: Record<MenuTemplate, { outer: string; card: string; bar: string; accent: string; photo: string; list: string }> = {
  visual: {
    outer: "bg-gradient-to-br from-[#221812] via-[#7b4f2f] to-[#f4d7a2]",
    card: "bg-white",
    bar: "bg-[#221812]",
    accent: "bg-[#e85d04]",
    photo: "bg-[#f4c27b]",
    list: "bg-[#fff1df]"
  },
  elegant: {
    outer: "bg-gradient-to-br from-[#f8f0e4] via-[#d8c4a7] to-[#7b5a44]",
    card: "bg-[#fffdf8]",
    bar: "bg-[#2f211a]",
    accent: "bg-[#c6a984]",
    photo: "bg-[#e8d8c2]",
    list: "bg-[#f3e8db]"
  },
  compact: {
    outer: "bg-gradient-to-br from-[#fff8ef] via-[#e1d5c5] to-[#938474]",
    card: "bg-white",
    bar: "bg-[#221812]",
    accent: "bg-[#d9cbb8]",
    photo: "bg-[#f1e7d8]",
    list: "bg-[#ece1d2]"
  },
  "dark-premium": {
    outer: "bg-gradient-to-br from-[#070504] via-[#221812] to-[#60402f]",
    card: "bg-[#211711]",
    bar: "bg-[#f0b35b]",
    accent: "bg-[#8c5d3b]",
    photo: "bg-[#3b2a21]",
    list: "bg-[#302118]"
  },
  mediterranean: {
    outer: "bg-gradient-to-br from-[#f9f1df] via-[#e9caa1] to-[#1f5f64]",
    card: "bg-[#fffefb]",
    bar: "bg-[#1f5f64]",
    accent: "bg-[#e7c989]",
    photo: "bg-[#cfe2dc]",
    list: "bg-[#eef7f4]"
  },
    "sweet-cafe": {
    outer: "bg-gradient-to-br from-[#fff1e6] via-[#ffd6c2] to-[#f7a072]",
    card: "bg-[#fffaf5]",
    bar: "bg-[#7b3f2a]",
    accent: "bg-[#f28482]",
    photo: "bg-gradient-to-br from-[#f6bd60] to-[#f7ede2]",
    list: "bg-[#fff1e6]",
  },
};

function MiniPreview({ template }: { template: MenuTemplate }) {
  const p = previewMap[template];
  return (
    <div className={`relative mb-4 h-32 overflow-hidden rounded-[1.35rem] p-3 ${p.outer}`}>
      <div className={`absolute left-3 top-3 h-7 w-7 rounded-xl ${p.card}`} />
      <div className={`absolute left-12 top-4 h-2 w-20 rounded-full ${p.card} opacity-90`} />
      <div className={`absolute bottom-3 left-3 right-3 rounded-[1rem] ${p.card} p-2 shadow-xl`}>
        <div className="grid grid-cols-[42px_1fr] gap-2">
          <div className={`h-12 rounded-xl ${p.photo}`} />
          <div className="space-y-1.5">
            <div className={`h-2 w-20 rounded-full ${p.bar}`} />
            <div className={`h-2 w-full rounded-full ${p.list}`} />
            <div className={`h-2 w-2/3 rounded-full ${p.list}`} />
          </div>
        </div>
        <div className="mt-2 flex gap-1.5">
          <span className={`h-4 w-14 rounded-full ${p.accent}`} />
          <span className={`h-4 w-10 rounded-full ${p.list}`} />
        </div>
      </div>
    </div>
  );
}

export function TemplateSelector({ value, onChange }: { value: MenuTemplate; onChange: (template: MenuTemplate) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {templateOptions.map((template) => {
        const selected = value === template.value;
        return (
          <button
            key={template.value}
            type="button"
            onClick={() => onChange(template.value)}
            className={`relative rounded-[1.7rem] border p-3 text-left transition hover:-translate-y-1 hover:shadow-lg ${
              selected ? "border-[#e85d04] bg-[#fff4e8] shadow-[0_18px_40px_rgba(232,93,4,0.12)]" : "border-[#eadfce] bg-white"
            }`}
          >
            {selected ? <CheckCircle2 className="absolute right-4 top-4 z-10 text-[#e85d04]" size={20} /> : null}
            <MiniPreview template={template.value} />
            <p className="text-lg font-black text-[#221812]">{template.label}</p>
            <p className="mt-1 text-sm font-medium leading-6 text-[#6b594a]">{template.description}</p>
          </button>
        );
      })}
    </div>
  );
}
