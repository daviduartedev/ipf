# request.md — Ciclo único: melhorias em posts, editor, hyperlinks, categoria LIVE e refatoração de dados

## Contexto

O projeto possui uma área administrativa para criação e edição de posts. Hoje, o editor de texto e a estrutura dos dados possuem limitações que dificultam a evolução do conteúdo.

Este ciclo deve tratar os ajustes abaixo como uma melhoria contínua, sem reconstruir o módulo inteiro.

## Objetivo

Melhorar a criação/edição de posts no admin, permitindo hyperlinks e melhor controle textual, adicionar a categoria `LIVE`, refatorar o campo `album` para `titulo` na estrutura dos dados e adicionar uma coluna de tipo na listagem/tabela indicada pelo @public/image.png

---

# Ajustes solicitados

## 1. Melhorar edição de texto no admin

Hoje, ao criar posts, existem limitações na edição de texto.

Problemas observados:

- Não é possível adicionar hyperlinks dentro dos posts.
- Não é possível ou não está claro como adicionar hyperlinks em referências a álbuns.
- As quebras de linha e espaçamentos precisam ser analisados.
- Ao pular linhas, parece existir um espaçamento fixo/limitado.
- Com o tempo, será necessário ter uma edição textual mais detalhada.

O objetivo não é criar um CMS completo neste momento, mas melhorar a base atual para que os posts tenham uma edição textual mais flexível e sustentável.

Antes de implementar, analisar os posts existentes e identificar a real necessidade editorial dentro do conteúdo dos posts.

---

## 2. Adicionar hyperlink dentro dos posts

O admin deve permitir inserir hyperlinks no conteúdo dos posts.

Requisitos:

- Deve ser possível selecionar ou escrever um trecho do texto e associar um link.
- O link deve ser salvo corretamente.
- O link deve renderizar corretamente no front.
- O link deve ser clicável.
- O link deve ter aparência visual clara.
- Links externos devem abrir de forma segura, preferencialmente com:

```html
target="_blank"
rel="noopener noreferrer"