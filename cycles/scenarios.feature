# language: pt

Funcionalidade: Gestão de postagens pelo operador
  Para publicar e manter conteúdo no site
  O operador autenticado precisa de um painel dedicado

  Cenário: Aceder ao painel apenas com sessão válida
    Dado que existe uma conta de operador configurada
    Quando o visitante abre o painel administrativo sem estar autenticado
    Então deve ver o fluxo de início de sessão antes de gerir conteúdos
    Quando o visitante inicia sessão com credenciais válidas de operador
    Então passa a ver a área de gestão de postagens

  Cenário: Criar uma nova postagem com resumo e imagem
    Dado que o operador está autenticado no painel
    Quando cria uma postagem com título, resumo curto, conteúdo e imagem nos formatos permitidos
    Então a postagem fica guardada e pode ser encontrada na lista do painel

  Esquema do Cenário: Controlar visibilidade na página inicial
    Dado que o operador está autenticado no painel
    E existe uma postagem "<estado>"
    Quando um visitante abre a página inicial
    Então "<resultado na home>"

    Exemplos:
      | estado     | resultado na home                          |
      | publicada  | o cartão da postagem aparece na listagem   |
      | rascunho   | o cartão da postagem não aparece na listagem |

  Cenário: A página inicial destaca título, data e imagem
    Dado que existem postagens publicadas
    Quando um visitante abre a página inicial
    Então cada cartão mostra o título, a data relevante em português (Brasil) e a imagem
    E cada cartão mostra ainda um resumo curto em uma linha

  Cenário: Reordenar postagens publicadas
    Dado que o operador está autenticado no painel
    E existem várias postagens publicadas
    Quando altera a ordem da lista no painel e guarda
    Então a página inicial reflete a nova ordem

  Cenário: Editar ou remover uma postagem existente
    Dado que o operador está autenticado no painel
    E existe uma postagem publicada
    Quando altera título, resumo, conteúdo ou imagem e guarda
    Então as alterações aparecem para visitantes após a publicação
    Quando remove a postagem e confirma
    Então ela deixa de aparecer na página inicial e no detalhe público

  Cenário: Ver o artigo completo com datas
    Dado que existe uma postagem publicada
    Quando um visitante abre o artigo a partir da página inicial
    Então vê o título, o conteúdo completo e as datas de publicação e de última atualização quando aplicável

  Esquema do Cenário: Rejeitar imagens fora da política
    Dado que o operador está autenticado no painel
    Quando tenta anexar uma imagem "<caso>"
    Então o sistema não aceita o envio e explica o motivo de forma clara

    Exemplos:
      | caso                |
      | formato não permitido |
      | ficheiro demasiado grande |
