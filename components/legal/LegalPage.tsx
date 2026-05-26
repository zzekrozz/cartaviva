import Link from "next/link";
import { BRAND_DOMAIN_PLACEHOLDER, BRAND_NAME } from "@/lib/brand";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#fffaf3] px-5 py-10 text-[#221812]">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm md:p-10">
        <Link href="/" className="text-sm font-black text-[#e85d04]">← Volver a {BRAND_NAME}</Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-[#a08d7d]">Legal · {BRAND_DOMAIN_PLACEHOLDER}</p>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">{title}</h1>
        <div className="prose prose-stone mt-8 max-w-none prose-headings:text-[#221812] prose-p:leading-7 prose-li:leading-7">{children}</div>
        <p className="mt-10 rounded-[1.2rem] bg-[#fff4e8] p-4 text-sm font-bold text-[#a3581c]">Textos base editables. Antes de lanzar comercialmente conviene revisarlos con un profesional jurídico.</p>
      </div>
    </main>
  );
}
