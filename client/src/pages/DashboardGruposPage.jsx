import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import LayoutDashboardComponent from "../components/LayoutDashboardComponent";
import useGetLideres from "../hooks/api/useGetLideres";

function DashboardGruposPage() {
  const { lideres, liderValue, setLiderValue } = useGetLideres();
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [loading, setLoading] = useState({
    create: false,
    update: false,
    delete: false,
  });
  const [grupo, setGrupo] = useState({
    name: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    score: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading({ ...loading, create: true });

    try {
      if (selectedGrupo) {
      } else {
        const { data } = await axios.post("/api/grupos", {
          ...grupo,
          lider: liderValue,
        });
        console.log(data.data);
        toast.success(data.detail, {
          duration: 5000,
        });

        setLoading({ ...loading, create: false });
      }
      setGrupo({
        name: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
        score: 1,
      });
      setLiderValue(lideres[0].id);
      setSelectedGrupo(null);
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }

      setGrupo({
        name: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
        score: 1,
      });
      setLiderValue(lideres[0].id);
      setSelectedGrupo(null);
      setLoading({ ...loading, create: false, update: false });
    }
  };

  return (
    <LayoutDashboardComponent>
      <div>
        <div className="mb-3">
          <h1>
            <strong>Grupos</strong>
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
                      value={grupo.name}
                      onChange={(e) =>
                        setGrupo({ ...grupo, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description-label" className="form-label">
                      Descripción
                    </label>
                    <textarea
                      id="description-label"
                      rows={4}
                      className="form-control"
                      value={grupo.description}
                      onChange={(e) =>
                        setGrupo({ ...grupo, description: e.target.value })
                      }
                    ></textarea>
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
                  {lideres.length > 0 && (
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                      <div className="mb-3">
                        <label htmlFor="lider-input" className="form-label">
                          Líder
                        </label>
                        <select
                          className="form-select"
                          id="lider-input"
                          value={liderValue}
                          onChange={(e) => setLiderValue(e.target.value)}
                        >
                          {lideres.map((l) => (
                            <option key={l.full_name} value={l.id}>
                              {l.full_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  {loading.create ? (
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
                      disabled={
                        grupo.name === "" ||
                        grupo.description === "" ||
                        liderValue == null
                      }
                    >
                      {selectedGrupo ? "EDITAR" + " GRUPO" : "CREAR" + " GRUPO"}
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
          {/* <div className="col-xl-7 col-12" style={{ maxWidth: 750 }}>
            <table className="table table-hover table-stripped text-center table-bordered table-responsive shadow">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Score</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {jerarquias.map((j) => (
                  <tr key={j.name}>
                    <td>{`${j.name.charAt(0).toUpperCase()}${j.name.slice(
                      1
                    )}`}</td>
                    <td>{j.score}</td>
                    <td>
                      <div className="hstack gap-3 d-flex align-items-center justify-content-center">
                        {loadingUpdate ? (
                          <button className="btn btn-warning" type="button">
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            <span className="visually-hidden">Loading...</span>
                          </button>
                        ) : (
                          <button
                            className="btn btn-warning"
                            onClick={() => handleUpdate(j)}
                          >
                            <AiFillEdit />
                          </button>
                        )}

                        {loadingDelete ? (
                          <button className="btn btn-danger" type="button">
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            <span className="visually-hidden">Loading...</span>
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteJerarquia(j.id)}
                          >
                            <AiFillDelete />{" "}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
        </div>
      </div>
    </LayoutDashboardComponent>
  );
}

export default DashboardGruposPage;
