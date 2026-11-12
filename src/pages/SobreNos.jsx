import Cabecalho from "../components/Cabecalho";
import Rodape from "../components/Rodape";
import logotipo from "../assets/logotipo.png";
import logotipoAmarelo from "../assets/logotipoAmarelo.png";
import mascote from "../assets/sobre/MascoteSobre.svg";
import acessoTodos from "../assets/sobre/AcessoTodos.png";
import amorLeitura from "../assets/sobre/AmorLeitura.png";
import comunidadeTroca from "../assets/sobre/ComunidadeTroca.png";
import mariaMarta from "../assets/sobre/MariaMarta.png";
import juliaMaria from "../assets/sobre/JuliaMaria.png";
import jenniferOliveira from "../assets/sobre/JenniferOliveira.png";
import josivaldoLopes from "../assets/sobre/JosivaldoLopes.png";
import "./SobreNos.css";

const etiquetas = [
  "Encontros culturais",
  "Troca de experiências",
  "Comunidade",
  "Educação",
  "Aprendizado",
  "Acesso à informação",
  "Conhecimento",
];

const valores = [
  { titulo: "", imagem: acessoTodos, tom: "amarelo" },
  { titulo: "", imagem: amorLeitura, tom: "verde" },
  { titulo: "", imagem: comunidadeTroca, tom: "magenta" },
];

const equipe = [
  { nome: "Maria Marta", foto: mariaMarta, cor: "#f78520", tag: "#c06616" },
  { nome: "Júlia Maria", foto: juliaMaria, cor: "#62832a", tag: "#2a3a0e" },
  { nome: "Jeniffer Oliveira", foto: jenniferOliveira, cor: "#d532a7", tag: "#63124c" },
  { nome: "Josivaldo Lopes", foto: josivaldoLopes, cor: "#005842", tag: "#003426" },
];

function SobreNos() {
  return (
    <div className="sobre">
      <section className="sobre__hero">
        <Cabecalho claro />
        <img className="sobre__mascote" src={mascote} alt="" />
        <div className="sobre__apresentacao">
          <img src={logotipoAmarelo} alt="Theka" />
          <p>
            A <strong>Theka</strong>© é um espaço feito para conectar pessoas e histórias.
            Aqui você encontra livros para todos os gostos, além de atividades que
            incentivam o conhecimento, a cultura e a troca de experiências. Mais do que
            estantes cheias, somos um ponto de encontro para quem acredita no poder da
            leitura em transformar vidas.
          </p>
        </div>
      </section>

      <ul className="sobre__etiquetas">
        {etiquetas.map((texto) => (
          <li key={texto}>{texto}</li>
        ))}
      </ul>

      <section className="sobre__historia">
        <h2>Nossa história</h2>
        <div className="sobre__historia-texto">
          <p>
            A biblioteca nasceu do desejo de oferecer à comunidade um espaço de acesso à
            leitura, ao conhecimento e à cultura. No começo, era apenas uma pequena
            coleção de livros reunidos com carinho, mas, com o tempo, foi crescendo e
            conquistando cada vez mais leitores.
          </p>
          <p>
            Hoje, além de guardar histórias nas estantes, também faz parte da história
            de quem passa por aqui: estudantes, pesquisadores, curiosos e apaixonados
            por livros. Seguimos firmes na missão de ser um ponto de encontro,
            aprendizado e inspiração para todos.
          </p>
        </div>
        <div className="sobre__historia-logo" aria-hidden="true">
          <img src={logotipo} alt="" />
        </div>
      </section>

      <section className="sobre__secao">
        <h2>Nossos valores</h2>
        <ul className="sobre__valores">
          {valores.map((v) => (
            <li key={v.tom} className={`sobre__valor sobre__valor--${v.tom}`}>
              <h3>{v.titulo}</h3>
              <img src={v.imagem} alt="" />
            </li>
          ))}
        </ul>
      </section>

      <section className="sobre__secao">
        <h2>Nossa equipe</h2>
        <ul className="sobre__equipe">
          {equipe.map((p) => (
            <li
              key={p.nome}
              className="sobre__pessoa"
              style={{ "--cor-card": p.cor, "--cor-tag": p.tag }}
            >
              <img src={p.foto} alt={p.nome} />
              <span className="sobre__nome">{p.nome}</span>
            </li>
          ))}
        </ul>
      </section>

      <Rodape />
    </div>
  );
}

export default SobreNos;