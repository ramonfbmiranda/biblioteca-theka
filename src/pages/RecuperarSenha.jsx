import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { pedirRecuperacaoDeSenha, mensagemDeErro } from "../services/api";

function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [enviadoPara, setEnviadoPara] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setEmail(e.target.value);
    setErro("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (enviando) return;

    setEnviando(true);
    setErro("");
    setEnviadoPara("");
    try {
      await pedirRecuperacaoDeSenha(email);
      setEnviadoPara(email.trim());
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthLayout titulo="Recuperar senha" lado="esquerdo">
      <form className="auth__form" onSubmit={handleSubmit}>
        <Input
          label="E-mail"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="seuemail@email.com"
          autoComplete="email"
          required
        />

        {enviadoPara && (
          <p className="auth__sucesso" role="status">
            Enviamos um link de recuperação para {enviadoPara}. Confira sua caixa de
            entrada e a pasta de spam.
          </p>
        )}
        {erro && <p className="auth__erro" role="alert">{erro}</p>}

        <div className="auth__acoes">
          <Button variante="contorno" onClick={() => navigate("/login")}>
            Voltar
          </Button>
          <Button type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : enviadoPara ? "Reenviar" : "Enviar"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default RecuperarSenha;