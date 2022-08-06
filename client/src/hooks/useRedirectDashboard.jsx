import { useEffect } from "react";

function useRedirectDashboard() {
  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      window.location.href = "/dashboard/perfil";
    }
  }, []);

  return {};
}

export default useRedirectDashboard;
