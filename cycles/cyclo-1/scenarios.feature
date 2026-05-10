# language: pt

Funcionalidade: Filtrar trabalhos na NUKE DB por tipo
  Para encontrar discos com mais precisão
  Como visitante da rota `/db`
  Eu quero combinar busca textual com classificação de tipo de trabalho

  Cenário: Ver todos os trabalhos por padrão
    Dado que existem registros na NUKE DB
    Quando o visitante acessa a página `/db`
    Então o filtro de tipo inicia em "Todos"
    E a listagem mostra todos os trabalhos disponíveis

  Esquema do Cenário: Filtrar por tipo específico
    Dado que o visitante está na página `/db`
    Quando ele seleciona "<tipo>" no dropdown de classificação
    Então a lista exibe somente trabalhos do tipo "<tipo>"

    Exemplos:
      | tipo        |
      | Álbum       |
      | EP          |
      | Single      |
      | Compilação  |
      | Demo        |

  Cenário: Combinar busca textual com filtro de tipo
    Dado que o visitante selecionou um tipo no dropdown
    Quando ele busca por um termo textual
    Então a lista mostra apenas itens que atendem ao tipo e ao termo
    E a paginação é recalculada sobre os resultados filtrados

  Cenário: Limpar filtros e voltar ao estado inicial
    Dado que o visitante aplicou busca textual e tipo
    Quando ele aciona "limpar filtros"
    Então o termo de busca é removido
    E o tipo volta para "Todos"
    E a listagem completa volta a ser exibida

  Cenário: Tratar registros legados sem tipo
    Dado que existe um registro antigo sem classificação explícita
    Quando esse registro é carregado na listagem
    Então ele é tratado como tipo "Álbum"
