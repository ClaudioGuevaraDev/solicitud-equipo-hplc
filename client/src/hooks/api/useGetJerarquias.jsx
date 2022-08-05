import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

function useGetJerarquias() {
  const [jerarquias, setJerarquias] = useState([]);
  const [jerarquiaValue, setJerarquiaValue] = useState("");

  const getJerarquias = async () => {
    try {
      const { data } = await axios.get("/api/jerarquias");

      setJerarquias(data.data);
      setJerarquiaValue(data.data[0].name);
    } catch (error) {
      setJerarquias([]);
      setJerarquiaValue("");
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
  };
}

export default useGetJerarquias;
