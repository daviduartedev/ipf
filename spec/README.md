# Especificações (hub)

Este diretório é a fonte de verdade para o comportamento pretendido do produto. Os pedidos de ciclo em `cycles/` descrevem deltas; as features aqui descrevem o estado alvo atual.

## Features

| Feature | Descrição |
|--------|------------|
| [admin-posts](features/admin-posts/readme.md) | Painel em `/adminipf`, gestão de postagens, Supabase, home e detalhe públicos |
| [public-site](features/public-site/readme.md) | Casca pública da home: destaques fixos, feed de postagens por recência, filtros e paginação |
| [nuke-db](features/nuke-db/readme.md) | Catálogo público em `/db` com busca, classificação por tipo de trabalho e paginação |

## Convenções

- Requisitos de negócio e regras de dados vivem em `spec/features/<feature>/readme.md`.
- Cenários de aceitação de alto nível podem ser espelhados em `cycles/scenarios.feature` por ciclo.
