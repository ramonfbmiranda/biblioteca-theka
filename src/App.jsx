import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import RecuperarSenha from "./pages/RecuperarSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import Cadastro from "./pages/Cadastro";
import Acervo from "./pages/Acervo";
import SobreNos from "./pages/SobreNos";
import AdicionarMaterial from "./components/AdicionarMaterial";
import EditarMaterial from "./components/EditarMaterial";
import RotaProtegida from "./components/RotaProtegida";
import SoVisitante from "./components/SoVisitante";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Só para quem não está logado */}
      <Route element={<SoVisitante />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      </Route>

      {/* Vêm de link de e-mail: abertas para qualquer pessoa */}
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />
      <Route path="/redefinir-senha/:uid/:token" element={<RedefinirSenha />} />

      {/* Só para quem está logado */}
      <Route element={<RotaProtegida />}>
        <Route path="/acervo" element={<Acervo />}>
          <Route path="adicionar-material" element={<AdicionarMaterial />} />
          <Route path="editar-material/:id" element={<EditarMaterial />} />
        </Route>
        {/* Para deixar "Sobre nós" só para logados, descomente a linha abaixo
            e apague a rota pública /sobre mais abaixo */}
        {/* <Route path="/sobre" element={<SobreNos />} /> */}
      </Route>

      {/* Pública (decisão sua: veja o comentário acima) */}
      <Route path="/sobre" element={<SobreNos />} />
    </Routes>
  );
}

export default App;