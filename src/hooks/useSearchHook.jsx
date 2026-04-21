import { useState, useEffect, useCallback } from "react";

const SEARCH_TYPE = {
  ALL: "0",
  MESSAGES_ONLY: "1",
};

const MESSAGE_TYPE = {
  VIEWED: "0",
  NOT_VIEWED: "1",
};

export default function useSearchHook({
  idEmpresa,
  fetchBuscarNotificaciones,
  fetchListarNotificaciones,
  novedades,
  itemsPorPagina = 20,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [contadorPaginas, setContadorPaginas] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Resetear página cuando cambia la búsqueda
  useEffect(() => {
    setContadorPaginas(0);
  }, [busqueda, idEmpresa]);

  // Calcular total de páginas
  useEffect(() => {
    if (novedades?.Total && novedades.Total > 0) {
      setTotalPaginas(Math.ceil(novedades.Total / itemsPorPagina));
    } else {
      setTotalPaginas(1);
    }
  }, [novedades, itemsPorPagina]);

  // Efecto principal para fetch
  useEffect(() => {
    const trimmedSearch = busqueda.trim();
    
    if (trimmedSearch) {
      fetchBuscarNotificaciones(
        "sn",
        MESSAGE_TYPE.VIEWED,
        contadorPaginas,
        idEmpresa,
        SEARCH_TYPE.ALL,
        trimmedSearch
      );
    } else {
      fetchListarNotificaciones(
        "ln",
        MESSAGE_TYPE.VIEWED,
        contadorPaginas,
        idEmpresa,
        SEARCH_TYPE.MESSAGES_ONLY
      );
    }
  }, [
    busqueda,
    contadorPaginas,
    idEmpresa,
    fetchBuscarNotificaciones,
    fetchListarNotificaciones,
  ]);

  const handleSearch = useCallback((query) => {
    setBusqueda(query);
  }, []);

  const anteriorSiguiente = useCallback((accion) => {
    setContadorPaginas((prevContador) => {
      return accion === "siguiente"
        ? Math.min(prevContador + 1, totalPaginas - 1)
        : Math.max(prevContador - 1, 0);
    });
  }, [totalPaginas]);

  const irAPagina = useCallback((numeroDePagina) => {
    setContadorPaginas(numeroDePagina);
  }, []);

  return {
    busqueda,
    setBusqueda,
    handleSearch,
    contadorPaginas,
    setContadorPaginas,
    totalPaginas,
    anteriorSiguiente,
    irAPagina,
  };
}