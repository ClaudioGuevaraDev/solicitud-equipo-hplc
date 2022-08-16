import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LayoutDashboardComponent from "../components/LayoutDashboardComponent";
import { RiThumbUpFill } from "@react-icons/all-files/ri/RiThumbUpFill";
import { RiThumbDownFill } from "@react-icons/all-files/ri/RiThumbDownFill";
import LoadingComponent from "../components/LoadingComponent";

function DashboardUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [originalUsuarios, setOriginalUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [valueSearch, setValueSearch] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [elementsPagination, setElementsPagination] = useState({
    firstElement: 0,
    lastElement: 9,
  });

  const getUsuarios = async (search) => {
    try {
      const { data } = await axios.get(`/api/users/${search}`);
      pagination(
        data.data,
        elementsPagination.firstElement,
        elementsPagination.lastElement
      );
      setOriginalUsuarios(data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error al listar los usuarios.", {
        duration: 5000,
      });
      setUsuarios([]);
      setLoading(false);
    }
  };

  const pagination = (dataUsuarios, firstElement, lastElement) => {
    const filterUsuarios = [];
    for (let [index, value] of dataUsuarios.entries()) {
      if (filterUsuarios.length === 10) {
        break;
      }
      if (index >= firstElement && index <= lastElement) {
        filterUsuarios.push(value);
      }
    }
    setUsuarios(filterUsuarios);
  };

  const handleNextPage = () => {
    setElementsPagination({
      firstElement: elementsPagination.firstElement + 10,
      lastElement: elementsPagination.lastElement + 10,
    });
    pagination(
      originalUsuarios,
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
      originalUsuarios,
      elementsPagination.firstElement - 10,
      elementsPagination.lastElement - 10
    );
  };

  useEffect(() => {
    getUsuarios("null");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    setLoadingSearch(true);

    if (valueSearch === "") {
      getUsuarios("null");
    } else {
      getUsuarios(valueSearch);
    }

    setLoadingSearch(false);
  };

  return (
    <LayoutDashboardComponent>
      <div>
        <div className="mb-3">
          <h1>
            <strong>Usuarios</strong>
          </h1>
        </div>
        <div className="row gy-4">
          {loading ? (
            <div
              className="col-12 d-flex align-items-center justify-content-center"
              style={{ maxWidth: 1300 }}
            >
              <LoadingComponent />
            </div>
          ) : (
            <div className="col-12 table-responsive" style={{ maxWidth: 2400 }}>
              <div className="row">
                <div className="col-xl-3 col-lg-5 col-md-6 col-sm-12 col-12 mb-1">
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
                      <button className="btn btn-outline-success" type="submit">
                        Buscar
                      </button>
                    )}
                  </form>
                </div>
                <div className="col-xl-9 col-lg-7 col-md-6 col-sm-12 col-12 mb-2">
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
                            originalUsuarios.length
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
              {usuarios.length > 0 ? (
                <div className="row">
                  <div className="col-12">
                    <table className="table table-hover table-stripped text-center table-bordered shadow">
                      <thead className="table-dark">
                        <tr>
                          <th>Nombre</th>
                          <th>Apellidos</th>
                          <th>Email</th>
                          <th>Jerarquía</th>
                          <th>Grupos</th>
                          <th>Proyectos</th>
                          <th>Verificado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuarios.map((u) => (
                          <tr key={u.id}>
                            <td>{u.first_name}</td>
                            <td>{u.last_name}</td>
                            <td>{u.email}</td>
                            <td>
                              {u.jerarquia ? u.jerarquia : "Sin jerarquía"}
                            </td>
                            <td>
                              {u.grupos.length === 0 ? (
                                <p>Sin grupos</p>
                              ) : (
                                <ul>
                                  {u.grupos.map((g) => (
                                    <li key={g}>{g}</li>
                                  ))}
                                </ul>
                              )}
                            </td>
                            <td>
                              {u.proyectos.length === 0 ? (
                                <p>Sin proyectos</p>
                              ) : (
                                <ul>
                                  {u.proyectos.map((p) => (
                                    <li key={p}>{p}</li>
                                  ))}
                                </ul>
                              )}
                            </td>
                            <td>
                              {u.verified ? (
                                <RiThumbUpFill
                                  className="text-success"
                                  size={20}
                                />
                              ) : (
                                <RiThumbDownFill
                                  className="text-danger"
                                  size={20}
                                />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div
                  className="alert alert-warning mt-3"
                  role="alert"
                  style={{ maxWidth: 300 }}
                >
                  <strong>No hay usuarios registrados.</strong>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </LayoutDashboardComponent>
  );
}

export default DashboardUsuariosPage;
