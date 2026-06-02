import { MonitorSmartphone } from "lucide-react";
import { PublicMenuView } from "@/components/cartaviva/PublicMenuView";
import type { CartaVivaState } from "@/lib/cartaviva-data";

export function DesktopMenuPreview({ data, branded }: { data: CartaVivaState; branded?: boolean }) {
  return (
    <div className="overflow-hidden rounded-[2.2rem] border border-[#d8ccb9] bg-[#f3e8d7] shadow-[0_36px_90px_rgba(34,24,18,0.18)]">
      <div className="flex items-center justify-between border-b border-[#d8ccb9] bg-white px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-[#fff1df] text-[#e85d04]"><MonitorSmartphone size={18} /></span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a08d7d]">Vista escritorio</p>
            <p className="text-sm font-bold text-[#221812]">Miniweb del restaurante</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-[#f5b1a6]" />
          <span className="h-3 w-3 rounded-full bg-[#f8d98f]" />
          <span className="h-3 w-3 rounded-full bg-[#9ed8b5]" />
        </div>
      </div>
      <div className="max-h-[810px] overflow-y-auto bg-[#fffaf3]">
        <PublicMenuView data={data} showBranding={branded} />
      </div>
    </div>
  );
}
