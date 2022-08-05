import { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useState } from "react";
import axios from "axios";

function useHandleToken() {
  const [loggedUser, setLoggedUser] = useState({
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    url_image: "",
    role: "",
  });
  const [loadingDataUser, setLoadingDataUser] = useState(true);

  const getDataInfo = async () => {
    try {
      const decoded = jwt_decode(window.localStorage.getItem("token"));

      const { data } = await axios.get(`/api/users/${decoded.id}`);

      setLoggedUser({
        id: decoded.id,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        email: decoded.email,
        url_image: data.user.url_image,
        role: decoded.role,
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      getDataInfo();
    }
    setLoadingDataUser(false);
  }, []);

  return {
    loggedUser,
    loadingDataUser,
  };
}

export default useHandleToken;
