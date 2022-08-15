import axios from "axios";
import { useState, useEffect, useContext } from "react";
import LayoutDashboardComponent from "../components/LayoutDashboardComponent";
import AppContext from "../context/AppContext";
import toast from "react-hot-toast";

function DashboardSolicitudesPage() {
  const { userLogged } = useContext(AppContext);
  const [equipos, setEquipos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [getErrors, setGetErrors] = useState({
    grupos: false,
    proyectos: false,
  });
  const [authorizedGet, setAuthorizedGet] = useState({
    equipos: true,
    grupos: false,
    proyectos: false,
  });

  const getEquipos = async () => {
    try {
      const { data } = await axios.get("/api/equipos");
      setEquipos(data.data);
      setAuthorizedGet({ ...authorizedGet, equipos: false, grupos: true });
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
      setEquipos([]);
      setAuthorizedGet({ ...authorizedGet, equipos: false, grupos: true });
    }
  };

  const getGrupos = async () => {
    try {
      const { data } = await axios.get(`/api/users-grupos/${userLogged.id}`);
      setGrupos(data.data);
      setAuthorizedGet({ ...authorizedGet, grupos: false, proyectos: true });
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
      setGrupos([]);
      setGetErrors({ ...getErrors, grupos: true });
      setAuthorizedGet({ ...authorizedGet, grupos: false, proyectos: true });
    }
  };

  const getProyectos = async () => {
    try {
      const { data } = await axios.get(`/api/users-proyectos/${userLogged.id}`);
      setProyectos(data.data);
      setAuthorizedGet({ ...authorizedGet, proyectos: false });
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
      setProyectos([]);
      setGetErrors({ ...getErrors, proyectos: true });
      setAuthorizedGet({ ...authorizedGet, proyectos: false });
    }
  };

  useEffect(() => {
    if (authorizedGet.equipos === true && userLogged.id !== 0) getEquipos();
    if (authorizedGet.grupos === true && userLogged.id !== 0) getGrupos();
    if (authorizedGet.proyectos === true && userLogged.id !== 0) getProyectos();
  }, [userLogged.id, authorizedGet]);

  return (
    <LayoutDashboardComponent>
      <div>
        <div className="mb-3">
          <h1>
            <strong>Solicitudes</strong>
          </h1>
        </div>
        {equipos.length === 0 && (
          <div
            className="alert alert-warning"
            style={{ maxWidth: 300 }}
            role="alert"
          >
            <strong>No hay equipos para solicitar.</strong>
          </div>
        )}
        {grupos.length === 0 &&
          (getErrors.grupos === true ? (
            <div
              className="alert alert-warning"
              style={{ maxWidth: 300 }}
              role="alert"
            >
              <strong>No hay grupos para solicitar.</strong>
            </div>
          ) : (
            <div
              className="alert alert-warning"
              style={{ maxWidth: 300 }}
              role="alert"
            >
              <strong>No estás inscrito en ningún grupo.</strong>
            </div>
          ))}
        {proyectos.length === 0 &&
          (getErrors.proyectos === true ? (
            <div
              className="alert alert-warning"
              style={{ maxWidth: 300 }}
              role="alert"
            >
              <strong>No hay proyectos para solicitar.</strong>
            </div>
          ) : (
            <div
              className="alert alert-warning"
              style={{ maxWidth: 300 }}
              role="alert"
            >
              <strong>No estás inscrito en ningún proyecto.</strong>
            </div>
          ))}
        {grupos.length > 0 && equipos.length > 0 && proyectos.length > 0 && (
          <div className="row">
            <div className="col-12" style={{ maxWidth: 1000 }}>
              <div className="card">
                <div className="card-body">
                  <div className="row gy-3">
                    <div className="col-xl-4 col-lg-4 col-md-4">
                      <label htmlFor="equipos-input" className="form-label">
                        Equipos
                      </label>
                      <select className="form-select" id="equipos-input">
                        {equipos.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4">
                      <label htmlFor="grupos-input" className="form-label">
                        Grupos
                      </label>
                      <select className="form-select" id="grupos-input">
                        {grupos.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4">
                      <label htmlFor="proyectos-input" className="form-label">
                        Proyectos
                      </label>
                      <select className="form-select" id="proyectos-input">
                        {proyectos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-12">
                      <button className="btn btn-success">Solicitar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutDashboardComponent>
  );
}

export default DashboardSolicitudesPage;
