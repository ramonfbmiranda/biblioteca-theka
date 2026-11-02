import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import Rodape from "./Rodape";
import setinha from "../assets/Setinha.png";

import "./FormMaterial.css";
import { buscarPorIsbn, limparIsbn } from "../services/isbn";
import { buscarLivro, criarLivro, atualizarLivro, deletarLivro } from "../services/api";

function Icone({ children }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const Marcador = () => <Icone><path d="M6 3h12v18l-6-4-6 4z" /></Icone>;
const Lixeira = () => <Icone><path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 11v6M14 11v6" /></Icone>;
const Seta = () => <Icone><path d="M6 9l6 6 6-6" /></Icone>;

function Campo({ label, name, className = "", children }) {
  return (
    <div className={`material__campo ${className}`}>
      <label htmlFor={name}>{label}</label>
      {children}
    </div>
  );
}

const VAZIO = { titulo: "", paginas: "", isbn: "", autor: "", ano: "", editora: "", resumo: "", capaUrl: "" };

function FormMaterial({ modo = "adicionar" }) {
  const navigate = useNavigate();
  const editando = modo === "editar";

  const { id } = useParams();

  const { recarregar } = useOutletContext() ?? {};

  const [valores, setValores] = useState(VAZIO);
  const [buscandoIsbn, setBuscandoIsbn] = useState(false);
  const [avisoIsbn, setAvisoIsbn] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (editando && id) {
      buscarLivro(id)
        .then((livro) => setValores({ ...VAZIO, ...livro }))
        .catch(() => setErro("Não foi possível carregar o livro."));
    }
  }, [editando, id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setValores((v) => ({ ...v, [name]: value }));
  }

  async function handleIsbnBlur() {
    const isbn = limparIsbn(valores.isbn);
    if (isbn.length !== 10 && isbn.length !== 13) return;

    setBuscandoIsbn(true);
    setAvisoIsbn("");
    try {
      const sugestao = await buscarPorIsbn(isbn);
      if (!sugestao) {
        setAvisoIsbn("Livro não encontrado. Preencha manualmente.");
        return;
      }
      // só preenche o que ainda está vazio, sem apagar o que a pessoa digitou
      setValores((v) => {
        const novo = { ...v };
        for (const [campo, valor] of Object.entries(sugestao)) {
          if (!novo[campo]) novo[campo] = valor;
        }
        return novo;
      });
    } catch {
      setAvisoIsbn("Não foi possível consultar agora. Preencha manualmente.");
    } finally {
      setBuscandoIsbn(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    const dados = { ...valores, paginas: Number(valores.paginas), ano: Number(valores.ano) };
    try {
      if (editando) await atualizarLivro(id, dados);
      else await criarLivro(dados);
      await recarregar?.();
      navigate("/acervo");
    } catch {
      setErro("Não foi possível salvar. Confira se a API está rodando.");
    }
  }

  async function handleDeletar() {
    setErro("");
    try {
      await deletarLivro(id);
      await recarregar?.();
      navigate("/acervo");
    } catch {
      setErro("Não foi possível deletar. Confira se a API está rodando.");
    }
  }

  return (
    <div className="material">
      <header className="material__header">
        <img className="material__folha" src={setinha} alt="" />
        <div className="material__marca">Theka</div>
      </header>

      <main className="material__main">
        <h1 className="material__titulo">
          {editando ? "Editar material" : "Adicionar material ao catálogo"}
        </h1>

        {editando ? (
          <div className="material__capa material__capa--preenchida" role="img" aria-label={`Capa de ${valores.titulo}`}>
            {valores.capaUrl && <img src={valores.capaUrl} alt="" />}
          </div>
        ) : (
          <div className="material__capa">
            <Icone><rect x="3" y="5" width="16" height="14" rx="2" /><path d="M7 3h14v14M3 15l5-5 5 5 3-3" /></Icone>
            {valores.capaUrl && <img src={valores.capaUrl} alt="Capa do material" />}
            <button type="button" className="material__upload">
              Adicionar capa
              <Icone><path d="M12 15V3M8 7l4-4 4 4M5 12v8h14v-8" /></Icone>
            </button>
          </div>
        )}

        <form className="material__form" onSubmit={handleSubmit}>
          <Campo label="Título no material:" name="titulo">
            <input id="titulo" name="titulo" value={valores.titulo} onChange={handleChange} placeholder="Inserir o título do material" />
          </Campo>

          <div className="material__linha">
            <Campo label="Número de páginas" name="paginas">
              <input id="paginas" name="paginas" value={valores.paginas} onChange={handleChange} placeholder="000" />
            </Campo>
            <Campo label="ISBM" name="isbn">
              <input id="isbn" name="isbn" value={valores.isbn} onChange={handleChange} onBlur={handleIsbnBlur} placeholder="xxxxxxx" />
            </Campo>
          </div>

          {buscandoIsbn && <p className="material__aviso">Buscando dados do livro...</p>}
          {avisoIsbn && <p className="material__aviso" role="status">{avisoIsbn}</p>}

          <Campo label="Autor:" name="autor">
            <input id="autor" name="autor" value={valores.autor} onChange={handleChange} placeholder="Machado de Assis" />
          </Campo>

          <div className="material__linha">
            <Campo label="Ano de publicação" name="ano">
              <input id="ano" name="ano" value={valores.ano} onChange={handleChange} placeholder="000" />
            </Campo>
            <Campo label="Editora" name="editora">
              <div className="material__select">
                <select id="editora" name="editora" value={valores.editora} onChange={handleChange}>
                  <option value="" disabled>Selecionar</option>
                  <option value="Companhia das Letras">Companhia das Letras</option>
                  {valores.editora && valores.editora !== "Companhia das Letras" && (
                    <option value={valores.editora}>{valores.editora}</option>
                  )}
                </select>
                <Seta />
              </div>
            </Campo>
          </div>

          <Campo label="Resumo do material:" name="resumo" className="material--campo--cheio">
            <textarea
              id="resumo"
              name="resumo"
              rows="4"
              value={valores.resumo}
              onChange={handleChange}
              placeholder="Inserir um breve resumo do material."
            />
          </Campo>

          {erro && <p className="material__aviso" role="alert">{erro}</p>}

          <div className={`material__acoes ${editando ? "material__acoes--editar" : ""}`}>
            {editando && (
              <button type="button" className="material__botao material__deletar" onClick={handleDeletar}>
                Deletar <Lixeira />
              </button>
            )}
            <button type="button" className="material__botao material__botao--contorno material__cancelar" onClick={() => navigate("/acervo")}>
              Cancelar
            </button>
            <button type="submit" className="material__botao material__salvar">
              Salvar <Marcador />
            </button>
          </div>
        </form>
      </main>

      <Rodape />
    </div>
  );
}

export default FormMaterial;