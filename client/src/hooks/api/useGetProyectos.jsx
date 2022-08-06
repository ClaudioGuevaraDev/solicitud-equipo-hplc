import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

function useGetProyectos() {
  const [proyectos, setProyectos] = useState([]);

  const getProyectos = async () => {
    try {
      const { data } = await axios.get("/api/proyectos");
      setProyectos(data.data);
    } catch (error) {
      toast.error("Error al listar los proyectos.", {
        duration: 5000,
      });
      setProyectos([]);
    }
  };

  useEffect(() => {
    getProyectos();
  }, []);

  return {
    proyectos,
    setProyectos
  };
}

export default useGetProyectos;
