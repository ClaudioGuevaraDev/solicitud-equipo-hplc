import { useNavigate } from "react-router-dom";
import { HiLockClosed } from "@react-icons/all-files/hi/HiLockClosed";
import { useState } from "react";
import axios from "axios";

function RegisterPage() {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      "http://localhost:8000/api/auth/register",
      user
    );
    console.log(response);

    // setUser({
    //   first_name: "",
    //   last_name: "",
    //   email: "",
    //   password: "",
    //   confirm_password: "",
    //   image: null,
    // });
  };

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
              <form onSubmit={handleSubmit}>
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
                        value={user.first_name}
                        onChange={(e) =>
                          setUser({ ...user, first_name: e.target.value })
                        }
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
                        required
                        value={user.last_name}
                        onChange={(e) =>
                          setUser({ ...user, last_name: e.target.value })
                        }
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
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
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
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="confirm-password-input"
                    className="form-label"
                  >
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    id="confirm-password-input"
                    className="form-control"
                    placeholder="********"
                    required
                    value={user.confirm_password}
                    onChange={(e) =>
                      setUser({ ...user, confirm_password: e.target.value })
                    }
                  />
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
