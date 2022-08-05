import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useHandleToken from "../hooks/useHandleToken";

import UnknownProfile from "../assets/unknown_perfil.jpg";

function SidebarComponent() {
  const [loadingLogout, setLoadingLogout] = useState(false);
  const navigate = useNavigate();
  const { loggedUser, loadingDataUser } = useHandleToken();

  const handleSection = (section) => {
    navigate(`/dashboard/${section}`);
  };

  const logout = () => {
    setLoadingLogout(true);
    window.localStorage.removeItem("token");
    setLoadingLogout(false);
    navigate("/");
  };

  if (loadingDataUser === true) return <h1>Loading...</h1>

  return (
    <>
      <div className="d-flex justify-content-center align-items-center mt-4">
        <img
          src={loggedUser.url_image ? loggedUser.url_image : UnknownProfile}
          alt={`${loggedUser.first_name} ${loggedUser.last_name}`}
          className="rounded-circle"
          style={{ width: "11rem", height: "11rem", maxWidth: "100%" }}
        />
      </div>

      <h3 className="h5 my-3 text-center">
        {`${loggedUser.first_name} ${loggedUser.last_name}`}
      </h3>

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
