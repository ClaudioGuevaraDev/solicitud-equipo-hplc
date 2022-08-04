import { useEffect } from "react";
import { useLoadingContext, topbar } from "react-router-loading";

function useLoadingPage() {
  const loadingContenxt = useLoadingContext();

  topbar.config({
    autoRun: false,
    barThickness: 5,
    barColors: {
      0: "#134F92",
      0.3: "#134F92",
      1.0: "#134F92",
    },
    shadowBlur: 15,
    className: "topbar",
  });

  useEffect(() => {
    loadingContenxt.done();
  }, []);

  return {};
}

export default useLoadingPage;
