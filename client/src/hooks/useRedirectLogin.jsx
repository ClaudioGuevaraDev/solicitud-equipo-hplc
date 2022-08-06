import { useEffect } from "react";

function useRedirectLogin() {
  useEffect(() => {
    if (!window.localStorage.getItem("token")) {
      window.location.href = "/";
    }
  }, []);

  return {};
}

export default useRedirectLogin;
