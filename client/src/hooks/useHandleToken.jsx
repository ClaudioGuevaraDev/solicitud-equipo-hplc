import { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useState } from "react";

function useHandleToken() {
  const [loggedUser, setLoggedUser] = useState({
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    url_image: "",
    role: "",
  });

  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      const decoded = jwt_decode(window.localStorage.getItem("token"));
      setLoggedUser({
        id: decoded.id,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        email: decoded.email,
        url_image: decoded.url_image,
        role: decoded.role,
      });
    }
  }, []);

  return {
    loggedUser,
  };
}

export default useHandleToken;
