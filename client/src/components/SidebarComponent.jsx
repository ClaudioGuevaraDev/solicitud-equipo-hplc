import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import Claudio from "../assets/claudio.jpeg";

function SidebarComponent() {
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const navigate = useNavigate();

  const handleSection = (section) => {
    navigate(`/dashboard/${section}`);
  };

  const logout = () => {
    if (cookies.token) {
      removeCookie("token");
    }
    navigate("/");
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center mt-4">
        <img
          src={Claudio}
          alt="zoro"
          className="rounded-circle"
          style={{ width: "11rem", height: "11rem", maxWidth: "100%" }}
        />
      </div>

      <h3 className="h5 my-3 text-center">Claudio Guevara</h3>

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
        <button className="btn btn-danger btn-md" onClick={logout}>
          CERRAR SESIÓN
        </button>
      </div>
    </>
  );
}

export default SidebarComponent;
