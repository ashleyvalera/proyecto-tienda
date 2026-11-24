-- ============================================================================
-- La casita de Mathi · Esquema de Base de Datos (Supabase / PostgreSQL)
-- ============================================================================

create extension if not exists "pgcrypto";

-- 1. Productos del catálogo
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('fundas', 'protectores', 'cables', 'cargadores', 'audifonos')),
  subtype text not null,
  brand text not null default 'Universal',
  device_model text,
  price numeric(10, 2), -- NULL significa "Consultar precio"
  compare_at_price numeric(10, 2),
  supports_mica_addon boolean not null default false,
  mica_addon_price numeric(10, 2) not null default 10,
  image_url text not null,
  swatches jsonb not null default '[]'::jsonb,
  rating numeric(2, 1) not null default 4.8 check (rating >= 0 and rating <= 5),
  review_count integer not null default 12 check (review_count >= 0),
  featured boolean not null default false,
  badge text,
  in_stock boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_brand on public.products (brand);
create index if not exists idx_products_featured on public.products (featured) where featured = true;

-- 2. Pedidos coordinados desde el carrito / catálogo
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  device_model text,
  notes text,
  items jsonb not null,
  total_amount numeric(10, 2) not null default 0,
  has_quote_items boolean not null default false,
  status text not null default 'pending_whatsapp' check (status in ('pending_whatsapp', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- 3. Consultas rápidas desde el Home / Contacto
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  device_model text,
  message text not null,
  source text not null default 'footer_quick_form',
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.inquiries enable row level security;

-- Catálogo público de solo lectura
drop policy if exists "Productos visibles al público" on public.products;
create policy "Productos visibles al público"
  on public.products
  for select
  to anon, authenticated
  using (in_stock = true);

-- Cualquier visitante puede registrar su pedido antes de abrir WhatsApp
drop policy if exists "Visitantes pueden crear pedidos" on public.orders;
create policy "Visitantes pueden crear pedidos"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);

-- Cualquier visitante puede enviar una consulta rápida
drop policy if exists "Visitantes pueden enviar consultas" on public.inquiries;
create policy "Visitantes pueden enviar consultas"
  on public.inquiries
  for insert
  to anon, authenticated
  with check (true);
