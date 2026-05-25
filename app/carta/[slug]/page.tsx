"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PublicMenuView from "@/components/cartaviva/PublicMenuView";
import { CartaVivaState, defaultCartaVivaState, STORAGE_KEY } from "@/lib/cartaviva-data";

export default function CartaPage() {
  const [data, setData] = useState<CartaVivaState>(defaultCartaVivaState);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setData({ ...defaultCartaVivaState, ...JSON.parse(saved) });
    } catch {
      setData(defaultCartaVivaState);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#fffaf3]">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/builder" className="rounded-full bg-[#221812] px-5 py-2.5 text-sm font-black text-white">Editar carta</Link>
        <p className="hidden text-sm font-bold text-[#8b735f] sm:block">Vista pública simulada</p>
      </div>
      <PublicMenuView data={data} mode="full" />
    </div>
  );
}
