-- ============================================================
-- MesaCarta v2 · Migración: Mini landing + sweet-cafe + renombrado Pro → Web
-- Ejecutar en Supabase > SQL Editor
-- Es seguro reejecutar: usa IF NOT EXISTS y ADD COLUMN IF NOT EXISTS
-- ============================================================

-- 1. Tabla restaurant_landing_settings
-- Separada de restaurants para mantener limpieza y escalabilidad.
-- Relación 1:1 con restaurants (unique restaurant_id).

create table if not exists public.restaurant_landing_settings (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null unique references public.restaurants(id) on delete cascade,
  enabled boolean not null default false,
  hero_title text default '',
  hero_subtitle text default '',
  story_title text default '',
  story_text text default '',
  gallery_images text[] not null default '{}',
  featured_product_ids text[] not null default '{}',
  reservation_url text default '',
  google_maps_url text default '',
  google_reviews_url text default '',
  seo_title text default '',
  seo_description text default '',
  landing_template text default 'warm',
  primary_cta text default 'Ver carta',
  secondary_cta text default 'Cómo llegar',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger updated_at
drop trigger if exists restaurant_landing_settings_updated_at on public.restaurant_landing_settings;
create trigger restaurant_landing_settings_updated_at
  before update on public.restaurant_landing_settings
  for each row execute function public.set_updated_at();

-- RLS
alter table public.restaurant_landing_settings enable row level security;

drop policy if exists "landing_select_owned_or_published" on public.restaurant_landing_settings;
drop policy if exists "landing_insert_own" on public.restaurant_landing_settings;
drop policy if exists "landing_update_own" on public.restaurant_landing_settings;
drop policy if exists "landing_delete_own" on public.restaurant_landing_settings;

create policy "landing_select_owned_or_published"
  on public.restaurant_landing_settings for select
  using (
    exists (
      select 1 from public.restaurants r
      where r.id = restaurant_landing_settings.restaurant_id
      and (r.owner_id = auth.uid() or r.status = 'published' or r.is_proposal = true)
    )
  );

create policy "landing_insert_own"
  on public.restaurant_landing_settings for insert
  with check (
    exists (
      select 1 from public.restaurants r
      where r.id = restaurant_landing_settings.restaurant_id
      and r.owner_id = auth.uid()
    )
  );

create policy "landing_update_own"
  on public.restaurant_landing_settings for update
  using (
    exists (
      select 1 from public.restaurants r
      where r.id = restaurant_landing_settings.restaurant_id
      and r.owner_id = auth.uid()
    )
  );

create policy "landing_delete_own"
  on public.restaurant_landing_settings for delete
  using (
    exists (
      select 1 from public.restaurants r
      where r.id = restaurant_landing_settings.restaurant_id
      and r.owner_id = auth.uid()
    )
  );

-- 2. Actualizar check de template para incluir sweet-cafe
alter table public.restaurants drop constraint if exists restaurants_template_check;
alter table public.restaurants add constraint restaurants_template_check
  check (template in ('visual', 'elegant', 'compact', 'dark-premium', 'mediterranean', 'sweet-cafe'));

-- 3. Campo de tipo de negocio si no existe
alter table public.restaurants add column if not exists business_type text default 'Restaurante'
  check (business_type in ('Restaurante', 'Bar', 'Cafetería', 'Brunch', 'Tapas', 'Otro'));

-- 4. Índices útiles para landing
create index if not exists idx_restaurant_landing_restaurant_id
  on public.restaurant_landing_settings(restaurant_id);

-- ============================================================
-- NOTAS PARA EL DEVELOPER
-- ============================================================
-- • El plan "restaurant-pro" en BD mantiene su ID. Solo cambia el nombre
--   en UI/copy: "Restaurante Pro" → "Restaurante Web". No hay cambio en BD.
--
-- • La tabla restaurant_landing_settings se lee/escribe desde:
--   lib/supabase/queries.ts → loadRestaurantState / saveRestaurantState
--   (hay que actualizar los mappers para incluir landing data)
--
-- • gallery_images es text[] con URLs públicas de Supabase Storage.
--   Límite por plan: free=0, menu-day=0, carta-visual=5, restaurant-pro=15
--   Este límite se valida en el frontend (LandingEditor) y en plan-config.ts
--
-- • featured_product_ids es text[] con IDs de productos existentes.
--   Se valida en el frontend (LandingEditor). Máximo 6.
--
-- • La ruta /restaurante/[slug] o /r/[slug] es opcional para la miniweb.
--   Por ahora, la miniweb puede vivir en /carta/[slug]?view=web
--   sin romper la carta QR actual.
