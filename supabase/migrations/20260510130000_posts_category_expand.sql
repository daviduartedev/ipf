-- Expandir categorias editoriais (reviews, eventos, entrevistas)
-- Executar depois de 20260510120000_posts_category.sql

alter table public.posts
  drop constraint if exists posts_category_check;

alter table public.posts
  add constraint posts_category_check
  check (
    category in (
      'standard',
      'live',
      'launch_review',
      'classic_review',
      'event_coverage',
      'interview'
    )
  );

comment on column public.posts.category is
  'Editorial: standard | live | launch_review | classic_review | event_coverage | interview';
