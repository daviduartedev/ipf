# Feature — Gestão de postagens (admin + site público)

## Objetivo

Substituir a importação manual de `posts.json` por um fluxo em que um **único operador** (cliente) gere postagens num painel dedicado, com publicação na **página inicial** e **página de detalhe**, com dados persistidos e imagens armazenadas de forma adequada.

## URLs

| Rota | Audiência | Notas |
|------|-----------|--------|
| `/` | Pública | Lista postagens **publicadas** ordenadas |
| `/post/:slug` | Pública | Detalhe por **slug** canónico |
| `/adminipf` | Operador autenticado | **Sem** ligação no menu público; partilha apenas por URL direta |

## Autenticação e acesso (cliente)

- Mecanismo: **Supabase Auth** com e-mail e palavra-passe (conta única para o cliente).
- **Como aceder**: abrir `https://<o-seu-dominio>/adminipf`, iniciar sessão com o e-mail e palavra-passe que lhe forem enviados por um canal seguro (não publicar credenciais no site).
- O administrador do projeto cria o utilizador no Supabase (ou envia convite) e envia ao cliente apenas o URL e as credenciais.
- A página admin deve usar **`noindex`** para reduzir descoberta acidental; não substitui a exigência de sessão válida.

## Modelo de dados (conceitual)

| Campo | Descrição |
|--------|------------|
| `id` | UUID (PK), gerado pelo sistema |
| `slug` | Texto único, URL-seguro; gerado a partir do título e ajustável no painel |
| `title` | Título do post |
| `excerpt` | Resumo **curto** (uma frase, chamativo) |
| `content` | Texto simples, quebras de linha (como o site hoje) |
| `image` | Referência ao ficheiro no **Supabase Storage** (ou URL estável servida pelo storage) |
| `status` | `draft` ou `published` |
| `published_at` | Momento de publicação (quando aplicável) |
| `updated_at` | Última atualização de conteúdo ou metadados relevantes |
| `sort_order` | Ordem na home entre publicados (menor/maior definido na implementação, mas explícito e editável) |

### Regras

- Apenas `published` aparecem na home e no detalhe público.
- `draft` só no painel.
- **Datas**: armazenamento em UTC; apresentação em **pt-BR** com timezone **America/Sao_Paulo** (aceitável também para SC no mesmo fuso).

## Imagens

- Formatos: **JPEG, PNG** apenas.
- Tamanho máximo: **5 MB** por ficheiro.
- Validação no cliente; políticas de storage devem alinhar tipo e tamanho.

## Ordenação

- O operador define a ordem dos posts **publicados** na home através de uma lista ordenável no painel; a ordem é persistida (`sort_order` ou equivalente).

## Apresentação pública (UI)

- Regras de rodapé, tamanho de página do feed na home (30 por página), paridade de imagens entre destaques e listagem, e tipografia dos cartões: ver [public-site](../public-site/readme.md).

## Contrato público vs admin

- **Leitura pública**: cliente Supabase com chave **anon** + **RLS** (só leitura de posts publicados e campos necessários).
- **Escrita e uploads**: apenas utilizador **autenticado** autorizado (a conta do operador).

## Migração

- Os posts existentes em `public/posts.json` devem ser importados para Supabase no arranque, preservando textos e referências de imagem (copiando ficheiros para o storage se necessário).

## Implementação (código)

- Migração SQL: `supabase/migrations/20260419120000_posts_and_storage.sql`.
- Variáveis: `.env.example` (`VITE_SUPABASE_*`); script de dados: `npm run migrate:posts` com `SUPABASE_SERVICE_ROLE_KEY`.
- Rotas: `/adminipf`, `/adminipf/new`, `/adminipf/edit/:id`; leitura pública via `src/services/postsApi.js` com fallback para `public/posts.json` quando o Supabase não está configurado (desenvolvimento).

## Fora de escopo

- Editor rico, comentários, múltiplos operadores com papéis, SEO avançado.
