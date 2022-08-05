import jwt_decode from "jwt-decode";

export const decoded_token = () => {
  if (window.localStorage.getItem("token")) {
    const decoded = jwt_decode(window.localStorage.getItem("token"));
    return decoded;
  }

  return null;
};
