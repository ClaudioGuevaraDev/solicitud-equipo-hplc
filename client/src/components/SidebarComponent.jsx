import { useNavigate } from "react-router-dom";
import { useState } from "react";

import UnknownProfile from "../assets/unknown_perfil.jpg";
import { useContext } from "react";
import AppContext from "../context/AppContext";

function SidebarComponent() {
  const [loadingLogout, setLoadingLogout] = useState(false);
  const navigate = useNavigate();
  const { userLogged } = useContext(AppContext);

  const handleSection = (section) => {
    navigate(`/dashboard/${section}`);
  };

  const logout = () => {
    setLoadingLogout(true);
    if (window.localStorage.getItem("token"))
      window.localStorage.removeItem("token");
    setLoadingLogout(false);
    navigate("/");
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center mt-4">
        <img
          src={userLogged.url_image ? userLogged.url_image : UnknownProfile}
          alt={`${userLogged.first_name} ${userLogged.last_name}`}
          className="rounded-circle"
          style={{ width: "11rem", height: "11rem", maxWidth: "100%" }}
        />
      </div>

      <h3 className="h5 mt-3 text-center">
        {`${userLogged.first_name} ${userLogged.last_name}`}
      </h3>
      <h5 className="text-center h5 mb-4"><em>{userLogged.jerarquia}</em></h5>

      <hr className="divider-solid" />

      <ul className="d-flex flex-column justify-content-center align-items-center my-3">
        <li
          className={`item-list h4 ${
            window.location.href.split("/")[4] === "perfil" && "active"
          }`}
          onClick={() => handleSection("perfil")}
        >
          Mi Perfil
        </li>
      </ul>

      {userLogged.role === "admin" && (
        <>
          <hr className="divider-solid" />

          <ul className="d-flex flex-column justify-content-center align-items-center my-3">
            <li
              className={`item-list h4 ${
                window.location.href.split("/")[4] === "jerarquias" && "active"
              }`}
              onClick={() => handleSection("jerarquias")}
            >
              Jerarquías
            </li>
            <li
              className={`item-list h4 ${
                window.location.href.split("/")[4] === "lideres" && "active"
              }`}
              onClick={() => handleSection("lideres")}
            >
              Líderes
            </li>
          </ul>
        </>
      )}

      <hr className="divider-solid" />

      <ul className="d-flex flex-column justify-content-center align-items-center my-3">
        <li
          className={`item-list h4 ${
            window.location.href.split("/")[4] === "usuarios" && "active"
          }`}
          onClick={() => handleSection("usuarios")}
        >
          Usuarios
        </li>
        <li
          className={`item-list h4 ${
            window.location.href.split("/")[4] === "equipos" && "active"
          }`}
          onClick={() => handleSection("equipos")}
        >
          Equipos
        </li>
        <li
          className={`item-list h4 ${
            window.location.href.split("/")[4] === "grupos" && "active"
          }`}
          onClick={() => handleSection("grupos")}
        >
          Grupos
        </li>
        <li
          className={`item-list h4 ${
            window.location.href.split("/")[4] === "proyectos" && "active"
          }`}
          onClick={() => handleSection("proyectos")}
        >
          Proyectos
        </li>
      </ul>

      <hr className="divider-solid" />

      <div className="d-flex justify-content-center mt-4">
        {loadingLogout ? (
          <button className="btn btn-danger btn-md w-100" type="button">
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Loading...</span>
          </button>
        ) : (
          <button className="btn btn-danger btn-md" onClick={logout}>
            CERRAR SESIÓN
          </button>
        )}
      </div>
    </>
  );
}

export default SidebarComponent;
