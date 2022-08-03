import { useNavigate } from "react-router-dom";
import { HiLockClosed } from "@react-icons/all-files/hi/HiLockClosed";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useCookies } from "react-cookie";
import useRedirectDashboard from "../hooks/useRedirectDashboard";

function LoginPage() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies([]);

  const navigate = useNavigate();
  useRedirectDashboard()

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/auth/login",
        user
      );
      setCookie("token", data.token);
      setUser({
        email: "",
        password: "",
      });
      setLoading(false);
      navigate("/dashboard/perfil");
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
        setUser({
          email: "",
          password: "",
        });
        setLoading(false);
      }
    }
  };

  return (
    <div className="container p-4">
      <div className="row">
        <div className="col-xl-4 col-lg-5 col-md-7 col-sm-9 col-12 mx-auto">
          <div className="card border-0">
            <div className="card-body">
              <div className="text-center">
                <i className="h1" style={{ color: "#9c27b0" }}>
                  <HiLockClosed />
                </i>
              </div>
              <h3 className="text-center mt-3 mb-4">Iniciar Sesión</h3>
              <form onSubmit={handleSubmit}>
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
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
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
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
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
                {loading ? (
                  <button className="btn btn-primary w-100" type="button">
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Loading...</span>
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary w-100">
                    Iniciar Sesión
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
