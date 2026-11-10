import { Navigate, Outlet } from "react-router-dom";
import { estaAutenticado } from "../services/auth";

function RotaProtegida() {
  return estaAutenticado() ? <Outlet /> : <Navigate to="/login" replace />;
}

export default RotaProtegida;