-- MesaCarta / Carta digital MVP
-- Ejecuta este SQL en Supabase > SQL Editor.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text default '',
  logo_url text default '',
  cover_url text default '',
  whatsapp text default '',
  phone text default '',
  address text default '',
  instagram text default '',
  schedule text default '',
  template text not null default 'visual' check (template in ('visual', 'elegant', 'compact', 'dark-premium', 'mediterranean')),
  primary_color text not null default '#e85d04',
  plan text not null default 'free' check (plan in ('free', 'menu-day', 'carta-visual', 'restaurant-pro')),
  selected_plan text not null default 'free' check (selected_plan in ('free', 'menu-day', 'carta-visual', 'restaurant-pro')),
  trial_type text null check (trial_type is null or trial_type in ('one-euro')),
  trial_started_at timestamptz null,
  trial_ends_at timestamptz null,
  discount_expires_at timestamptz null,
  discount_used boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- Columnas comerciales preparadas para pruebas y descuentos. Seguras al reejecutar el SQL en proyectos existentes.
alter table public.restaurants add column if not exists selected_plan text not null default 'free';
alter table public.restaurants add column if not exists trial_type text null;
alter table public.restaurants add column if not exists trial_started_at timestamptz null;
alter table public.restaurants add column if not exists trial_ends_at timestamptz null;
alter table public.restaurants add column if not exists discount_expires_at timestamptz null;
alter table public.restaurants add column if not exists discount_used boolean not null default false;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  group_name text not null default 'comida' check (group_name in ('comida', 'bebidas', 'vinos', 'desayunos', 'cocteles', 'menu-dia')),
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  description text default '',
  price text default '',
  image_url text default '',
  status text not null default 'active' check (status in ('active', 'soldout', 'hidden')),
  tags text[] not null default '{}',
  allergens text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_menus (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null unique references public.restaurants(id) on delete cascade,
  enabled boolean not null default true,
  title text default 'Menú del día',
  price text default '',
  availability text default '',
  schedule text default '',
  starters text[] not null default '{}',
  mains text[] not null default '{}',
  desserts text[] not null default '{}',
  drink_included boolean not null default true,
  note text default '',
  show_images boolean not null default false,
  cover_image text default '',
  starters_image text default '',
  mains_image text default '',
  desserts_image text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_updated_at on public.profiles;
drop trigger if exists restaurants_updated_at on public.restaurants;
drop trigger if exists categories_updated_at on public.categories;
drop trigger if exists products_updated_at on public.products;
drop trigger if exists daily_menus_updated_at on public.daily_menus;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger restaurants_updated_at before update on public.restaurants for each row execute function public.set_updated_at();
create trigger categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger daily_menus_updated_at before update on public.daily_menus for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.daily_menus enable row level security;

-- Limpia políticas previas si reejecutas el SQL.
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "restaurants_select_own" on public.restaurants;
drop policy if exists "restaurants_select_published" on public.restaurants;
drop policy if exists "restaurants_insert_own" on public.restaurants;
drop policy if exists "restaurants_update_own" on public.restaurants;
drop policy if exists "restaurants_delete_own" on public.restaurants;
drop policy if exists "categories_select_owned_or_published" on public.categories;
drop policy if exists "categories_insert_own" on public.categories;
drop policy if exists "categories_update_own" on public.categories;
drop policy if exists "categories_delete_own" on public.categories;
drop policy if exists "products_select_owned_or_published" on public.products;
drop policy if exists "products_insert_own" on public.products;
drop policy if exists "products_update_own" on public.products;
drop policy if exists "products_delete_own" on public.products;
drop policy if exists "daily_menus_select_owned_or_published" on public.daily_menus;
drop policy if exists "daily_menus_insert_own" on public.daily_menus;
drop policy if exists "daily_menus_update_own" on public.daily_menus;
drop policy if exists "daily_menus_delete_own" on public.daily_menus;

create policy "profiles_select_own" on public.profiles for select using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles for insert with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "restaurants_select_own" on public.restaurants for select using (owner_id = auth.uid());
create policy "restaurants_select_published" on public.restaurants for select using (status = 'published');
create policy "restaurants_insert_own" on public.restaurants for insert with check (owner_id = auth.uid());
create policy "restaurants_update_own" on public.restaurants for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "restaurants_delete_own" on public.restaurants for delete using (owner_id = auth.uid());

create policy "categories_select_owned_or_published" on public.categories for select using (
  exists (
    select 1 from public.restaurants r
    where r.id = categories.restaurant_id
    and (r.owner_id = auth.uid() or r.status = 'published')
  )
);
create policy "categories_insert_own" on public.categories for insert with check (
  exists (select 1 from public.restaurants r where r.id = categories.restaurant_id and r.owner_id = auth.uid())
);
create policy "categories_update_own" on public.categories for update using (
  exists (select 1 from public.restaurants r where r.id = categories.restaurant_id and r.owner_id = auth.uid())
) with check (
  exists (select 1 from public.restaurants r where r.id = categories.restaurant_id and r.owner_id = auth.uid())
);
create policy "categories_delete_own" on public.categories for delete using (
  exists (select 1 from public.restaurants r where r.id = categories.restaurant_id and r.owner_id = auth.uid())
);

create policy "products_select_owned_or_published" on public.products for select using (
  exists (
    select 1 from public.restaurants r
    where r.id = products.restaurant_id
    and (r.owner_id = auth.uid() or r.status = 'published')
  )
);
create policy "products_insert_own" on public.products for insert with check (
  exists (select 1 from public.restaurants r where r.id = products.restaurant_id and r.owner_id = auth.uid())
);
create policy "products_update_own" on public.products for update using (
  exists (select 1 from public.restaurants r where r.id = products.restaurant_id and r.owner_id = auth.uid())
) with check (
  exists (select 1 from public.restaurants r where r.id = products.restaurant_id and r.owner_id = auth.uid())
);
create policy "products_delete_own" on public.products for delete using (
  exists (select 1 from public.restaurants r where r.id = products.restaurant_id and r.owner_id = auth.uid())
);

create policy "daily_menus_select_owned_or_published" on public.daily_menus for select using (
  exists (
    select 1 from public.restaurants r
    where r.id = daily_menus.restaurant_id
    and (r.owner_id = auth.uid() or r.status = 'published')
  )
);
create policy "daily_menus_insert_own" on public.daily_menus for insert with check (
  exists (select 1 from public.restaurants r where r.id = daily_menus.restaurant_id and r.owner_id = auth.uid())
);
create policy "daily_menus_update_own" on public.daily_menus for update using (
  exists (select 1 from public.restaurants r where r.id = daily_menus.restaurant_id and r.owner_id = auth.uid())
) with check (
  exists (select 1 from public.restaurants r where r.id = daily_menus.restaurant_id and r.owner_id = auth.uid())
);
create policy "daily_menus_delete_own" on public.daily_menus for delete using (
  exists (select 1 from public.restaurants r where r.id = daily_menus.restaurant_id and r.owner_id = auth.uid())
);

-- Preparado para fase fotos reales, si luego quieres activar Supabase Storage:
-- insert into storage.buckets (id, name, public) values ('restaurant-images', 'restaurant-images', true)
-- on conflict (id) do nothing;

-- Supabase Storage para fotos reales de la carta.
-- Bucket público: la carta pública necesita poder mostrar imágenes sin login.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'menu-images',
  'menu-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Limpia políticas de Storage si reejecutas el SQL.
drop policy if exists "menu_images_public_read" on storage.objects;
drop policy if exists "menu_images_insert_own_folder" on storage.objects;
drop policy if exists "menu_images_update_own_folder" on storage.objects;
drop policy if exists "menu_images_delete_own_folder" on storage.objects;

-- Cualquiera puede ver imágenes publicadas del bucket.
create policy "menu_images_public_read"
on storage.objects for select
using (bucket_id = 'menu-images');

-- Cada usuario autenticado solo puede subir dentro de su carpeta /userId/...
create policy "menu_images_insert_own_folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'menu-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "menu_images_update_own_folder"
on storage.objects for update
to authenticated
using (
  bucket_id = 'menu-images'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'menu-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "menu_images_delete_own_folder"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'menu-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Fase beta: Stripe, propuestas, idiomas y tutorial.
alter table public.profiles add column if not exists stripe_customer_id text;
alter table public.profiles add column if not exists stripe_subscription_id text;
alter table public.profiles add column if not exists subscription_status text default 'free';
alter table public.profiles add column if not exists current_period_end timestamptz;
alter table public.profiles add column if not exists selected_plan text default 'free';
alter table public.profiles add column if not exists billing_interval text;
alter table public.profiles add column if not exists trial_type text;
alter table public.profiles add column if not exists trial_started_at timestamptz;
alter table public.profiles add column if not exists trial_ends_at timestamptz;
alter table public.profiles add column if not exists discount_expires_at timestamptz;
alter table public.profiles add column if not exists discount_used boolean default false;
alter table public.profiles add column if not exists tutorial_completed boolean default false;
alter table public.profiles add column if not exists tutorial_completed_at timestamptz;
alter table public.profiles add column if not exists tutorial_last_step text;

alter table public.restaurants add column if not exists proposal_token text;
alter table public.restaurants add column if not exists proposal_expires_at timestamptz;
alter table public.restaurants add column if not exists watermark_enabled boolean not null default true;
alter table public.restaurants add column if not exists claimed_by uuid references auth.users(id) on delete set null;
alter table public.restaurants add column if not exists is_proposal boolean not null default false;
alter table public.restaurants add column if not exists stripe_customer_id text;
alter table public.restaurants add column if not exists stripe_subscription_id text;
alter table public.restaurants add column if not exists subscription_status text;
alter table public.restaurants add column if not exists current_period_end timestamptz;
alter table public.restaurants add column if not exists billing_interval text;

alter table public.restaurants drop constraint if exists restaurants_status_check;
alter table public.restaurants add constraint restaurants_status_check check (status in ('draft', 'demo', 'proposal', 'published'));

create table if not exists public.restaurant_translations (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  language text not null check (language in ('en', 'fr', 'de', 'it', 'pt')),
  description text default '',
  schedule text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, language)
);

create table if not exists public.category_translations (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  language text not null check (language in ('en', 'fr', 'de', 'it', 'pt')),
  name text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, language)
);

create table if not exists public.product_translations (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  language text not null check (language in ('en', 'fr', 'de', 'it', 'pt')),
  name text default '',
  description text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, language)
);

create table if not exists public.daily_menu_translations (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  daily_menu_id uuid references public.daily_menus(id) on delete cascade,
  language text not null check (language in ('en', 'fr', 'de', 'it', 'pt')),
  title text default '',
  starters text[] not null default '{}',
  mains text[] not null default '{}',
  desserts text[] not null default '{}',
  note text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, language)
);

alter table public.restaurant_translations enable row level security;
alter table public.category_translations enable row level security;
alter table public.product_translations enable row level security;
alter table public.daily_menu_translations enable row level security;

drop trigger if exists restaurant_translations_updated_at on public.restaurant_translations;
drop trigger if exists category_translations_updated_at on public.category_translations;
drop trigger if exists product_translations_updated_at on public.product_translations;
drop trigger if exists daily_menu_translations_updated_at on public.daily_menu_translations;
create trigger restaurant_translations_updated_at before update on public.restaurant_translations for each row execute function public.set_updated_at();
create trigger category_translations_updated_at before update on public.category_translations for each row execute function public.set_updated_at();
create trigger product_translations_updated_at before update on public.product_translations for each row execute function public.set_updated_at();
create trigger daily_menu_translations_updated_at before update on public.daily_menu_translations for each row execute function public.set_updated_at();

drop policy if exists "restaurants_select_published" on public.restaurants;
create policy "restaurants_select_published" on public.restaurants for select using (status = 'published' or is_proposal = true or status = 'proposal');

drop policy if exists "translations_select_owned_or_public" on public.restaurant_translations;
drop policy if exists "translations_insert_own" on public.restaurant_translations;
drop policy if exists "translations_update_own" on public.restaurant_translations;
drop policy if exists "translations_delete_own" on public.restaurant_translations;
create policy "translations_select_owned_or_public" on public.restaurant_translations for select using (exists (select 1 from public.restaurants r where r.id = restaurant_translations.restaurant_id and (r.owner_id = auth.uid() or r.status = 'published' or r.is_proposal = true)));
create policy "translations_insert_own" on public.restaurant_translations for insert with check (exists (select 1 from public.restaurants r where r.id = restaurant_translations.restaurant_id and r.owner_id = auth.uid()));
create policy "translations_update_own" on public.restaurant_translations for update using (exists (select 1 from public.restaurants r where r.id = restaurant_translations.restaurant_id and r.owner_id = auth.uid())) with check (exists (select 1 from public.restaurants r where r.id = restaurant_translations.restaurant_id and r.owner_id = auth.uid()));
create policy "translations_delete_own" on public.restaurant_translations for delete using (exists (select 1 from public.restaurants r where r.id = restaurant_translations.restaurant_id and r.owner_id = auth.uid()));

drop policy if exists "category_translations_select_owned_or_public" on public.category_translations;
drop policy if exists "category_translations_insert_own" on public.category_translations;
drop policy if exists "category_translations_update_own" on public.category_translations;
drop policy if exists "category_translations_delete_own" on public.category_translations;
create policy "category_translations_select_owned_or_public" on public.category_translations for select using (exists (select 1 from public.restaurants r where r.id = category_translations.restaurant_id and (r.owner_id = auth.uid() or r.status = 'published' or r.is_proposal = true)));
create policy "category_translations_insert_own" on public.category_translations for insert with check (exists (select 1 from public.restaurants r where r.id = category_translations.restaurant_id and r.owner_id = auth.uid()));
create policy "category_translations_update_own" on public.category_translations for update using (exists (select 1 from public.restaurants r where r.id = category_translations.restaurant_id and r.owner_id = auth.uid())) with check (exists (select 1 from public.restaurants r where r.id = category_translations.restaurant_id and r.owner_id = auth.uid()));
create policy "category_translations_delete_own" on public.category_translations for delete using (exists (select 1 from public.restaurants r where r.id = category_translations.restaurant_id and r.owner_id = auth.uid()));

drop policy if exists "product_translations_select_owned_or_public" on public.product_translations;
drop policy if exists "product_translations_insert_own" on public.product_translations;
drop policy if exists "product_translations_update_own" on public.product_translations;
drop policy if exists "product_translations_delete_own" on public.product_translations;
create policy "product_translations_select_owned_or_public" on public.product_translations for select using (exists (select 1 from public.restaurants r where r.id = product_translations.restaurant_id and (r.owner_id = auth.uid() or r.status = 'published' or r.is_proposal = true)));
create policy "product_translations_insert_own" on public.product_translations for insert with check (exists (select 1 from public.restaurants r where r.id = product_translations.restaurant_id and r.owner_id = auth.uid()));
create policy "product_translations_update_own" on public.product_translations for update using (exists (select 1 from public.restaurants r where r.id = product_translations.restaurant_id and r.owner_id = auth.uid())) with check (exists (select 1 from public.restaurants r where r.id = product_translations.restaurant_id and r.owner_id = auth.uid()));
create policy "product_translations_delete_own" on public.product_translations for delete using (exists (select 1 from public.restaurants r where r.id = product_translations.restaurant_id and r.owner_id = auth.uid()));

drop policy if exists "daily_menu_translations_select_owned_or_public" on public.daily_menu_translations;
drop policy if exists "daily_menu_translations_insert_own" on public.daily_menu_translations;
drop policy if exists "daily_menu_translations_update_own" on public.daily_menu_translations;
drop policy if exists "daily_menu_translations_delete_own" on public.daily_menu_translations;
create policy "daily_menu_translations_select_owned_or_public" on public.daily_menu_translations for select using (exists (select 1 from public.restaurants r where r.id = daily_menu_translations.restaurant_id and (r.owner_id = auth.uid() or r.status = 'published' or r.is_proposal = true)));
create policy "daily_menu_translations_insert_own" on public.daily_menu_translations for insert with check (exists (select 1 from public.restaurants r where r.id = daily_menu_translations.restaurant_id and r.owner_id = auth.uid()));
create policy "daily_menu_translations_update_own" on public.daily_menu_translations for update using (exists (select 1 from public.restaurants r where r.id = daily_menu_translations.restaurant_id and r.owner_id = auth.uid())) with check (exists (select 1 from public.restaurants r where r.id = daily_menu_translations.restaurant_id and r.owner_id = auth.uid()));
create policy "daily_menu_translations_delete_own" on public.daily_menu_translations for delete using (exists (select 1 from public.restaurants r where r.id = daily_menu_translations.restaurant_id and r.owner_id = auth.uid()));

-- Permite que categorías/productos/menú sean públicos también para propuestas.
drop policy if exists "categories_select_owned_or_published" on public.categories;
create policy "categories_select_owned_or_published" on public.categories for select using (exists (select 1 from public.restaurants r where r.id = categories.restaurant_id and (r.owner_id = auth.uid() or r.status = 'published' or r.is_proposal = true)));

drop policy if exists "products_select_owned_or_published" on public.products;
create policy "products_select_owned_or_published" on public.products for select using (exists (select 1 from public.restaurants r where r.id = products.restaurant_id and (r.owner_id = auth.uid() or r.status = 'published' or r.is_proposal = true)));

drop policy if exists "daily_menus_select_owned_or_published" on public.daily_menus;
create policy "daily_menus_select_owned_or_published" on public.daily_menus for select using (exists (select 1 from public.restaurants r where r.id = daily_menus.restaurant_id and (r.owner_id = auth.uid() or r.status = 'published' or r.is_proposal = true)));

-- === Fase comercial MesaCarta: trimestral, montaje y menú semanal ===
alter table if exists public.restaurants add column if not exists billing_interval text default 'monthly';
alter table if exists public.restaurants add column if not exists selected_plan text default 'free';
alter table if exists public.restaurants add column if not exists subscription_status text;
alter table if exists public.restaurants add column if not exists stripe_customer_id text;
alter table if exists public.restaurants add column if not exists stripe_subscription_id text;
alter table if exists public.restaurants add column if not exists current_period_end timestamptz;

create table if not exists public.setup_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  restaurant_name text not null,
  contact_name text,
  whatsapp text not null,
  email text,
  city text,
  interested_plan text default 'carta-visual',
  current_menu_url text,
  notes text,
  status text default 'new',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.weekly_menus (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade not null,
  weekday int not null check (weekday >= 0 and weekday <= 6),
  enabled boolean default true,
  title text,
  price text,
  schedule text,
  starters text[],
  mains text[],
  desserts text[],
  drink_included boolean default true,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(restaurant_id, weekday)
);

alter table public.setup_requests enable row level security;
alter table public.weekly_menus enable row level security;

drop policy if exists "setup_requests_insert_anyone" on public.setup_requests;
create policy "setup_requests_insert_anyone" on public.setup_requests for insert with check (true);

drop policy if exists "setup_requests_owner_select" on public.setup_requests;
create policy "setup_requests_owner_select" on public.setup_requests for select using (auth.uid() = user_id);

drop policy if exists "weekly_owner_all" on public.weekly_menus;
create policy "weekly_owner_all" on public.weekly_menus for all using (
  exists (select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = auth.uid())
) with check (
  exists (select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = auth.uid())
);

drop policy if exists "weekly_public_read" on public.weekly_menus;
create policy "weekly_public_read" on public.weekly_menus for select using (
  exists (select 1 from public.restaurants r where r.id = restaurant_id and r.status in ('published','demo','proposal'))
);
