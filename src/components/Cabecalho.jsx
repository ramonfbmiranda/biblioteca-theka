import { Link } from "react-router-dom";
import "./Cabecalho.css";

function IconeUsuario() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

function Cabecalho() {
  return (
    <header className="cabecalho">
      <span className="cabecalho__logo" aria-hidden="true" />
      <nav className="cabecalho__nav">
        <Link to="/acervo">Acervo</Link>
        <Link to="/sobre">Sobre nós</Link>
      </nav>
      <button type="button" className="cabecalho__usuario" aria-label="Perfil">
        <IconeUsuario />
      </button>
    </header>
  );
}

export default Cabecalho;