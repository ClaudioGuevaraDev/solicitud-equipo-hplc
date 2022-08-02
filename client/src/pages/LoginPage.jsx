import { useNavigate } from "react-router-dom";
import { HiLockClosed } from "@react-icons/all-files/hi/HiLockClosed";

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="container p-4">
      <div className="row">
        <div className="col-xl-4 mx-auto">
          <div className="card border-0">
            <div className="card-body">
              <div className="text-center">
                <i className="h1" style={{ color: "#9c27b0" }}>
                  <HiLockClosed />
                </i>
              </div>
              <h3 className="text-center mt-3 mb-4">Iniciar Sesión</h3>
              <div className="mb-3">
                <label htmlFor="email-input" className="form-label">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email-input"
                  className="form-control"
                  placeholder="example@gmail.com"
                  required
                  autoFocus
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password-input"
                  className="form-control"
                  placeholder="********"
                  required
                />
              </div>
              <div className="mb-3">
                <p
                  className="paragraph-auth text-center"
                  onClick={() => navigate("/register")}
                >
                  ¿No tienes una cuenta registrada?
                </p>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                onClick={() => navigate("/dashboard/perfil")}
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
