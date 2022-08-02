import { useNavigate } from "react-router-dom";

import Claudio from "../assets/claudio.jpeg";

function SidebarComponent() {
  const navigate = useNavigate();

  return (
    <aside className="container-dashboard__sidebar shadow">
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
        <li className="item-list h4">Mi Perfil</li>
      </ul>

      <hr className="divider-solid" />

      <ul className="d-flex flex-column justify-content-center align-items-center my-3">
        <li className="item-list h4">Usuarios</li>
        <li className="item-list h4">Equipos</li>
        <li className="item-list h4">Grupos</li>
        <li className="item-list h4">Proyectos</li>
      </ul>

      <hr className="divider-solid" />

      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-danger btn-md" onClick={() => navigate("/")}>
          CERRAR SESIÓN
        </button>
      </div>
    </aside>
  );
}

export default SidebarComponent;
