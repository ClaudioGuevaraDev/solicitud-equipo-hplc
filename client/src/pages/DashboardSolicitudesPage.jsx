import axios from "axios";
import { useState, useEffect, useContext } from "react";
import LayoutDashboardComponent from "../components/LayoutDashboardComponent";
import AppContext from "../context/AppContext";
import toast from "react-hot-toast";
import { FcCancel } from "@react-icons/all-files/fc/FcCancel";
import { AiOutlineLine } from "@react-icons/all-files/ai/AiOutlineLine";
import CanceledModal from "../components/CanceledModal";

function DashboardSolicitudesPage() {
  const { userLogged } = useContext(AppContext);
  const [solicitudes, setSolicitudes] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [getErrors, setGetErrors] = useState({
    equipos: false,
    grupos: false,
    proyectos: false,
  });
  const [authorizedGet, setAuthorizedGet] = useState({
    solicitudes: true,
    equipos: false,
    grupos: false,
    proyectos: false,
  });
  const [solicitud, setSolicitud] = useState({
    equipo: "",
    grupo: "",
    proyecto: "",
  });
  const [showMessage, setShowMessage] = useState(false);

  const getSolicitudes = async () => {
    try {
      const { data } = await axios.get(`/api/solicitudes/${userLogged.id}`);
      setSolicitudes(data.data);
      setAuthorizedGet({ ...authorizedGet, solicitudes: false, equipos: true });
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
      setSolicitudes([]);
      setAuthorizedGet({ ...authorizedGet, solicitudes: false, equipos: true });
    }
  };

  const getEquipos = async () => {
    try {
      const { data } = await axios.get("/api/equipos");
      setEquipos(data.data);
      if (data.data.length > 0) {
        setSolicitud({ ...solicitud, equipo: data.data[0].id });
      } else {
        setSolicitud({ ...solicitud, equipo: "" });
      }
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
      if (data.data.length > 0) {
        setSolicitud({ ...solicitud, grupo: data.data[0].id });
      } else {
        setSolicitud({ ...solicitud, grupo: "" });
      }
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

  const getProyectos = async (grupo) => {
    try {
      const { data } = await axios.get(
        `/api/users-proyectos/${userLogged.id}/${grupo}`
      );
      setProyectos(data.data);
      if (data.data.length > 0) {
        setSolicitud({ ...solicitud, proyecto: data.data[0].id, grupo: grupo });
      } else {
        setSolicitud({ ...solicitud, proyecto: "", grupo: grupos[0].id });
      }
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
    if (authorizedGet.solicitudes === true && userLogged.id !== 0)
      getSolicitudes();
    if (
      authorizedGet.equipos === true &&
      userLogged.id !== 0 &&
      userLogged.role === "user"
    )
      getEquipos();
    if (
      authorizedGet.grupos === true &&
      userLogged.id !== 0 &&
      userLogged.role === "user"
    )
      getGrupos();
    if (
      authorizedGet.proyectos === true &&
      userLogged.id !== 0 &&
      userLogged.role === "user"
    )
      getProyectos(solicitud.grupo);
  }, [userLogged.id, authorizedGet]);

  const handleChangeGrupo = (e) => {
    setSolicitud({ ...solicitud, grupo: e.target.value });
    getProyectos(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/solicitudes", {
        ...solicitud,
        user: userLogged.id,
      });
      setSolicitudes([...solicitudes, data.data]);
      setSolicitud({
        grupo: grupos[0].id,
        equipo: equipos[0].id,
        proyecto: proyectos[0].id,
      });
      setShowMessage(true);
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
      setSolicitud({
        grupo: grupos[0].id,
        equipo: equipos[0].id,
        proyecto: proyectos[0].id,
      });
      setShowMessage(false);
    }
  };

  const handleCanceled = (solicitudId) => {
    console.log(solicitudId)
  }

  return (
    <LayoutDashboardComponent>
      <div>
        <div className="mb-3">
          <h1>
            <strong>Solicitudes</strong>
          </h1>
        </div>
        {equipos.length === 0 && userLogged.role === "user" && (
          <div
            className="alert alert-warning"
            style={{ maxWidth: 300 }}
            role="alert"
          >
            <strong>No hay equipos para solicitar.</strong>
          </div>
        )}
        {grupos.length === 0 &&
          userLogged.role === "user" &&
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
          userLogged.role === "user" &&
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
        {userLogged.role === "user" && (
          <div className="row">
            <div className="col-12" style={{ maxWidth: 1000 }}>
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row gy-3">
                      {equipos.length > 0 && (
                        <div className="col-xl-4 col-lg-4 col-md-4">
                          <label htmlFor="equipos-input" className="form-label">
                            Equipos
                          </label>
                          <select
                            className="form-select"
                            id="equipos-input"
                            value={solicitud.equipo}
                            onChange={(e) =>
                              setSolicitud({
                                ...solicitud,
                                equipo: e.target.value,
                              })
                            }
                          >
                            {equipos.map((e) => (
                              <option key={e.id} value={e.id}>
                                {e.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {grupos.length > 0 && (
                        <div className="col-xl-4 col-lg-4 col-md-4">
                          <label htmlFor="grupos-input" className="form-label">
                            Grupos
                          </label>
                          <select
                            className="form-select"
                            id="grupos-input"
                            value={solicitud.grupo}
                            onChange={handleChangeGrupo}
                          >
                            {grupos.map((g) => (
                              <option key={g.id} value={g.id}>
                                {g.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {proyectos.length > 0 && (
                        <div className="col-xl-4 col-lg-4 col-md-4">
                          <label
                            htmlFor="proyectos-input"
                            className="form-label"
                          >
                            Proyectos
                          </label>
                          <select
                            className="form-select"
                            id="proyectos-input"
                            value={solicitud.proyecto}
                            onChange={(e) =>
                              setSolicitud({
                                ...solicitud,
                                proyecto: e.target.value,
                              })
                            }
                          >
                            {proyectos.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="row mt-3">
                      <div className="col-12">
                        <button
                          className="btn btn-success"
                          disabled={
                            solicitud.equipo === "" ||
                            solicitud.grupo === "" ||
                            solicitud.proyecto === ""
                          }
                        >
                          SOLICITAR
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {showMessage === true && (
          <div
            className="alert alert-success alert-dismissible fade show mt-3"
            role="alert"
            style={{ maxWidth: 900 }}
          >
            <strong>
              Tu solicitud ha sido añadida con éxito. Te enviaremos un correo
              cuando esta sea aprobada y asignada a una fecha.
            </strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        )}
        {solicitudes.length === 0 ? (
          <div
            className="alert alert-warning mt-3"
            style={{ maxWidth: 300 }}
            role="alert"
          >
            <strong>No hay solicitudes para listar.</strong>
          </div>
        ) : (
          <div className="row mt-3">
            <div className="col-12 table-responsive">
              <table
                className="table
                table-hover
                table-stripped
                text-center
                table-bordered
                shadow"
              >
                <thead className="table-dark">
                  <tr>
                    <th>Usuario</th>
                    <th>Equipo</th>
                    <th>Grupo</th>
                    <th>Proyecto</th>
                    <th>Fecha de la Solicitud</th>
                    <th>Fecha Asignada</th>
                    <th>Estado</th>
                    <th>Cancelada</th>
                    <th>Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.map((s) => (
                    <tr key={s.solicitud}>
                      <td>{s.user}</td>
                      <td>{s.equipo}</td>
                      <td>{s.grupo}</td>
                      <td>{s.proyecto}</td>
                      <td>{`${s.created_at.split("T")[0]} - ${
                        s.created_at.split("T")[1].split(".")[0]
                      }`}</td>
                      <td>
                        {s.assigned_date ? s.assigned_date : "Sin asignar"}
                      </td>
                      <td>{s.estado}</td>
                      <td>
                        <i className="h2">
                          {s.canceled ? <FcCancel /> : <AiOutlineLine />}
                        </i>
                      </td>
                      <td>
                        <button className="btn btn-danger" disabled={s.canceled === true} type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#canceledModal">CANCELAR</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <CanceledModal handleCanceled={handleCanceled}/>
    </LayoutDashboardComponent>
  );
}

export default DashboardSolicitudesPage;
