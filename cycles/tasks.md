# Tasks — UI pública: rodapé, listagem e tipografia

## Especificação (obrigatório)

- [x] Atualizar `spec/README.md` e `spec/features/public-site/readme.md` para refletir o estado alvo deste ciclo.
- [x] Cruzar com `spec/features/admin-posts/readme.md` se algum comportamento público (URLs, paginação) tiver de ficar referenciado na feature de dados.

## Rodapé

- [x] Adicionar ligações e ícones para TikTok e YouTube (URLs acordados); manter Instagram e WhatsApp coerentes com a spec.
- [x] Trocar o e-mail clicável por texto informativo (sem `mailto:`); garantir contraste e leitura em mobile.
- [x] Rever `Footer.css` para alinhamento, quebras e safe-area sem regressões; testar larguras estreitas.

## Home — listagem e dados

- [x] Definir `POSTS_PAGE_SIZE = 30` em `postsApi.js` (e qualquer constante duplicada, se existir).
- [x] Unificar regras de imagem/crop entre secção de destaques e secção «Postagens» (CSS e/ou props de `PostCard`).

## Tipografia e separadores

- [x] Carregar fonte(s) complementar(es) no `index.html` / CSS global e aplicar a excertos (e hierarquia coerente com títulos Cinzel).
- [x] Implementar divisórias visuais entre itens da grelha/listagem da secção paginada.

## Qualidade

- [x] `npm run lint` sem erros nas áreas tocadas.
- [ ] Verificação manual: home em largura desktop e mobile; footer (links TikTok/YouTube/abrem em novo separador; e-mail não navega); paginação com ≤30 itens por página; separadores legíveis.
