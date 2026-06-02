import { CheckCircle2, Paintbrush } from "lucide-react";
import { templateOptions, type CartaVivaState, type MenuTemplate } from "@/lib/cartaviva-data";

const simpleTemplates: MenuTemplate[] = ["visual", "elegant", "compact"];

export function SimpleDesignStep({
  data,
  onTemplateChange,
  onRestaurantChange
}: {
  data: CartaVivaState;
  onTemplateChange: (value: MenuTemplate) => void;
  onRestaurantChange: <K extends keyof CartaVivaState["restaurant"]>(field: K, value: CartaVivaState["restaurant"][K]) => void;
}) {
  const filtered = templateOptions.filter((item) => simpleTemplates.includes(item.value));
  return (
    <div className="space-y-5">
      <div className="rounded-[1.8rem] border border-[#eadfce] bg-[#fff9f1] p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-[1.3rem] bg-white text-[#e85d04]"><Paintbrush size={22} /></span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#e85d04]">Diseño</p>
            <h3 className="text-2xl font-black text-[#221812]">Elige plantilla y color, nada más</h3>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-[#6b594a]">Menos botones, más claridad. El restaurante solo tiene que elegir el estilo que encaja con su carta.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {filtered.map((item) => {
          const selected = data.restaurant.template === item.value;
          return (
            <button key={item.value} type="button" onClick={() => onTemplateChange(item.value)} className={`rounded-[1.8rem] border p-5 text-left shadow-sm transition hover:-translate-y-0.5 ${selected ? "border-[#e85d04] bg-[#fff4e8]" : "border-[#eadfce] bg-white"}`}>
              <div className="mb-4 h-28 rounded-[1.3rem] bg-[linear-gradient(135deg,#fff1df,#f7b267)] p-3">
                <div className="h-7 w-7 rounded-xl bg-white" />
                <div className="mt-8 rounded-2xl bg-white p-2 shadow-sm">
                  <div className="h-3 w-24 rounded-full bg-[#221812]" />
                  <div className="mt-2 h-2 w-full rounded-full bg-[#eadfce]" />
                  <div className="mt-2 h-2 w-2/3 rounded-full bg-[#eadfce]" />
                </div>
              </div>
              <p className="inline-flex items-center gap-2 text-xl font-black text-[#221812]">{selected ? <CheckCircle2 className="text-[#e85d04]" size={18} /> : null}{item.label}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#6b594a]">{item.description}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="rounded-[1.7rem] border border-[#eadfce] bg-white p-4 text-sm font-black text-[#221812] shadow-sm">
          Color principal
          <input type="color" value={data.restaurant.primaryColor} onChange={(event) => onRestaurantChange("primaryColor", event.target.value)} className="mt-3 h-14 w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] p-2" />
        </label>
        <label className="rounded-[1.7rem] border border-[#eadfce] bg-white p-4 text-sm font-black text-[#221812] shadow-sm">
          Color secundario
          <input type="color" value={data.restaurant.secondaryColor} onChange={(event) => onRestaurantChange("secondaryColor", event.target.value)} className="mt-3 h-14 w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] p-2" />
        </label>
        <label className="rounded-[1.7rem] border border-[#eadfce] bg-white p-4 text-sm font-black text-[#221812] shadow-sm">
          Fondo
          <input type="color" value={data.restaurant.backgroundColor} onChange={(event) => onRestaurantChange("backgroundColor", event.target.value)} className="mt-3 h-14 w-full rounded-2xl border border-[#eadfce] bg-[#fffdf9] p-2" />
        </label>
      </div>
    </div>
  );
}
