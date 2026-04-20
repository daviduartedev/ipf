# Feature — Casca pública (rodapé, home, tipografia)

Complementa a [feature admin-posts](../admin-posts/readme.md) (dados e painel). Descreve o estado alvo da **apresentação** nas páginas públicas: rodapé global, listagem da home e hierarquia tipográfica dos cartões.

## Rodapé

- Presente em todas as páginas que usam `Layout` (site público).
- **Redes com ligação externa** (abrir em novo separador / `noopener noreferrer`):
  - Instagram: `https://www.instagram.com/inaudivel_por_favor/`
  - WhatsApp: `https://wa.me/554896196699`
  - TikTok: `https://www.tiktok.com/@inaudivelporfavor`
  - YouTube: `https://www.youtube.com/@inaudivelporfavor`
- **E-mail** `inaudivelporfavor@gmail.com`: mostrado como **texto informativo** — não é hiperligação `mailto:`; o visitante não deve ser enviado para cliente de correio ao interagir com o texto.
- **Ícones**: gráficos vetoriais simples coerentes com o estilo do site (sem obrigação de logos oficiais da marca); área de toque confortável em mobile (≥44px).
- **Layout**: conteúdo centrado, adaptável a larguras estreitas; uso de áreas seguras (`safe-area`) onde aplicável; não deve sobrepor nem esconder o conteúdo principal.

## Página inicial (`/`)

### Secção de destaques (hero)

- Três cartões fixos no topo (fonte de dados: migração `posts.json` conforme implementação).
- Define o **referencial visual** de imagem dos cartões (proporção/crop e alturas por breakpoint).

### Secção «Postagens» (feed paginado)

- Lista apenas postagens **publicadas** (via Supabase ou fallback JSON), **excluindo** os slugs já mostrados nos destaques, para evitar duplicação.
- **Paginação**: até **30** postagens por página (com contagem total coerente para navegação «Anterior» / «Seguinte»).
- **Imagens**: cada cartão usa o **mesmo critério de enquadramento e escala** que os destaques (paridade visual em desktop e mobile).
- **Separadores**: entre itens consecutivos do feed deve existir um **separador visual** explícito (p.ex. linha ou espaço com micro-ritmo), alinhado à paleta do site, sem prejudicar leitura ou acessibilidade.

## Tipografia dos cartões públicos

- **Títulos**: continuam na família **Cinzel** (hierarquia com o resto do site).
- **Excertos e, quando aplicável, linha de data** nos cartões da home: família **Lora** (Google Fonts, pesos 400–500), em conjunto com a escala de tamanhos/entrelinha definida no CSS — tom editorial que contrasta com Arial do `body` e harmoniza com o dourado (`--secondary`).
- Detalhe do artigo (`/post/:slug`) deve **alinhar** a este padrão quando reutilizar os mesmos tokens tipográficos.

## Referência técnica (implementação)

- Componentes: `Footer.jsx`, `Home.jsx`, `PostCard.jsx`, estilos em `Footer.css`, `Home.css`, variáveis em `src/index.css`.
- Tamanho de página: constante `POSTS_PAGE_SIZE` em `src/services/postsApi.js`.
