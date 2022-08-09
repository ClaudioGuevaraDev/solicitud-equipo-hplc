import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

function useGetJerarquias() {
  const [jerarquias, setJerarquias] = useState([]);
  const [jerarquiaValue, setJerarquiaValue] = useState("");
  const [loadingJerarquias, setLoadingJerarquias] = useState(true);

  const getJerarquias = async () => {
    try {
      const { data } = await axios.get("/api/jerarquias");

      setJerarquias(data.data);
      if (data.data.length > 0) {
        setJerarquiaValue(data.data[0].name);
      }
      setLoadingJerarquias(false);
    } catch (error) {
      toast.error("Error al listar las jerarquías", {
        duration: 5000,
      });
      setJerarquias([]);
      setJerarquiaValue("");
      setLoadingJerarquias(false);
    }
  };

  useEffect(() => {
    getJerarquias();
  }, []);

  return {
    jerarquias,
    setJerarquias,
    jerarquiaValue,
    setJerarquiaValue,
    loadingJerarquias,
  };
}

export default useGetJerarquias;
