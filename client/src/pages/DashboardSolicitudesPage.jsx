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

  const getEquipos = async () => {
    try {
      const { data } = await axios.get("/api/equipos");
      setEquipos(data.data);
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
      setEquipos([]);
    }
  };

  const getGrupos = async () => {
    try {
      const { data } = await axios.get(`/api/users-grupos/${userLogged.id}`);
      setGrupos(data.data);
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
      setGrupos([]);
      setGetErrors({ ...getErrors, grupos: true });
    }
  };

  const getProyectos = async () => {
    try {
      const { data } = await axios.get(`/api/users-proyectos/${userLogged.id}`);
      setProyectos(data.data);
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
      setProyectos([]);
      setGetErrors({ ...getErrors, proyectos: true });
    }
  };

  useEffect(() => {
    if (userLogged.id !== 0) getEquipos();
    if (userLogged.id !== 0) getGrupos();
    if (userLogged.id !== 0) getProyectos();
  }, [userLogged.id]);

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
            <div className="col-12">
              <div className="card">
                <div className="card-body"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutDashboardComponent>
  );
}

export default DashboardSolicitudesPage;
