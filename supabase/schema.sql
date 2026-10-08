-- Jalankan sekali di Supabase: SQL Editor -> New query -> Run.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  whatsapp text not null,
  branch text not null,
  payment_method text not null,
  note text,
  items jsonb not null,
  total integer not null
);

alter table public.orders enable row level security;

-- Customer (anon) hanya boleh INSERT order.
drop policy if exists "anon insert orders" on public.orders;
create policy "anon insert orders"
  on public.orders for insert
  to anon
  with check (true);

-- Hanya admin yang sudah login (authenticated) boleh membaca order.
drop policy if exists "admin read orders" on public.orders;
create policy "admin read orders"
  on public.orders for select
  to authenticated
  using (true);
