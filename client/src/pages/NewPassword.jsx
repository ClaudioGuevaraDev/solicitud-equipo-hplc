import { useState } from "react";
import { HiLockClosed } from "@react-icons/all-files/hi/HiLockClosed";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useLoadingPage from "../hooks/useLoadingPage";
import useRedirectDashboard from "../hooks/useRedirectDashboard";

function NewPassword() {
  useLoadingPage();
  useRedirectDashboard();

  const [user, setUser] = useState({
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await axios.post(
        `/api/auth/change-password/${id}`,
        user
      );
      toast.success(data.detail, {
        duration: 6000,
      });
      setLoading(false);
      navigate("/");
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
        setUser({
          password: "",
          confirm_password: "",
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
                <h3 className="text-center mt-3 mb-4">Cambiar Contraseña</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="password-input" className="form-label">
                      Nueva Contraseña
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
                      Repetir Contraseña
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
                        user.password === "" || user.confirm_password === ""
                          ? true
                          : false
                      }
                    >
                      CAMBIAR CONTRASEÑA
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

export default NewPassword;
