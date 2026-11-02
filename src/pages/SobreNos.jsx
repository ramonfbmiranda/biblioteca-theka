import Cabecalho from "../components/Cabecalho";
import Rodape from "../components/Rodape";
import "./SobreNos.css";

function SobreNos() {
  return (
    <div className="sobre">
      <Cabecalho />

      <main className="sobre__conteudo">
        <h1>Sobre nós</h1>
      </main>

      <Rodape />
    </div>
  );
}

export default SobreNos;