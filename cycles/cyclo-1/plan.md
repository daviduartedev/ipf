# Plan — Filtro por tipo na NUKE DB (delta)

## Baseline observado

- A rota pública `/db` renderiza o catálogo com dados locais (`src/services/data.js`).
- A busca atual é textual e cobre banda, álbum e data.
- Não existe classificação de tipo de trabalho no modelo atual.
- O fluxo atual já inclui paginação e ordenação por colunas.

## Estado desejado (decisões deste ciclo)

### Escopo funcional

- O ajuste vale para ambos:
  - página pública `/db`;
  - fluxo administrativo de manutenção dos registros.
- O novo filtro de tipo complementa a busca textual existente.
- Estado inicial do filtro de tipo: `Todos`.

### Modelo de dados de classificação

- Criar campo canônico obrigatório `work_type`.
- Valores internos permitidos:
  - `album`
  - `ep`
  - `single`
  - `compilation`
  - `demo`
- Rótulos de UI:
  - `Álbum`, `EP`, `Single`, `Compilação`, `Demo`.
- Regra de legado: registros sem tipo devem assumir `album`.

### UX e comportamento na `/db`

- Filtro de tipo deve ser um dropdown alinhado à paleta visual do site.
- O dropdown combina com o filtro textual existente (interseção dos critérios).
- Filtros devem atuar sobre o conjunto completo antes da paginação.
- Ação de limpar filtros deve retornar busca vazia + tipo `Todos`.

### Regras administrativas

- `work_type` é obrigatório na criação e edição.
- O sistema deve validar e aceitar apenas os 5 valores previstos.
- Não há necessidade de edição em massa neste ciclo.

## Delta em especificação canônica

- Atualizar `spec/README.md` adicionando a feature canônica da rota `/db`.
- Criar `spec/features/nuke-db/readme.md` com contrato de dados, UX, regras e defaults.
- Manter `admin-posts` e `public-site` sem mudanças funcionais neste ciclo.
