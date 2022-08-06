import axios from "axios";
import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import LayoutDashboardComponent from "../components/LayoutDashboardComponent";
import useGetLideres from "../hooks/api/useGetLideres";
import { AiFillEdit } from "@react-icons/all-files/ai/AiFillEdit";
import { AiFillDelete } from "@react-icons/all-files/ai/AiFillDelete";

function DashboardLideresPage() {
  const { lideres, setLideres } = useGetLideres();

  const [loading, setLoading] = useState({
    create: false,
    update: false,
    delete: false,
  });
  const [lider, setLider] = useState({
    full_name: "",
  });
  const [selectedLider, setSelectedLider] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedLider) {
        setLoading({ ...loading, update: true });
        const { data } = await axios.put(
          `/api/lideres/${selectedLider}`,
          lider
        );
        toast.success(data.detail, {
          duration: 5000,
        });
        setLideres(lideres.map((l) => (l.id === data.data.id ? data.data : l)));
        setSelectedLider(null);
        setLoading({ ...loading, update: false });
      } else {
        setLoading({ ...loading, create: true });

        const { data } = await axios.post("/api/lideres", lider);
        toast.success(data.detail, {
          duration: 5000,
        });
        setLideres([data.data, ...lideres]);
        setLoading({ ...loading, create: false });
      }
      setLider({
        full_name: "",
      });
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
      setSelectedLider(null);
      setLider({
        full_name: "",
      });
      setLoading({ ...loading, create: false, update: false });
    }
  };

  const handleUpdate = (lider) => {
    setSelectedLider(lider.id);
    setLider({
      full_name: lider.full_name,
    });
  };

  const deleteLider = async (id) => {
    setLoading({ ...loading, delete: true });
    try {
      const { data } = await axios.delete(`/api/lideres/${id}`);
      setLideres(lideres.filter((l) => l.id !== data.data.id));
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

    setLoading({ ...loading, delete: false });
  };

  return (
    <LayoutDashboardComponent>
      <div>
        <div className="mb-3">
          <h1>
            <strong>Líderes</strong>
          </h1>
        </div>
        <div className="row gy-4">
          <div className="col-xl-4 col-12" style={{ maxWidth: 400 }}>
            <div className="card shadow">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="full-name-input" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="full-name-input"
                      className="form-control"
                      required
                      placeholder="Ej: Álvaro Olivera"
                      value={lider.full_name}
                      onChange={(e) =>
                        setLider({ ...lider, full_name: e.target.value })
                      }
                    />
                  </div>
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
                      disabled={lider.full_name === "" ? true : false}
                    >
                      {selectedLider ? "EDITAR" + " LÍDER" : "CREAR" + " LÍDER"}
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>

          <div className="col-xl-7 col-12" style={{ maxWidth: 550 }}>
            <table className="table table-hover table-stripped text-center table-bordered table-responsive shadow">
              <thead className="table-dark">
                <tr>
                  <th>Nombre Completo</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {lideres.map((l) => (
                  <tr key={l.full_name}>
                    <td>{l.full_name}</td>
                    <td>
                      <div className="hstack gap-3 d-flex align-items-center justify-content-center">
                        {loading.update ? (
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
                            onClick={() => handleUpdate(l)}
                          >
                            <AiFillEdit />
                          </button>
                        )}

                        {loading.delete ? (
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
                            onClick={() => deleteLider(l.id)}
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

export default DashboardLideresPage;
