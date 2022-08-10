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

  const getUsuarios = async (page_value, previus_page) => {
    try {
      const { data } = await axios.get(`/api/users/page/${page_value}`);
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
      setUsuarios([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsuarios(page.nextPage, page.nextPage);
  }, []);

  const handleNextPage = () => {
    getUsuarios(page.nextPage, usuarios[0].id);
  };

  const handlePreviusPage = async () => {
    const { data } = await axios.get(
      `/api/users/previus-page/${page.previusPage}`
    );
    getUsuarios(page.previusPage, data.previus_value);
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
            usuarios.length > 0 && (
              <div
                className="col-12 table-responsive"
                style={{ maxWidth: 1300 }}
              >
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
                <table className="table table-hover table-stripped text-center table-bordered shadow">
                  <thead className="table-dark">
                    <tr>
                      <th>Nombre</th>
                      <th>Apellidos</th>
                      <th>Email</th>
                      <th>Jerarquía</th>
                      <th>Rol</th>
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
                          {u.role.name === "admin"
                            ? "Administrador"
                            : "Usuario"}
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
              </div>
            )
          )}
        </div>
      </div>
    </LayoutDashboardComponent>
  );
}

export default DashboardUsuariosPage;
