// Livros, gêneros e editoras: API da EJECT (Django REST Framework)
const API = (
  import.meta.env.VITE_API_URL ?? "https://thekaapitrainee1.pythonanywhere.com"
).replace(/\/$/, "");

// Usuários: json-server em desenvolvimento; no site publicado, lê /db.json (somente leitura)
const USUARIOS_DEV = "http://localhost:3000";

async function requisitar(url, opcoes) {
  const resposta = await fetch(url, opcoes);
  if (!resposta.ok) {
    let detalhe = "";
    try {
      detalhe = JSON.stringify(await resposta.json());
    } catch {
      // resposta sem JSON
    }
    throw new Error(`Erro ${resposta.status} ao comunicar com o servidor. ${detalhe}`.trim());
  }
  return resposta.status === 204 ? null : resposta.json();
}

const comJson = (metodo, corpo) => ({
  method: metodo,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(corpo),
});

// segue as páginas (?page=2, ?page=3...) até acabar; aceita lista simples também
async function listarTodos(url) {
  const itens = [];
  let proxima = url;
  while (proxima) {
    const dados = await requisitar(proxima);
    if (Array.isArray(dados)) return dados;
    itens.push(...dados.results);
    proxima = dados.next;
  }
  return itens;
}

// API -> formato que o site usa
const deApi = (l) => ({
  id: l.id,
  titulo: l.titulo ?? "",
  autor: l.autor ?? "",
  ano: l.ano_publicacao ?? "",
  paginas: l.numero_paginas ?? "",
  isbn: l.isbn ?? "",
  genero: l.genero ?? "",
  editora: l.editora ?? "",
  resumo: l.resumo ?? "",
  capaUrl: l.capa ?? "",
});

// formato do site -> API
const paraApi = (d) => ({
  titulo: d.titulo,
  autor: d.autor,
  ano_publicacao: d.ano,
  numero_paginas: d.paginas,
  isbn: d.isbn,
  genero: d.genero,
  editora: d.editora,
  resumo: d.resumo,
});

// Livros
export const listarLivros = () =>
  listarTodos(`${API}/livros/`).then((lista) => lista.map(deApi));

export const buscarLivro = (id) =>
  requisitar(`${API}/livros/${id}/`).then(deApi);

export const criarLivro = (dados) =>
  requisitar(`${API}/livros/`, comJson("POST", paraApi(dados))).then(deApi);

export const atualizarLivro = (id, dados) =>
  requisitar(`${API}/livros/${id}/`, comJson("PATCH", paraApi(dados))).then(deApi);

export const deletarLivro = (id) =>
  requisitar(`${API}/livros/${id}/`, { method: "DELETE" });

// Gêneros e editoras
export const listarEditoras = () => listarTodos(`${API}/editoras/`);
export const listarGeneros = () => listarTodos(`${API}/generos/`);

// Usuários (login e cadastro)
async function lerEstatico() {
  const resposta = await fetch("/db.json");
  if (!resposta.ok) throw new Error("Não foi possível carregar os dados.");
  return resposta.json();
}

export const listarUsuarios = () =>
  import.meta.env.DEV
    ? requisitar(`${USUARIOS_DEV}/usuarios`)
    : lerEstatico().then((d) => d.usuarios ?? []);

export async function criarUsuario(dados) {
  if (!import.meta.env.DEV) throw new Error("Esta versão publicada é somente leitura.");
  return requisitar(`${USUARIOS_DEV}/usuarios`, comJson("POST", dados));
}