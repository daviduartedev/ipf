# Tasks — Painel admin de postagens

## Especificação

- [x] Atualizar `spec/` (hub + `spec/features/admin-posts/`) se o desenho mudar durante a implementação.

## Supabase

- [x] Criar projeto Supabase e variáveis de ambiente no Vite (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- [x] Definir tabela `posts` (UUID, slug único, título, excerpt, content, image path/url, status draft/published, published_at, updated_at, sort_order).
- [x] Configurar bucket de storage para imagens (JPEG/PNG, limite 5 MB) e políticas alinhadas ao modelo de acesso.
- [x] Configurar RLS: leitura pública só de posts publicados; escrita apenas para utilizador autenticado do operador.
- [x] Criar utilizador Auth para o cliente (e-mail/palavra-passe) e documentar entrega segura das credenciais.

## Aplicação React

- [x] Adicionar cliente Supabase e camada de dados (posts + upload).
- [x] Implementar rota **`/adminipf`**: login, lista, criar/editar, eliminar, reordenar, rascunho vs publicado; após guardar com sucesso, **voltar à lista** (comportamento padrão).
- [x] Atualizar `Home` para carregar posts publicados ordenados; exibir título, **data**, imagem e **resumo curto**.
- [x] Atualizar rota de detalhe para **`/post/:slug`** e página `Post` para resolver por slug; mostrar conteúdo completo e datas.
- [x] Garantir `Layout`/rotas: sem link público para o painel; meta **noindex** na rota admin.
- [x] Migração única: importar conteúdo de `posts.json` para Supabase (imagens já em `public/` ou copiadas para storage).

## Qualidade

- [x] `npm run lint` sem erros nas áreas tocadas.
- [x] Testes automatizados necessários (unitários para slug/datas/validação de imagem; e2e se adotado no projeto).
- [ ] Verificação manual: criar rascunho, publicar, reordenar, editar, apagar; home e detalhe consistentes.

## Entrega ao cliente

- [x] Enviar apenas o URL `https://<domínio>/adminipf` e credenciais por canal seguro; não incluir o painel no menu público.
