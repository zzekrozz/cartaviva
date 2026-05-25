import Link from "next/link";
import PublicMenuView from "@/components/cartaviva/PublicMenuView";
import { defaultCartaVivaState } from "@/lib/cartaviva-data";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#fffaf3]">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="rounded-full bg-[#221812] px-5 py-2.5 text-sm font-black text-white">Volver</Link>
        <Link href="/builder" className="rounded-full bg-[#e85d04] px-5 py-2.5 text-sm font-black text-white">Crear mi carta</Link>
      </div>
      <PublicMenuView data={defaultCartaVivaState} mode="full" />
    </div>
  );
}
