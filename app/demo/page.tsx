import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { PublicMenuView } from "@/components/cartaviva/PublicMenuView";
import { defaultCartaVivaState } from "@/lib/cartaviva-data";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#fffaf3]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#221812] shadow-sm">
          <ArrowLeft size={16} />
          Landing
        </Link>
        <Link href="/builder" className="inline-flex items-center gap-2 rounded-full bg-[#e85d04] px-4 py-2 text-sm font-bold text-white shadow-sm">
          <Pencil size={16} />
          Editar demo
        </Link>
      </div>
      <PublicMenuView data={{ ...defaultCartaVivaState, settings: { ...defaultCartaVivaState.settings, showBranding: true, plan: "free" } }} showBranding />
    </main>
  );
}
