import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useRedirectLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.localStorage.getItem("token")) {
      navigate("/")
    }
  }, []);

  return {};
}

export default useRedirectLogin;
