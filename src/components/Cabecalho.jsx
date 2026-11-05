import { Link } from "react-router-dom";
import setinha from "../assets/Setinha.png";
import perfil from "../assets/Perfil.png";
import "./Cabecalho.css";

function IconeUsuario() {
  return (
    <img src={perfil} alt="" width="36" height="36" aria-hidden="true" />
  );
}

function Cabecalho({ claro = false }) {
  return (
    <header className={`cabecalho ${claro ? "cabecalho--claro" : ""}`}>
      <img className="cabecalho__logo" src={ setinha } alt="" width="36" height="36" aria-hidden="true" />
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