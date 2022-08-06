import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

function useGetLideres() {
  const [lideres, setLideres] = useState([]);
  const [liderValue, setLiderValue] = useState(null)

  const getLideres = async () => {
    try {
      const { data } = await axios.get("/api/lideres");
      setLideres(data.data);
      setLiderValue(data.data[0].id)
    } catch (error) {
      toast.error("Error al listar los líderes", {
        duration: 5000,
      });
      setLideres([]);
      setLiderValue(null)
    }
  };

  useEffect(() => {
    getLideres();
  }, []);

  return {
    lideres,
    setLideres,
    liderValue,
    setLiderValue
  };
}

export default useGetLideres;
