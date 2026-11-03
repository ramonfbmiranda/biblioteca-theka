import { listarUsuarios, criarUsuario } from "./api";

const CHAVE = "theka:usuario";

const normalizar = (email) => email.trim().toLowerCase();

// devolve o usuário (sem a senha) ou null se e-mail/senha não conferem
export async function entrar(email, senha) {
  const usuarios = await listarUsuarios();
  const usuario = usuarios.find(
    (u) => normalizar(u.email) === normalizar(email) && u.senha === senha
  );
  if (!usuario) return null;

  const publico = { id: usuario.id, nome: usuario.nome, email: usuario.email };
  localStorage.setItem(CHAVE, JSON.stringify(publico));
  return publico;
}

export async function cadastrar({ nome, email, senha }) {
  const usuarios = await listarUsuarios();
  if (usuarios.some((u) => normalizar(u.email) === normalizar(email))) {
    throw new Error("Este e-mail já está cadastrado.");
  }
  return criarUsuario({ nome: nome.trim(), email: normalizar(email), senha });
}

export const sair = () => localStorage.removeItem(CHAVE);

export function usuarioAtual() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE));
  } catch {
    return null;
  }
}