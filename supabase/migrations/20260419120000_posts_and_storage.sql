-- Posts + Storage for IPF admin (apply via Supabase SQL editor or `supabase db push`)

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  image_path text not null,
  status text not null check (status in ('draft', 'published')),
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  sort_order integer not null default 0
);

create index if not exists posts_status_sort_idx on public.posts (status, sort_order);

create or replace function public.posts_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row
  execute procedure public.posts_set_updated_at();

alter table public.posts enable row level security;

-- Public (anon): only published rows
create policy "posts_anon_select_published"
  on public.posts
  for select
  to anon
  using (status = 'published');

-- Authenticated: full read (drafts + published)
create policy "posts_auth_select_all"
  on public.posts
  for select
  to authenticated
  using (true);

create policy "posts_auth_insert"
  on public.posts
  for insert
  to authenticated
  with check (true);

create policy "posts_auth_update"
  on public.posts
  for update
  to authenticated
  using (true)
  with check (true);

create policy "posts_auth_delete"
  on public.posts
  for delete
  to authenticated
  using (true);

-- Storage bucket (5 MB, JPEG/PNG)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  true,
  5242880,
  array['image/jpeg', 'image/png']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Objects: public read
create policy "post_images_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'post-images');

create policy "post_images_auth_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'post-images');

create policy "post_images_auth_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'post-images')
  with check (bucket_id = 'post-images');

create policy "post_images_auth_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'post-images');
