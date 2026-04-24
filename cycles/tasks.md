# Tasks — Filtro por tipo na `/db`

## Especificação canônica (obrigatório)

- [x] Atualizar `spec/README.md` com referência da feature canônica da NUKE DB.
- [x] Criar/atualizar `spec/features/nuke-db/readme.md` com regras de classificação por tipo.
- [x] Registrar contrato de dados para `work_type` obrigatório com valores permitidos.
- [x] Registrar regra de retrocompatibilidade: sem tipo => `album`.

## Dados e integração

- [x] Adicionar campo `work_type` na fonte de dados da `/db` (modelo local atual e/ou backend futuro).
- [x] Definir enum canônico: `album`, `ep`, `single`, `compilation`, `demo`.
- [x] Mapear labels de UI: `Álbum`, `EP`, `Single`, `Compilação`, `Demo`.
- [x] Garantir migração/default `album` para registros legados sem tipo.

## UI e comportamento (`/db`)

- [x] Adicionar dropdown de tipo com opção inicial `Todos`.
- [x] Aplicar combinação de filtros: busca textual + tipo selecionado.
- [x] Recalcular paginação sobre o conjunto filtrado completo.
- [x] Manter ordenação existente por colunas sem conflito com o filtro de tipo.
- [x] Implementar ação "limpar filtros" retornando busca vazia + tipo `Todos`.

## Admin e validação

- [ ] Tornar `work_type` obrigatório no fluxo administrativo de criação/edição. (pendente: não há fluxo admin da NUKE DB neste código atual)
- [x] Validar entrada para aceitar apenas os 5 tipos permitidos.
- [ ] Exibir erro amigável quando o tipo não for informado. (pendente junto do fluxo admin)

## Qualidade e validação

- [ ] Teste manual em `/db`: filtro `Todos`, cada tipo individual, combinação com busca, paginação, limpeza.
- [ ] Teste de regressão: ordenação por banda/álbum/data continua funcional.
- [ ] Teste de legado: item sem tipo aparece como `Álbum`.
