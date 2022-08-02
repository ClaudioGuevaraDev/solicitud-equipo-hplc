import { useNavigate } from "react-router-dom";
import { HiLockClosed } from "@react-icons/all-files/hi/HiLockClosed";

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="container p-4">
      <div className="row">
        <div className="col-xl-5 mx-auto">
          <div className="card border-0">
            <div className="card-body">
              <div className="text-center">
                <i className="h1" style={{ color: "#9c27b0" }}>
                  <HiLockClosed />
                </i>
              </div>
              <h3 className="text-center mt-3 mb-4">Registrarse</h3>
              <div className="row">
                <div className="col-xl-6">
                  <div className="mb-3">
                    <label htmlFor="first-name-input" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="first-name-input"
                      className="form-control"
                      placeholder="Claudio"
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="mb-3">
                    <label htmlFor="last-name-input" className="form-label">
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="last-name-input"
                      className="form-control"
                      placeholder="Guevara"
                      requied
                    />
                  </div>
                </div>
              </div>
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
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password-input" className="form-label">
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
                <label htmlFor="confirm-password-input" className="form-label">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  id="confirm-password-input"
                  className="form-control"
                  placeholder="********"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="file-input" className="form-label">
                  Foto de Perfil
                </label>
                <input type="file" id="file-input" className="form-control" />
              </div>
              <div className="mb-3">
                <p
                  className="paragraph-auth text-center"
                  onClick={() => navigate("/")}
                >
                  ¿Ya tienes una cuenta registrada?
                </p>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
