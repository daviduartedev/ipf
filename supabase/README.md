# Supabase

1. Crie um projeto em [Supabase](https://supabase.com).
2. Copie `.env.example` para `.env` na raiz do repositório e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
3. No **SQL Editor**, execute o ficheiro `migrations/20260419120000_posts_and_storage.sql` (ou use a CLI `supabase db push` se tiver o projeto ligado).
4. Em **Authentication → Users**, crie um utilizador com e-mail e palavra-passe para o operador do painel (`/adminipf`).
5. Para a migração única a partir de `public/posts.json`, use `npm run migrate:posts` com `SUPABASE_SERVICE_ROLE_KEY` definido no ambiente (não commite esta chave).
