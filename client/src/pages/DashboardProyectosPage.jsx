import axios from "axios";
import { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import LayoutDashboardComponent from "../components/LayoutDashboardComponent";
import { AiFillEdit } from "@react-icons/all-files/ai/AiFillEdit";
import { AiFillDelete } from "@react-icons/all-files/ai/AiFillDelete";
import DeleteModal from "../components/DeleteModal";
import AppContext from "../context/AppContext";
import LoadingComponent from "../components/LoadingComponent";

function DashboardProyectosPage() {
  const { userLogged } = useContext(AppContext);
  const [proyectos, setProyectos] = useState([]);
  const [originalProyectos, setOriginalProyectos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [authorized, setAuthorized] = useState(false);

  const [proyecto, setProyecto] = useState({
    folio: "",
    name: "",
    start_date: new Date().toISOString().slice(0, 10),
    termination_date: new Date().toISOString().slice(0, 10),
    score: 1,
    grupo: null,
  });
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [selectedDeleteProyecto, setSelectedDeleteProyecto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disableCheckboxs, setDisableCheckboxs] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [usersProyectos, setUsersProyectos] = useState([]);
  const [loadingData, setLoadingData] = useState({
    grupos: true,
    proyectos: true,
  });
  const [valueSearch, setValueSearch] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [elementsPagination, setElementsPagination] = useState({
    firstElement: 0,
    lastElement: 9,
  });

  const getGrupos = async () => {
    try {
      const { data } = await axios.get("/api/grupos");
      setGrupos(data.data);
      if (data.data.length > 0) {
        setProyecto({ ...proyecto, grupo: data.data[0].name });
      }
      setAuthorized(true);
      setLoadingData({ ...loadingData, grupos: false });
    } catch (error) {
      toast.error("Error al listar los grupos.", {
        duration: 5000,
      });
      setAuthorized(true);
      setLoadingData({ ...loadingData, grupos: false });
    }
  };

  const getProyectos = async (search) => {
    try {
      const { data } = await axios.get(
        `/api/proyectos/${userLogged.id}/${userLogged.role}/${typeFilter}/${search}`
      );
      setOriginalProyectos(data.data);
      pagination(
        data.data,
        elementsPagination.firstElement,
        elementsPagination.lastElement
      );
      setUsersProyectos(data.users_proyectos);
      setLoadingData({ ...loading, proyectos: false });
    } catch (error) {
      toast.error("Error al listar los proyectos.", {
        duration: 5000,
      });
      setProyectos([]);
      setLoadingData({ ...loading, proyectos: false });
    }
  };

  const pagination = (dataProyectos, firstElement, lastElement) => {
    const filterProyectos = [];
    for (let [index, value] of dataProyectos.entries()) {
      if (filterProyectos.length === 10) {
        break;
      }
      if (index >= firstElement && index <= lastElement) {
        filterProyectos.push(value);
      }
    }
    setProyectos(filterProyectos);
  };

  const handleNextPage = () => {
    setElementsPagination({
      firstElement: elementsPagination.firstElement + 10,
      lastElement: elementsPagination.lastElement + 10,
    });
    pagination(
      originalProyectos,
      elementsPagination.firstElement + 10,
      elementsPagination.lastElement + 10
    );
  };

  const handlePreviusPage = () => {
    setElementsPagination({
      firstElement: elementsPagination.firstElement - 10,
      lastElement: elementsPagination.lastElement - 10,
    });
    pagination(
      originalProyectos,
      elementsPagination.firstElement - 10,
      elementsPagination.lastElement - 10
    );
  };

  useEffect(() => {
    if (authorized === true) {
      getProyectos("null");
    } else {
      getGrupos();
    }
  }, [authorized, userLogged.role, typeFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (selectedProyecto) {
        const { data } = await axios.put(
          `/api/proyectos/${selectedProyecto}`,
          proyecto
        );
        pagination(
          originalProyectos.map((p) => (p.id === data.data.id ? data.data : p)),
          elementsPagination.firstElement,
          elementsPagination.lastElement
        );
        setOriginalProyectos(
          originalProyectos.map((p) => (p.id === data.data.id ? data.data : p))
        );
        toast.success(data.detail, {
          duration: 5000,
        });
      } else {
        const { data } = await axios.post("/api/proyectos", proyecto);
        pagination(
          [...originalProyectos, data.data],
          elementsPagination.firstElement,
          elementsPagination.lastElement
        );
        setOriginalProyectos([...originalProyectos, data.data]);
        toast.success(data.detail, {
          duration: 5000,
        });
      }

      setProyecto({
        folio: "",
        name: "",
        start_date: new Date().toISOString().slice(0, 10),
        termination_date: new Date().toISOString().slice(0, 10),
        score: 1,
        grupo: grupos.length > 0 && grupos[0].name,
      });
      setSelectedProyecto(null);
      setLoading(false);
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }

      setProyecto({
        folio: "",
        name: "",
        start_date: new Date().toISOString().slice(0, 10),
        termination_date: new Date().toISOString().slice(0, 10),
        score: 1,
        grupo: grupos.length > 0 && grupos[0].name,
      });
      setSelectedProyecto(null);
      setLoading(false);
    }
  };

  const deleteProyecto = async (id) => {
    try {
      const { data } = await axios.delete(`/api/proyectos/${id}`);
      pagination(
        originalProyectos.filter((f) => f.id !== id),
        elementsPagination.firstElement,
        elementsPagination.lastElement
      );
      setOriginalProyectos(originalProyectos.filter((f) => f.id !== id));
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

  const handleUpdate = (proyecto) => {
    setSelectedProyecto(proyecto.id);
    setProyecto({
      folio: proyecto.folio ? proyecto.folio : "",
      name: proyecto.name,
      start_date: proyecto.start_date.split("T")[0],
      termination_date: proyecto.termination_date.split("T")[0],
      score: proyecto.score,
      grupo: proyecto.grupo,
    });
  };

  const handleUsuariosProyectos = async (e, p) => {
    setDisableCheckboxs(true);

    try {
      const post = {
        user: userLogged.id,
        proyecto: p.id,
        checked: e.target.checked,
      };
      const { data } = await axios.post("/api/users-proyectos", post);

      setUsersProyectos(data.users_proyectos);

      setDisableCheckboxs(false);
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
      setDisableCheckboxs(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    setLoadingSearch(true);

    if (valueSearch === "") {
      getProyectos("null");
    } else {
      getProyectos(valueSearch);
    }

    setLoadingSearch(false);
  };

  return (
    <LayoutDashboardComponent>
      <>
        <div>
          <div className="mb-3">
            <h1>
              <strong>Proyectos</strong>
            </h1>
          </div>
          {userLogged.role === "user" && (
            <>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="inlineRadio1"
                  value="all"
                  checked={typeFilter === "all" ? true : false}
                  onChange={(e) => setTypeFilter(e.target.value)}
                />
                <label className="form-check-label" htmlFor="inlineRadio1">
                  Todos los proyectos
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="inlineRadio2"
                  value="filter"
                  checked={typeFilter === "filter" ? true : false}
                  onChange={(e) => setTypeFilter(e.target.value)}
                />
                <label className="form-check-label" htmlFor="inlineRadio2">
                  Mis proyectos
                </label>
              </div>
            </>
          )}
          <div className="row gy-4">
            {loadingData.grupos ? (
              <div
                className="col-xl-4 col-12 d-flex align-items-center justify-content-center"
                style={{ maxWidth: 400 }}
              >
                <LoadingComponent />
              </div>
            ) : (
              userLogged.role === "admin" && (
                <div className="col-xl-6 col-12" style={{ maxWidth: 800 }}>
                  <div className="card shadow">
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-6">
                            <div className="mb-3">
                              <label
                                htmlFor="name-input"
                                className="form-label"
                              >
                                Nombre
                              </label>
                              <input
                                type="text"
                                id="name-input"
                                className="form-control"
                                required
                                placeholder="Ej: Grupo 1"
                                value={proyecto.name}
                                onChange={(e) =>
                                  setProyecto({
                                    ...proyecto,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="mb-3">
                              <label
                                htmlFor="folio-input"
                                className="form-label"
                              >
                                Folio
                              </label>
                              <input
                                type="text"
                                id="name-input"
                                className="form-control"
                                placeholder="Ej: Grupo 1"
                                value={proyecto.folio}
                                onChange={(e) =>
                                  setProyecto({
                                    ...proyecto,
                                    folio: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <div className="mb-3">
                              <label
                                htmlFor="start-date-input"
                                className="form-label"
                              >
                                Fecha de Inicio
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                required
                                id="start-date-input"
                                value={proyecto.start_date}
                                onChange={(e) =>
                                  setProyecto({
                                    ...proyecto,
                                    start_date: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="mb-3">
                              <label
                                htmlFor="termination-date-input"
                                className="form-label"
                              >
                                Fecha de T??rmino
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                required
                                id="termination-date-input"
                                value={proyecto.termination_date}
                                onChange={(e) =>
                                  setProyecto({
                                    ...proyecto,
                                    termination_date: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <div className="mb-3">
                              <label
                                htmlFor="score-input"
                                className="form-label"
                              >
                                Score
                              </label>
                              <input
                                type="number"
                                id="score-input"
                                className="form-control"
                                placeholder="1-100"
                                min={1}
                                max={100}
                                required
                                value={proyecto.score}
                                onChange={(e) =>
                                  setProyecto({
                                    ...proyecto,
                                    score: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            {grupos.length > 0 && (
                              <div className="mb-3">
                                <label
                                  htmlFor="grupos-input"
                                  className="form-label"
                                >
                                  Grupos
                                </label>
                                <select
                                  className="form-select"
                                  id="grupos-input"
                                  value={proyecto.grupo}
                                  onChange={(e) =>
                                    setProyecto({
                                      ...proyecto,
                                      grupo: e.target.value,
                                    })
                                  }
                                >
                                  {proyecto.grupo === null && (
                                    <option
                                      selected={proyecto.grupo ? false : true}
                                      value={null}
                                    >
                                      Grupo sin asignar
                                    </option>
                                  )}
                                  {grupos.map((g) => (
                                    <option key={g.id} value={g.name}>
                                      {g.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                        {loading ? (
                          <button className="btn btn-success" type="button">
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            <span className="visually-hidden">Loading...</span>
                          </button>
                        ) : (
                          <button
                            className="btn btn-success"
                            disabled={proyecto.name === "" ? true : false}
                          >
                            {selectedProyecto
                              ? "EDITAR" + " PROYECTO"
                              : "CREAR" + " PROYECTO"}
                          </button>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          <div className="row mt-3">
            {loadingData.proyectos ? (
              <div
                className="col-12 d-flex align-items-center justify-content-center"
                style={{ maxWidth: 1300 }}
              >
                <LoadingComponent />
              </div>
            ) : (
              <div
                className="col-12 table-responsive mt-3"
                style={{ maxWidth: 1300 }}
              >
                <div className="row">
                  <div className="col-xl-4 col-lg-6 col-md-8 col-sm-12 col-12 mb-1">
                    <form
                      className="d-flex"
                      role="search"
                      onSubmit={handleSearch}
                    >
                      <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        value={valueSearch}
                        onChange={(e) => setValueSearch(e.target.value)}
                      />
                      {loadingSearch ? (
                        <button className="btn btn-success" type="button">
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <span className="visually-hidden">Loading...</span>
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-success"
                          type="submit"
                        >
                          Buscar
                        </button>
                      )}
                    </form>
                  </div>
                  <div className="col-xl-8 col-lg-6 col-md-4 col-sm-12 col-12 mb-1">
                    <nav aria-label="Page navigation example">
                      <ul className="pagination justify-content-end">
                        <li className="page-item">
                          <button
                            className={`page-link ${
                              elementsPagination.firstElement === 0
                                ? "disabled"
                                : ""
                            }`}
                            onClick={handlePreviusPage}
                          >
                            Anterior
                          </button>
                        </li>
                        <li className="page-item">
                          <button
                            className={`page-link ${
                              elementsPagination.lastElement + 1 >=
                              originalProyectos.length
                                ? "disabled"
                                : ""
                            }`}
                            onClick={handleNextPage}
                          >
                            Siguiente
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
                {proyectos.length > 0 ? (
                  <table className="table table-hover table-stripped text-center table-bordered shadow">
                    <thead className="table-dark">
                      <tr>
                        <th>Nombre</th>
                        <th>Folio</th>
                        <th>Fecha de Inicio</th>
                        <th>Fecha de Termino</th>
                        {userLogged.role === "admin" && <th>Score</th>}
                        <th>Grupo</th>
                        <th>
                          {userLogged.role === "admin"
                            ? "Opciones"
                            : "Inscribir"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {proyectos.map((p) => (
                        <tr key={p.id}>
                          <td>{p.name}</td>
                          <td>{p.folio ? p.folio : "Sin folio"}</td>
                          <td>{p.start_date.split("T")[0]}</td>
                          <td>{p.termination_date.split("T")[0]}</td>
                          {userLogged.role === "admin" && <td>{p.score}</td>}
                          <td>{p.grupo ? p.grupo : "Grupo sin asignar"}</td>
                          <td>
                            <div className="hstack gap-3 d-flex align-items-center justify-content-center">
                              {userLogged.role === "admin" ? (
                                <>
                                  <button
                                    className="btn btn-warning"
                                    onClick={() => handleUpdate(p)}
                                  >
                                    <AiFillEdit />
                                  </button>

                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      setSelectedDeleteProyecto(p.id)
                                    }
                                    type="button"
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteModal"
                                  >
                                    <AiFillDelete />{" "}
                                  </button>
                                </>
                              ) : (
                                <>
                                  <div className="form-check">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="checkbox-input"
                                      onChange={(e) =>
                                        handleUsuariosProyectos(e, p)
                                      }
                                      disabled={
                                        disableCheckboxs === true ? true : false
                                      }
                                      checked={usersProyectos.includes(p.id)}
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div
                    className="alert alert-warning mt-3"
                    role="alert"
                    style={{ maxWidth: 300 }}
                  >
                    <strong>No hay proyectos para mostrar.</strong>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <DeleteModal
          title="el proyecto"
          handleDelete={() => deleteProyecto(selectedDeleteProyecto)}
        />
      </>
    </LayoutDashboardComponent>
  );
}

export default DashboardProyectosPage;
