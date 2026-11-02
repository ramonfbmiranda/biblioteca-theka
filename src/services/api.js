const BASE_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "http://localhost:3000" : "");

// Sem API (site publicado só com arquivos), lê de /db.json e não grava
const MODO_ESTATICO = !BASE_URL;

async function requisitar(caminho, opcoes) {
  const resposta = await fetch(`${BASE_URL}${caminho}`, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });
  if (!resposta.ok) throw new Error("Erro ao comunicar com o servidor.");
  return resposta.status === 204 ? null : resposta.json();
}

async function lerEstatico() {
  const resposta = await fetch("/db.json");
  if (!resposta.ok) throw new Error("Não foi possível carregar o acervo.");
  const dados = await resposta.json();
  return dados.livros;
}

function somenteLeitura() {
  throw new Error("Esta versão publicada é somente leitura.");
}

export const listarLivros = () =>
  MODO_ESTATICO ? lerEstatico() : requisitar("/livros");

export const buscarLivro = async (id) =>
  MODO_ESTATICO
    ? (await lerEstatico()).find((l) => String(l.id) === String(id))
    : requisitar(`/livros/${id}`);

export const criarLivro = (dados) =>
  MODO_ESTATICO
    ? somenteLeitura()
    : requisitar("/livros", { method: "POST", body: JSON.stringify(dados) });

export const atualizarLivro = (id, dados) =>
  MODO_ESTATICO
    ? somenteLeitura()
    : requisitar(`/livros/${id}`, { method: "PUT", body: JSON.stringify(dados) });

export const deletarLivro = (id) =>
  MODO_ESTATICO
    ? somenteLeitura()
    : requisitar(`/livros/${id}`, { method: "DELETE" });