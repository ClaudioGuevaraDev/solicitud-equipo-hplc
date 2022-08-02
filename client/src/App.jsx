import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPerfilPage from "./pages/DashboardPerfilPage";
import DashboardUsuariosPage from "./pages/DashboardUsuariosPage";
import DashboardEquiposPage from "./pages/DashboardEquiposPage";
import DashboardGruposPage from "./pages/DashboardGruposPage";
import DashboardProyectosPage from "./pages/DashboardProyectosPage";
import UserNotFoundPage from "./pages/errors/UserNotFoundPage";
import ErrorVerificacionPage from "./pages/errors/ErrorVerificacionPage";
import CuentaVerificadaPage from "./pages/success/CuentaVerificadaPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard/perfil" element={<DashboardPerfilPage />} />
          <Route
            path="/dashboard/usuarios"
            element={<DashboardUsuariosPage />}
          />
          <Route path="/dashboard/equipos" element={<DashboardEquiposPage />} />
          <Route path="/dashboard/grupos" element={<DashboardGruposPage />} />
          <Route
            path="/dashboard/proyectos"
            element={<DashboardProyectosPage />}
          />

          <Route path="/error/user-not-found" element={<UserNotFoundPage />} />
          <Route
            path="/error/error-verificacion"
            element={<ErrorVerificacionPage />}
          />

          <Route
            path="/success/cuenta-verificada"
            element={<CuentaVerificadaPage />}
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
