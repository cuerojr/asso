import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import {
  setearEquipoSeleccionadoEnCargaMasiva,
  cleanControlesDelEquipo,
  setearEquipoNoControlado,
  setNavegacionCargando,
} from "../../../../reducers/cargas-masivas-reducer";
import {
  cargaControlPorComponente,
  guardarEquipoNoControlado,
} from "../../../../lib/cargas-masivas-api";
import { NotificationManager } from "../../../../components/common/react-notifications";
import moment from "moment";

const NavegacionEquipo = ({
  direccion,
  equiposEnCargaMasiva,
  equipoSeleccionadoEnCargaMasiva,
  setearEquipoSeleccionadoEnCargaMasiva,
  controlesDelEquipo,
  cleanControlesDelEquipo,
  equipoNoControlado,
  setearEquipoNoControlado,
  navegacionCargando,
  setNavegacionCargando,
}) => {
  const [disableNext, setdisableNext] = useState(false);
  const [disablePrev, setdisablePrev] = useState(false);

  useEffect(() => {
    setdisablePrev(
      equiposEnCargaMasiva[0].id === equipoSeleccionadoEnCargaMasiva
    );
    setdisableNext(
      equiposEnCargaMasiva[equiposEnCargaMasiva.length - 1].id ===
        equipoSeleccionadoEnCargaMasiva
    );
  }, [equiposEnCargaMasiva, equipoSeleccionadoEnCargaMasiva]);

  const recorridoYDireccion = (sig) => {
    equiposEnCargaMasiva.forEach((equipo, index) => {
      if (equipo.id.toString() === equipoSeleccionadoEnCargaMasiva) {
        const nextStep = sig === "+" ? index + 1 : index - 1;
        if (nextStep >= 0 && nextStep < equiposEnCargaMasiva.length) {
          setearEquipoSeleccionadoEnCargaMasiva(
            equiposEnCargaMasiva[nextStep].id
          );
        }
      }
    });
  };

  const tareasDespuesDeLlamarAlServer = () => {
    recorridoYDireccion("+");
    cleanControlesDelEquipo();
    scrollTop();
  };

  const enviar = async (data) => {
    console.log("🚀 ~ enviar ~ data:", data);
    try {
      setNavegacionCargando(true);
      const resp = await cargaControlPorComponente(
        data.idCargaMasiva,
        data.fecha,
        data.estadoId,
        data.componente,
        data.fallasValues,
        data.observacion,
        data.recomendacion,
        data.file
      );

      if (resp && !resp.error) {
        if (data.direccion !== "soloGuardar") {
          tareasDespuesDeLlamarAlServer();
        }
        if (data.direccion === "soloGuardar" && data.index === 0) {
          NotificationManager.success(
            "El equipo se ha guardado correctamente",
            "Hecho",
            3000
          );
        }
        return;
      }
      NotificationManager.error("Error al enviar el control", "Error", 3000);
    } catch (error) {
      console.error("Error al enviar:", error);
      NotificationManager.error("Error al enviar el control", "Error", 3000);
    } finally {
      setNavegacionCargando(false);
    }
  };

  const siguienteEquipoYGuardar = async () => {
    /*try {*/
    //setNavegacionCargando(true);
    //console.log("🚀 ~ abrirModal ~ equipoNoControlado:", equipoNoControlado);
    console.log(
      "🚀 ~ abrirModal ~ controlesDelEquipo:",
      controlesDelEquipo.some((item) => item.file)
    );

    if (equipoNoControlado) {
      await guardarEquipoNoControlado(
        equipoNoControlado.idCargaMasiva,
        equipoNoControlado.equipoSeleccionadoEnCargaMasiva,
        equipoNoControlado.motivoNoControlado,
        equipoNoControlado.observacionesMotivosNoControlados,
        equipoNoControlado.fechaEquipoNoControlado
      );

      if (direccion !== "soloGuardar") {
        setearEquipoNoControlado(null);
        tareasDespuesDeLlamarAlServer();
      }
      if (direccion === "soloGuardar") {
        NotificationManager.success(
          "El equipo se ha guardado correctamente",
          "Hecho",
          3000
        );
      }
      //return;
    }

    if (controlesDelEquipo.some((item) => item.file)) {
      for (let index = 0; index < controlesDelEquipo.length; index++) {
        const {
          fallasSeleccionada,
          estado,
          componente,
          observacion,
          recomendacion,
          file,
          idCargaMasiva,
          fecha,
        } = controlesDelEquipo[index];

        if (!file || file.length < 0) continue;
        
        let fallasValues = fallasSeleccionada
          ? fallasSeleccionada.map((falla) => String(falla.value))
          : [];

        const data = {
          idCargaMasiva,
          fecha: moment(fecha).format("YYYY-MM-DD"),
          estadoId: estado.id,
          componente,
          fallasValues: JSON.stringify(fallasValues),
          observacion,
          recomendacion,
          file,
          direccion,
          index,
        };
        await enviar(data);
      }
    }
    if (direccion === "soloGuardar" && controlesDelEquipo.length === 0) {
      NotificationManager.success(
        "El equipo se ha guardado correctamente",
        "Hecho",
        3000
      );
      return;
    }
    // if (controlesDelEquipo.length === 0) {
    recorridoYDireccion("+");
    scrollTop();
    // return;
    //}

    /*} finally {
      setNavegacionCargando(false);
    }*/
  };

  const anteriorEquipo = () => {
    recorridoYDireccion("-");
    scrollTop();
  };

  const siguienteEquipo = () => {
    tareasDespuesDeLlamarAlServer();
  };

  const scrollTop = () => {
    setTimeout(() => {
      document
        .querySelector("#carga-masiva")
        .scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  return (
    <>
      {direccion === "nextYGuardar" && (
        <Button
          color="info"
          className="ml-2"
          onClick={siguienteEquipoYGuardar}
          disabled={disableNext || navegacionCargando}
        >
          {navegacionCargando ? (
            "CARGANDO"
          ) : (
            <>
              GUARDAR Y SIGUIENTE <span className="ml-2">&gt;</span>
            </>
          )}
        </Button>
      )}
      {direccion === "next" && (
        <Button
          color="info"
          className="ml-2"
          onClick={siguienteEquipo}
          disabled={disableNext || navegacionCargando}
        >
          {navegacionCargando ? (
            "CARGANDO"
          ) : (
            <>
              GUARDAR Y SIGUIENTE <span className="ml-2">&gt;</span>
            </>
          )}
        </Button>
      )}
      {direccion === "soloGuardar" && (
        <Button
          color="success"
          className="ml-2"
          onClick={siguienteEquipoYGuardar}
          disabled={navegacionCargando}
        >
          {navegacionCargando ? "CARGANDO" : "GUARDAR"}
        </Button>
      )}
      {direccion === "prev" && (
        <Button
          color="success"
          onClick={anteriorEquipo}
          disabled={disablePrev || navegacionCargando}
        >
          <span className="mr-2">&lt;</span> EQUIPO ANTERIOR
        </Button>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  equiposEnCargaMasiva: state.cargasMasivasReducer.equiposEnCargaMasiva,
  equipoSeleccionadoEnCargaMasiva:
    state.cargasMasivasReducer.equipoSeleccionadoEnCargaMasiva,
  controlesDelEquipo: state.cargasMasivasReducer.controlesDelEquipo,
  equipoNoControlado: state.cargasMasivasReducer.equipoNoControlado,
  navegacionCargando: state.cargasMasivasReducer.navegacionCargando,
});

export default connect(mapStateToProps, {
  setearEquipoSeleccionadoEnCargaMasiva,
  cleanControlesDelEquipo,
  setearEquipoNoControlado,
  setNavegacionCargando,
})(NavegacionEquipo);
