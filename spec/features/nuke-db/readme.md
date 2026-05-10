# Feature — NUKE DB (catálogo público)

Define o estado alvo da rota pública `/db`, usada para explorar discografias por banda, **título da obra** e data de lançamento, com filtros combináveis.

## Objetivo

Permitir que o visitante filtre o catálogo por tipo de trabalho (ex.: Álbum, EP) sem perder a busca textual já existente.

## Rota e audiência

| Rota | Audiência | Notas |
|------|-----------|-------|
| `/db` | Pública | Catálogo navegável com busca, classificação e paginação |

## Modelo de dados (conceitual)

Cada registro do catálogo deve conter, no mínimo:

| Campo | Tipo | Regra |
|------|------|-------|
| `banda` | texto | obrigatório |
| `titulo` | texto | obrigatório (título da obra / release) |
| `data` | data (`YYYY-MM-DD`) | opcional, mas recomendada |
| `work_type` | enum texto | obrigatório |

### Enum canônico de `work_type`

Valores persistidos:

- `album`
- `ep`
- `single`
- `compilation`
- `demo`
- `live`

Rótulos de UI:

- `album` -> `Álbum`
- `ep` -> `EP`
- `single` -> `Single`
- `compilation` -> `Compilação`
- `demo` -> `Demo`
- `live` -> `Live`

### Regra de retrocompatibilidade

- Registros legados sem `work_type` devem ser tratados como `album`.

## Comportamento de filtros

- A busca textual continua disponível e cobre banda, **título** (`titulo`) e data.
- O novo filtro de tipo é exibido em dropdown.
- Opção padrão do dropdown: `Todos`.
- Quando um tipo é selecionado, a listagem retorna apenas itens do tipo escolhido.
- Quando busca textual e tipo estão ativos, o resultado é a interseção dos dois filtros.
- A ação "limpar filtros" retorna para: busca vazia + tipo `Todos`.

## Paginação e ordenação

- A paginação atua sobre o conjunto já filtrado.
- Regras de ordenação por coluna (banda, título, release) permanecem válidas.
- A tabela desktop exibe uma coluna **Tipo** com o rótulo do `work_type`; a vista mobile mostra o tipo em cada cartão.
- O filtro por tipo não deve quebrar o comportamento atual de ordenação.

## Regras administrativas

- `work_type` é obrigatório em criação e edição de registros.
- O sistema deve rejeitar valores fora do enum canônico.
- Edição em massa não é requisito deste ciclo.

## Fora de escopo

- Múltiplos tipos por registro.
- Taxonomias hierárquicas de gênero/subgênero.
- Novas rotas públicas além de `/db`.
