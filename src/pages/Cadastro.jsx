import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { cadastrar } from "../services/auth";

function Cadastro() {
  const [dados, setDados] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
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

    if (dados.senha !== dados.confirmarSenha) {
      setErro("As senhas não conferem.");
      return;
    }

    setEnviando(true);
    setErro("");
    try {
      await cadastrar(dados);
      navigate("/login", { state: { cadastrado: true } });
    } catch (e) {
      setErro(e.message); // já vem em português (e-mail repetido, senha fraca, sem conexão...)
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthLayout titulo="Cadastro" lado="esquerdo">
      <form className="auth__form" onSubmit={handleSubmit}>
        <Input
          label="Nome completo"
          name="nome"
          value={dados.nome}
          onChange={handleChange}
          placeholder="Seu nome completo"
          autoComplete="name"
          required
        />

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
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirmar senha"
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
          <Button variante="contorno" onClick={() => navigate("/login")}>
            Voltar
          </Button>
          <Button type="submit" disabled={enviando}>
            {enviando ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Cadastro;