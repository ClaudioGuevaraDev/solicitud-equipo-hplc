import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import LayoutDashboardComponent from "../components/LayoutDashboardComponent";

function DashboardEquiposPage() {
  const [estados, setEstados] = useState([]);
  const [equipo, setEquipo] = useState({
    name: "",
    image: null,
    date_obtained: new Date().toISOString().slice(0, 10),
    estado: null,
  });
  const [equipos, setEquipos] = useState([]);
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [loading, setLoading] = useState(false);

  const getEstados = async () => {
    try {
      const { data } = await axios.get("/api/estados");
      setEstados(data.data);
      if (data.data.length > 0) {
        setEquipo({
          ...equipo,
          estado: data.data[0].id,
        });
      }
    } catch (error) {
      toast.error("Error al listar los estados.");
    }
  };

  const getEquipos = async () => {
    try {
      const { data } = await axios.get("/api/equipos");
      setEquipos(data.data);
    } catch (error) {
      toast.error("Error al listar los equipos.", {
        duration: 5000,
      });
      setEquipos([]);
    }
  };

  useEffect(() => {
    if (estados.length > 0) {
      getEquipos();
    } else {
      getEstados();
    }
  }, [estados]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const post = new FormData();
      post.append("file", equipo.image);
      post.append("name", equipo.name);
      post.append("estado", equipo.estado);
      post.append("date_obtained", equipo.date_obtained);

      if (selectedEquipo) {
      } else {
        const { data } = await axios.post("/api/equipos", post);
        setEquipos([data.data, ...equipos]);
        toast.success(data.detail, {
          duration: 5000,
        });
      }

      setLoading(false);
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
      setLoading(false);
    }
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
                        id="file-input"
                        className="form-control"
                        required
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
                        <label htmlFor="estados-input" className="form-label">
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
                          {estados.map((e) => (
                            <option key={e.id} value={e.id}>
                              {e.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
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
                        disabled={
                          equipo.name === "" ||
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
          </div>
          <div className="row mt-3 gy-4">
            {equipos.length > 0 &&
              equipos.map((e) => (
                <div className="col-xl-3" key={e.id}>
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
                        <strong>Estado: </strong> <span>{e.estado}</span>
                      </h5>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </>
    </LayoutDashboardComponent>
  );
}

export default DashboardEquiposPage;
