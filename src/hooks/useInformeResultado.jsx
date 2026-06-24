import { useDispatch } from "react-redux";
import { setFiltrosInforme } from "../reducers/informes-reducer";

import { useState, useEffect } from "react";

export default function useInformeResultado({
  detalleInforme,
  idEmpresa,
  fallas,
  estados,
  fetchlistarFallas,
  fetchlistarEstados,
  filtroFallasIniciales = [], // 👈
  filtroEstadosIniciales = [],
}) {
  const dispatch = useDispatch();

  const [mesesActivosState, setMesesActivosState] = useState([]);
  const [equiposActivosState, setEquiposActivosState] = useState([]);
  // Estado filtrado separado del original
  const [equiposFiltradosState, setEquiposFiltradosState] = useState([]);

  const [mostrarImagen, setMostrarImagen] = useState(false);
  const [imagen, setImagen] = useState("");
  const [filtro, setFiltro] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState(0);

  const [selectedFallas, setSelectedFallas] = useState([]);
  const [selectedEstados, setSelectedEstados] = useState([]);
  const [opcionesEstados, setOpcionesEstados] = useState([]);
  const [opcionesFallas, setOpcionesFallas] = useState([]);

  const meses = [
    null,
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // ─── Efectos de carga ────────────────────────────────────────────────────────

  useEffect(() => {
    fetchlistarEstados(idEmpresa);
    fetchlistarFallas(idEmpresa);
  }, [idEmpresa]);

  useEffect(() => {
    if (!fallas) return;
    const fallasArray = fallas.map((falla) => ({
      label: (
        <span
          dangerouslySetInnerHTML={{
            __html: `<div class="falla-color-wrapper"><div class="dot" style="background-color:${falla.color}"></div>${falla.nombre}</div>`,
          }}
        />
      ),
      value: falla.id,
      color: falla.color,
    }));
    setOpcionesFallas(fallasArray);
  }, [fallas]);

  useEffect(() => {
    if (!estados) return;
    const estadosArray = estados.map((estado) => ({
      label: (
        <span
          dangerouslySetInnerHTML={{
            __html: `<div class="falla-color-wrapper"><div class="dot" style="background-color:${estado.color}"></div>${estado.nombre}</div>`,
          }}
        />
      ),
      value: estado.id,
      color: estado.color,
      name: estado.nombre,
    }));
    setOpcionesEstados(estadosArray);
  }, [estados]);

  useEffect(() => {
    if (!opcionesFallas.length || !filtroFallasIniciales.length) return;
    const preseleccionadas = opcionesFallas.filter((o) =>
      filtroFallasIniciales.includes(String(o.value)),
    );
    setSelectedFallas(preseleccionadas);
  }, [opcionesFallas, filtroFallasIniciales]);

  useEffect(() => {
    if (!opcionesEstados.length || !filtroEstadosIniciales.length) return;
    const preseleccionados = opcionesEstados.filter((o) =>
      filtroEstadosIniciales.includes(String(o.value)),
    );
    setSelectedEstados(preseleccionados);
  }, [opcionesEstados, filtroEstadosIniciales]);

  useEffect(() => {
    if (!detalleInforme) return;

    const mesesActivos = [];
    const equipos = [];

    detalleInforme.forEach((item) => {
      mesesActivos.push(meses[Number(item.mes)] + " " + item.anio);
      equipos.push(item.equipos);
    });

    setMesesActivosState(mesesActivos);
    setEquiposActivosState(equipos);
    setEquiposFiltradosState(equipos); // inicializar filtrado con todos los datos
  }, [detalleInforme]);

  // ─── Aplicar filtros automáticamente cuando cambian selecciones ──────────────

  useEffect(() => {
    aplicarFiltros();
  }, [selectedFallas, selectedEstados, equiposActivosState]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  // Y los handlers pasan los nuevos valores directamente
  const handleChangeMulti = (el) => {
    setSelectedFallas(el);
    dispatch(setFiltrosInforme(el, selectedEstados));
    aplicarFiltros(el, selectedEstados); // 👈 pasa el valor nuevo, no el del estado
  };

  const seleccionarEstado = (el) => {
    setSelectedEstados(el);
    dispatch(setFiltrosInforme(selectedFallas, el));
    aplicarFiltros(selectedFallas, el); // 👈 idem
  };

  //filtramos equipos completos por estado pero tb por falla de componente 
  const aplicarFiltros = (
    fallasSel = selectedFallas,
    estadosSel = selectedEstados,
  ) => {
    const hayFallasFiltradas = fallasSel.length > 0;
    const hayEstadosFiltrados = estadosSel.length > 0;

    if (!hayFallasFiltradas && !hayEstadosFiltrados) {
      setEquiposFiltradosState(equiposActivosState);
      return;
    }

    const fallaIds = fallasSel.map((f) => f.value);
    const estadoNames = estadosSel.map((e) => e.name);

    const equiposFiltrados = equiposActivosState.map((equiposMes) => {
      // 1. Filtrar equipos por estado
      const equiposPorEstado = hayEstadosFiltrados
        ? equiposMes.filter((equipo) => estadoNames.includes(equipo.eq_estado))
        : equiposMes;

      // 2. Filtrar equipos que tengan al menos 1 componente con la falla (equipo completo)
      if (!hayFallasFiltradas) return equiposPorEstado;

      return equiposPorEstado.filter((equipo) =>
        equipo.componentes?.some((componente) =>
          componente.fallas?.some((falla) => fallaIds.includes(falla.id_falla)),
        ),
      );
    });

    setEquiposFiltradosState(equiposFiltrados);
  };

  const limpiarFiltros = () => {
    setSelectedFallas([]);
    setSelectedEstados([]);
    setEquiposFiltradosState(equiposActivosState);
  };

  const mostrarImagenModal = (img) => {
    setImagen(img);
    setMostrarImagen(true);
  };

  const guardarInformeFiltrado = () => {
    // Aquí podrías implementar la lógica para guardar el informe filtrado
    // por ejemplo, enviándolo a un servidor o guardándolo en localStorage
    console.log("Informe filtrado guardado:", equiposFiltradosState);
  };

  // ─── Return ──────────────────────────────────────────────────────────────────

  return {
    mesesActivosState,
    equiposActivosState: equiposFiltradosState, // 👈 el componente recibe los filtrados
    mostrarImagen,
    imagen,
    mesSeleccionado,
    filtro,
    opcionesFallas,
    opcionesEstados,
    selectedFallas,
    selectedEstados,
    handleChangeMulti,
    seleccionarEstado,
    setFiltro,
    setMesSeleccionado,
    mostrarImagenModal,
    setMostrarImagen,
    limpiarFiltros,
    aplicarFiltros,
    guardarInformeFiltrado,
  };
}
