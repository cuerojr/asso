// useDetalleComponente.js
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchlistarControles } from "../reducers/controles-reducer";
import {
  listarTipoTesteos,
  altaControl,
  eliminarControl,
  actualizarControl,
  recargarEstadosControl,
} from "../lib/controles-api";
import { NotificationManager } from "../components/common/react-notifications";
import { booleanToNumber, numberToBoolean } from "../componentes/utils/utils";

const useDetalleComponente = (props) => {
  const dispatch = useDispatch();
  const controles = useSelector((state) => state.controlesReducer.controles);

  const [nombre, setNombre] = useState(props.componente.nombre);
  const [descripcion, setDescripcion] = useState(props.componente.descripcion);
  const [nuevoControl, setNuevoControl] = useState(false);
  const [editarControl, setEditarControl] = useState(false);
  const [controlSeleccionado, setControlSeleccionado] = useState(null);
  const [tipoTesteos, setTipoTesteos] = useState(null);
  const [mostrarModalConfirmarEliminarComponente, setMostrarModalConfirmarEliminarComponente] = useState(false);
  const [filtro, setFiltro] = useState(null);
  const [estados, setEstados] = useState(props.componente.estados);
  const [bajaRPM, setBajaRPM] = useState(numberToBoolean(Number(props.componente.baja_rpm)));

  useEffect(() => {
    setNombre(props.componente.nombre);
    setDescripcion(props.componente.descripcion);
    setBajaRPM(numberToBoolean(Number(props.componente.baja_rpm)));
    setEstados(props.componente.estados);
    setNuevoControl(false);
    setEditarControl(false);

    dispatch(fetchlistarControles(props.idEmpresa, props.equipo.id, props.componente.id));
    listarTipoTesteos().then((res) => {
      setTipoTesteos(res);
      let filtroTemp = [];
      res.map((tipo) => {
        filtroTemp.push({ nombre: tipo.control, visible: true });
      });
      setFiltro(filtroTemp);
    });
    recargarEstadosControl(props.componente.id).then((res) => {
      setEstados(res[0].estados);
    });
  }, [props.componente.id]);

  useEffect(() => {
    recargarEstadosControl(props.componente.id).then((res) => {
      setEstados(res[0].estados);
    });
  }, [controles]);

  const volverComponentes = () => {
    props.salirDetalleComponente();
  };

  const editarControlSeleccionado = (control) => {
    setControlSeleccionado(control);
    setEditarControl(true);
  };

  const actualizarComponente = () => {
    props.updateComponente(
      props.componente.id,
      nombre,
      descripcion,
      booleanToNumber(bajaRPM),
    );
  };

  const eliminarComponente = () => {
    props.deleteComponente(props.componente.id);
  };

  const cargarControl = (tipoTest, idEstado, fecha, fallas, observaciones, recomendaciones, reporte, file) => {
    altaControl(
      tipoTest, idEstado, props.componente.id, fecha,
      JSON.stringify(fallas), observaciones, recomendaciones, reporte, file,
    ).then((res) => {
      if (res.stat == 1) {
        dispatch(fetchlistarControles(props.idEmpresa, props.equipo.id, props.componente.id));
        setNuevoControl(false);
        recargarEstadosControl(props.componente.id).then((res) => {
          setEstados(res[0].estados);
        });
        NotificationManager.success("El control ha sido cargado", "Hecho", 3000, null, null, "");
      } else if (res.stat == 0) {
        NotificationManager.error(res.err, "Error");
      }
    });
  };

  const borrarControl = (idTest) => {
    eliminarControl(idTest).then((res) => {
      if (res.stat == 1) {
        dispatch(fetchlistarControles(props.idEmpresa, props.equipo.id, props.componente.id));
        NotificationManager.success("El control ha sido eliminado", "Hecho", 3000, null, null, "");
        setEditarControl(false);
        recargarEstadosControl(props.componente.id).then((res) => {
          setEstados(res[0].estados);
        });
      } else if (res.stat == 0) {
        NotificationManager.error(res.err, "Error");
      }
    });
  };

  const updateControl = (idTest, tipoTest, idEstado, fecha, fallas, observaciones, recomendaciones, reporte, file) => {
    actualizarControl(
      idTest, tipoTest, idEstado, props.componente.id, fecha,
      JSON.stringify(fallas), observaciones, recomendaciones, reporte, file,
    ).then((res) => {
      if (res.stat == 1) {
        dispatch(fetchlistarControles(props.idEmpresa, props.equipo.id, props.componente.id));
        setEditarControl(false);
        recargarEstadosControl(props.componente.id).then((res) => {
          setEstados(res[0].estados);
        });
        NotificationManager.success("El control ha sido actualizado", "Hecho", 3000, null, null, "");
      } else if (res.stat == 0) {
        NotificationManager.error(res.err, "Error");
      }
    });
  };

  const filtrarControl = (value, tipo) => {
    let tipoFiltroTemp = filtro;
    tipoFiltroTemp.map((filtro) => {
      if (value && filtro.nombre == tipo) {
        filtro.visible = true;
      } else if (!value && filtro.nombre == tipo) {
        filtro.visible = false;
      }
    });
    setFiltro(tipoFiltroTemp);
    dispatch(fetchlistarControles(props.idEmpresa, props.equipo.id, props.componente.id));
  };

  const salirEditarControl = () => {
    setEditarControl(false);
    setControlSeleccionado(null);
  };

  return {
    controles,
    nombre, setNombre,
    descripcion, setDescripcion,
    nuevoControl, setNuevoControl,
    editarControl, setEditarControl,
    controlSeleccionado,
    tipoTesteos,
    mostrarModalConfirmarEliminarComponente, setMostrarModalConfirmarEliminarComponente,
    filtro,
    estados,
    bajaRPM, setBajaRPM,
    volverComponentes,
    editarControlSeleccionado,
    actualizarComponente,
    eliminarComponente,
    cargarControl,
    borrarControl,
    updateControl,
    filtrarControl,
    salirEditarControl,
  };
};

export default useDetalleComponente;