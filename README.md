# Inaudível Por Favor (IPF) - Modernização React

Este projeto é uma refatoração completa da plataforma **Inaudível Por Favor**, antes construída em Vanilla JS/HTML, para uma arquitetura moderna utilizando **React** e **Vite**.

## 🚀 Tecnologias Utilizadas

- **React 18**: Biblioteca principal para construção da interface.
- **Vite**: Ferramenta de build ultra-rápida.
- **React Router Dom**: Gerenciamento de rotas (SPA).
- **Lucide React**: Biblioteca de ícones.
- **CSS Vanilla**: Estilização customizada e responsiva.

## 📁 Estrutura do Projeto

```text
src/
 ├── assets/        # Imagens e logos dinâmicos
 ├── components/    # Componentes globais (Navbar, Layout, Footer)
 ├── pages/         # Páginas da aplicação (Home, Store, Database, Post)
 ├── services/      # Lógica de dados (Nuke DB)
 └── utils/         # Funções auxiliares
```

## ✨ Principais Melhorias

1. **Nuke DB (Database):**
   - Isolamento de estado para evitar conflitos de variáveis globais.
   - Algoritmo de busca e ordenação otimizado com `useMemo`.
   - Layout de **Cards Responsivos** para dispositivos móveis.
   
2. **Loja (Store):**
   - Carrossel de imagens nativo em React com controle de estado.
   - Grid adaptativo e integração direta com WhatsApp.

3. **Navegação SPA:**
   - Troca de páginas instantânea sem recarregar o navegador.
   - Logos dinâmicas na Navbar que mudam conforme a seção ativa.

## 🛠️ Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (recomendado v18+)

### Instalação
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

### Build de Produção
```bash
# Gerar a pasta dist otimizada
npm run build
```

## 📜 Licença
Este projeto é de uso restrito da **Inaudível Por Favor**.

---
*Refatorado com 🤘 para a cena metal brasileira.*
