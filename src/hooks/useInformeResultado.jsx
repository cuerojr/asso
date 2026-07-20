import { useDispatch } from "react-redux";
import { setFiltrosInforme } from "../reducers/informes-reducer";

import { useState, useEffect } from "react";

export default function useInformeResultado({
  detalleInforme,
  idEmpresa,
  fallas,
  estados,
  componentes,
  fetchlistarFallas,
  fetchlistarEstados,
  fetchlistarcomponentesPorEmpresa,
  filtroFallasIniciales = [], // 👈
  filtroEstadosIniciales = [],
  filtroComponentesIniciales = [],
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
  const [selectedComponentes, setSelectedComponentes] = useState([]);

  const [opcionesEstados, setOpcionesEstados] = useState([]);
  const [opcionesFallas, setOpcionesFallas] = useState([]);
  const [opcionesComponentes, setOpcionesComponentes] = useState([]);

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
    fetchlistarcomponentesPorEmpresa(idEmpresa);
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

  // 👈 nuevo: igual patrón que fallas, pero el value/filtro es el nombre
  // (porque en equipo.componentes lo que tenemos para matchear es el nombre)
  useEffect(() => {
  if (!componentes) return;
  const componentesArray = componentes.map((item) => ({
    label: item.componente,
    value: item.componente,
    name: item.componente,
  }));
  setOpcionesComponentes(componentesArray);
}, [componentes]);

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

  // 👈 nuevo: preselección de componentes iniciales (por nombre)
  useEffect(() => {
    if (!opcionesComponentes.length || !filtroComponentesIniciales.length) return;
    const preseleccionados = opcionesComponentes.filter((o) =>
      filtroComponentesIniciales.includes(String(o.value)),
    );
    setSelectedComponentes(preseleccionados);
  }, [opcionesComponentes, filtroComponentesIniciales]);

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
  }, [selectedFallas, selectedEstados, selectedComponentes, equiposActivosState]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  // Y los handlers pasan los nuevos valores directamente
  const handleChangeMulti = (el) => {
    setSelectedFallas(el);
    dispatch(setFiltrosInforme(el, selectedEstados, selectedComponentes));
    aplicarFiltros(el, selectedEstados, selectedComponentes); // 👈 pasa el valor nuevo, no el del estado
  };

  const seleccionarEstado = (el) => {
    setSelectedEstados(el);
    dispatch(setFiltrosInforme(selectedFallas, el, selectedComponentes));
    aplicarFiltros(selectedFallas, el, selectedComponentes); // 👈 idem
  };

  // 👈 nuevo handler para componentes
  const seleccionarComponente = (el) => {
    setSelectedComponentes(el);
    dispatch(setFiltrosInforme(selectedFallas, selectedEstados, el));
    aplicarFiltros(selectedFallas, selectedEstados, el);
  };

  //filtramos equipos completos por estado pero tb por falla de componente
  const aplicarFiltros = (
    fallasSel = selectedFallas,
    estadosSel = selectedEstados,
    componentesSel = selectedComponentes,
  ) => {
    const hayFallasFiltradas = fallasSel.length > 0;
    const hayEstadosFiltrados = estadosSel.length > 0;
    const hayComponentesFiltrados = componentesSel.length > 0;

    if (!hayFallasFiltradas && !hayEstadosFiltrados && !hayComponentesFiltrados) {
      setEquiposFiltradosState(equiposActivosState);
      return;
    }

    const fallaIds = fallasSel.map((f) => f.value);
    const estadoNames = estadosSel.map((e) => e.name);
    const componenteNames = componentesSel.map((c) => c.name);

    const equiposFiltrados = equiposActivosState.map((equiposMes) => {
      // 1. Filtrar equipos por estado
      let resultado = hayEstadosFiltrados
        ? equiposMes.filter((equipo) => estadoNames.includes(equipo.eq_estado))
        : equiposMes;

      // 2. Filtrar equipos que tengan al menos 1 componente con el nombre buscado 👈 nuevo
      if (hayComponentesFiltrados) {
        resultado = resultado.filter((equipo) =>
          equipo.componentes?.some((componente) =>
            componenteNames.includes(componente.nombre),
          ),
        );
      }

      // 3. Filtrar equipos que tengan al menos 1 componente con la falla (equipo completo)
      if (hayFallasFiltradas) {
        resultado = resultado.filter((equipo) =>
          equipo.componentes?.some((componente) =>
            componente.fallas?.some((falla) => fallaIds.includes(falla.id_falla)),
          ),
        );
      }

      return resultado;
    });

    setEquiposFiltradosState(equiposFiltrados);
  };

  const limpiarFiltros = () => {
    setSelectedFallas([]);
    setSelectedEstados([]);
    setSelectedComponentes([]);
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
    opcionesComponentes,
    selectedComponentes,
    seleccionarComponente,
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
