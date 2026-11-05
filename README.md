# Desafio Front-End - EJECT

Repositório desenvolvido para o processo de trainee da **EJECT** (Empresa Júnior da Escola de Ciência e Tecnologia), vinculada à UFRN. O objetivo do projeto é a implementação de uma interface web a partir de um protótipo do Figma, na qual optei por utilizar **React**.

## Objetivo

Desenvolver um site para a **Theka**, uma biblioteca moderna e acessível, com uma estética animada, colorida e descontraída, voltado principalmente para jovens, estudantes e leitores curiosos. O site deve promover o acesso ao acervo da biblioteca, contar a história da instituição e oferecer um canal de comunicação prático e acolhedor.

## Telas

| Tela | Rota | O que faz |
|---|---|---|
| Login | `/login` | Entrada com e-mail e senha (somente visual, sem autenticação) |
| Cadastro | `/cadastro` | Formulário de cadastro (somente visual) |
| Recuperar senha | `/recuperar-senha` | Pede o e-mail para recuperação (somente visual) |
| Redefinir senha | `/redefinir-senha` | Define a nova senha (somente visual) |
| Acervo | `/acervo` | Novidades da semana, busca e catálogo de livros |
| Adicionar material | `/acervo/adicionar-material` | Cadastra um livro no catálogo |
| Editar material | `/acervo/editar-material/:id` | Edita ou exclui um livro |
| Sobre nós | `/sobre` | História, valores e equipe da Theka |

As telas de adicionar e editar material abrem por cima do Acervo (rotas aninhadas). O endereço `/` redireciona para `/login`.

As telas têm versão desktop e mobile.

## Tecnologias

- **React** 19
- **Vite**
- **React Router** (`react-router-dom`)
- **JavaScript, HTML e CSS** (CSS puro, um arquivo por componente ou página)
- **json-server** (API simulada, só em desenvolvimento)
- **oxlint** (verificação de código)

## Como rodar o projeto:

Requisitos: **Node.js 22.12 ou superior** e **npm**.

1. Clone o repositório:

   ```bash
   git clone https://github.com/ramonfbmiranda/desafio-react-eject.git
   cd desafio-react-eject
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Em um terminal, suba a API simulada:

   ```bash
   npm run api
   ```

   Ela fica em `http://localhost:3000` e lê os livros do arquivo `db.json`.

4. Em outro terminal, suba o site:

   ```bash
   npm run dev
   ```

   O site abre em `http://localhost:5173`.

Sem a API rodando, o Acervo abre vazio e mostra uma mensagem de erro.

## Scripts

| Comando | Para que serve |
|---|---|
| `npm run dev` | Sobe o site em modo de desenvolvimento |
| `npm run api` | Sobe a API simulada (`json-server`) |
| `npm run build` | Gera a versão de produção na pasta `dist` |
| `npm run preview` | Abre localmente a versão de produção |
| `npm run lint` | Verifica o código com o oxlint |

## API e dados

## API e dados

Livros, gêneros e editoras vêm da **API REST da EJECT** (Django REST Framework):

| Método | Endereço | Ação |
|---|---|---|
| `GET` | `/livros/` | Lista os livros (paginada: o site segue as páginas) |
| `GET` | `/livros/:id/` | Busca um livro |
| `POST` | `/livros/` | Cadastra um livro |
| `PATCH` | `/livros/:id/` | Atualiza um livro |
| `DELETE` | `/livros/:id/` | Exclui um livro |
| `GET` | `/generos/` e `/editoras/` | Listas usadas nos filtros e no formulário |

O arquivo `src/services/api.js` traduz os nomes dos campos da API (`ano_publicacao`, `numero_paginas`, `capa`) para os usados no site.

**Login e cadastro** usam uma API simulada (`json-server`, coleção `usuarios` do `db.json`) em desenvolvimento. No site publicado, o login lê os usuários do `db.json` (somente leitura).

### Variável de ambiente (opcional)

Em `.env.local`, na raiz:

VITE_API_URL=https://thekaapitrainee1.pythonanywhere.com
```

- `VITE_API_URL`: endereço da API.

Reinicie o `npm run dev` depois de alterar o arquivo.

## Estrutura de pastas

```
desafio-react-eject/
├── db.json               # dados dos livros (API simulada)
├── index.html
├── vercel.json           # redireciona as rotas para o index.html
├── public/
│   └── capas/            # imagens das capas dos livros
└── src/
    ├── assets/           # imagens (mascote, logotipos, ícones, equipe)
    ├── components/       # AuthLayout, Button, Input, Cabecalho, Rodape,
    │                     # FormMaterial, AdicionarMaterial, EditarMaterial
    ├── pages/            # Login, Cadastro, RecuperarSenha, RedefinirSenha,
    │                     # Acervo, SobreNos
    ├── services/         # api.js (requisições) e isbn.js (busca por ISBN)
    ├── App.jsx           # rotas
    ├── main.jsx
    └── index.css         # variáveis de cor, espaçamento e reset
```

## Responsividade

O layout é fluido. Em telas com mais de 900px (desktop), as medidas escalam com a largura da janela a partir de uma unidade definida em `index.css` (`--u`, equivalente a 1px do protótipo em 1600px). Abaixo de 900px (celular e tablet), entra o layout mobile.

## Funcionalidades além do protótipo

Estes itens foram incluídos para dar vida ao catálogo e não fazem parte do desenho do Figma:

- **Busca por ISBN**: ao digitar o ISBN em "Adicionar material", o formulário é preenchido com os dados do livro (Google Books) e a capa vem da Open Library. Se o livro não for encontrado, o preenchimento é manual.
- **Carrossel de novidades**: ao clicar em um slide, ele é ampliado e o texto acima muda para o livro escolhido.

## Deploy

O site é publicado na **Vercel**. O arquivo `vercel.json` devolve o `index.html` para qualquer endereço, o que faz as rotas do React Router funcionarem ao atualizar a página.

A API simulada (`json-server`) não é publicada junto com o site.

## Autor

Desenvolvido por **Ramon Miranda** ([@ramonfbmiranda](https://github.com/ramonfbmiranda)).

Mockup desenvolvido por EJECT.