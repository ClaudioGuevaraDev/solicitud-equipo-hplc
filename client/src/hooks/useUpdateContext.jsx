import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import AppContext from "../context/AppContext";
import { decoded_token } from "../utils/decoded_token";

function useUpdateContext() {
  const { handleUserLogged } = useContext(AppContext);

  const getDataUser = async () => {
    const decoded = decoded_token();

    if (decoded && decoded.id && decoded.id >= 1) {
      try {
        const { data } = await axios.get(`/api/users/${decoded.id}`);
        handleUserLogged({
          email: data.user.email,
          first_name: data.user.first_name,
          id: data.user.id,
          last_name: data.user.last_name,
          role: data.user.role.name,
          url_image: data.user.url_image,
          jerarquia: data.user.jerarquia
            ? data.user.jerarquia.name
            : data.user.jerarquia,
        });
      } catch (error) {
        window.localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
  };

  useEffect(() => {
    getDataUser();
  }, []);

  return {};
}

export default useUpdateContext;
