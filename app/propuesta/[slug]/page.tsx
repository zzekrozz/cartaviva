import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { PublicMenuView } from "@/components/cartaviva/PublicMenuView";
import { loadProposalRestaurantBySlug } from "@/lib/supabase/queries";
import { defaultCartaVivaState } from "@/lib/cartaviva-data";

function publicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
}

export default async function ProposalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = publicSupabase();
  let data = defaultCartaVivaState;
  if (supabase) {
    const loaded = await loadProposalRestaurantBySlug(supabase, slug).catch(() => null);
    if (!loaded) notFound();
    data = loaded;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const publicUrl = `${appUrl}/propuesta/${slug}`;

  return <PublicMenuView data={data} publicUrl={publicUrl} showBranding proposal />;
}
