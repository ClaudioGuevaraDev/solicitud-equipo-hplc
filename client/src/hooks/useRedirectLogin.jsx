import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function useRedirectLogin() {
  const [cookies, setCookie] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.token) {
      navigate("/");
    }
  }, []);

  return {};
}

export default useRedirectLogin;
