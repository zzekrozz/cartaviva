import { PublicMenuView } from "@/components/cartaviva/PublicMenuView";
import type { CartaVivaState } from "@/lib/cartaviva-data";

export function MobileMenuPreview({ data, branded }: { data: CartaVivaState; branded?: boolean }) {
  return (
    <div className="mx-auto w-full max-w-[390px] rounded-[2.6rem] border-[12px] border-[#1d140f] bg-[#fffaf3] shadow-[0_30px_70px_rgba(34,24,18,0.18)]">
      <div className="max-h-[780px] overflow-y-auto rounded-[1.8rem]">
        <PublicMenuView data={data} preview showBranding={branded} />
      </div>
    </div>
  );
}
