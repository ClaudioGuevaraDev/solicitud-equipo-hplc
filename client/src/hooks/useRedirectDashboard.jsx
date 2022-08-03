import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useRedirectDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      navigate("/dashboard/perfil");
    }
  }, []);

  return {};
}

export default useRedirectDashboard;
