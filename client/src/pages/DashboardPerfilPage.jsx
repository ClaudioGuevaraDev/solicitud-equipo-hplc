import LayoutDashboardComponent from "../components/LayoutDashboardComponent";
import useHandleToken from "../hooks/useHandleToken";

import UnknownProfile from "../assets/unknown_perfil.jpg";

function DashboardPerfilPage() {
  const { loggedUser } = useHandleToken();

  return (
    <LayoutDashboardComponent>
      <div>
        <h1 className="mb-3">
          <strong>Mi Perfil</strong>
        </h1>
        <div className="row">
          <div className="col-xl-3 col-lg-7 col-md-9 col-sm-12 col-12">
            <img
              src={loggedUser.url_image ? loggedUser.url_image : UnknownProfile}
              alt={`${loggedUser.first_name} ${loggedUser.last_name}`}
              width="100%"
              style={{ height: 300 }}
            />
            <input className="form-control mt-2 mb-3" type="file" />
            <button className="btn btn-success">EDITAR</button>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-xl-3 col-lg-7 col-md-9 col-sm-12 col-12">
            <form>
              <div className="row">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="mb-3">
                    <label htmlFor="first-name-input" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="first-name-input"
                      className="form-control"
                      placeholder={loggedUser.first_name}
                      value={loggedUser.first_name}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="mb-3">
                    <label htmlFor="last-name-input" className="form-label">
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="last-name-input"
                      className="form-control"
                      placeholder={loggedUser.last_name}
                      value={loggedUser.last_name}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="mb-3">
                    <label htmlFor="email-input" className="form-label">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      id="email-input"
                      className="form-control"
                      placeholder={loggedUser.email}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="mb-3">
                    <label htmlFor="user-type-input" className="form-label">
                      Tipo de Usuario
                    </label>
                    <input
                      type="text"
                      id="user-type-input"
                      className="form-control"
                      placeholder={
                        loggedUser.role === "user"
                          ? "Usuario"
                          : loggedUser.role === "admin"
                          ? "Administrador"
                          : loggedUser.role === "root" && "Root"
                      }
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
              <button className="btn btn-success">EDITAR</button>
            </form>
          </div>
        </div>
      </div>
    </LayoutDashboardComponent>
  );
}

export default DashboardPerfilPage;
