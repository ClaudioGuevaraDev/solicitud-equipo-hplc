import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LayoutDashboardComponent from "../components/LayoutDashboardComponent";
import { RiThumbUpFill } from "@react-icons/all-files/ri/RiThumbUpFill";
import { RiThumbDownFill } from "@react-icons/all-files/ri/RiThumbDownFill";
import LoadingComponent from "../components/LoadingComponent";

function DashboardUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState({
    nextPage: 1,
    previusPage: 1,
    firstPage: true,
    lastPage: true,
  });
  const [valueSearch, setValueSearch] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);

  const getUsuarios = async (page_value, previus_page, search) => {
    try {
      const { data } = await axios.get(
        `/api/users/page/${page_value}/${search}`
      );
      setUsuarios(data.data);
      setPage({
        ...page,
        nextPage: data.next_page,
        previusPage: previus_page,
        firstPage: data.first_page,
        lastPage: data.last_page,
      });
      setLoading(false);
    } catch (error) {
      toast.error("Error al listar los usuarios.", {
        duration: 5000,
      });
      setPage({
        ...page,
        nextPage: 1,
        previusPage: 1,
        firstPage: true,
        lastPage: true,
      });
      setUsuarios([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsuarios(page.nextPage, page.nextPage, "null");
  }, []);

  const handleNextPage = () => {
    if (valueSearch === "") {
      getUsuarios(page.nextPage, usuarios[0].id, "null");
    } else {
      getUsuarios(page.nextPage, usuarios[0].id, valueSearch);
    }
  };

  const handlePreviusPage = async () => {
    const { data } = await axios.get(
      `/api/users/previus-page/${page.previusPage}`
    );
    if (valueSearch === "") {
      getUsuarios(page.previusPage, data.previus_value, "null");
    } else {
      getUsuarios(page.previusPage, data.previus_value, valueSearch);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    setLoadingSearch(true);

    setPage({
      ...page,
      nextPage: 1,
      previusPage: 1,
      firstPage: true,
      lastPage: true,
    });

    if (valueSearch === "") {
      getUsuarios(1, 1, "null");
    } else {
      getUsuarios(1, 1, valueSearch);
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
            <div className="col-12 table-responsive" style={{ maxWidth: 1800 }}>
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
                        Search
                      </button>
                    )}
                  </form>
                </div>
                {usuarios.length > 0 && (
                  <div className="col-xl-9 col-lg-7 col-md-6 col-sm-12 col-12 mb-2">
                    <nav aria-label="Page navigation example">
                      <ul className="pagination justify-content-end">
                        <li className="page-item">
                          <button
                            className={`page-link ${
                              page.firstPage ? "disabled" : ""
                            }`}
                            onClick={handlePreviusPage}
                          >
                            Previous
                          </button>
                        </li>
                        <li className="page-item">
                          <button
                            className={`page-link ${
                              page.lastPage ? "disabled" : ""
                            }`}
                            onClick={handleNextPage}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
              {usuarios.length > 0 ? (
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
                          {u.jerarquia ? u.jerarquia.name : "Sin jerarquía"}
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
                            <RiThumbUpFill className="text-success" size={20} />
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
