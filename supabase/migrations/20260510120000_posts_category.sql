-- Ciclo 2: categoria editorial (ex.: LIVE)
alter table public.posts
  add column if not exists category text not null default 'standard';

alter table public.posts
  drop constraint if exists posts_category_check;

alter table public.posts
  add constraint posts_category_check
  check (category in ('standard', 'live'));

comment on column public.posts.category is 'Editorial category: standard | live';
