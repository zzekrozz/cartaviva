import { PublicMenuView } from "@/components/cartaviva/PublicMenuView";
import type { CartaVivaState } from "@/lib/cartaviva-data";

export function MobileMenuPreview({ data, branded }: { data: CartaVivaState; branded?: boolean }) {
  return (
    <div className="mx-auto w-full max-w-[410px] rounded-[3rem] border-[11px] border-[#18110d] bg-[#18110d] p-[3px] shadow-[0_36px_90px_rgba(34,24,18,0.28)]">
      <div className="flex justify-center rounded-t-[2.4rem] bg-[#18110d] pb-3 pt-2">
        <span className="h-1.5 w-24 rounded-full bg-white/18" />
      </div>
      <div className="max-h-[790px] overflow-y-auto rounded-[2.25rem] bg-[#fffaf3]">
        <PublicMenuView data={data} preview showBranding={branded} />
      </div>
    </div>
  );
}
