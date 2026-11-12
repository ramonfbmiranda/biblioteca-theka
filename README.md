# Desafio Front-End - EJECT

Repositório desenvolvido para o processo de trainee da **EJECT** (Empresa Júnior da Escola de Ciência e Tecnologia), vinculada à UFRN. O objetivo do projeto é a implementação de uma interface web a partir de um protótipo do Figma, utilizando **React**.

## Objetivo

Desenvolver um site para a **Theka**, uma biblioteca moderna e acessível, com uma estética animada, colorida e descontraída, voltado principalmente para jovens, estudantes e leitores curiosos. O site deve promover o acesso ao acervo da biblioteca, contar a história da instituição e oferecer um canal de comunicação prático e acolhedor.

## Telas

| Tela | Rota | O que faz |
|---|---|---|
| Login | `/login` | Entrada com e-mail e senha (autenticação JWT na API) |
| Cadastro | `/cadastro` | Cria uma conta na API |
| Recuperar senha | `/recuperar-senha` | Pede à API o envio do link de recuperação por e-mail |
| Redefinir senha | `/redefinir-senha` | Define a nova senha a partir do link do e-mail (lê `uid` e `token` da URL) |
| Acervo | `/acervo` | Novidades da semana, busca por título/autor e filtros por gênero e editora |
| Adicionar material | `/acervo/adicionar-material` | Cadastra um livro (com upload de capa e preenchimento por ISBN) |
| Editar material | `/acervo/editar-material/:id` | Edita ou exclui um livro |
| Sobre nós | `/sobre` | História, valores e equipe da Theka |

As telas de adicionar e editar material abrem por cima do Acervo (rotas aninhadas) e fecham com **Esc** ou clicando fora. O endereço `/` redireciona para `/login`.

As telas têm versão desktop e mobile.

## Tecnologias

- **React** 19
- **Vite**
- **React Router** (`react-router-dom`)
- **JavaScript, HTML e CSS** (CSS puro, um arquivo por componente ou página)
- **API REST da EJECT** (Django REST Framework), consumida com `fetch`
- **oxlint** (verificação de código)

## Como rodar o projeto

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

3. Suba o site:

   ```bash
   npm run dev
   ```

   O site abre em `http://localhost:5173`. Livros, login e cadastro usam a API da EJECT, que fica na internet, então não é preciso subir nenhum servidor local.

## Scripts

| Comando | Para que serve |
|---|---|
| `npm run dev` | Sobe o site em modo de desenvolvimento |
| `npm run build` | Gera a versão de produção na pasta `dist` |
| `npm run preview` | Abre localmente a versão de produção |
| `npm run lint` | Verifica o código com o oxlint |

## API e dados

Todos os dados vêm da **API REST da EJECT** (Django REST Framework). O arquivo `src/services/api.js` concentra as chamadas.

### Livros, gêneros e editoras

| Método | Endereço | Ação |
|---|---|---|
| `GET` | `/livros/` | Lista os livros (paginada: o site segue as páginas) |
| `GET` | `/livros/:id/` | Busca um livro |
| `POST` | `/livros/` | Cadastra um livro |
| `PATCH` | `/livros/:id/` | Atualiza um livro |
| `DELETE` | `/livros/:id/` | Exclui um livro |
| `GET` | `/generos/` e `/editoras/` | Listas usadas no formulário |

O `api.js` traduz os nomes dos campos da API (`ano_publicacao`, `numero_paginas`, `capa`) para os usados no site e envia a capa como arquivo (`multipart`) quando há upload. A busca e os filtros do Acervo rodam no navegador, sobre a lista já carregada.

### Autenticação

| Método | Endereço | Ação |
|---|---|---|
| `POST` | `/auth/token/` | Login com e-mail e senha (devolve os tokens JWT) |
| `POST` | `/auth/token/refresh/` | Renova o token de acesso |
| `POST` | `/users/` | Cadastro (o e-mail também é usado como `username`) |
| `POST` | `/auth/password/reset/` | Pede o e-mail de recuperação de senha |
| `POST` | `/auth/password/reset/confirm/` | Define a nova senha (`uid` e `token` vêm do link do e-mail) |

A sessão fica no `localStorage` (chave `theka:sessao`), gerenciada por `src/services/auth.js`. As regras de senha e as mensagens de validação vêm da API e são exibidas nos formulários em português.

### Variável de ambiente (opcional)

Em `.env.local`, na raiz do projeto:

```
VITE_API_URL=https://thekapitrainee1.pythonanywhere.com
VITE_GOOGLE_BOOKS_KEY=sua_chave_aqui
```

- `VITE_API_URL`: endereço da API. Sem ela, o site já usa o endereço da EJECT.
- `VITE_GOOGLE_BOOKS_KEY`: chave do Google Books, usada na busca por ISBN. Sem ela a busca funciona com a cota anônima, que é menor.

Reinicie o `npm run dev` depois de alterar o arquivo.

## Estrutura de pastas

```
desafio-react-eject/
├── index.html
├── vercel.json           # redireciona as rotas para o index.html
├── public/               # arquivos estáticos (favicon)
└── src/
    ├── assets/           # imagens (mascote, logotipos, ícones, equipe)
    ├── components/       # AuthLayout, Button, Input, Cabecalho, Rodape,
    │                     # FormMaterial, AdicionarMaterial, EditarMaterial
    ├── pages/            # Login, Cadastro, RecuperarSenha, RedefinirSenha,
    │                     # Acervo, SobreNos
    ├── services/         # api.js (requisições), auth.js (sessão) e isbn.js (busca por ISBN)
    ├── App.jsx           # rotas
    ├── main.jsx
    └── index.css         # variáveis de cor, espaçamento e reset
```

## Responsividade

O layout é fluido. Em telas com mais de 900px (desktop), as medidas escalam com a largura da janela a partir de uma unidade definida em `index.css` (`--u`, equivalente a 1px do protótipo em 1600px). Abaixo de 900px (celular e tablet), entra o layout mobile.

## Funcionalidades além do protótipo

Estes itens foram incluídos para dar vida ao catálogo e não fazem parte do desenho do Figma:

- **Busca por ISBN**: ao digitar o ISBN em "Adicionar material", o formulário é preenchido com os dados do livro (Google Books). Se o livro não for encontrado, o preenchimento é manual.
- **Carrossel de novidades**: ao clicar em um slide, ele é ampliado e o texto acima muda para o livro escolhido.

## Deploy

O site é publicado na **Vercel**. O arquivo `vercel.json` devolve o `index.html` para qualquer endereço, o que faz as rotas do React Router funcionarem ao atualizar a página.

Como todos os dados vêm da API da EJECT (na internet), o site publicado funciona igual ao de desenvolvimento. O link de recuperação de senha enviado por e-mail precisa apontar para a rota `/redefinir-senha` do site.

## Autor

Desenvolvido por **Ramon Miranda** ([@ramonfbmiranda](https://github.com/ramonfbmiranda)).

Mockup desenvolvido por EJECT.
