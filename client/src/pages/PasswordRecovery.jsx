import { useState } from "react";
import { HiLockClosed } from "@react-icons/all-files/hi/HiLockClosed";
import axios from "axios";
import toast from "react-hot-toast";
import useLoadingPage from "../hooks/useLoadingPage";
import useRedirectDashboard from "../hooks/useRedirectDashboard";

function PasswordRecovery() {
  useLoadingPage();
  useRedirectDashboard();

  const [user, setUser] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await axios.post("/api/auth/password-recovery", user);
      toast.success(data.detail, {
        duration: 10000,
      });
      setUser({
        email: "",
      });
      setLoading(false);
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
        setUser({
          email: "",
        });
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="bg-container"
      style={{ minHeight: "100vh", height: "100%", width: "100%" }}
    >
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
                <h3 className="text-center mt-3 mb-4">Recuperar Contraseña</h3>
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
                      disabled={user.email === "" ? true : false}
                    >
                      RECUPERAR CONTRASEÑA
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

export default PasswordRecovery;
