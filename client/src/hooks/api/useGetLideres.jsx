import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

function useGetLideres() {
  const [lideres, setLideres] = useState([]);

  const getLideres = async () => {
    try {
      const { data } = await axios.get("/api/lideres");
      setLideres(data.data);
    } catch (error) {
      toast.error("Error al listar los líderes", {
        duration: 5000,
      });
      setLideres([]);
    }
  };

  useEffect(() => {
    getLideres();
  }, []);

  return {
    lideres,
    setLideres
  };
}

export default useGetLideres;
