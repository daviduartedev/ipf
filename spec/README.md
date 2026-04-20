# Especificações (hub)

Este diretório é a fonte de verdade para o comportamento pretendido do produto. Os pedidos de ciclo em `cycles/` descrevem deltas; as features aqui descrevem o estado alvo atual.

## Features

| Feature | Descrição |
|--------|------------|
| [admin-posts](features/admin-posts/readme.md) | Painel em `/adminipf`, gestão de postagens, Supabase, home e detalhe públicos |
| [public-site](features/public-site/readme.md) | Rodapé global, paridade visual dos cartões na home, paginação do feed, tipografia pública |

## Convenções

- Requisitos de negócio e regras de dados vivem em `spec/features/<feature>/readme.md`.
- Cenários de aceitação de alto nível podem ser espelhados em `cycles/scenarios.feature` por ciclo.
