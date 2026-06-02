import { HardDrive, LogIn } from "lucide-react";
import Link from "next/link";

export function DemoModeBadge() {
  return (
    <div className="rounded-[1.4rem] border border-orange-200 bg-[#fff4e8] px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#e85d04]"><HardDrive size={18} /></span>
          <div>
            <p className="text-sm font-black text-[#221812]">Modo demo</p>
            <p className="text-xs font-bold leading-5 text-[#8a5a2b]">Tus cambios se guardan en este navegador. Después conectaremos Supabase para guardar con cuenta.</p>
          </div>
        </div>
        <Link href="/login?next=/dashboard" className="inline-flex items-center gap-2 rounded-full bg-[#221812] px-4 py-2 text-xs font-black text-white">
          <LogIn size={14} /> Guardar con cuenta
        </Link>
      </div>
    </div>
  );
}
