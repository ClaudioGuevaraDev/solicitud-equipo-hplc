import { Routes, Route } from "react-router-loading";
import useUpdateContext from "../hooks/useUpdateContext";

// Pages
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPerfilPage from "../pages/DashboardPerfilPage";
import DashboardUsuariosPage from "../pages/DashboardUsuariosPage";
import DashboardEquiposPage from "../pages/DashboardEquiposPage";
import DashboardGruposPage from "../pages/DashboardGruposPage";
import DashboardProyectosPage from "../pages/DashboardProyectosPage";
import DashboardJerarquiasPage from "../pages/DashboardJerarquiasPage";
import VerifiedAccountPage from "../pages/success/VerifiedAccountPage";
import PasswordRecovery from "../pages/PasswordRecovery";
import NewPassword from "../pages/NewPassword";
import LoadingPage from "../pages/LoadingPage";
import ErrorPage from "../pages/ErrorPage";

function RouterComponent() {
  useUpdateContext();

  return (
    <Routes loadingScreen={LoadingPage}>
      <Route path="/" element={<LoginPage />} loading />
      <Route path="/register" element={<RegisterPage />} loading />
      <Route path="/password-recovery" element={<PasswordRecovery />} loading />
      <Route path="/new-password/:id" element={<NewPassword />} loading />
      <Route
        path="/dashboard/perfil"
        element={<DashboardPerfilPage />}
        loading
      />
      <Route
        path="/dashboard/jerarquias"
        element={<DashboardJerarquiasPage />}
        loading
      />
      <Route
        path="/dashboard/usuarios"
        element={<DashboardUsuariosPage />}
        loading
      />
      <Route
        path="/dashboard/equipos"
        element={<DashboardEquiposPage />}
        loading
      />
      <Route
        path="/dashboard/grupos"
        element={<DashboardGruposPage />}
        loading
      />
      <Route
        path="/dashboard/proyectos"
        element={<DashboardProyectosPage />}
        loading
      />

      <Route path="/error-page" element={<ErrorPage />} loading />

      <Route
        path="/success/verified-account"
        element={<VerifiedAccountPage />}
        loading
      />
    </Routes>
  );
}

export default RouterComponent;
