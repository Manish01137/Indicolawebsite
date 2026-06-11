-- ─────────────────────────────────────────────────────────────────────
-- IndiColas Reviews — Supabase Schema
-- Paste this into:  Supabase Dashboard → SQL Editor → New Query → Run
-- ─────────────────────────────────────────────────────────────────────

-- 1. The reviews table
create table if not exists public.reviews (
  id           uuid          default gen_random_uuid() primary key,
  name         text          not null,
  email        text,
  rating       int           not null check (rating between 1 and 5),
  title        text,
  body         text          not null,
  flavor_slug  text,                                  -- null = brand-wide review
  location     text,
  is_published boolean       default true,
  is_featured  boolean       default false,
  honeypot     text,                                  -- anti-spam (must be empty)
  created_at   timestamptz   default now()
);

create index if not exists reviews_created_at_idx on public.reviews (created_at desc);
create index if not exists reviews_flavor_slug_idx on public.reviews (flavor_slug);
create index if not exists reviews_is_published_idx on public.reviews (is_published);

-- 2. Enable Row Level Security
alter table public.reviews enable row level security;

-- 3. Policies

-- Anyone (logged in or not) can read PUBLISHED reviews
drop policy if exists "anyone can read published reviews" on public.reviews;
create policy "anyone can read published reviews"
  on public.reviews for select
  to anon, authenticated
  using (is_published = true);

-- Authenticated admins can read ALL reviews (including hidden)
drop policy if exists "admin can read all reviews" on public.reviews;
create policy "admin can read all reviews"
  on public.reviews for select
  to authenticated
  using (true);

-- Anyone can submit a review — honeypot must be empty
drop policy if exists "anyone can submit reviews" on public.reviews;
create policy "anyone can submit reviews"
  on public.reviews for insert
  to anon, authenticated
  with check (
    coalesce(honeypot, '') = ''
    and length(name) between 1 and 80
    and length(body) between 4 and 2000
    and rating between 1 and 5
  );

-- Only authenticated users (you, the admin) can update
drop policy if exists "admin can update" on public.reviews;
create policy "admin can update"
  on public.reviews for update
  to authenticated
  using (true)
  with check (true);

-- Only authenticated users can delete
drop policy if exists "admin can delete" on public.reviews;
create policy "admin can delete"
  on public.reviews for delete
  to authenticated
  using (true);

-- 4. Real-time subscriptions (live updates on the wall)
alter publication supabase_realtime add table public.reviews;
