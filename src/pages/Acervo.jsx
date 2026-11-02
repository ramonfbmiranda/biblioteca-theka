
import "./Acervo.css";
import Rodape from "../components/Rodape";
import Cabecalho from "../components/Cabecalho";
import { listarLivros } from "../services/api";
import { urlCapa } from "../services/isbn";
import { Link, Outlet } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

// [COMPONENTIZADO PARA O CABEÇALHO] 
// function IconeUsuario() {
//   return (
//     <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
//       <circle cx="12" cy="8" r="4" />
//       <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
//     </svg>
//   );
// }

function IconeSeta() {
  return (
    <svg viewBox="0 0 36 36" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="18" r="16" />
      <path d="M11 18h14M19 12l6 6-6 6" />
    </svg>
  );
}

function IconeBusca() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}

function IconeMais() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ImgCapa({ livro }) {
  const src = urlCapa(livro);
  if (!src) return null;
  return (
    <img
      src={src}
      alt={livro.titulo}
      onError={(e) => (e.currentTarget.style.display = "none")}
    />
  );
}

function Acervo() {
  const [livros, setLivros] = useState([]);
  const [erro, setErro] = useState("");

    const carregar = useCallback(
      () => listarLivros().then(setLivros).catch((e) => setErro(e.message)),
      []
    );

    useEffect(() => {
      carregar();
    }, [carregar]);

  const destaques = livros.slice(0, 5);
  const destaque = destaques[0];

  return (
    <div className="acervo">
      <Cabecalho />
      {/* Cabeçalho [Componentizado]
      <header className="acervo__header">
        <span className="acervo__logo-circulo" aria-hidden="true" />
        <nav className="acervo__nav">
          <Link to="/acervo">Acervo</Link>
          <Link to="/sobre">Sobre nós</Link>
        </nav>
        <button type="button" className="acervo__usuario" aria-label="Perfil">
          <IconeUsuario />
        </button>
      </header> */}

      {/* Novidades */}
      <section className="acervo__hero">
        <div className="acervo__hero-texto">
          <h1>Novidades<br />da<br />semana</h1>  
          {destaque && (
            <div>
              <p className="acervo__hero-livro">{destaque.titulo}</p>
              <p className="acervo__hero-autor">
                {destaque.autor} - {destaque.ano}
              </p>
            </div>
          )}
        </div>

        <div className="acervo__carrossel">
          {destaques.map((livro, i) => (
            <div
              key={livro.id}
              className={`acervo__destaque ${i === 0 ? "acervo__destaque--ativo" : ""}`}
            >
              <ImgCapa livro={livro} />
              <Link
                className="acervo__destaque-link"
                to={`/acervo/editar-material/${livro.id}`}
                aria-label={`Abrir ${livro.titulo}`}
              >
                <IconeSeta />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Catálogo */}
      <section className="acervo__catalogo">
        <h2>Veja nosso catálogo</h2>

        <form className="acervo__busca" onSubmit={(e) => e.preventDefault()}>
          <input type="search" placeholder="Fazer busca" aria-label="Fazer busca" />
          <select aria-label="Gênero" defaultValue="">
            <option value="" disabled>Gênero</option>
          </select>
          <select aria-label="Ordenar" defaultValue="">
            <option value="" disabled>Ordem</option>
          </select>
          <button type="submit">
            Buscar <IconeBusca />
          </button>
        </form>

        {erro && <p role="alert">{erro}</p>}

        <ul className="acervo__grade">
          {livros.map((livro) => (
            <li key={livro.id}>
              <Link
               to={`/acervo/editar-material/${livro.id}`}>
                <div className="acervo__capa">
                  <ImgCapa livro={livro} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
{/* (RETIREI BOTÕES PORQUE NÃO TEM SENTIDO)
        <nav className="acervo__paginacao" aria-label="Paginação">
          <button type="button" className="acervo__seta" aria-label="Página anterior">‹</button>
          <button type="button">1</button>
          <button type="button" className="acervo__pagina--ativa" aria-current="page">2</button>
          <button type="button">3</button>
          <button type="button" className="acervo__seta" aria-label="Próxima página">›</button>
        </nav> */}
      </section>

      <Link to="/adicionar-material" className="acervo__adicionar" aria-label="Adicionar material">
        <IconeMais />
      </Link>
      
      <Outlet context={{ recarregar: carregar }} />
      
      <Rodape />
    </div>
  );
}

export default Acervo;