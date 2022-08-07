import React from "react";
import { useState } from "react";
import LayoutDashboardComponent from "../components/LayoutDashboardComponent";
import useGetJerarquias from "../hooks/api/useGetJerarquias";
import { AiFillEdit } from "@react-icons/all-files/ai/AiFillEdit";
import { AiFillDelete } from "@react-icons/all-files/ai/AiFillDelete";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteModal from "../components/DeleteModal";

function DashboardJerarquiasPage() {
  const { jerarquias, setJerarquias } = useGetJerarquias();
  const [loading, setLoading] = useState(false);
  const [selectedJerarquia, setSelectedJerarquia] = useState(null);
  const [selectedDeleteJerarquia, setSelectedDeleteJerarquia] = useState(null);

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
        toast.success(data.detail, {
          duration: 5000,
        });
        window.location.href = "/dashboard/jerarquias";
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
      setSelectedJerarquia(null);
      setLoading(false);
    }
  };

  const deleteJerarquia = async (id) => {
    try {
      const { data } = await axios.delete(`/api/jerarquias/${id}`);
      toast.success(data.detail, {
        duration: 5000,
      });
      window.location.href = "/dashboard/jerarquias";
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
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
      <>
        <div>
          <div className="mb-3">
            <h1>
              <strong>Jerarquías</strong>
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
                        {selectedJerarquia
                          ? "EDITAR" + " JERARQUÍA"
                          : "CREAR" + " JERARQUÍA"}
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>
            <div
              className="col-xl-7 col-12 table-responsive"
              style={{ maxWidth: 750 }}
            >
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
                          <button
                            className="btn btn-warning"
                            onClick={() => handleUpdate(j)}
                          >
                            <AiFillEdit />
                          </button>

                          <button
                            className="btn btn-danger"
                            onClick={() => setSelectedDeleteJerarquia(j.id)}
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
        </div>
        <DeleteModal
          title="la jerarquía"
          handleDelete={() => deleteJerarquia(selectedDeleteJerarquia)}
        />
      </>
    </LayoutDashboardComponent>
  );
}

export default DashboardJerarquiasPage;
