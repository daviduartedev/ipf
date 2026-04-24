# Plan — Ordenação e filtro de postagens (delta)

## Baseline observado

- A seção pública `Postagens` já é paginada e exclui os três destaques do hero.
- A fonte de dados usa Supabase com fallback para `posts.json`.
- A ordenação atual no Supabase está baseada em `sort_order`.
- No admin, a listagem também é orientada por ordem manual (`sort_order`) e setas de reordenação.

## Estado desejado (decisões deste ciclo)

### Escopo funcional

- O ajuste vale para a **seção pública `Postagens` na home** e para a **listagem no admin**.
- O hero com os três cards especiais permanece fora desse fluxo e nunca deve ser afetado por filtro/paginação.
- Os três cards especiais continuam com manutenção manual em código quando necessário.

### Ordenação

- Critério canônico de recência: `published_at` (descendente: mais recente primeiro).
- Empate de `published_at` usa `updated_at` (descendente) como desempate estável.
- `sort_order` deixa de ser a fonte principal para ordenação de listagens; pode permanecer apenas como legado técnico.

### Filtro na home (somente seção "Postagens")

- Widget combinado:
  - Busca textual com atualização em tempo real ("conforme digita").
  - Controle estruturado de período (`Todos`, `Últimos 30 dias`, `Ano atual`) para cobrir o "combo" sem exigir novas tabelas.
- O filtro atua sobre o conjunto completo da seção paginada (não só página atual), recalculando total de páginas.
- Deve existir ação explícita para limpar filtros.
- Estado vazio padrão: `Nenhuma postagem encontrada para os filtros selecionados.`
- Em mobile, o filtro fica recolhido por padrão (botão "Filtrar"), expansível para reduzir ruído visual.

### Conteúdo dos 3 posts especiais

- Atualizar apenas `title`, `excerpt` e `content` dos três especiais.
- Não alterar imagens nesse ciclo.

## Delta em especificação canônica

- Atualizar `spec/features/public-site/readme.md` com:
  - ordenação por recência em `published_at`;
  - comportamento do widget de filtro;
  - garantia de isolamento do hero.
- Atualizar `spec/features/admin-posts/readme.md` para refletir:
  - listagem administrativa ordenada por recência (`published_at` desc);
  - `sort_order` como legado/não obrigatório para o comportamento principal.
- Ajustar `spec/README.md` para refletir o novo foco de comportamento público.
