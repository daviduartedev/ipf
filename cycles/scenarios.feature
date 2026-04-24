# language: pt

Funcionalidade: Descobrir postagens na home com ordem e filtros
  Para encontrar conteúdo com rapidez
  Como visitante do site
  Eu quero ver a seção "Postagens" ordenada por recência e filtrável sem afetar os destaques

  Cenário: Ver postagens mais recentes primeiro
    Dado que existem postagens publicadas na seção "Postagens" da home
    Quando o visitante acessa a página inicial
    Então a lista é exibida do post mais recente para o mais antigo
    E os três destaques do hero permanecem inalterados

  Cenário: Filtrar enquanto digita e reduzir resultados
    Dado que o visitante está na seção "Postagens"
    Quando ele digita um termo no campo de busca
    Então os resultados são atualizados em tempo real conforme a digitação
    E somente postagens compatíveis com o termo permanecem visíveis

  Esquema do Cenário: Aplicar e limpar filtros estruturados
    Dado que o visitante está na seção "Postagens"
    Quando ele aplica o filtro "<periodo>"
    Então a lista mostra apenas postagens dentro desse período
    Quando ele limpa os filtros
    Então volta a ver a listagem completa da seção "Postagens"

    Exemplos:
      | periodo          |
      | Últimos 30 dias  |
      | Ano atual        |

  Cenário: Ver mensagem clara ao não encontrar resultados
    Dado que o visitante aplicou filtros na seção "Postagens"
    Quando nenhuma postagem atende aos filtros selecionados
    Então ele vê a mensagem "Nenhuma postagem encontrada para os filtros selecionados."

  Cenário: Paginação coerente após filtragem
    Dado que existem resultados suficientes para múltiplas páginas
    Quando o visitante aplica filtros na seção "Postagens"
    Então a paginação reflete o total de resultados filtrados
    E a navegação entre páginas mantém os mesmos filtros ativos
