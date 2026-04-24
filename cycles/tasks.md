# Tasks — Ordenação e filtros de postagens

## Especificação canônica (obrigatório)

- [x] Atualizar `spec/features/public-site/readme.md` com o contrato de ordenação por `published_at` e o widget de filtro da seção `Postagens`.
- [x] Atualizar `spec/features/admin-posts/readme.md` para listagem administrativa por recência (`published_at` desc; desempate `updated_at` desc).
- [x] Atualizar `spec/README.md` para refletir o novo escopo da feature pública.
- [x] Validar consistência entre specs (`public-site` e `admin-posts`) sem conflito sobre `sort_order`.

## Home pública (`/`)

- [x] Ordenar posts da seção `Postagens` por `published_at` desc (desempate `updated_at` desc), mantendo exclusão dos slugs do hero.
- [x] Implementar widget combinado de filtros:
- [x] Busca textual em tempo real por `title` e `excerpt`.
- [x] Filtro estruturado de período (`Todos`, `Últimos 30 dias`, `Ano atual`).
- [x] Recalcular paginação a partir do conjunto filtrado (filtro não limitado à página atual).
- [x] Adicionar ação de limpar filtros.
- [x] Exibir estado vazio padrão: `Nenhuma postagem encontrada para os filtros selecionados.`
- [x] Garantir que filtros não alterem os 3 destaques do hero.
- [x] Definir comportamento mobile com filtro recolhido por padrão e expansão por ação do usuário.

## Admin (`/adminipf`)

- [x] Exibir listagem por recência (`published_at` desc; fallback `updated_at` desc quando aplicável).
- [x] Desabilitar impacto funcional da reordenação manual (`sort_order`) no comportamento principal (manter legado sem quebrar dados).

## Conteúdo dos 3 especiais

- [x] Atualizar conteúdo textual dos três posts especiais:
- [x] `Quem Somos — Inaudível Por Favor`
- [x] `Seja um Revisor`
- [x] `Nuke DB – Uma breve introdução`
- [x] Preservar imagens atuais sem substituição neste ciclo.

## Qualidade e validação

- [x] Rodar linter/testes do projeto e corrigir regressões nas áreas tocadas.
- [ ] Teste manual desktop/mobile:
- [ ] Home: ordenação, filtro em tempo real, limpar, estado vazio, paginação coerente.
- [ ] Hero: permanece intacto.
- [ ] Admin: ordem por recência exibida corretamente.
