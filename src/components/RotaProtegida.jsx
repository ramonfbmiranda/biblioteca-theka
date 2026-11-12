import { Navigate, Outlet, useLocation } from "react-router-dom";
import { estaAutenticado } from "../services/auth";

function RotaProtegida() {
  const local = useLocation();

  if (estaAutenticado()) return <Outlet />;

  // guarda o endereço que a pessoa queria abrir, para voltar depois do login
  return <Navigate to="/login" replace state={{ de: local.pathname }} />;
}

export default RotaProtegida;