import { useNavigate } from "react-router-dom";
import useLoadingPage from "../../hooks/useLoadingPage";

function CuentaVerificadaPage() {
  useLoadingPage()

  const navigate = useNavigate();

  return (
    <div
      className="w-100 d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div className="d-flex flex-column align-items-center text-center">
        <h1>Su cuenta ha sido verificada! Ya puede iniciar sesión.</h1>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate("/")}
        >
          Regresar
        </button>
      </div>
    </div>
  );
}

export default CuentaVerificadaPage;
