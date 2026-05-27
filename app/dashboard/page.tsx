"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeEuro, Copy, ExternalLink, Gift, Languages, Loader2, LogOut, Plus, QrCode, Store, Wand2, MessageCircle } from "lucide-react";
import { BRAND_NAME } from "@/lib/brand";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/client";
import { createRestaurantFromDemo, duplicateRestaurantAsProposal, getCurrentUser, loadRestaurantState, loadUserRestaurants, upsertProfile } from "@/lib/supabase/queries";
import { buildPublicPath, normalizeState, STORAGE_KEY, type CartaVivaState } from "@/lib/cartaviva-data";
import type { RestaurantRow } from "@/lib/supabase/mappers";
import { getPlanConfig, toPlanTier, type BillingInterval, type PlanId } from "@/lib/plan-config";
import { SetupRequestForm } from "@/components/cartaviva/SetupRequestForm";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [restaurants, setRestaurants] = useState<RestaurantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [origin, setOrigin] = useState("");
  const [billingProfile, setBillingProfile] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);

  async function load() {
    if (!hasSupabaseConfig()) {
      setMessage("Faltan las variables de Supabase. Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createBrowserSupabaseClient();
      const currentUser = await getCurrentUser(supabase);
      if (!currentUser) {
        router.push("/login?next=/dashboard");
        return;
      }
      setUser(currentUser);
      await upsertProfile(supabase, currentUser);
      const [{ data: profile }, rows] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", currentUser.id).maybeSingle(),
        loadUserRestaurants(supabase, currentUser.id),
      ]);
      setBillingProfile(profile);
      setRestaurants(rows);
    } catch (err: any) {
      setMessage(err?.message || "No se pudo cargar el dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const published = restaurants.filter((restaurant) => restaurant.status === "published").length;
    return { total: restaurants.length, published, drafts: restaurants.length - published };
  }, [restaurants]);

  async function createRestaurant() {
    setCreating(true);
    setMessage("");
    try {
      const supabase = createBrowserSupabaseClient();
      const currentUser = user || await getCurrentUser(supabase);
      if (!currentUser) {
        router.push("/login?next=/dashboard");
        return;
      }
      let localDraft: CartaVivaState | undefined;
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) localDraft = normalizeState(JSON.parse(stored) as CartaVivaState);
      } catch {
        localDraft = undefined;
      }
      const trialType = window.localStorage.getItem("mesacarta_trial_type");
      const id = await createRestaurantFromDemo(supabase, currentUser.id, localDraft, trialType);
      router.push(`/builder/${id}`);
    } catch (err: any) {
      setMessage(err?.message || "No se pudo crear la carta.");
    } finally {
      setCreating(false);
    }
  }

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  function copy(value: string) {
    navigator.clipboard?.writeText(value);
    setMessage("Enlace copiado.");
  }

  async function startCheckout(plan: PlanId, interval: BillingInterval = "monthly", trial = false) {
    setActionLoading(`${plan}-${interval}`);
    setMessage("");
    try {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        router.push("/login?next=/probar");
        return;
      }
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan, interval, trial: trial ? "one-euro" : "none" }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "No se pudo abrir Stripe.");
      window.location.href = json.url;
    } catch (err: any) {
      setMessage(err?.message || "No se pudo abrir Stripe.");
    } finally {
      setActionLoading("");
    }
  }

  async function openPortal() {
    setActionLoading("portal");
    setMessage("");
    try {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Necesitas iniciar sesión.");
      const response = await fetch("/api/stripe/portal", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "No se pudo abrir el portal.");
      window.location.href = json.url;
    } catch (err: any) {
      setMessage(err?.message || "No se pudo abrir el portal.");
    } finally {
      setActionLoading("");
    }
  }

  async function createProposal(restaurantId: string) {
    setActionLoading(`proposal-${restaurantId}`);
    setMessage("");
    try {
      const supabase = createBrowserSupabaseClient();
      const currentUser = user || await getCurrentUser(supabase);
      if (!currentUser) throw new Error("Necesitas iniciar sesión.");
      const { state } = await loadRestaurantState(supabase, restaurantId, currentUser.id);
      const proposal = await duplicateRestaurantAsProposal(supabase, state, currentUser.id);
      const url = `${origin}/propuesta/${proposal.slug}`;
      await load();
      copy(url);
      setMessage("Propuesta creada y enlace copiado.");
    } catch (err: any) {
      setMessage(err?.message || "No se pudo crear la propuesta.");
    } finally {
      setActionLoading("");
    }
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#fffaf3] text-[#221812]"><div className="rounded-[2rem] bg-white p-8 text-center shadow-sm"><Loader2 className="mx-auto animate-spin text-[#e85d04]" /><p className="mt-4 font-bold">Abriendo dashboard...</p></div></main>;
  }

  return (
    <main className="min-h-screen bg-[#fffaf3] text-[#221812]">
      <header className="border-b border-[#eadfce] bg-[#fffaf3]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-[#221812] text-white"><QrCode size={20} /></span>
            <span>
              <span className="block text-xl font-black">{BRAND_NAME}</span>
              <span className="block text-xs font-bold text-[#7b6a5b]">Dashboard de cartas digitales</span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#6b594a] shadow-sm">{user?.email}</span>
            <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#221812] shadow-sm"><LogOut size={16} /> Salir</button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[2.4rem] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e85d04]">Producto real</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Tus cartas guardadas</h1>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-[#6b594a] md:text-base">
              Crea una carta, edítala en el builder, publícala por slug y comparte el enlace o QR con el restaurante.
            </p>
            <button onClick={createRestaurant} disabled={creating} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#e85d04] px-6 py-3 text-sm font-black text-white shadow-sm disabled:opacity-60">
              {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Crear nueva carta
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[1.7rem] border border-[#eadfce] bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.22em] text-[#a08d7d]">Total</p><p className="mt-2 text-4xl font-black">{stats.total}</p></div>
            <div className="rounded-[1.7rem] border border-[#eadfce] bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.22em] text-[#a08d7d]">Publicadas</p><p className="mt-2 text-4xl font-black">{stats.published}</p></div>
            <div className="rounded-[1.7rem] border border-[#eadfce] bg-white p-5 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.22em] text-[#a08d7d]">Borradores</p><p className="mt-2 text-4xl font-black">{stats.drafts}</p></div>
          </div>
        </div>

        {message ? <p className="mt-5 rounded-[1.3rem] border border-[#eadfce] bg-white px-5 py-4 text-sm font-bold text-[#6b594a] shadow-sm">{message}</p> : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] border border-[#eadfce] bg-[#221812] p-5 text-white shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-black"><BadgeEuro size={17} className="text-orange-200" /> Plan actual</p>
                <h2 className="mt-2 text-3xl font-black">
                  {getPlanConfig(toPlanTier(billingProfile?.selected_plan)).name}
                  {billingProfile?.trial_type === "one-euro" ? " en prueba" : ""}
                </h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
                  Puedes construir gratis y activar este plan por 1 € + IVA el primer mes. Después {getPlanConfig(toPlanTier(billingProfile?.selected_plan)).monthlyPrice} €/mes + IVA.
                </p>
                {billingProfile?.current_period_end ? <p className="mt-2 text-xs font-bold text-white/60">Próxima renovación: {new Date(billingProfile.current_period_end).toLocaleDateString("es-ES")}</p> : null}
              </div>
              {billingProfile?.selected_plan && billingProfile?.selected_plan !== "free" ? <span className="rounded-full bg-[#fff1df] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#a3581c]">Primer mes por 1 € + IVA</span> : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => startCheckout("carta-visual", "monthly", true)} disabled={Boolean(actionLoading)} className="rounded-full bg-[#e85d04] px-4 py-2 text-sm font-black text-white disabled:opacity-60">{actionLoading === "carta-visual-monthly" ? "Abriendo..." : "Activar por 1 €"}</button>
              <Link href="/probar" className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#221812]">Ver planes</Link>
              <button onClick={openPortal} disabled={Boolean(actionLoading)} className="rounded-full border border-white/20 bg-transparent px-4 py-2 text-sm font-black text-white disabled:opacity-60">Gestionar suscripción</button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfce] bg-white p-5 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-black text-[#221812]"><Gift size={17} className="text-[#e85d04]" /> Construye gratis</p>
            <p className="mt-2 text-sm font-semibold leading-7 text-[#6b594a]">Prueba cualquier constructor sin pagar antes. Si el resultado te convence, activas el plan por 1 € + IVA el primer mes.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/probar" className="rounded-full bg-[#e85d04] px-4 py-2 text-sm font-black text-white">Construir gratis</Link>
              <Link href="/#precios" className="rounded-full bg-[#221812] px-4 py-2 text-sm font-black text-white">Ver planes</Link>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-[#eadfce] bg-[#221812] p-6 text-white shadow-sm">
            <p className="flex items-center gap-2 text-sm font-black"><MessageCircle size={17} className="text-orange-200" /> ¿Prefieres que la montemos por ti?</p>
            <h2 className="mt-3 text-3xl font-black">Nos mandas la carta y la dejamos lista</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-white/70">Durante lanzamiento, el montaje inicial puede ir incluido en trimestral y anual. Ideal para restaurantes que no quieren pelearse con tecnología.</p>
            <Link href="/montaje" className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-[#221812]">Ver montaje asistido</Link>
          </div>
          <SetupRequestForm compact />
        </div>

        <div className="mt-8 space-y-4">
          {restaurants.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-[#d7c7b2] bg-white/70 p-8 text-center">
              <Wand2 className="mx-auto text-[#e85d04]" />
              <h2 className="mt-3 text-2xl font-black">Todavía no tienes cartas</h2>
              <p className="mt-2 text-sm font-semibold text-[#6b594a]">Crea una carta desde la demo base y edítala en el builder.</p>
            </div>
          ) : restaurants.map((restaurant) => {
            const path = restaurant.is_proposal || restaurant.status === "proposal" ? `/propuesta/${restaurant.slug}` : buildPublicPath(restaurant.slug);
            const publicUrl = origin ? `${origin}${path}` : path;
            const plan = getPlanConfig(restaurant.selected_plan || restaurant.plan || "free");
            return (
              <article key={restaurant.id} className="grid gap-4 rounded-[2rem] border border-[#eadfce] bg-white p-5 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.3rem] bg-[#fff3e3] text-[#e85d04]"><Store size={22} /></div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-black">{restaurant.name}</h2>
                      <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${restaurant.status === "published" ? "bg-[#e7f7ed] text-[#166534]" : "bg-[#fff3e3] text-[#a3581c]"}`}>{restaurant.status === "published" ? "Publicada" : "Borrador"}</span>
                      <span className="rounded-full bg-[#f7efe4] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#6b594a]">{plan.name}</span>
                      {restaurant.trial_type === "one-euro" ? <span className="rounded-full bg-[#fff1df] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#a3581c]">1 € primer mes · después {plan.monthlyPrice} €/mes</span> : null}
                    </div>
                    <p className="mt-1 break-all text-sm font-semibold text-[#6b594a]">{publicUrl}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href={`/builder/${restaurant.id}`} className="rounded-full bg-[#221812] px-4 py-2 text-sm font-black text-white">Editar</Link>
                  <Link href={path} className="inline-flex items-center gap-2 rounded-full border border-[#d9cbb8] bg-white px-4 py-2 text-sm font-black"><ExternalLink size={16} /> {restaurant.is_proposal || restaurant.status === "proposal" ? "Ver propuesta" : "Ver carta"}</Link>
                  <button onClick={() => copy(publicUrl)} className="inline-flex items-center gap-2 rounded-full border border-[#d9cbb8] bg-white px-4 py-2 text-sm font-black"><Copy size={16} /> Copiar</button>
                  <button onClick={() => createProposal(restaurant.id)} disabled={Boolean(actionLoading)} className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-[#fff4e8] px-4 py-2 text-sm font-black text-[#a3581c] disabled:opacity-60"><Languages size={16} /> Propuesta</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
