import axios from "axios";
import { useEffect, useState, useRef, useContext } from "react";
import toast from "react-hot-toast";
import LayoutDashboardComponent from "../components/LayoutDashboardComponent";
import { AiFillEdit } from "@react-icons/all-files/ai/AiFillEdit";
import { AiFillDelete } from "@react-icons/all-files/ai/AiFillDelete";
import DeleteModal from "../components/DeleteModal";
import AppContext from "../context/AppContext";
import LoadingComponent from "../components/LoadingComponent";

function DashboardEquiposPage() {
  const { userLogged } = useContext(AppContext);
  const [estados, setEstados] = useState([]);
  const [equipo, setEquipo] = useState({
    name: "",
    image: null,
    date_obtained: new Date().toISOString().slice(0, 10),
    estado: null,
  });
  const [equipos, setEquipos] = useState([]);
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [selectedDeleteEquipo, setSelectedDeleteEquipo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [authorizedGetEquipos, setAuthorizedGetEquipos] = useState(false);
  const [loadingData, setLoadingData] = useState({
    estados: true,
    equipos: true,
  });

  const inputRef = useRef(null);

  const getEstados = async () => {
    try {
      const { data } = await axios.get("/api/estados-equipos");
      if (data.data.length > 0) {
        setEstados(data.data);
        setEquipo({
          ...equipo,
          estado: data.data[0].name,
        });
        setLoadingData({ ...loadingData, estados: false });
      } else {
        setEstados([]);
        setShowAlert(true);
        setLoadingData({ ...loadingData, estados: false });
      }
      setAuthorizedGetEquipos(true);
    } catch (error) {
      toast.error("Error al listar los estados.");
      setEstados([]);
      setAuthorizedGetEquipos(true);
    }
  };

  const getEquipos = async () => {
    try {
      const { data } = await axios.get("/api/equipos");
      setEquipos(data.data);
      setLoadingData({ ...loading, equipos: false });
    } catch (error) {
      toast.error("Error al listar los equipos.", {
        duration: 5000,
      });
      setEquipos([]);
      setLoadingData({ ...loading, equipos: false });
    }
  };

  useEffect(() => {
    if (authorizedGetEquipos === true) {
      getEquipos();
    } else {
      getEstados();
    }
  }, [authorizedGetEquipos]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (
      equipo.image &&
      equipo.image.type !== "image/png" &&
      equipo.image.type !== "image/jpg" &&
      equipo.image.type !== "image/jpeg"
    ) {
      toast.error("Solo se aceptan imágenes PNG, JPG y JPEG", {
        duration: 7000,
      });
      inputRef.current.value = null;
      setEquipo({
        name: "",
        image: null,
        date_obtained: new Date().toISOString().slice(0, 10),
        estado: estados.length > 0 && estados[0].name,
      });
      setLoading(false);
      return;
    }

    try {
      const post = new FormData();
      if (equipo.image !== null && equipo.image !== undefined) {
        post.append("file", equipo.image);
      }
      post.append("name", equipo.name);
      post.append("estado", equipo.estado);
      post.append("date_obtained", equipo.date_obtained);

      if (selectedEquipo) {
        const { data } = await axios.put(
          `/api/equipos/${selectedEquipo}`,
          post
        );
        setEquipos(equipos.map((e) => (e.id === data.data.id ? data.data : e)));
        toast.success(data.detail, {
          duration: 5000,
        });
      } else {
        const { data } = await axios.post("/api/equipos", post);
        setEquipos([data.data, ...equipos]);
        toast.success(data.detail, {
          duration: 5000,
        });
      }

      setSelectedEquipo(null);
      setEquipo({
        name: "",
        image: null,
        date_obtained: new Date().toISOString().slice(0, 10),
        estado: estados.length > 0 && estados[0].name,
      });
      inputRef.current.value = null;
      setLoading(false);
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
      inputRef.current.value = null;
      setEquipo({
        name: "",
        image: null,
        date_obtained: new Date().toISOString().slice(0, 10),
        estado: estados.length > 0 && estados[0].name,
      });
      setLoading(false);
    }
  };

  const deleteEquipo = async (id) => {
    try {
      const { data } = await axios.delete(`/api/equipos/${id}`);
      setEquipos(equipos.filter((f) => f.id !== data.data.id));
      toast.success(data.detail, {
        duration: 5000,
      });
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
    }
  };

  const handleUpdate = (equipo) => {
    setSelectedEquipo(equipo.id);
    setEquipo({
      date_obtained: equipo.date_obtained.split("T")[0],
      estado: equipo.estado ? equipo.estado : null,
      name: equipo.name,
      image: null,
    });
  };

  return (
    <LayoutDashboardComponent>
      <>
        <div>
          <div className="mb-3">
            <h1>
              <strong>Equipos</strong>
            </h1>
          </div>
          {showAlert === true && userLogged.role === "admin" && (
            <div
              className="alert alert-warning"
              role="alert"
              style={{ maxWidth: 450 }}
            >
              <strong>
                Debe haber estados registrados para poder crear equipos.
              </strong>
            </div>
          )}
          <div className="row mb-3 gy-4">
            {loadingData.estados ? (
              <div className="row mb-3 gy-4">
                <div
                  className="col-xl-4 col-12 d-flex align-items-center justify-content-center"
                  style={{ maxWidth: 400 }}
                >
                  <LoadingComponent />
                </div>
              </div>
            ) : (
              userLogged.role === "admin" && (
                <div className="col-xl-4 col-12" style={{ maxWidth: 400 }}>
                  <div className="card shadow">
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="name-input" className="form-label">
                            Nombre
                          </label>
                          <input
                            type="text"
                            id="name-input"
                            className="form-control"
                            required
                            placeholder="Ej: HPLC"
                            value={equipo.name}
                            onChange={(e) =>
                              setEquipo({ ...equipo, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="file-input" className="form-label">
                            Imagen
                          </label>
                          <input
                            type="file"
                            ref={inputRef}
                            id="file-input"
                            className="form-control"
                            required={selectedEquipo ? false : true}
                            onChange={(e) =>
                              setEquipo({ ...equipo, image: e.target.files[0] })
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="termination-date-input"
                            className="form-label"
                          >
                            Fecha de Obtención
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            required
                            id="termination-date-input"
                            value={equipo.date_obtained}
                            onChange={(e) =>
                              setEquipo({
                                ...equipo,
                                date_obtained: e.target.value,
                              })
                            }
                          />
                        </div>
                        {estados.length > 0 && (
                          <div className="mb-3">
                            <label
                              htmlFor="estados-input"
                              className="form-label"
                            >
                              Estados
                            </label>
                            <select
                              className="form-select"
                              id="jerarquia-input"
                              value={equipo.estado}
                              onChange={(e) =>
                                setEquipo({ ...equipo, estado: e.target.value })
                              }
                            >
                              {equipo.estado === null && (
                                <option selected value={null}>
                                  Sin estado
                                </option>
                              )}
                              {estados.map((e) => (
                                <option key={e.name} value={e.name}>
                                  {e.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        {loading ? (
                          <button
                            className="btn btn-success w-100"
                            type="button"
                          >
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            <span className="visually-hidden">Loading...</span>
                          </button>
                        ) : (
                          <button
                            className="btn btn-success w-100"
                            disabled={
                              selectedEquipo
                                ? equipo.name === "" || equipo.estado === null
                                : equipo.name === "" ||
                                  equipo.image === null ||
                                  equipo.image === undefined ||
                                  equipo.estado === null
                            }
                          >
                            {selectedEquipo
                              ? "EDITAR" + " EQUIPO"
                              : "CREAR" + " EQUIPO"}
                          </button>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          {equipos.length === 0 && (
            <div
              className="alert alert-warning mt-3"
              role="alert"
              style={{ maxWidth: 300 }}
            >
              <strong>No hay equipos para mostrar.</strong>
            </div>
          )}
          <div className="row gy-4">
            {loadingData.equipos ? (
              <div className="col-xl-12 d-flex align-items-center justify-content-center">
                <LoadingComponent />
              </div>
            ) : (
              equipos.length > 0 &&
              equipos.map((e) => (
                <div
                  className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
                  key={e.id}
                  style={{ maxWidth: 600 }}
                >
                  <div className="card shadow" style={{ height: "100%" }}>
                    <img
                      src={e.url_image}
                      className="card-img-top"
                      alt={e.name}
                      style={{ height: 400 }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">
                        <strong>Nombre: </strong> <span>{e.name}</span>
                      </h5>
                      <h5 className="card-title">
                        <strong>Fecha de Obtención: </strong>{" "}
                        <span>{e.date_obtained.split("T")[0]}</span>
                      </h5>
                      <h5 className="card-title">
                        <strong>Estado: </strong>{" "}
                        <span>{e.estado ? e.estado : "Sin estado"}</span>
                      </h5>
                    </div>
                    {userLogged.role === "admin" && (
                      <div className="card-footer">
                        <div className="hstack gap-3 d-flex align-items-center justify-content-start">
                          <button
                            className="btn btn-warning btn-lg"
                            type="button"
                            onClick={() => handleUpdate(e)}
                          >
                            <AiFillEdit />
                          </button>
                          <button
                            className="btn btn-danger btn-lg"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#deleteModal"
                            onClick={() => setSelectedDeleteEquipo(e.id)}
                          >
                            <AiFillDelete />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <DeleteModal
          title="el equipo"
          handleDelete={() => deleteEquipo(selectedDeleteEquipo)}
        />
      </>
    </LayoutDashboardComponent>
  );
}

export default DashboardEquiposPage;
