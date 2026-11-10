import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { confirmarNovaSenha, mensagemDeErro } from "../services/api";

function RedefinirSenha() {
  const { uid: uidRota, token: tokenRota } = useParams();
  const [busca] = useSearchParams();
  const uid = uidRota ?? busca.get("uid") ?? "";
  const token = tokenRota ?? busca.get("token") ?? "";
  const linkValido = Boolean(uid && token);

  const [dados, setDados] = useState({ novaSenha: "", confirmarSenha: "" });
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
    setErro("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (enviando) return;

    if (dados.novaSenha !== dados.confirmarSenha) {
      setErro("As senhas não conferem.");
      return;
    }

    setEnviando(true);
    setErro("");
    try {
      await confirmarNovaSenha({
        uid,
        token,
        novaSenha: dados.novaSenha,
        confirmarSenha: dados.confirmarSenha,
      });
      navigate("/login", { state: { senhaRedefinida: true } });
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setEnviando(false);
    }
  }

  // quem abre a tela sem passar pelo link do e-mail
  if (!linkValido) {
    return (
      <AuthLayout titulo="Recuperar senha" lado="esquerdo">
        <div className="auth__form">
          <p className="auth__erro" role="alert">
            Este link é inválido ou expirou. Peça um novo link de recuperação.
          </p>

          <div className="auth__acoes">
            <Button variante="contorno" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/recuperar-senha")}>Pedir novo link</Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout titulo="Recuperar senha" lado="esquerdo">
      <form className="auth__form" onSubmit={handleSubmit}>
        <Input
          label="Nova senha"
          type="password"
          name="novaSenha"
          value={dados.novaSenha}
          onChange={handleChange}
          placeholder="********"
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirmar nova senha"
          type="password"
          name="confirmarSenha"
          value={dados.confirmarSenha}
          onChange={handleChange}
          placeholder="********"
          autoComplete="new-password"
          required
        />

        {erro && <p className="auth__erro" role="alert">{erro}</p>}

        <div className="auth__acoes">
          <Button variante="contorno" onClick={() => navigate("/recuperar-senha")}>
            Voltar
          </Button>
          <Button type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default RedefinirSenha;