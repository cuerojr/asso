import React from "react";
import { Card, CardBody, Button, CardTitle, Row, Col } from "reactstrap";
import moment from "moment";
import { WithWizard } from "react-albus";
import {
  setearCargaMasiva,
  setearCargaMasivaABorrar,
  setearDisabledInputs,
  setearEquipoSeleccionadoEnCargaMasiva,
  resetdetalleDeComponentesYControles,
} from "../../../../reducers/cargas-masivas-reducer";
import { resetSecciones } from "../../../../reducers/secciones-reducer";
import { resetRutas } from "../../../../reducers/rutas-reducer";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faClone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const ItemListaCargaMasivaNoFinalizada = ({
  item,
  setearCargaMasivaABorrar,
  setearCargaMasiva,
  tipoTesteos,
  setearDisabledInputs,
  resetSecciones,
  resetRutas,
  setearEquipoSeleccionadoEnCargaMasiva,
  resetdetalleDeComponentesYControles,
}) => {
  //console.log("🚀 ~ ItemListaCargaMasivaNoFinalizada2 ~ item:", item)

  const seleccionarCargaMasivaSeleccionada = (item) => {
    const idRutasArray = JSON.parse(item.id_rutas);
    const rutasLabelArray = JSON.parse(
      item.rutas.replace(/\[(.*?)\]/g, (match) => {
        return `[${match
          .slice(1, -1)
          .split(",")
          .map((word) => `"${word.trim()}"`)
          .join(",")}]`;
      })
    );
    const idSeccionesArray = JSON.parse(item.id_secciones);
    const seccionesStr = item.secciones.slice(1, -1);
    const seccionesArray = seccionesStr.split(",").map((s) => s.trim());
    const seccionesLabelArray = seccionesArray.map((s) =>
      s.startsWith('"') && s.endsWith('"') ? s : `"${s}"`
    );
    const seccionesLabelJson = `[${seccionesLabelArray.join(",")}]`;

    const seccionesParsedArray = JSON.parse(seccionesLabelJson);

    const rutas = idRutasArray.map((id, index) => ({
      label: rutasLabelArray[index],
      value: id,
    }));

    const secciones = idSeccionesArray.map((id, index) => ({
      label: seccionesParsedArray[index],
      value: id,
    }));
    const TipoTesteoEncontrado = tipoTesteos.find(
      (testeo) => testeo.id === item.tipo_control
    );
    const nuevoItem = {
      tituloDeReferencia: item.titulo,
      clienteSeleccionado: {
        value: item.id_cliente,
        label: item.nombre_cliente,
      },
      fecha: moment(item.fecha_global_controles),
      rutasSeleccionadas: rutas,
      seccionSeleccionada: secciones,
      tipoTesteo: {
        value: TipoTesteoEncontrado.id,
        label: TipoTesteoEncontrado.control,
      },
      id: item.id,
    };

    setearCargaMasiva(nuevoItem);
    setearDisabledInputs(true);
  };

  return (
    <Col sx="12" className="mb-3">
      <Card>
        <CardBody>
          <CardTitle className="d-flex justify-content-between mb-0">
            <Col sx="9" className="pl-0">
              <WithWizard
                render={({ push }) => (
                  <Button
                    className="p-0"
                    color="link"
                    onClick={() => {
                      seleccionarCargaMasivaSeleccionada(item);
                      push("step1");
                    }}
                  >
                    <h3 className="h2">{item.titulo}</h3>
                  </Button>
                )}
              />
            </Col>
            <Col sx="3" className="text-right p-0">
              <Button
                color="danger"
                className="py-1 px-3"
                onClick={() => {
                  setearCargaMasivaABorrar(item.id);
                  setearDisabledInputs(false);
                }}
              >
                <FontAwesomeIcon icon={faTrash} className="h-2 w-2" />
              </Button>
            </Col>
          </CardTitle>
          <Row>
            <Col sx="9">
              <span className="opacity-50">Cliente:</span> {item.nombre_cliente}
            </Col>
          </Row>
          <Row>
            <Col sx="9">
              <span className="opacity-50">Tipo:</span>{" "}
              {item.tipo_control == 1 ? "Vibración" : "Termografía"}
            </Col>
          </Row>
          <Row>
            <Col sx="9">
              <span className="opacity-50">Última actualización:</span>{" "}
              {moment(item.ultima_actualizacion).format("DD/MM/YYYY")}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

const mapStateToProps = (state) => {
  return {
    cargasMasivas: state.cargasMasivasReducer.cargasMasivas,
    tipoTesteos: state.cargasMasivasReducer.tipoTesteos,
  };
};

export default connect(mapStateToProps, {
  setearCargaMasiva,
  setearCargaMasivaABorrar,
  setearDisabledInputs,
  resetSecciones,
  resetRutas,
  setearEquipoSeleccionadoEnCargaMasiva,
  resetdetalleDeComponentesYControles,
})(ItemListaCargaMasivaNoFinalizada);
