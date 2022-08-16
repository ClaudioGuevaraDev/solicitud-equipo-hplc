import axios from "axios";
import { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import LayoutDashboardComponent from "../components/LayoutDashboardComponent";
import { AiFillEdit } from "@react-icons/all-files/ai/AiFillEdit";
import { AiFillDelete } from "@react-icons/all-files/ai/AiFillDelete";
import DeleteModal from "../components/DeleteModal";
import AppContext from "../context/AppContext";
import LoadingComponent from "../components/LoadingComponent";

function DashboardGruposPage() {
  const { userLogged } = useContext(AppContext);
  const [grupos, setGrupos] = useState([]);
  const [originalGrupos, setOriginalGrupos] = useState([]);
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [selectedDeleteGrupo, setSelectedDeleteGrupo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [grupo, setGrupo] = useState({
    name: "",
    date: new Date().toISOString().slice(0, 10),
    score: 1,
    lider: "",
  });
  const [disableCheckboxs, setDisableCheckboxs] = useState(false);
  const [usersGrupos, setUsersGrupos] = useState([]);
  const [handleShowGrupos, setHandleShowGrupos] = useState("all");
  const [loadingGrupos, setLoadingGrupos] = useState(true);
  const [valueSearch, setValueSearch] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [elementsPagination, setElementsPagination] = useState({
    firstElement: 0,
    lastElement: 9,
  });

  const getGrupos = async (search) => {
    try {
      const { data } = await axios.get(
        `/api/grupos/${userLogged.id}/${handleShowGrupos}/${search}`
      );
      pagination(
        data.data,
        elementsPagination.firstElement,
        elementsPagination.lastElement
      );
      setOriginalGrupos(data.data);
      setUsersGrupos(data.users_grupos);
      setLoadingGrupos(false);
    } catch (error) {
      console.log(error);
      toast.error("Error al listar los grupos.", {
        duration: 5000,
      });
      setGrupos([]);
      setUsersGrupos([]);
      setLoadingGrupos(false);
    }
  };

  const pagination = (dataGrupos, firstElement, lastElement) => {
    const filterGrupos = [];
    for (let [index, value] of dataGrupos.entries()) {
      if (filterGrupos.length === 10) {
        break;
      }
      if (index >= firstElement && index <= lastElement) {
        filterGrupos.push(value);
      }
    }
    setGrupos(filterGrupos);
  };

  const handleNextPage = () => {
    setElementsPagination({
      firstElement: elementsPagination.firstElement + 10,
      lastElement: elementsPagination.lastElement + 10,
    });
    pagination(
      originalGrupos,
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
      originalGrupos,
      elementsPagination.firstElement - 10,
      elementsPagination.lastElement - 10
    );
  };

  useEffect(() => {
    if (userLogged !== 0) {
      getGrupos("null");
    }
  }, [userLogged.id, handleShowGrupos]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (selectedGrupo) {
        const { data } = await axios.put(`/api/grupos/${selectedGrupo}`, grupo);
        pagination(
          originalGrupos.map((g) => (g.id === data.data.id ? data.data : g)),
          elementsPagination.firstElement,
          elementsPagination.lastElement
        );
        setOriginalGrupos(
          originalGrupos.map((g) => (g.id === data.data.id ? data.data : g))
        );
        toast.success(data.detail, {
          duration: 5000,
        });
      } else {
        const { data } = await axios.post("/api/grupos", grupo);
        pagination(
          [...originalGrupos, data.data],
          elementsPagination.firstElement,
          elementsPagination.lastElement
        );
        setOriginalGrupos([...originalGrupos, data.data]);
        toast.success(data.detail, {
          duration: 5000,
        });
      }
      setGrupo({
        name: "",
        date: new Date().toISOString().slice(0, 10),
        score: 1,
        lider: "",
      });
      setSelectedGrupo(null);
      setLoading(false);
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }

      setGrupo({
        name: "",
        date: new Date().toISOString().slice(0, 10),
        score: 1,
        lider: "",
      });
      setSelectedGrupo(null);
      setLoading(false);
    }
  };

  const handleUpdate = (grupo) => {
    setSelectedGrupo(grupo.id);
    setGrupo({
      date: grupo.creation_date.split("T")[0],
      name: grupo.name,
      score: grupo.score,
      lider: grupo.lider,
    });
  };

  const deleteGrupo = async (id) => {
    try {
      const { data } = await axios.delete(`/api/grupos/${id}`);
      pagination(
        originalGrupos.filter((f) => f.id !== data.data.id),
        elementsPagination.firstElement,
        elementsPagination.lastElement
      );
      setOriginalGrupos(originalGrupos.filter((f) => f.id !== data.data.id));
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

  const handleUsuarioGrupo = async (e, grupo) => {
    setDisableCheckboxs(true);
    try {
      const post = {
        user: userLogged.id,
        grupo: grupo.id,
        checked: e.target.checked,
      };
      const { data } = await axios.post("/api/users-grupos", post);
      setUsersGrupos(data.users_grupos);

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
      getGrupos("null");
    } else {
      getGrupos(valueSearch);
    }

    setLoadingSearch(false);
  };

  return (
    <LayoutDashboardComponent>
      <>
        <div>
          <div className="mb-3">
            <h1>
              <strong>Grupos</strong>
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
                  checked={handleShowGrupos === "all" ? true : false}
                  onChange={(e) => setHandleShowGrupos(e.target.value)}
                />
                <label className="form-check-label" htmlFor="inlineRadio1">
                  Todos los grupos
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="inlineRadio2"
                  value="filter"
                  checked={handleShowGrupos === "filter" ? true : false}
                  onChange={(e) => setHandleShowGrupos(e.target.value)}
                />
                <label className="form-check-label" htmlFor="inlineRadio2">
                  Mis grupos
                </label>
              </div>
            </>
          )}
          {usersGrupos.length === 0 &&
            handleShowGrupos === "filter" &&
            userLogged.role === "user" && (
              <div
                className="alert alert-warning mt-3"
                role="alert"
                style={{ maxWidth: 300 }}
              >
                <strong>No estas inscrito en ningún grupo.</strong>
              </div>
            )}
          {userLogged.role === "admin" && (
            <div className="row gy-4">
              <div className="col-xl-6 col-12" style={{ maxWidth: 800 }}>
                <div className="card shadow">
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="name-input" className="form-label">
                              Nombre
                            </label>
                            <input
                              type="text"
                              id="name-input"
                              className="form-control"
                              required
                              placeholder="Ej: Grupo 1"
                              value={grupo.name}
                              onChange={(e) =>
                                setGrupo({ ...grupo, name: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="lider-label" className="form-label">
                              Líder
                            </label>
                            <input
                              type="text"
                              id="lider-label"
                              required
                              className="form-control"
                              value={grupo.lider}
                              onChange={(e) =>
                                setGrupo({ ...grupo, lider: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="date-input" className="form-label">
                              Fecha de Creación
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              required
                              id="date-input"
                              value={grupo.date}
                              onChange={(e) =>
                                setGrupo({ ...grupo, date: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="score-input" className="form-label">
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
                              value={grupo.score}
                              onChange={(e) =>
                                setGrupo({ ...grupo, score: e.target.value })
                              }
                            />
                          </div>
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
                          disabled={grupo.name === "" || grupo.lider === ""}
                        >
                          {selectedGrupo
                            ? "EDITAR" + " GRUPO"
                            : "CREAR" + " GRUPO"}
                        </button>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="row mt-4">
            {loadingGrupos ? (
              <div
                className="col-12 d-flex align-items-center justify-content-center"
                style={{ maxWidth: 1300 }}
              >
                <LoadingComponent />
              </div>
            ) : (
              <>
                <div
                  className="col-12 table-responsive"
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
                            Search
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
                              Previous
                            </button>
                          </li>
                          <li className="page-item">
                            <button
                              className={`page-link ${
                                elementsPagination.lastElement + 1 >=
                                originalGrupos.length
                                  ? "disabled"
                                  : ""
                              }`}
                              onClick={handleNextPage}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                  {grupos.length > 0 ? (
                    <table className="table table-hover table-stripped text-center table-bordered shadow">
                      <thead className="table-dark">
                        <tr>
                          <th>Nombre</th>
                          <th>Líder</th>
                          <th>Fecha de Creación</th>
                          {userLogged.role === "admin" && <th>Score</th>}
                          <th>
                            {userLogged.role === "admin"
                              ? "Opciones"
                              : "Inscribir"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {grupos.map((g) => (
                          <tr key={g.id}>
                            <td>{g.name}</td>
                            <td>{g.lider}</td>
                            <td>{g.creation_date.split("T")[0]}</td>
                            {userLogged.role === "admin" && <td>{g.score}</td>}
                            <td>
                              <div className="hstack gap-3 d-flex align-items-center justify-content-center">
                                {userLogged.role === "admin" ? (
                                  <>
                                    <button
                                      className="btn btn-warning"
                                      onClick={() => handleUpdate(g)}
                                    >
                                      <AiFillEdit />
                                    </button>

                                    <button
                                      className="btn btn-danger"
                                      onClick={() =>
                                        setSelectedDeleteGrupo(g.id)
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
                                          handleUsuarioGrupo(e, g)
                                        }
                                        disabled={
                                          disableCheckboxs === true
                                            ? true
                                            : false
                                        }
                                        checked={usersGrupos.includes(g.id)}
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
                    handleShowGrupos === "all" &&
                    grupos.length === 0 && (
                      <div
                        className="alert alert-warning mt-3"
                        role="alert"
                        style={{ maxWidth: 300 }}
                      >
                        <strong>No hay grupos para mostrar.</strong>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <DeleteModal
          title="el grupo"
          handleDelete={() => deleteGrupo(selectedDeleteGrupo)}
        />
      </>
    </LayoutDashboardComponent>
  );
}

export default DashboardGruposPage;
