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

  const siguienteEquipoYGuardar = async () => {
    if (equipoNoControlado) {
      const res = await guardarEquipoNoControlado(
        equipoNoControlado.idCargaMasiva,
        equipoNoControlado.equipoSeleccionadoEnCargaMasiva,
        equipoNoControlado.motivoNoControlado,
        equipoNoControlado.observacionesMotivosNoControlados,
        equipoNoControlado.fechaEquipoNoControlado
      );

      if (res) {
        console.log("🚀 ~ siguienteEquipoYGuardar ~ res:", res);
      }

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
      
    } else {
      
        const promisesControledEquipment = controlesDelEquipo.map((control) => {
          const {
            fallasSeleccionada,
            estado,
            componente,
            observacion,
            recomendacion,
            imagenes,
            file,
            fecha,
            idCargaMasiva,
          } = control;

          let fallasValues = [];
          if (fallasSeleccionada)
            fallasValues = fallasSeleccionada.map((falla) =>
              String(falla.value)
            );

          const estadoId = estado ? estado.id : null;

          return cargaControlPorComponente(
            idCargaMasiva,
            moment(fecha).format("YYYY-MM-DD"),
            estadoId,
            componente,
            JSON.stringify(fallasValues),
            observacion,
            recomendacion,
            file
          );
        });
        
        await Promise.all(promisesControledEquipment);
        cleanControlesDelEquipo();
        
    }

    recorridoYDireccion("+");
    scrollTop();

  };

  const anteriorEquipo = () => {
    recorridoYDireccion("-");
    scrollTop();
  };

  const siguienteEquipo = () => {
    console.log("siguiente equipo", controlesDelEquipo, equipoNoControlado);
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
