-- ═══════════════════════════════════════════════
--  ShopiSpy — Schéma Supabase
--  À coller dans Supabase > SQL Editor > Run
-- ═══════════════════════════════════════════════

-- Extension UUID
create extension if not exists "uuid-ossp";


-- ── Waitlist ─────────────────────────────────────
create table if not exists public.waitlist (
  id         uuid primary key default uuid_generate_v4(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- N'importe qui peut s'inscrire (insert public)
create policy "waitlist_insert" on public.waitlist
  for insert with check (true);

-- Seuls les admins peuvent lire
create policy "waitlist_select_admin" on public.waitlist
  for select using (auth.jwt() ->> 'role' = 'admin');


-- ── Products (catalogue de veille) ───────────────
create table if not exists public.products (
  id                       uuid primary key default uuid_generate_v4(),
  title                    text not null,
  niche                    text not null,
  price                    numeric(10, 2) not null,
  currency                 char(3) not null default 'EUR',
  saturation_score         smallint not null check (saturation_score between 0 and 100),
  trend_score              smallint not null check (trend_score between 0 and 100),
  monthly_orders_estimate  int not null default 0,
  image_url                text,
  store_url                text,
  tags                     text[] not null default '{}',
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

alter table public.products enable row level security;

-- Tous les membres authentifiés peuvent lire
create policy "products_select_auth" on public.products
  for select using (auth.role() = 'authenticated');


-- ── Cloned products (fiches générées) ────────────
create table if not exists public.cloned_products (
  id                        uuid primary key default uuid_generate_v4(),
  product_id                uuid references public.products(id) on delete set null,
  user_id                   uuid not null references auth.users(id) on delete cascade,
  title                     text,
  hook                      text,
  description               text,
  bullet_points             text[],
  target_audience           text,
  ad_angle                  text,
  seo_keywords              text[],
  suggested_price           numeric(10, 2),
  suggested_price_rationale text,
  created_at                timestamptz not null default now()
);

alter table public.cloned_products enable row level security;

-- Chaque utilisateur ne voit que ses propres fiches
create policy "clones_select_own" on public.cloned_products
  for select using (auth.uid() = user_id);

create policy "clones_insert_own" on public.cloned_products
  for insert with check (auth.uid() = user_id);

create policy "clones_delete_own" on public.cloned_products
  for delete using (auth.uid() = user_id);


-- ── Trigger updated_at ───────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();


-- ── User usage (quota) ───────────────────────────
create table if not exists public.user_usage (
  user_id   uuid references auth.users(id) on delete cascade,
  month     char(7) not null, -- format "YYYY-MM"
  searches  int not null default 0,
  clones    int not null default 0,
  spy_scans int not null default 0,
  primary key (user_id, month)
);

alter table public.user_usage enable row level security;

create policy "usage_own" on public.user_usage
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Permet l'upsert depuis le service role (API routes)
create policy "usage_service" on public.user_usage
  for all using (true)
  with check (true);
