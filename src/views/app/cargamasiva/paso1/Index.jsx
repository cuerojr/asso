import React, { Fragment, useState, useEffect } from "react";
import {
  InputGroup,
  InputGroupAddon,
  Input,
  Row,
  Col,
  Button,
} from "reactstrap";
import SelectMultiple from "../../../../componentes/selectMultiple";
import DatePicker from "react-datepicker";
import { WithWizard } from "react-albus";
import { connect } from "react-redux";
import {
  setearFechaGlobal,
  setearCargaMasiva,
  fetchListarTipoTesteos,
  setearEquipoSeleccionadoEnCargaMasiva,
  resetdetalleDeComponentesYControles,
} from "../../../../reducers/cargas-masivas-reducer";
import { fetchListarClientes } from "../../../../reducers/clientes-reducer";
import {
  fetchlistarSecciones,
  resetSecciones,
} from "../../../../reducers/secciones-reducer";
import {
  fetchlistarRutas,
  resetRutas,
} from "../../../../reducers/rutas-reducer";
import moment from "moment";
import {
  modificacionCargaMasiva,
  altaCargaMasiva,
} from "../../../../lib/cargas-masivas-api";

const DatosGlobales = (props) => {
  const {
    cargaMasiva,
    setearCargaMasiva,
    fetchListarClientes,
    fetchlistarSecciones,
    fetchlistarRutas,
    tipoTesteos,
    fetchListarTipoTesteos,
    disabledInput,
    rutas,
    secciones,
    resetSecciones,
    resetRutas,
    setearEquipoSeleccionadoEnCargaMasiva,
    resetdetalleDeComponentesYControles,
  } = props;

  const savingData = (key, value) => {
    cargaMasiva[key] = value;
    setearCargaMasiva({ ...cargaMasiva });
  };

  useEffect(() => {
    // lista los clientes
    fetchListarClientes();
    fetchListarTipoTesteos();
  }, [fetchListarClientes, fetchListarTipoTesteos]);

  useEffect(() => {
    // lista las secciones cada vez que se haga un cambio en el cliente seleccionado

    if (cargaMasiva && cargaMasiva.clienteSeleccionado) {
      fetchlistarSecciones(cargaMasiva.clienteSeleccionado.value);
      fetchlistarRutas(cargaMasiva.clienteSeleccionado.value);
    }
  }, [fetchlistarSecciones, fetchlistarRutas, cargaMasiva]);

  const limpiarRutasYSecciones = () => {
    savingData("seccionSeleccionada", undefined);
    savingData("rutasSeleccionadas", undefined);
  };

  const guardar = (next, steps, step) => {
    let rutasIds = cargaMasiva.rutasSeleccionadas.map((ruta) => ruta.value);
    let seccionesIds = cargaMasiva.seccionSeleccionada.map(
      (seccion) => seccion.value
    );

    if (props.cargaMasiva.id) {
      props.setearFechaGlobal(moment(cargaMasiva.fecha));
      modificacionCargaMasiva(
        cargaMasiva.id,
        cargaMasiva.tituloDeReferencia,
        cargaMasiva.clienteSeleccionado.value,
        JSON.stringify(rutasIds),
        cargaMasiva.tipoTesteo.value,
        JSON.stringify(seccionesIds)
      ).then((res) => {
        if (res.stat === 1) {
          props.onClickNext(next, steps, step);
        }
      });
    } else {
      if (rutasIds[0] === 999999999999) {
        rutasIds = rutas.map((ruta) => ruta.id);
      }

      if (seccionesIds[0] === 999999999999) {
        seccionesIds = secciones.map((secc) => secc.id);
      }

      altaCargaMasiva(
        cargaMasiva.tituloDeReferencia,
        cargaMasiva.clienteSeleccionado.value,
        JSON.stringify(rutasIds),
        cargaMasiva.tipoTesteo.value,
        JSON.stringify(seccionesIds),
        moment(cargaMasiva.fecha).format("YYYY-MM-DD")
      ).then((res) => {
        if (res.err) {
          alert(res.err);
        } else {
          props.setearFechaGlobal(
            moment(cargaMasiva.fecha).format("YYYY-MM-DD")
          );
          //props.setIdCargaMasiva(res.id);
          cargaMasiva.id = res.id;
          setearCargaMasiva({ ...cargaMasiva });
          props.onClickNext(next, steps, step);
        }
      });
    }
  };

  useEffect(() => {
    if (
      cargaMasiva &&
      Object.keys(cargaMasiva).length === 1 &&
      cargaMasiva.tituloDeReferencia === ""
    ) {
      resetSecciones();
      resetRutas();
      setearEquipoSeleccionadoEnCargaMasiva(null);
      resetdetalleDeComponentesYControles();
    }
  }, [cargaMasiva]);

  return (
    <Fragment>
      <div className="paso-uno">
        <Row className="mt-4 titulo-referencia">
          <Col>
            <InputGroup className="mb-3">
              <InputGroupAddon addonType="prepend">
                TÍTULO DE REFERENCIA
              </InputGroupAddon>
              <Input
                value={cargaMasiva.tituloDeReferencia}
                onChange={(e) =>
                  savingData("tituloDeReferencia", e.target.value)
                }
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroupAddon addonType="prepend">CLIENTE</InputGroupAddon>
              <Input
                type="select"
                name="cliente"
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  savingData("clienteSeleccionado", {
                    label: selectedOption.text,
                    value: selectedOption.value,
                  });
                  limpiarRutasYSecciones();
                }}
                value={cargaMasiva.clienteSeleccionado?.value || ""}
                disabled={disabledInput}
              >
                <option>Seleccione un cliente</option>
                {props.clientes.map((cliente) => {
                  return (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.empresa}
                    </option>
                  );
                })}
              </Input>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroupAddon addonType="prepend">SECCIONES</InputGroupAddon>
              {props.secciones && (
                <SelectMultiple
                  items={props.secciones}
                  handleChangeMulti={(e) => {
                    savingData("seccionSeleccionada", e);
                  }}
                  itemsSeleccionados={cargaMasiva.seccionSeleccionada || ""}
                  placeholderSingular="seccion"
                  placeholderPlural="secciones"
                  isDisabled={disabledInput}
                />
              )}
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroupAddon addonType="prepend">RUTAS</InputGroupAddon>
              {props.rutas && (
                <SelectMultiple
                  items={props.rutas}
                  handleChangeMulti={(e) => {
                    savingData("rutasSeleccionadas", e);
                  }}
                  itemsSeleccionados={cargaMasiva.rutasSeleccionadas || ""}
                  placeholderSingular="ruta"
                  placeholderPlural="rutas"
                  isDisabled={disabledInput}
                />
              )}
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3 d-flex flex-row align-items-start justify-content-start">
              <InputGroupAddon addonType="prepend">
                FECHA DE CONTROL
              </InputGroupAddon>
              <div className="flex-fill">
                <DatePicker
                  locale={"es"}
                  selected={cargaMasiva.fecha}
                  onChange={(date) => {
                    savingData("fecha", date);
                  }}
                />
              </div>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroupAddon addonType="prepend">
                TIPO DE CONTROL
              </InputGroupAddon>
              <Input
                type="select"
                name="select"
                id="exampleSelect"
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  savingData("tipoTesteo", {
                    label: selectedOption.text,
                    value: selectedOption.value,
                  });
                }}
                value={cargaMasiva.tipoTesteo?.value || ""}
                disabled={disabledInput}
              >
                <option value="">Seleccione un control</option>
                {tipoTesteos &&
                  tipoTesteos.map((tipo) => {
                    return (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.control}
                      </option>
                    );
                  })}
              </Input>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col className="">
            <WithWizard
              render={({ next, previous, step, steps }) => (
                <div className="wizard-buttons d-flex justify-content-center">
                  <Button
                    color="success"
                    disabled={
                      cargaMasiva.tituloDeReferencia === "" ||
                      !cargaMasiva.clienteSeleccionado ||
                      !cargaMasiva.rutasSeleccionadas ||
                      !cargaMasiva.seccionSeleccionada ||
                      !cargaMasiva.tipoTesteo ||
                      !cargaMasiva.fecha
                    }
                    onClick={() => {
                      guardar(next, steps, step);
                    }}
                  >
                    SIGUIENTE | CARGA DE CONTROLES{" "}
                    <span className="ml-2">&gt;</span>
                  </Button>
                </div>
              )}
            />
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};
const mapStateToProps = (state) => {
  return {
    secciones: state.seccionesReducer.secciones,
    rutas: state.rutasReducer.rutas,
    clientes: state.clientesReducer.clientes,
    fechaGlobal: state.cargasMasivasReducer.fechaGlobal,
    cargaMasiva: state.cargasMasivasReducer.cargaMasiva,
    tipoTesteos: state.cargasMasivasReducer.tipoTesteos,
    disabledInput: state.cargasMasivasReducer.disabledInput,
  };
};

export default connect(
  //función que mapea propiedades del state con propiedades del componente
  mapStateToProps,
  //mapeo de funciones
  {
    fetchListarClientes,
    fetchlistarSecciones,
    setearFechaGlobal,
    setearCargaMasiva,
    fetchlistarRutas,
    fetchListarTipoTesteos,
    resetSecciones,
    resetRutas,
    setearEquipoSeleccionadoEnCargaMasiva,
    resetdetalleDeComponentesYControles,
  }
)(DatosGlobales);
