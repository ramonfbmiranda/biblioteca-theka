import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { entrar } from "../services/auth";

function Login() {
  const [dados, setDados] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  function handleChange(e) {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
    setErro("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setErro("");
    try {
      const usuario = await entrar(dados.email, dados.senha);
      if (usuario) navigate("/acervo");
      else setErro("E-mail ou senha incorretos.");
    } catch {
      setErro("Não foi possível conectar. Confira se a API está rodando.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthLayout titulo="Login" lado="direito">
      <form className="auth__form" onSubmit={handleSubmit}>
        <Input
          label="E-mail"
          type="email"
          name="email"
          value={dados.email}
          onChange={handleChange}
          placeholder="seuemail@email.com"
          autoComplete="email"
          required
        />

        <Input
          label="Senha"
          type="password"
          name="senha"
          value={dados.senha}
          onChange={handleChange}
          placeholder="********"
          autoComplete="current-password"
          required
        />

        {state?.cadastrado && !erro && (
          <p className="auth__sucesso" role="status">
            Cadastro realizado! Entre com seu e-mail e senha.
          </p>
        )}
        {erro && <p className="auth__erro" role="alert">{erro}</p>}

        <div className="auth__links">
          <Link to="/recuperar-senha">Esqueceu a senha?</Link>
          <Link to="/cadastro">Ainda não tem cadastro?</Link>
        </div>

        <div className="auth__acoes">
          <Button type="submit" disabled={enviando}>
            {enviando ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Login;