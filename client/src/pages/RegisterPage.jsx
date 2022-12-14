import { useNavigate } from "react-router-dom";
import { HiLockClosed } from "@react-icons/all-files/hi/HiLockClosed";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useRedirectDashboard from "../hooks/useRedirectDashboard";
import useLoadingPage from "../hooks/useLoadingPage";
import useGetJerarquias from "../hooks/api/useGetJerarquias";

function RegisterPage() {
  useLoadingPage();
  const { jerarquias, jerarquiaValue, setJerarquiaValue } = useGetJerarquias();

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  useRedirectDashboard();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const post = {
        ...user,
        jerarquia: jerarquiaValue,
      };

      const { data } = await axios.post("/api/auth/register", post);
      toast.success(data.detail, {
        duration: 10000,
      });
      setUser({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      setJerarquiaValue(jerarquias[0].name);
      setLoading(false);
      navigate("/");
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
      setUser({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      setJerarquiaValue(jerarquias[0].name);
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-container"
      style={{ minHeight: "100vh", height: "100%", width: "100%" }}
    >
      <div className="container p-4">
        <div className="row">
          <div className="col-xl-5 col-lg-7 col-md-9 col-sm-12 col-12 mx-auto">
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
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="mb-3">
                        <label
                          htmlFor="first-name-input"
                          className="form-label"
                        >
                          Nombre
                        </label>
                        <input
                          type="text"
                          id="first-name-input"
                          className="form-control"
                          placeholder="David"
                          required
                          value={user.first_name}
                          onChange={(e) =>
                            setUser({ ...user, first_name: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="mb-3">
                        <label htmlFor="last-name-input" className="form-label">
                          Apellido
                        </label>
                        <input
                          type="text"
                          id="last-name-input"
                          className="form-control"
                          placeholder="Medina"
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
                      Correo Electr??nico
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
                      Contrase??a
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
                      Repetir Contrase??a
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
                    <label htmlFor="jerarquia-input" className="form-label">
                      Jerarqu??a
                    </label>
                    <select
                      className="form-select"
                      id="jerarquia-input"
                      defaultValue={jerarquiaValue}
                      onChange={(e) => setJerarquiaValue(e.target.value)}
                    >
                      {jerarquias.map((j) => (
                        <option key={j.name} value={j.name}>
                          {`${j.name.charAt(0).toUpperCase()}${j.name.slice(
                            1
                          )}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <p
                      className="paragraph-auth text-center"
                      onClick={() => navigate("/")}
                    >
                      ??Ya tienes una cuenta registrada?
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
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={
                        jerarquiaValue === "" ||
                        user.first_name === "" ||
                        user.last_name === "" ||
                        user.email === "" ||
                        user.password === "" ||
                        user.confirm_password === ""
                          ? true
                          : false
                      }
                    >
                      REGISTRARSE
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
