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
  });

  const handleUserLogged = ({
    id,
    first_name,
    last_name,
    email,
    url_image,
    role,
  }) => {
    setUserLogged({
      id,
      first_name,
      last_name,
      email,
      url_image,
      role,
    });
  };

  return (
    <AppContext.Provider value={{ userLogged, handleUserLogged }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
