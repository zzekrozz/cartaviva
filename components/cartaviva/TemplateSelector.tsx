import { templateOptions, type MenuTemplate } from "@/lib/cartaviva-data";

export function TemplateSelector({
  value,
  onChange
}: {
  value: MenuTemplate;
  onChange: (template: MenuTemplate) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {templateOptions.map((template) => (
        <button
          key={template.value}
          type="button"
          onClick={() => onChange(template.value)}
          className={`rounded-[1.6rem] border p-4 text-left transition ${
            value === template.value
              ? "border-[#e85d04] bg-[#fff4e8] shadow-sm"
              : "border-[#eadfce] bg-white hover:-translate-y-0.5"
          }`}
        >
          <div className="mb-3 h-24 rounded-[1.2rem] bg-gradient-to-br from-[#221812] via-[#7b4f2f] to-[#f4d7a2]" />
          <p className="text-lg font-bold text-[#221812]">{template.label}</p>
          <p className="mt-1 text-sm leading-6 text-[#6b594a]">{template.description}</p>
        </button>
      ))}
    </div>
  );
}
