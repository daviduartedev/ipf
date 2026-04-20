# language: pt

Funcionalidade: Experiência pública na página inicial e rodapé
  Para descobrir conteúdos e contactos do Inaudível Por Favor
  O visitante precisa de uma lista clara de postagens e um rodapé consistente

  Cenário: Consultar redes sociais a partir do rodapé
    Dado que o visitante está em qualquer página pública com rodapé
    Quando procura as redes sociais do projecto
    Então encontra atalhos para o TikTok e o YouTube nas localizações acordadas
    E pode abrir cada atalho sem sair do contexto de segurança habitual (ex.: abrir em novo contexto quando aplicável)

  Cenário: Ver o endereço de e-mail sem acção de correio
    Dado que o visitante está no rodapé
    Quando lê a secção de contacto
    Então vê o endereço de e-mail como informação apenas
    E não é levado automaticamente a uma aplicação de correio ao «clicar» no texto

  Cenário: Ler a listagem de postagens com o mesmo encarte visual dos destaques
    Dado que existem postagens na secção paginada abaixo dos três destaques
    Quando o visitante percorre essa listagem
    Então as imagens dos cartões seguem o mesmo critério de tamanho e enquadramento que os destaques do topo
    E a experiência é coerente entre vistas amplas e estreitas

  Esquema do Cenário: Navegar entre páginas de postagens
    Dado que existem mais postagens do que o limite por página
    Quando o visitante está na listagem paginada e pede a "<direcção>"
    Então vê um conjunto de até <limite> postagens por página até ao fim do conteúdo disponível

    Exemplos:
      | direcção | limite |
      | seguinte | 30     |
      | anterior | 30     |

  Cenário: Identidade visual na leitura dos resumos
    Dado que o visitante abre a página inicial
    Quando lê os resumos dos cartões de postagem
    Então a tipografia transmite hierarquia clara e harmonia com o restante do site

  Cenário: Separar visualmente uma postagem da seguinte na listagem
    Dado que existem várias postagens na secção paginada
    Quando o visitante percorre a listagem
    Então percebe uma separação visual consistente entre entradas consecutivas
