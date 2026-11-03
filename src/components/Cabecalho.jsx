import { Link } from "react-router-dom";
import setinha from "../assets/Setinha.png";
import "./Cabecalho.css";

function IconeUsuario() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.2 19c1.4-2.2 3.4-3.2 5.8-3.2s4.4 1 5.8 3.2" />
    </svg>
  );
}

function Cabecalho({ claro = false }) {
  return (
    <header className={`cabecalho ${claro ? "cabecalho--claro" : ""}`}>
      <img className="cabecalho__logo" src={setinha} alt="" />
      <div className="cabecalho__barra">
        <nav className="cabecalho__nav">
          <Link to="/acervo">Acervo</Link>
          <Link to="/sobre">Sobre nós</Link>
        </nav>
        <button type="button" className="cabecalho__usuario" aria-label="Perfil">
          <IconeUsuario />
        </button>
      </div>
    </header>
  );
}

export default Cabecalho;