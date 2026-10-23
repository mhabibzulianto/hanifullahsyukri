create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  title text not null,
  topic text,
  tags text[] not null default '{}',
  excerpt text not null default '',
  main_image_url text,
  image_path text,
  content jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (author_id, slug)
);

create or replace function public.set_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;

create trigger posts_set_updated_at
before update on public.posts
for each row
execute function public.set_posts_updated_at();

alter table public.posts enable row level security;

drop policy if exists "Users can read own posts" on public.posts;
create policy "Users can read own posts"
on public.posts
for select
to authenticated
using (auth.uid() = author_id);

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
on public.posts
for select
to anon
using (status = 'published');

drop policy if exists "Users can insert own posts" on public.posts;
create policy "Users can insert own posts"
on public.posts
for insert
to authenticated
with check (auth.uid() = author_id);

drop policy if exists "Users can update own posts" on public.posts;
create policy "Users can update own posts"
on public.posts
for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

drop policy if exists "Users can upload own post images" on storage.objects;
create policy "Users can upload own post images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update own post images" on storage.objects;
create policy "Users can update own post images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Public can read post images" on storage.objects;
create policy "Public can read post images"
on storage.objects
for select
to public
using (bucket_id = 'post-images');

create table if not exists public.homepage_settings (
  id text primary key default 'main',
  featured_post_id uuid references public.posts(id) on delete set null,
  quote_text text not null default 'Tulisan yang baik tidak hanya selesai dibaca. Ia tinggal lebih lama di dalam cara kita melihat hidup.',
  quote_reference text not null default 'Hanifullah Syukri — Catatan Editorial',
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.homepage_settings enable row level security;

drop policy if exists "Public can read homepage settings" on public.homepage_settings;
create policy "Public can read homepage settings"
on public.homepage_settings
for select
to public
using (true);

drop policy if exists "Authenticated users can manage homepage settings" on public.homepage_settings;
create policy "Authenticated users can manage homepage settings"
on public.homepage_settings
for all
to authenticated
using (true)
with check (true);

insert into public.homepage_settings (id)
values ('main')
on conflict (id) do nothing;
