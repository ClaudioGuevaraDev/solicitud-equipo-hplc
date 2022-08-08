import axios from "axios";
import { useState, useContext } from "react";
import toast from "react-hot-toast";
import LayoutDashboardComponent from "../components/LayoutDashboardComponent";
import { AiFillEdit } from "@react-icons/all-files/ai/AiFillEdit";
import { AiFillDelete } from "@react-icons/all-files/ai/AiFillDelete";
import useGetGrupos from "../hooks/api/useGetGrupos";
import DeleteModal from "../components/DeleteModal";
import AppContext from "../context/AppContext";

function DashboardGruposPage() {
  const { userLogged } = useContext(AppContext);
  const { grupos, setGrupos } = useGetGrupos();
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [selectedDeleteGrupo, setSelectedDeleteGrupo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [grupo, setGrupo] = useState({
    name: "",
    date: new Date().toISOString().slice(0, 10),
    score: 1,
    lider: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (selectedGrupo) {
        const { data } = await axios.put(`/api/grupos/${selectedGrupo}`, grupo);
        setGrupos(grupos.map((g) => (g.id === data.data.id ? data.data : g)));
        toast.success(data.detail, {
          duration: 5000,
        });
      } else {
        const { data } = await axios.post("/api/grupos", grupo);
        setGrupos([data.data, ...grupos]);
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
      setGrupos(grupos.filter((f) => f.id !== data.data.id));
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

  return (
    <LayoutDashboardComponent>
      <>
        <div>
          <div className="mb-3">
            <h1>
              <strong>Grupos</strong>
            </h1>
          </div>
          {userLogged.role === "admin" && (
            <div className="row mb-3 gy-4">
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
                          placeholder="Ej: Grupo 1"
                          value={grupo.name}
                          onChange={(e) =>
                            setGrupo({ ...grupo, name: e.target.value })
                          }
                        />
                      </div>
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
                      {loading ? (
                        <button className="btn btn-success w-100" type="button">
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
          {grupos.length > 0 && (
            <div className="row">
              <div
                className="col-12 table-responsive"
                style={{ maxWidth: 1300 }}
              >
                <table className="table table-hover table-stripped text-center table-bordered shadow">
                  <thead className="table-dark">
                    <tr>
                      <th>Nombre</th>
                      <th>Líder</th>
                      <th>Fecha de Creación</th>
                      {userLogged.role === "admin" && <th>Score</th>}
                      <th>Opciones</th>
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
                            {userLogged.role === "admin" && (
                              <>
                                <button
                                  className="btn btn-warning"
                                  onClick={() => handleUpdate(g)}
                                >
                                  <AiFillEdit />
                                </button>

                                <button
                                  className="btn btn-danger"
                                  onClick={() => setSelectedDeleteGrupo(g.id)}
                                  type="button"
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteModal"
                                >
                                  <AiFillDelete />{" "}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
