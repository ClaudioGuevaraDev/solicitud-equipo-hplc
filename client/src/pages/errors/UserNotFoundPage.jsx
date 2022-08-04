import { useNavigate } from "react-router-dom";
import useLoadingPage from "../../hooks/useLoadingPage";

function UserNotFoundPage() {
  useLoadingPage();

  const navigate = useNavigate();

  return (
    <div
      className="w-100 d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div className="d-flex flex-column align-items-center text-center">
        <h1>Usuario no encontrado</h1>
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

export default UserNotFoundPage;
