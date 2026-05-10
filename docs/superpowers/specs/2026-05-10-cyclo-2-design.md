# Ciclo 2 — Posts (Markdown, links, LIVE), NUKE DB (`titulo`, tipo `live`, coluna Tipo)

## Resumo

Este ciclo melhora a criação e apresentação de postagens no admin e no site público (hiperligações inline, espaçamento via Markdown leve, categoria **LIVE**), e alinha a NUKE DB (`/db`) com o campo **`titulo`** (antes `album`), novo tipo de obra **`live`**, e coluna **Tipo** visível na tabela — conforme `public/image.png`.

## Decisões fixadas

| Tema | Decisão |
|------|---------|
| Âmbito | Um único ciclo: posts + NUKE DB + LIVE nos dois domínios |
| LIVE (posts) | Categoria de postagem no modelo de dados + filtro na home **combinável** com busca e período (lógica **E**) |
| LIVE (NUKE DB) | Novo valor de `work_type`: `live`, com rótulo de UI **Live** |
| Formato do conteúdo | **Markdown leve** como texto canónico em `content`; sem CMS completo nem WYSIWYG pesado |
| Ligações no admin | Campo de texto + **helper** (ex.: botão que envolve a selecção em `[texto](url)` ou diálogo equivalente) |
| Links no front | Renderização segura; URLs `http(s)` externas com `target="_blank"` e `rel="noopener noreferrer"` |
| Ordem de entrega | Contrato de dados primeiro (migração Supabase, API), depois UI admin/público, depois NUKE DB |
| Filtro categoria na home | **Dropdown**: «Todas as categorias» (default) \| «LIVE» |

## Análise do conteúdo editorial existente

Os três posts em `public/posts.json` são **texto simples** com parágrafos separados por `\n\n` e **uma linha isolada com URL** (Google Forms) no post «Seja um Revisor». Isto é compatível com Markdown: parágrafos normais; com **remark-gfm**, URLs em linha podem ser tratadas como autolinks na renderização. Não é obrigatório reescrever conteúdo legado para `[texto](url)` neste ciclo.

## Posts — modelo de dados

- Nova coluna `category` em `public.posts`:
  - Tipo: `text` com `check (category in ('standard', 'live'))`
  - Default: `'standard'`
  - `NOT NULL` após backfill implícito pelo default em migração
- `content` permanece `text`; sem nova coluna para formato (convénio: Markdown).

### Retrocompatibilidade

- **Supabase:** linhas existentes recebem `standard` via default da migração.
- **`posts.json` / legacy:** ausência de campo `category` ⇒ tratar como `standard` em `legacyPosts.js` e no mapeamento em `postsApi.js` quando aplicável.

## Posts — admin

- Select **Categoria**: `Padrão` ↔ `standard`, `LIVE` ↔ `live`.
- Área de conteúdo: textarea com **nota curta** sobre Markdown e botão **Inserir hiperligação** (ou equivalente) que facilita `[rótulo](url)`.
- `createPost` / `updatePost` enviam e persistem `category`.

## Posts — site público

- **`Post.jsx`:** deixar de fazer `split('\n')` e lógica ad-hoc de URL; passar a um componente dedicado (ex. `PostBody`) que renderiza Markdown com sanitização estrita.
- **CSS:** links claramente distinguíveis (sublinhado / cor de acordo com tokens existentes; classe partilhada com o legado `content-link` onde fizer sentido).

## Posts — home (`Home.jsx`)

- Novo estado de filtro `categoryFilter`: `'all' | 'live'`.
- Aplicar **depois** ou **em conjunto** com os filtros de texto e período: um post só aparece se passar em **todos** os critérios activos.
- Cartões podem mostrar **indicador visual** «LIVE» quando `category === 'live'` (opcional mas recomendado para coerência com o filtro).

## NUKE DB — dados e UI

- Renomear propriedade **`album` → `titulo`** em todos os registos em `src/services/data.js` (e qualquer código que leia `album`).
- Cabeçalho da coluna na tabela desktop: **TÍTULO** (ou manter rótulo visual alinhado ao mockup; o importante é o campo canónico `titulo`).
- Incluir coluna **Tipo** na tabela desktop com o rótulo de `work_type` (via `WORK_TYPE_OPTIONS` + fallback **Álbum** se ausente).
- Listagem **mobile:** incluir o tipo visível em cada cartão.
- Adicionar `live` ao enum canónico e ao dropdown de filtro; actualizar `spec/features/nuke-db/readme.md`.

### Pesquisa textual

- A busca que hoje inclui «álbum» deve passar a incluir **`titulo`** (mesmo comportamento, novo nome de campo).

## Segurança

- Pipeline: Markdown → HTML via `react-markdown` + `remark-gfm` → **sanitização** (`rehype-sanitize` ou equivalente) para evitar XSS.
- Não renderizar HTML arbitrário colado pelo operador salvo o que o Markdown permitir após sanitize.

## Verificação

- `npm run build`, `npm run lint`, `npm test`.
- Manual: criar/editar post com link inline; verificar abertura segura de link externo; filtro LIVE na home; `/db` com coluna Tipo e filtro Live; ordenação por `titulo`.

## Documentação de features

- Actualizar `spec/features/admin-posts/readme.md` (conteúdo Markdown, categoria, links).
- Actualizar `spec/features/public-site/readme.md` (filtro de categoria).
- Actualizar `spec/features/nuke-db/readme.md` (`titulo`, `live`, coluna visível).
