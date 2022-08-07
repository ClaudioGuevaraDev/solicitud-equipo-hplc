import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LayoutDashboardComponent from "../components/LayoutDashboardComponent";
import { RiThumbUpFill } from "@react-icons/all-files/ri/RiThumbUpFill";
import { RiThumbDownFill } from "@react-icons/all-files/ri/RiThumbDownFill";

function DashboardUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);

  const getUsuarios = async () => {
    try {
      const { data } = await axios.get("/api/users");
      setUsuarios(data.data);
    } catch (error) {
      console.log(error);
      toast.error("Error al listar los usuarios.", {
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    getUsuarios();
  }, []);

  return (
    <LayoutDashboardComponent>
      <div>
        <div className="mb-3">
          <h1>
            <strong>Usuarios</strong>
          </h1>
        </div>
        <div className="row gy-4">
          {usuarios.length > 0 && (
            <div className="col-12 table-responsive" style={{ maxWidth: 1300 }}>
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
                    <tr>
                      <td>{u.first_name}</td>
                      <td>{u.last_name}</td>
                      <td>{u.email}</td>
                      <td>
                        {u.jerarquia ? u.jerarquia.name : "Sin jerarquía"}
                      </td>
                      <td>
                        {u.role
                          ? u.role.name
                            ? "admin"
                              ? "Administrador"
                              : "Usuario"
                            : "Sin rol"
                          : "Sin Rol"}
                      </td>
                      <td>
                        {u.verified ? (
                          <RiThumbUpFill className="text-success" size={20} />
                        ) : (
                          <RiThumbDownFill className="text-danger" size={20} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </LayoutDashboardComponent>
  );
}

export default DashboardUsuariosPage;
