import { useEffect, useState, useRef } from "react";
import moment from "moment";

import {
  actualizarControl,
  guardarEquipoNoControladoIndividual,
} from "../lib/controles-api";
import { NotificationManager } from "../components/common/react-notifications";

const useEditarControl = ({
  equipoNoControlado,
  equipo,
  detalleCliente,
  controlIndividualSeleccionado,
  componenteIndividualSeleccionado,
  controlesDelEquipo,
  controles,
  estados,
  fetchModalEditarControl,
  setearCargaMasiva,
  setearEquipoNoControlado,
  fetchlistarEquipos,
  fetchlistarControles,
  fetchlistarcomponentes,
  fetchSetControlIndividualSeleccionado,
}) => {
  const [esperandoActualizacion, setEsperandoActualizacion] = useState(false);
  const controlIdRef = useRef(null);
  // ✅ Guardamos el estado local del control ANTES del guardado
  // para no depender de Redux en el momento exacto del dispatch
  const controlesAActualizarRef = useRef(null);

  // ── Escucha cambios en `controles` del store ───────────────────────────────
  useEffect(() => {
    if (!esperandoActualizacion) return;
    if (controlIdRef.current === null) return;

    const controlActualizado = controles?.find(
      (ctrl) => ctrl.id === controlIdRef.current,
    );
   
    // Todavía no llegó la actualización, esperamos la próxima ejecución
    if (!controlActualizado) return;
    
    // ✅ Comparamos IDs como string porque la API devuelve "236", "237", etc.
    const imagenes = (controlActualizado.files ?? []).map((f) => ({
      id: String(f.id),
      url: f.file,
      nombre: f.file.split("/").pop(), // "img_69c864a7995b7.jpg"
    }));

    fetchSetControlIndividualSeleccionado({
      ...controlActualizado,
      imagenes, // ✅ listo para ListadoDeImagenes
    });

    setEsperandoActualizacion(false);
    controlIdRef.current = null;
    controlesAActualizarRef.current = null;
  }, [controles, esperandoActualizacion]);

  // ── Guardar equipo no controlado ───────────────────────────────────────────
  const guardarEquipoNoControlado = async () => {
    const res = await guardarEquipoNoControladoIndividual(
      equipo.id,
      equipoNoControlado.motivoNoControlado,
      equipoNoControlado.observacionesMotivosNoControlados,
      equipoNoControlado.fechaEquipoNoControlado,
      detalleCliente.id,
    );

    if (res.stat === 1) {
      NotificationManager.success(
        "El equipo no controlado ha sido guardado",
        "Hecho",
        3000,
        null,
        null,
        "",
      );
      fetchModalEditarControl(false);
      setearCargaMasiva({ tituloDeReferencia: "" });
      setearEquipoNoControlado(null);
    }
  };

  // ── Guardar control ────────────────────────────────────────────────────────
  const guardarControl = async () => {
    try {
      if (!controlIndividualSeleccionado) return;

      const controlesAActualizar = controlesDelEquipo.find(
        (ctrl) => ctrl.componente === componenteIndividualSeleccionado,
      );

      const idsDeFallas = controlesAActualizar?.fallasSeleccionada?.map(
        (falla) => falla.value,
      );

      const controlData = {
        idControl: controlIndividualSeleccionado.id,
        idTipoTest:
          controlIndividualSeleccionado.nombre == "Vibraciones" ? 1 : 2,
        idEstado:
          controlesAActualizar?.estado.id ||
          estados.filter(
            (estado) => controlIndividualSeleccionado.estado === estado.nombre,
          ).id,
        idComponente:
          controlesAActualizar?.componente || componenteIndividualSeleccionado,
        fecha:
          moment(controlesAActualizar?.fecha).format("YYYY-MM-DD") ||
          moment(controlIndividualSeleccionado.fecha).format("YYYY-MM-DD"),
        fallas: JSON.stringify(idsDeFallas),
        observaciones:
          controlesAActualizar?.observacion ||
          controlIndividualSeleccionado.observaciones ||
          "",
        recomendaciones:
          controlesAActualizar?.recomendacion ||
          controlIndividualSeleccionado.recomendaciones ||
          "",
        reporte:
          controlesAActualizar?.reporte ||
          controlIndividualSeleccionado.reporte ||
          "",
        file:
          controlesAActualizar?.file?.length > 0
            ? controlesAActualizar.file
            : [],
      };

      const res = await actualizarControl(controlData);

      if (res.stat == 1) {
        // ✅ 1. Guardamos todo en refs ANTES de cualquier dispatch
        controlIdRef.current = controlIndividualSeleccionado.id;
        controlesAActualizarRef.current = controlesAActualizar;

        // ✅ 2. Actualizamos Redux optimistamente (sin URLs de imágenes aún)
        // Actualización optimista — sin imagenes todavía
        fetchSetControlIndividualSeleccionado({
          ...controlIndividualSeleccionado,
          color_estado: controlesAActualizar.estado.color,
          estado: controlesAActualizar.estado.nombre,
          fecha: controlesAActualizar.fecha,
          fallas: controlesAActualizar.fallasSeleccionada?.map((falla) => ({
            id: falla.value,
          })),
          observaciones: controlesAActualizar.observacion,
          recomendaciones: controlesAActualizar.recomendacion,
          reporte: controlesAActualizar.reporte,
          file: [],
          imagenes: [], // ✅ vaciamos hasta que lleguen las URLs reales de la API
        });

        // ✅ 3. Limpiamos el file local del control
        controlesAActualizar.file = [];

        // ✅ 4. Activamos la escucha ANTES de los dispatches asíncronos
        setEsperandoActualizacion(true);

        // ✅ 5. Disparamos las recargas (el useEffect capturará el resultado)
        fetchlistarEquipos(detalleCliente.id);
        fetchlistarControles(
          detalleCliente.id,
          equipo.id,
          controlesAActualizar.componente,
        );

        fetchSetControlIndividualSeleccionado(controles.find(
          (c) => c.id === controlIndividualSeleccionado.id,
        ));

        fetchlistarcomponentes(detalleCliente.id, equipo.id);

        fetchModalEditarControl(false);
        NotificationManager.success(
          "El control ha sido actualizado",
          "Hecho",
          3000,
          null,
          null,
          "",
        );
      }
    } catch (error) {
      NotificationManager.error(
        "Algo salio mal",
        "Error",
        3000,
        null,
        null,
        "",
      );
      console.error("Error al actualizar el control:", error);
    }
  };

  // ── Handler principal ──────────────────────────────────────────────────────
  const handleGuardar = () => {
    if (equipoNoControlado) {
      guardarEquipoNoControlado();
      return;
    }
    guardarControl();
  };

  return { handleGuardar };
};

export default useEditarControl;
