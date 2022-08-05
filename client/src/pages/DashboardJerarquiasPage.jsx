import React from "react";
import { useState } from "react";
import LayoutDashboardComponent from "../components/LayoutDashboardComponent";
import useGetJerarquias from "../hooks/api/useGetJerarquias";
import { AiFillEdit } from "@react-icons/all-files/ai/AiFillEdit";
import { AiFillDelete } from "@react-icons/all-files/ai/AiFillDelete";
import axios from "axios";
import toast from "react-hot-toast";

function DashboardJerarquiasPage() {
  const { jerarquias, setJerarquias } = useGetJerarquias();
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [selectedJerarquia, setSelectedJerarquia] = useState(null);

  const [jerarquia, setJerarquia] = useState({
    name: "",
    score: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (selectedJerarquia) {
        const { data } = await axios.put(
          `/api/jerarquias/${selectedJerarquia}`,
          jerarquia
        );
        setJerarquias(
          jerarquias.map((j) => (j.id === data.data["id"] ? data.data : j))
        );
        toast.success(data.detail, {
          duration: 5000,
        });
        setSelectedJerarquia(null);
      } else {
        const { data } = await axios.post("/api/jerarquias", jerarquia);
        setJerarquias([...jerarquias, data.data]);
        toast.success(data.detail, {
          duration: 5000,
        });
      }
      setJerarquia({
        name: "",
        score: 1,
      });
      setLoading(false);
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
      setJerarquia({
        name: "",
        score: 1,
      });
      setLoading(false);
      setSelectedJerarquia(null);
    }
  };

  const deleteJerarquia = async (id) => {
    setLoadingDelete(true);

    try {
      const { data } = await axios.delete(`/api/jerarquias/${id}`);
      toast.success(data.detail, {
        duration: 5000,
      });
      setJerarquias(jerarquias.filter((j) => j.id !== data.data["id"]));
      setLoadingDelete(false);
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
      setLoadingDelete(false);
    }
  };

  const handleUpdate = (jerarquia) => {
    setSelectedJerarquia(jerarquia.id);
    setJerarquia({
      name: jerarquia.name,
      score: jerarquia.score,
    });
  };

  return (
    <LayoutDashboardComponent>
      <div>
        <div className="mb-3">
          <h1>
            <strong>Jerarquías</strong>
          </h1>
        </div>
        <div className="row">
          <div className="col-xl-2">
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
                      placeholder="Ej: Profesor"
                      value={jerarquia.name}
                      onChange={(e) =>
                        setJerarquia({ ...jerarquia, name: e.target.value })
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
                      value={jerarquia.score}
                      onChange={(e) =>
                        setJerarquia({ ...jerarquia, score: e.target.value })
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
                      disabled={
                        jerarquia.name === "" || jerarquia.score === ""
                          ? true
                          : false
                      }
                    >
                      {selectedJerarquia ? "EDITAR" : "CREAR" + " JERARQUÍA"}
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
          <div className="col-xl-3">
            <table className="table table-hover table-stripped text-center table-bordered shadow">
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
                          <button
                            className="btn btn-warning w-100"
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
                            className="btn btn-warning"
                            onClick={() => handleUpdate(j)}
                          >
                            <AiFillEdit />
                          </button>
                        )}

                        {loadingDelete ? (
                          <button
                            className="btn btn-danger w-100"
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
          </div>
        </div>
      </div>
    </LayoutDashboardComponent>
  );
}

export default DashboardJerarquiasPage;
