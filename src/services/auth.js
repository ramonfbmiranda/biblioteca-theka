import {
  ErroApi,
  fazerLogin,
  renovarToken,
  cadastrarUsuario,
  mensagemDeErro,
} from "./api";

const CHAVE = "theka:sessao";

function lerSessao() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE));
  } catch {
    return null;
  }
}

const salvarSessao = (sessao) => localStorage.setItem(CHAVE, JSON.stringify(sessao));

// Um token JWT são 3 partes separadas por ponto; a do meio traz os dados (inclusive a data de validade, "exp")
function lerPayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// true se o token já venceu (ou vence nos próximos `margemSeg` segundos); se não der para ler, considera válido
function expirou(token, margemSeg = 30) {
  const exp = lerPayload(token)?.exp;
  return exp ? exp * 1000 < Date.now() + margemSeg * 1000 : false;
}

// Login. Devolve o usuário ({ email }) se deu certo, ou null se e-mail/senha estão errados.
// Qualquer outra falha (sem conexão, servidor fora do ar) vira um Error com a mensagem em português.
export async function entrar(email, senha) {
  let tokens;
  try {
    tokens = await fazerLogin(email, senha);
  } catch (e) {
    if (e instanceof ErroApi && (e.status === 401 || e.status === 400)) return null;
    throw new Error(mensagemDeErro(e));
  }

  if (!tokens?.access) throw new Error("Resposta inesperada do servidor no login.");

  const usuario = { email: email.trim().toLowerCase() };
  salvarSessao({ access: tokens.access, refresh: tokens.refresh ?? null, usuario });
  return usuario;
}

// Cadastro na API. Os erros chegam como Error com a mensagem pronta para a tela.
export async function cadastrar(dados) {
  try {
    return await cadastrarUsuario(dados);
  } catch (e) {
    throw new Error(mensagemDeErro(e));
  }
}

export function sair() {
  localStorage.removeItem(CHAVE);
  localStorage.removeItem("theka:usuario"); // chave da versão antiga do login
}

// Autenticado = tem sessão e (access ainda válido OU refresh ainda válido para renová-lo)
export function estaAutenticado() {
  const sessao = lerSessao();
  if (!sessao?.access) return false;
  if (!expirou(sessao.access, 0)) return true;
  return Boolean(sessao.refresh) && !expirou(sessao.refresh, 0);
}

export const usuarioAtual = () => lerSessao()?.usuario ?? null;

// Devolve um access token válido, renovando com o refresh se o atual venceu.
// Ainda não é usado por nenhuma tela: fica pronto para quando algum pedido precisar mandar o token.
export async function obterAccessToken() {
  const sessao = lerSessao();
  if (!sessao) return null;
  if (!expirou(sessao.access)) return sessao.access;

  if (!sessao.refresh || expirou(sessao.refresh, 0)) {
    sair();
    return null;
  }

  try {
    const novo = await renovarToken(sessao.refresh);
    salvarSessao({ ...sessao, access: novo.access, refresh: novo.refresh ?? sessao.refresh });
    return novo.access;
  } catch (e) {
    if (e instanceof ErroApi) sair(); // refresh recusado: sessão acabou
    return null; // sem internet: mantém a sessão e tenta depois
  }
}