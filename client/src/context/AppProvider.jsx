import React, { useState } from "react";
import AppContext from "./AppContext";

function AppProvider({ children }) {
  const [userLogged, setUserLogged] = useState({
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    url_image: "",
    role: "",
    jerarquia: "",
  });

  const handleUserLogged = ({
    id,
    first_name,
    last_name,
    email,
    url_image,
    role,
    jerarquia,
  }) => {
    setUserLogged({
      id,
      first_name,
      last_name,
      email,
      url_image,
      role,
      jerarquia,
    });
  };

  return (
    <AppContext.Provider value={{ userLogged, handleUserLogged }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
