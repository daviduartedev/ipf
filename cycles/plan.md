# Plan — UI pública: rodapé, listagem e tipografia (delta)

## Estado actual (baseline)

- **Rodapé** (`Footer.jsx`): Instagram e WhatsApp com ícones SVG embutidos; e-mail como `mailto:` clicável; layout em duas colunas com separador vertical (desktop) e horizontal (mobile).
- **Home**: três destaques no topo carregados de `posts.json` (`loadFeaturedPostsFromJson`); secção «Postagens» com API paginada (`POSTS_PAGE_SIZE = 6`); ambos usam `PostCard` com `.post-img` altura 220px (200px em viewport ≤768px).
- **Tipografia**: títulos e classe `cinzel` com **Cinzel** (Google Fonts); corpo e excertos em Arial/`#ccc` genérico.
- **Spec**: `spec/features/admin-posts/readme.md` cobre dados e admin; não existia spec dedicada à casca visual pública (footer, ritmo da listagem).

## Estado desejado (este ciclo)

### Rodapé

- Incluir ícones para **TikTok** e **YouTube** com os URL fornecidos; manter redes já presentes (Instagram, WhatsApp) salvo decisão de simplificar — **baseline**: todas as quatro com links externos e `rel` adequado.
- **E-mail** (`inaudivelporfavor@gmail.com`): texto **apenas informativo** — sem `mailto:`, sem hover de link; semântica de texto (ex. `<span>` ou `<p>` com `role`/`aria-label` se útil para leitores de ecrã).
- **Ícones**: SVGs simples alinhados ao estilo actual (contorno/monocromático), visto que não há logos oficiais entregues.
- **Layout**: robustez web + mobile (flex/grid, `flex-wrap`, safe-area), sem regressões visíveis; ajustes finos permitidos desde que o bloco permaneça centrado, legível e táctil (≥44px em botões de ícone).

### Home — imagens e listagem

- **Paridade visual**: thumbnails da secção «Postagens» com **mesmo tratamento de tamanho/crop** que os três cartões de destaque (hero), para qualquer largura de ecrã — uma única regra de dimensão/aspecto partilhada ou variante visual explícita evitando «miniaturas diferentes».
- **Paginação**: **30** posts por página na secção dinâmica (`POSTS_PAGE_SIZE = 30` e totais coerentes em Supabase e fallback JSON).

### Tipografia e identidade

- Adoptar **Lora** (400–500) para excertos e data nos cartões, em complemento a **Cinzel** nos títulos (Google Fonts + tokens em CSS), alinhado à paleta (preto, dourado, vermelho).

### Separadores visuais

- Separador claro **entre** itens da listagem paginada (não entre os três destaques entre si, que já têm ritmo de grelha), p.ex. linha ou espaço com micro-divisor consistente com `--primary`/`--secondary`, sem poluir nem reduzir acessibilidade.

### Fora de escopo

- Alterar regras de negócio de dados (RLS, drafts, ordenação admin).
- Página de detalhe `/post/:slug` salvo se o mesmo componente de cartão/texto for reutilizado e o padrão tipográfico for global.

## Rastreabilidade com decisão do cliente

| Tema | Decisão |
|------|---------|
| Âmbito | Só site público; hero = destaques em `posts--featured` |
| TikTok | `https://www.tiktok.com/@inaudivelporfavor` |
| YouTube | `https://www.youtube.com/@inaudivelporfavor` |
| E-mail | Só informativo, não clicável |
| Paginação | 30 por página |
| Tipografia | Equipa define fontes e escala condizentes com o site |
