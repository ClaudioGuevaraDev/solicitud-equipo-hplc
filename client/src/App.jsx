import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-loading";
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
import PasswordRecovery from "./pages/PasswordRecovery";
import NewPassword from "./pages/NewPassword";
import ChangePasswordErrorPage from "./pages/errors/ChangePasswordErrorPage";
import ChangePasswordSuccessPage from "./pages/success/ChangePasswordSuccessPage";
import LoadingPage from "./pages/LoadingPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes loadingScreen={LoadingPage}>
          <Route path="/" element={<LoginPage />} loading />
          <Route path="/register" element={<RegisterPage />} loading />
          <Route
            path="/password-recovery"
            element={<PasswordRecovery />}
            loading
          />
          <Route path="/new-password/:id" element={<NewPassword />} loading />
          <Route
            path="/dashboard/perfil"
            element={<DashboardPerfilPage />}
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

          <Route
            path="/error/user-not-found"
            element={<UserNotFoundPage />}
            loading
          />
          <Route
            path="/error/error-verificacion"
            element={<ErrorVerificacionPage />}
            loading
          />
          <Route
            path="/error/error-change-password"
            element={<ChangePasswordErrorPage />}
            loading
          />

          <Route
            path="/success/cuenta-verificada"
            element={<CuentaVerificadaPage />}
            loading
          />
          <Route
            path="/success/change-password-success"
            element={<ChangePasswordSuccessPage />}
            loading
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
