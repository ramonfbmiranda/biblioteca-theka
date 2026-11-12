// Livros, gêneros, editoras e autenticação: API da EJECT (Django REST Framework).
// Por padrão os pedidos vão para /api no próprio site (proxy do Vite em desenvolvimento
// e do vercel.json em produção), o que evita o bloqueio de CORS.
const API = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

// Erro de resposta da API: guarda o código HTTP e o corpo que o servidor devolveu
export class ErroApi extends Error {
  constructor(status, dados) {
    const detalhe = dados ? JSON.stringify(dados) : "";
    super(`Erro ${status} ao comunicar com o servidor. ${detalhe}`.trim());
    this.name = "ErroApi";
    this.status = status;
    this.dados = dados;
  }
}

async function requisitar(url, opcoes) {
  const resposta = await fetch(url, opcoes);
  if (!resposta.ok) {
    let dados = null;
    try {
      dados = await resposta.json();
    } catch {
      // resposta sem JSON
    }
    throw new ErroApi(resposta.status, dados);
  }
  return resposta.status === 204 ? null : resposta.json();
}

// auth.js registra aqui como obter o token e o que fazer quando a sessão acaba
// (assim api.js e auth.js não precisam importar um ao outro)
let obterToken = async () => null;
let aoSessaoExpirar = () => {};

export function configurarSessao({ obterToken: o, aoExpirar }) {
  obterToken = o;
  aoSessaoExpirar = aoExpirar;
}

// Só para livros, gêneros e editoras. Não use no login/cadastro/recuperação:
// o DRF responde 401 se receber um token inválido, mesmo em rota pública.
async function requisitarAutenticado(url, opcoes = {}) {
  const token = await obterToken();
  const comToken = token
    ? { ...opcoes, headers: { ...opcoes.headers, Authorization: `Bearer ${token}` } }
    : opcoes;
  try {
    return await requisitar(url, comToken);
  } catch (e) {
    if (e instanceof ErroApi && e.status === 401) aoSessaoExpirar();
    throw e;
  }
}

const comJson = (metodo, corpo) => ({
  method: metodo,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(corpo),
});

// segue as páginas (?page=2, ?page=3...) até acabar; aceita lista simples também.
// O link da próxima página vem com o endereço completo da API, então troco o início
// pelo API para continuar passando pelo proxy.
async function listarTodos(url, buscar = requisitar) {
  const itens = [];
  let proxima = url;
  while (proxima) {
    const dados = await buscar(proxima);
    if (Array.isArray(dados)) return dados;
    itens.push(...dados.results);
    proxima = dados.next ? dados.next.replace(/^https?:\/\/[^/]+/, API) : null;
  }
  return itens;
}

// ---------- Livros ----------

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

// número vazio vira "undefined" e é omitido do envio (a API rejeita "" em campo numérico)
const numero = (v) => (v === "" || v == null ? undefined : Number(v));

// formato do site -> API
const paraApi = (d) => ({
  titulo: d.titulo,
  autor: d.autor,
  ano_publicacao: numero(d.ano),
  numero_paginas: numero(d.paginas),
  isbn: d.isbn,
  genero: d.genero,
  editora: d.editora,
  resumo: d.resumo,
});

// JSON normal ou, se houver arquivo de capa, multipart (formulário com arquivo)
function corpoLivro(metodo, dados, arquivo) {
  if (!arquivo) return comJson(metodo, paraApi(dados));
  const form = new FormData();
  for (const [campo, valor] of Object.entries(paraApi(dados))) {
    if (valor !== "" && valor != null) form.append(campo, valor);
  }
  form.append("capa", arquivo);
  return { method: metodo, body: form }; // sem Content-Type: o navegador define
}

export const listarLivros = () =>
  listarTodos(`${API}/livros/`, requisitarAutenticado).then((lista) => lista.map(deApi));

export const buscarLivro = (id) =>
  requisitarAutenticado(`${API}/livros/${id}/`).then(deApi);

export const criarLivro = (dados, arquivo) =>
  requisitarAutenticado(`${API}/livros/`, corpoLivro("POST", dados, arquivo)).then(deApi);

export const atualizarLivro = (id, dados, arquivo) =>
  requisitarAutenticado(`${API}/livros/${id}/`, corpoLivro("PATCH", dados, arquivo)).then(deApi);

export const deletarLivro = (id) =>
  requisitarAutenticado(`${API}/livros/${id}/`, { method: "DELETE" });

export const listarEditoras = () => listarTodos(`${API}/editoras/`, requisitarAutenticado);
export const listarGeneros = () => listarTodos(`${API}/generos/`, requisitarAutenticado);

// ---------- Autenticação (API da EJECT) ----------

const normalizarEmail = (email) => email.trim().toLowerCase();

// Login: devolve os tokens
export const fazerLogin = (email, senha) =>
  requisitar(
    `${API}/auth/token/`,
    comJson("POST", { email: normalizarEmail(email), password: senha })
  );

// Troca o refresh por um access novo
export const renovarToken = (refresh) =>
  requisitar(`${API}/auth/token/refresh/`, comJson("POST", { refresh }));

// Cadastro: o e-mail também serve de username; "nome completo" vira nome + sobrenome
export function cadastrarUsuario({ nome, email, senha, confirmarSenha }) {
  const [primeiro = "", ...resto] = nome.trim().split(/\s+/);
  const login = normalizarEmail(email);
  return requisitar(
    `${API}/users/`,
    comJson("POST", {
      username: login,
      email: login,
      password: senha,
      password_confirm: confirmarSenha,
      first_name: primeiro,
      last_name: resto.join(" "),
    })
  );
}

// Recuperação de senha, etapa 1: a API envia um e-mail com o link
export const pedirRecuperacaoDeSenha = (email) =>
  requisitar(
    `${API}/auth/password/reset/`,
    comJson("POST", { email: normalizarEmail(email) })
  );

// Recuperação de senha, etapa 2: uid e token vêm do link do e-mail
export const confirmarNovaSenha = ({ uid, token, novaSenha, confirmarSenha }) =>
  requisitar(
    `${API}/auth/password/reset/confirm/`,
    comJson("POST", {
      uid,
      token,
      new_password: novaSenha,
      new_password_confirm: confirmarSenha,
    })
  );

// ---------- Mensagens de erro em português ----------

const ROTULOS = {
  email: "E-mail",
  username: "E-mail",
  password: "Senha",
  password_confirm: "Confirmação de senha",
  first_name: "Nome",
  last_name: "Sobrenome",
  new_password: "Nova senha",
  new_password_confirm: "Confirmação da nova senha",
};

const LINK_INVALIDO = "Este link é inválido ou expirou. Peça um novo.";

// mensagens em inglês que o Django costuma devolver; as que já vêm em português passam direto
function traduzir(msg) {
  if (/no active account|unable to log in/i.test(msg)) return "E-mail ou senha incorretos.";
  if (/field/i.test(msg) && /required/i.test(msg)) return "Preencha este campo.";
  if (/may not be (blank|null)/i.test(msg)) return "Preencha este campo.";
  if (/valid email/i.test(msg)) return "Digite um e-mail válido.";
  const curta = msg.match(/too short.*?(\d+)/i);
  if (curta) return `A senha é muito curta (mínimo de ${curta[1]} caracteres).`;
  if (/too common/i.test(msg)) return "Essa senha é muito comum. Escolha outra.";
  if (/entirely numeric/i.test(msg)) return "A senha não pode ter só números.";
  if (/too similar/i.test(msg)) return "A senha é parecida demais com os seus dados.";
  if (/(do not|don't) match/i.test(msg)) return "As senhas não conferem.";
  if (/(invalid|expired)/i.test(msg) && /(token|link)/i.test(msg)) return LINK_INVALIDO;
  return msg;
}

// Transforma qualquer erro de chamada em uma frase para mostrar na tela.
// `aoNegar` é a frase usada quando o servidor responde 401 (ex.: "E-mail ou senha incorretos.")
export function mensagemDeErro(erro, aoNegar) {
  if (!(erro instanceof ErroApi)) {
    return "Não foi possível conectar. Verifique sua internet e tente de novo.";
  }
  if (erro.status === 401 && aoNegar) return aoNegar;
  if (erro.status >= 500) return "O servidor está com problemas. Tente de novo em instantes.";

  const dados = erro.dados;
  if (!dados) return "Algo deu errado. Tente de novo.";
  if (typeof dados === "string") return traduzir(dados);

  const partes = new Set();
  for (const [campo, valor] of Object.entries(dados)) {
    if (campo === "uid" || campo === "token") {
      partes.add(LINK_INVALIDO);
      continue;
    }
    const lista = Array.isArray(valor) ? valor : [valor];
    for (const item of lista) {
      const texto = typeof item === "string" ? item : JSON.stringify(item);
      if (/already exists|já existe/i.test(texto) && (campo === "email" || campo === "username")) {
        partes.add("Este e-mail já está cadastrado.");
      } else if (["detail", "message", "non_field_errors"].includes(campo)) {
        partes.add(traduzir(texto));
      } else {
        partes.add(`${ROTULOS[campo] ?? campo}: ${traduzir(texto)}`);
      }
    }
  }
  return [...partes].join(" ") || "Algo deu errado. Tente de novo.";
}