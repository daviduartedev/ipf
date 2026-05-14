# Feature — Casca pública da home (destaques + feed filtrável)

Complementa a [feature admin-posts](../admin-posts/readme.md) (dados e painel). Descreve o estado alvo de experiência pública da home: três destaques fixos, feed de postagens com ordenação por recência, filtros e paginação.

## Página inicial (`/`)

### Seção de destaques (hero)

- Existem exatamente três cards especiais fixos no topo da home.
- Esses cards não participam da filtragem nem da paginação da seção "Postagens".
- Alterações desses três cards podem ser feitas diretamente no código quando necessário.

### Seção "Postagens" (feed paginado)

- Exibe apenas postagens com `status = published`.
- Exclui slugs já usados nos três destaques para evitar duplicação.
- Ordenação canônica: `published_at` em ordem decrescente (mais recente primeiro).
- Desempate de ordenação: `updated_at` em ordem decrescente.
- Paginação: até **30** postagens por página com total coerente para "Anterior" e "Seguinte".

## Filtros da seção "Postagens"

- O filtro atua somente na seção "Postagens"; nunca altera o hero.
- Combinação de filtros:
  - Busca textual em tempo real (conforme digita), aplicável a `title` e `excerpt`.
  - Filtro de período com opções: `Todos`, `Últimos 30 dias`, `Ano atual`.
  - Filtro de **categoria** em dropdown (todas ou uma categoria específica), em conjunto com os anteriores (**interseção**).
- Os filtros são aplicados ao conjunto completo da seção (não só à página atual), com recálculo de paginação sobre os resultados filtrados.
- Postagens com categoria diferente de **Padrão** podem exibir o rótulo da categoria no cartão do feed.
- Deve existir ação explícita para limpar filtros.
- Estado vazio padrão: `Nenhuma postagem encontrada para os filtros selecionados.`
- Em mobile, o painel de filtros é recolhido por padrão e pode ser expandido pelo usuário.

## Conteúdo dos 3 posts especiais (este estado alvo)

- Atualizar os textos de:
  - `Quem Somos — Inaudível Por Favor`
  - `Seja um Revisor`
  - `Nuke DB – Uma breve introdução`
- Não substituir imagens nesse ajuste de conteúdo.

## Referência técnica (implementação)

- Componentes principais: `Home.jsx`, `PostCard.jsx`, `PostBody.jsx` (detalhe do post em Markdown sanitizado).
- Serviço de dados: `src/services/postsApi.js`.
- A modelagem de dados e regras de publicação continuam em `admin-posts`.
