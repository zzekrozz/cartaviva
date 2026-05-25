"use client";

import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { PublicMenuView } from "@/components/cartaviva/PublicMenuView";
import { defaultCartaVivaState, STORAGE_KEY, type CartaVivaState } from "@/lib/cartaviva-data";

export default function ClientCartaPage({ slug }: { slug: string }) {
  const [data, setData] = useState<CartaVivaState>(defaultCartaVivaState);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setData(JSON.parse(stored) as CartaVivaState);
      } catch {
        setData(defaultCartaVivaState);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#fffaf3]">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5">
        <Link href="/builder" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#221812] shadow-sm">
          <ArrowLeft size={16} /> Builder
        </Link>
        <div className="hidden rounded-full bg-white px-4 py-2 text-xs font-bold text-[#7b6a5b] sm:block">/carta/{slug}</div>
        <Link href="/builder" className="inline-flex items-center gap-2 rounded-full bg-[#e85d04] px-4 py-2 text-sm font-black text-white shadow-sm">
          <Pencil size={16} /> Editar
        </Link>
      </div>
      <PublicMenuView data={data} />
    </main>
  );
}
