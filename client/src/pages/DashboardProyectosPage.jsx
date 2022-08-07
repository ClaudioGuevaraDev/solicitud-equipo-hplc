import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import LayoutDashboardComponent from "../components/LayoutDashboardComponent";
import useGetProyectos from "../hooks/api/useGetProyectos";
import { AiFillEdit } from "@react-icons/all-files/ai/AiFillEdit";
import { AiFillDelete } from "@react-icons/all-files/ai/AiFillDelete";
import DeleteModal from "../components/DeleteModal";

function DashboardProyectosPage() {
  const { proyectos, setProyectos } = useGetProyectos();

  const [proyecto, setProyecto] = useState({
    folio: "",
    name: "",
    start_date: new Date().toISOString().slice(0, 10),
    termination_date: new Date().toISOString().slice(0, 10),
    score: 1,
  });
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [selectedDeleteProyecto, setSelectedDeleteProyecto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (selectedProyecto) {
        const { data } = await axios.put(
          `/api/proyectos/${selectedProyecto}`,
          proyecto
        );
        setProyectos(
          proyectos.map((p) => (p.id === data.data.id ? data.data : p))
        );
        toast.success(data.detail, {
          duration: 5000,
        });
      } else {
        const { data } = await axios.post("/api/proyectos", proyecto);
        setProyectos([data.data, ...proyectos]);
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
      });
      setSelectedProyecto(null);
      setLoading(false);
    }
  };

  const deleteProyecto = async (id) => {
    try {
      const { data } = await axios.delete(`/api/proyectos/${id}`);
      setProyectos(proyectos.filter((f) => f.id !== id));
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
    });
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
          <div className="row gy-4">
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
                        value={proyecto.name}
                        onChange={(e) =>
                          setProyecto({ ...proyecto, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="folio-input" className="form-label">
                        Folio
                      </label>
                      <input
                        type="text"
                        id="name-input"
                        className="form-control"
                        placeholder="Ej: Grupo 1"
                        value={proyecto.folio}
                        onChange={(e) =>
                          setProyecto({ ...proyecto, folio: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="start-date-input" className="form-label">
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
                    <div className="mb-3">
                      <label
                        htmlFor="termination-date-input"
                        className="form-label"
                      >
                        Fecha de Término
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
                        value={proyecto.score}
                        onChange={(e) =>
                          setProyecto({ ...proyecto, score: e.target.value })
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
          </div>
          {proyectos.length > 0 && (
            <div className="row mt-3">
              <div
                className="col-12 table-responsive"
                style={{ maxWidth: 1300 }}
              >
                <table className="table table-hover table-stripped text-center table-bordered shadow">
                  <thead className="table-dark">
                    <tr>
                      <th>Nombre</th>
                      <th>Folio</th>
                      <th>Fecha de Inicio</th>
                      <th>Fecha de Termino</th>
                      <th>Score</th>
                      <th>Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proyectos.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.folio ? p.folio : "Sin folio"}</td>
                        <td>{p.start_date.split("T")[0]}</td>
                        <td>{p.termination_date.split("T")[0]}</td>
                        <td>{p.score}</td>
                        <td>
                          <div className="hstack gap-3 d-flex align-items-center justify-content-center">
                            <button
                              className="btn btn-warning"
                              onClick={() => handleUpdate(p)}
                            >
                              <AiFillEdit />
                            </button>

                            <button
                              className="btn btn-danger"
                              onClick={() => setSelectedDeleteProyecto(p.id)}
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#deleteModal"
                            >
                              <AiFillDelete />{" "}
                            </button>
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
          title="el proyecto"
          handleDelete={() => deleteProyecto(selectedDeleteProyecto)}
        />
      </>
    </LayoutDashboardComponent>
  );
}

export default DashboardProyectosPage;
