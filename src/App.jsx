import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import RecuperarSenha from "./pages/RecuperarSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import Cadastro from "./pages/Cadastro";
import Acervo from "./pages/Acervo";
import SobreNos from "./pages/SobreNos";
import AdicionarMaterial from "./components/AdicionarMaterial";
import EditarMaterial from "./components/EditarMaterial";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />
      <Route path="/redefinir-senha/:uid/:token" element={<RedefinirSenha />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/sobre" element={<SobreNos />} />
      <Route element={<RotaProtegida />}>
        <Route path="/acervo" element={<Acervo />}>
          <Route path="adicionar-material" element={<AdicionarMaterial />} />
          <Route path="editar-material/:id" element={<EditarMaterial />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;