import { createContext } from "react";

export const defaultState = {
  userLogged: {
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    url_image: "",
    role: "",
    jerarquia: "",
  },
  handleUserLogged: ({
    id,
    first_name,
    last_name,
    email,
    url_image,
    role,
    jerarquia,
  }) => undefined,
};

const AppContext = createContext(defaultState);

export default AppContext;
