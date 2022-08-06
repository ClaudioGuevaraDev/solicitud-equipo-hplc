import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

function useGetGrupos() {
  const [grupos, setGrupos] = useState([]);

  const getGrupos = async () => {
    try {
      const { data } = await axios.get("/api/grupos");
      setGrupos(data.data);
    } catch (error) {
      toast.error("Error al listar los grupos.", {
        duration: 5000,
      });
      setGrupos([]);
    }
  };

  useEffect(() => {
    getGrupos();
  }, []);

  return {
    grupos,
    setGrupos
  };
}

export default useGetGrupos;
