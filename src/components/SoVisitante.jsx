import { Navigate, Outlet } from "react-router-dom";
import { estaAutenticado } from "../services/auth";

// Telas que só fazem sentido para quem NÃO está logado (login, cadastro...)
function SoVisitante() {
  return estaAutenticado() ? <Navigate to="/acervo" replace /> : <Outlet />;
}

export default SoVisitante;