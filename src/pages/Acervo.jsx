import "./Acervo.css";
import Rodape from "../components/Rodape";
import Cabecalho from "../components/Cabecalho";
import { listarLivros } from "../services/api";
import { urlCapa } from "../services/isbn";
import { Link, Outlet } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import setinha from "../assets/Setinha.png";
import setaDireita from "../assets/SetaDireita.png";
import setaCima from "../assets/SetaCima.png";

// ignora acento e maiúsculas: "acao" encontra "Ação"
const normalizar = (t = "") =>
  String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const opcoes = (livros, campo) =>
  [...new Set(livros.map((l) => l[campo]).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );

function IconeSeta() {
  return <img src={setaDireita} alt="" width="36" height="36" aria-hidden="true" />;
}

function IconeSetaCima() {
  return <img src={setaCima} alt="" width="36" height="36" aria-hidden="true" />;
}

function IconeBusca() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}

function IconeFiltro() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 4v16M12 4v16M18 4v16" />
      <path d="M4 14h4M10 8h4M16 15h4" />
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
  const [ativo, setAtivo] = useState(0);
  const [busca, setBusca] = useState("");
  const [genero, setGenero] = useState("");
  const [editora, setEditora] = useState("");
  const [compacta, setCompacta] = useState(false);
  const barraRef = useRef(null);

  const carregar = useCallback(
    () => listarLivros().then(setLivros).catch((e) => setErro(e.message)),
    []
  );

  useEffect(() => {
    carregar();
  }, [carregar]);

  // mostra a busca compacta quando a barra grande sai da tela por cima
  useEffect(() => {
    const el = barraRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) =>
      setCompacta(!e.isIntersecting && e.boundingClientRect.top < 0)
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // carrossel: os 5 livros mais recentes (a API devolve do mais novo para o mais antigo)
  const destaques = livros.slice(0, 5);
  const atual = destaques[ativo] ? ativo : 0;
  const destaque = destaques[atual];

  // filtros no navegador (a lista inteira já está carregada)
  const generos = opcoes(livros, "genero");
  const editoras = opcoes(livros, "editora");

  const termo = normalizar(busca);
  const filtrados = livros.filter(
    (l) =>
      (!termo || normalizar(`${l.titulo} ${l.autor}`).includes(termo)) &&
      (!genero || l.genero === genero) &&
      (!editora || l.editora === editora)
  );

  return (
    <div className="acervo">
      <Cabecalho />

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
              className={`acervo__destaque ${i === atual ? "acervo__destaque--ativo" : ""}`}
            >
              <button
                type="button"
                className="acervo__destaque-selecionar"
                onClick={() => setAtivo(i)}
                aria-label={`Mostrar ${livro.titulo}`}
                aria-pressed={i === atual}
              >
                <ImgCapa livro={livro} />
                {i !== atual && (
                  <span className="acervo__destaque-link" aria-hidden="true">
                    <IconeSetaCima />
                  </span>
                )}
              </button>

              {i === atual && (
                <Link
                  className="acervo__destaque-link"
                  to={`/acervo/editar-material/${livro.id}`}
                  aria-label={`Abrir ${livro.titulo}`}
                >
                  <IconeSeta />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Catálogo */}
      <section className="acervo__catalogo">
        <h2>Veja nosso catálogo</h2>

        <form className="acervo__busca" ref={barraRef} onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Fazer busca"
            aria-label="Fazer busca"
          />
          <select aria-label="Gênero" value={genero} onChange={(e) => setGenero(e.target.value)}>
            <option value="">Gênero</option>
            {generos.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <select aria-label="Editora" value={editora} onChange={(e) => setEditora(e.target.value)}>
            <option value="">Editora</option>
            {editoras.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
          <button type="submit">
            Buscar <IconeBusca />
          </button>
        </form>

        {erro && <p role="alert">{erro}</p>}

        {livros.length > 0 && filtrados.length === 0 && (
          <p role="status">Nenhum livro encontrado.</p>
        )}

        <ul className="acervo__grade">
          {filtrados.map((livro) => (
            <li key={livro.id}>
              <Link to={`/acervo/editar-material/${livro.id}`}>
                <div className="acervo__capa">
                  <ImgCapa livro={livro} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Link to="/acervo/adicionar-material" className="acervo__adicionar" aria-label="Adicionar material">
        <IconeMais />
      </Link>

      {compacta && (
        <div className="acervo__mini">
          <label className="acervo__mini-busca">
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Fazer busca"
              aria-label="Fazer busca"
            />
            <IconeBusca />
          </label>
          <button
            type="button"
            className="acervo__mini-filtro"
            aria-label="Ir para os filtros"
            onClick={() => barraRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
          >
            <IconeFiltro />
          </button>
        </div>
      )}

      <Outlet context={{ recarregar: carregar }} />

      <Rodape />
    </div>
  );
}

export default Acervo;