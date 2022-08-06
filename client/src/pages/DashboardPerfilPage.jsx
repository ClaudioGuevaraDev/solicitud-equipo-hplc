import LayoutDashboardComponent from "../components/LayoutDashboardComponent";
import axios from "axios";
import toast from "react-hot-toast";

import UnknownProfile from "../assets/unknown_perfil.jpg";
import { useState } from "react";
import { useContext } from "react";
import AppContext from "../context/AppContext";
import useGetJerarquias from "../hooks/api/useGetJerarquias";
import { useEffect } from "react";

function DashboardPerfilPage() {
  const { jerarquias } = useGetJerarquias();
  const { userLogged, handleUserLogged } = useContext(AppContext);
  const [userImage, setUserImage] = useState({
    image: null,
  });
  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    jerarquia: "",
  });
  const [showSelect, setShowSelect] = useState(false);

  useEffect(() => {
    if (userLogged.jerarquia) {
      setUserInfo({ ...userInfo, jerarquia: userLogged.jerarquia });
      setShowSelect(true);
    } else {
      setShowSelect(true);
    }
  }, [userLogged.jerarquia]);

  const handleUserImage = async (e) => {
    e.preventDefault();

    try {
      const post = new FormData();
      post.append("image", userImage.image);
      const { data } = await axios.put(
        `/api/users/change-image/${userLogged.id}`,
        post
      );
      toast.success(data.detail, {
        duration: 4000,
      });
      handleUserLogged({ ...userLogged, url_image: data.url_image });
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
        setUserImage({
          image: null,
        });
      }
    }
  };

  const handleUserInfo = async (e) => {
    e.preventDefault();

    try {
      const post = {
        first_name:
          userInfo.first_name === ""
            ? userLogged.first_name
            : userInfo.first_name,
        last_name:
          userInfo.last_name === "" ? userLogged.last_name : userInfo.last_name,
        jerarquia: userInfo.jerarquia,
      };

      const { data } = await axios.put(
        `/api/users/change-info-user/${userLogged.id}`,
        post
      );
      toast.success(data.detail, {
        duration: 5000,
      });
      handleUserLogged({
        ...userLogged,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        jerarquia: data.user.jerarquia,
      });
      setUserInfo({
        first_name: "",
        last_name: "",
        jerarquia: userLogged.jerarquia ? userLogged.jerarquia : "",
      });
    } catch (error) {
      if (error.response.data.detail) {
        const error_message = error.response.data.detail;
        toast.error(error_message, {
          duration: 6000,
        });
      }
      setUserInfo({
        first_name: userLogged.first_name,
        last_name: userLogged.last_name,
        jerarquia: userLogged.jerarquia ? userLogged.jerarquia : "",
      });
    }
  };

  return (
    <LayoutDashboardComponent>
      <div>
        <h1 className="mb-3">
          <strong>Mi Perfil</strong>
        </h1>
        <div className="row">
          <div className="col-xl-2 col-lg-5 col-md-9 col-sm-12 col-12">
            <img
              src={userLogged.url_image ? userLogged.url_image : UnknownProfile}
              alt={`${userLogged.first_name} ${userLogged.last_name}`}
              width="100%"
              style={{ height: 300 }}
            />
            <form onSubmit={handleUserImage}>
              <input
                className="form-control mt-2 mb-3"
                type="file"
                onChange={(e) =>
                  setUserImage({ ...userImage, image: e.target.files[0] })
                }
              />
              <button
                className="btn btn-success"
                disabled={userImage.image ? false : true}
                type="submit"
              >
                EDITAR
              </button>
            </form>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-xl-3 col-lg-7 col-md-9 col-sm-12 col-12">
            <form onSubmit={handleUserInfo}>
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
                      placeholder={userLogged.first_name}
                      value={userInfo.first_name}
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          first_name: e.target.value,
                        })
                      }
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
                      placeholder={userLogged.last_name}
                      value={userInfo.last_name}
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          last_name: e.target.value,
                        })
                      }
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
                      placeholder={userLogged.email}
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
                        userLogged.role === "admin"
                          ? "Administrador"
                          : "Usuario"
                      }
                      disabled={true}
                    />
                  </div>
                </div>
                {showSelect === true && (
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label htmlFor="jerarquia-input" className="form-label">
                        Jerarquía
                      </label>
                      <select
                        className="form-select"
                        id="jerarquia-input"
                        value={userInfo.jerarquia}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            jerarquia: e.target.value,
                          })
                        }
                      >
                        {userInfo.jerarquia === "" && (
                          <option selected>Sin jerarquía</option>
                        )}
                        {jerarquias.map((j) => (
                          <option
                            selected={j.name === userLogged.jerarquia}
                            key={j.name}
                            value={j.name}
                          >
                            {`${j.name.charAt(0).toUpperCase()}${j.name.slice(
                              1
                            )}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <button
                className="btn btn-success"
                type="submit"
                disabled={
                  userInfo.first_name === "" &&
                  userInfo.last_name === "" &&
                  (userInfo.jerarquia === "" ||
                    userInfo.jerarquia === userLogged.jerarquia)
                    ? true
                    : false
                }
              >
                EDITAR
              </button>
            </form>
          </div>
        </div>
      </div>
    </LayoutDashboardComponent>
  );
}

export default DashboardPerfilPage;
