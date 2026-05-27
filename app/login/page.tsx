"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, LockKeyhole, Mail, QrCode } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/client";
import { upsertProfile } from "@/lib/supabase/queries";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [mode, setMode] = useState<"login" | "register">(searchParams.get("mode") === "register" ? "register" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!hasSupabaseConfig()) {
      setMessage("Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const response = mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (response.error) throw response.error;

      const user = response.data?.user;
      if (user) await upsertProfile(supabase, user);

      if (mode === "register" && !response.data?.session) {
        setMessage("Cuenta creada. Revisa tu email para confirmar el acceso si Supabase lo tiene activado.");
      } else {
        router.push(next);
      }
    } catch (err: any) {
      setMessage(err?.message || "No se pudo acceder.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-8 text-[#221812]">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm"><ArrowLeft size={16} /> Volver</Link>
        <Link href="/demo" className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">Ver demo</Link>
      </div>

      <section className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-[1fr_440px] lg:items-center">
        <div className="rounded-[2.6rem] border border-[#eadfce] bg-white p-8 shadow-sm md:p-10">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-[#221812] text-white"><QrCode size={24} /></span>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-[#e85d04]">Cuenta real</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Guarda tu carta y vuelve mañana a editarla.</h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-[#6b594a]">
            Accede a {BRAND_NAME} para crear cartas guardadas en Supabase, publicarlas por slug y compartir el enlace QR con cada restaurante.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {['Dashboard', 'Builder guardado', 'URL pública'].map((item) => <div key={item} className="rounded-[1.5rem] bg-[#fff7ee] p-4 text-sm font-black text-[#6b594a]">{item}</div>)}
          </div>
        </div>

        <form onSubmit={submit} className="rounded-[2.4rem] border border-[#eadfce] bg-white p-6 shadow-[0_24px_80px_rgba(34,24,18,0.1)] md:p-8">
          <div className="flex rounded-full bg-[#fff3e3] p-1">
            <button type="button" onClick={() => setMode("login")} className={`flex-1 rounded-full px-4 py-3 text-sm font-black ${mode === "login" ? "bg-[#221812] text-white" : "text-[#6b594a]"}`}>Entrar</button>
            <button type="button" onClick={() => setMode("register")} className={`flex-1 rounded-full px-4 py-3 text-sm font-black ${mode === "register" ? "bg-[#221812] text-white" : "text-[#6b594a]"}`}>Crear cuenta</button>
          </div>

          <h2 className="mt-7 text-3xl font-black">{mode === "login" ? "Iniciar sesión" : "Crear cuenta gratis"}</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#6b594a]">Sin pagos todavía. Solo cuenta, dashboard y guardado real.</p>

          <label className="mt-6 block text-sm font-black text-[#221812]">Email</label>
          <div className="mt-2 flex items-center gap-2 rounded-[1.2rem] border border-[#eadfce] bg-[#fffaf3] px-4 py-3">
            <Mail size={18} className="text-[#e85d04]" />
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="restaurante@email.com" className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-[#a08d7d]" />
          </div>

          <label className="mt-4 block text-sm font-black text-[#221812]">Contraseña</label>
          <div className="mt-2 flex items-center gap-2 rounded-[1.2rem] border border-[#eadfce] bg-[#fffaf3] px-4 py-3">
            <LockKeyhole size={18} className="text-[#e85d04]" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required minLength={6} placeholder="mínimo 6 caracteres" className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-[#a08d7d]" />
          </div>

          {message ? <p className="mt-4 rounded-[1.2rem] bg-[#fff3e3] px-4 py-3 text-sm font-bold leading-6 text-[#8a4a14]">{message}</p> : null}

          <button disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#e85d04] px-6 py-4 text-sm font-black text-white shadow-sm disabled:opacity-60">
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {mode === "login" ? "Entrar al dashboard" : "Crear cuenta"}
          </button>

          <p className="mt-4 text-center text-xs font-bold text-[#7b6a5b]">Después podrás crear una carta, guardarla y publicarla con URL propia.</p>
        </form>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-[#fffaf3]"><Loader2 className="animate-spin text-[#e85d04]" /></main>}>
      <LoginForm />
    </Suspense>
  );
}
