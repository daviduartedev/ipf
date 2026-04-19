# Plan — Painel admin de postagens (delta)

## Estado atual (baseline)

- Posts vêm de `public/posts.json` carregado no cliente.
- Home lista cartões com imagem, título e `excerpt`; não há data visível.
- Detalhe em `/post/:id` usa `id` estável (`post1`, …) e corpo em texto simples com quebras de linha.
- Não há autenticação nem painel administrativo.

## Estado desejado (este ciclo)

### Produto

- Rota administrativa **`/adminipf`** (link não divulgado no site; envio manual ao cliente).
- Operador **único** (conta dedicada ao cliente); instruções de acesso documentadas em `spec/features/admin-posts/readme.md`.
- CRUD completo de postagens, **incluindo ordenação manual** da lista (ordem explícita persistida).
- Cada post mantém um **resumo curto** (uma frase, chamativo) além de título, conteúdo e imagem.
- Página de detalhe continua exibindo o **conteúdo completo**; passa a incluir **datas de publicação e de atualização** quando aplicável.
- **Rascunhos**: posts podem existir sem aparecer na home até serem publicados.
- Após **guardar** criação ou edição com sucesso, o painel **volta à lista** de postagens (fluxo padrão).

### Identificadores e URLs

- **Chave primária**: UUID (gerado pelo banco).
- **Slug canônico** para URL pública: derivado do título (normalizado), **único**, ajustável no admin se necessário.
- Rota pública de detalhe: **`/post/:slug`** (substitui o uso de `post1`-style ids na navegação).

### Dados e integração

- **Backend**: Supabase (Postgres + Storage + Auth), alinhado ao pedido de “jeito mais fácil” com persistência real e upload de imagens.
- **Leitura pública**: a home e o detalhe consomem dados via **cliente Supabase com chave anon** e **RLS** (apenas posts publicados, leitura pública).
- **Escrita / upload**: apenas utilizador **autenticado** (conta do cliente) com políticas restritas.

### Imagens

- Formatos permitidos: **JPEG e PNG** apenas.
- Regra de negócio: tamanho máximo por ficheiro **5 MB**; validação no cliente e reforço no storage (MIME/tipo).

### Conteúdo e datas

- Corpo do post: **texto simples** com quebras de linha como hoje (sem editor rico neste ciclo).
- **Data de publicação** e **data de última atualização** mantidas; timezone **America/Sao_Paulo**; apresentação em **pt-BR**.

### Segurança

- Autenticação: **Supabase Auth** com e-mail e palavra-passe (abordagem simples e suportada).
- Painel sem ligação na navegação pública; página admin com **noindex** (não substitui controlo de acesso — a sessão autenticada é obrigatória).

### Testes e rollout

- Testes automatizados **onde o risco é maior**: p.ex. utilitários de slug/data, e fluxos críticos com testes de integração/e2e conforme viabilidade no repo.
- Migração dos posts existentes de `posts.json` para Supabase como passo de implantação (preservando conteúdo e imagens).

## Fora de escopo (outros ciclos)

- Editor rico, comentários, SEO avançado, múltiplos autores com papéis granulares.
