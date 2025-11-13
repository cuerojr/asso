import React, { useState, useEffect } from "react";
import {
  InputGroup,
  InputGroupAddon,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Row,
  Col
} from "reactstrap";
import DatePicker from "react-datepicker";
import { Tarjeta } from "../../../../../componentes/tarjeta";
import { connect } from "react-redux";
import TextInput from "./TextInput";
import CustomSelect from "./CustomSelect";
import Fila from "./Fila";
import Archivo from "./Archivo";
import { setearControlesDeEquipo } from "../../../../../reducers/cargas-masivas-reducer";
import moment from "moment";
import ListadoDeImagenes from "./ListadoDeImagenes";

const obtenerDatosTest = (test, fechaGlobal, estados, opcionesFallas, ) => {
  let fecha = fechaGlobal || test.fecha;
  let estadoSeleccionado = estados.find(
    (estado) => estado.nombre === test.estado
  );

  let fallasSeleccionadas = test.fallas
    .map((falla, i) => {
      let opcionFalla = opcionesFallas.find(
        (opcion) => opcion.id === falla.falla
      );
      opcionFalla.key = i;
      opcionFalla.label = (
        <span
          dangerouslySetInnerHTML={{
            __html: `<div class="falla-color-wrapper"><div class="dot" style="background-color: ${opcionFalla.color}"></div>${opcionFalla.nombre}</div>`,
          }}
        />
      );
      opcionFalla.value = opcionFalla.id;
      return opcionFalla;
    })
    .filter((falla) => falla !== undefined);
  return { fecha, estadoSeleccionado, fallasSeleccionadas };
};

const CargaControlItem = ({
  componente,
  fechaGlobal,
  estados,
  fallas,
  observaciones,
  recomendaciones,
  equipoNoControlado,
  cargaMasiva,
  setearControlesDeEquipo,
  detalleCliente
}) => {
  const estadoInicialControl = {
    fecha: "",
    estado: "",
    fallasSeleccionada: [],
    observacion: "",
    recomendacion: "",
    componente: componente.id,
    idCargaMasiva: cargaMasiva.id,
  };

  const [control, setControl] = useState(estadoInicialControl);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [opcionesFallas, setOpcionesFallas] = useState([]);
  const [recomendacion, setRecomendacion] = useState("");
  const [filesEditando, setFilesEditando] = useState([]);
  const [guardandoDatos, setGuardandoDatos] = useState(false);
  const [formularioCargado, setformularioCargado] = useState(false);

  const toggle = () => setDropDownOpen(!dropDownOpen);

  const savingData = (key, value) => {
    setGuardandoDatos(true);
    setControl((prevState) => ({ ...prevState, [key]: value }));
    setformularioCargado(true);
  };

  useEffect(() => {
    const procesarTest = (test) => {
      const { fecha, estadoSeleccionado, fallasSeleccionadas } =
        obtenerDatosTest(test, fechaGlobal, estados, fallas);
      let fechatrans = fecha;
      if (typeof fechatrans === "string") {
        fechatrans = moment(fecha);
      }
      setControl({
        componente: componente.id,
        idCargaMasiva: cargaMasiva.id,
        fecha: fechatrans,
        estado: estadoSeleccionado,
        fallasSeleccionada: fallasSeleccionadas,
        observacion: test.observaciones,
        recomendacion: test.recomendaciones,
        imagenes: test.imagenes,
      });
      setearControlesDeEquipo({
        componente: componente.id,
        idCargaMasiva: cargaMasiva.id,
        fecha: fechatrans,
        estado: estadoSeleccionado,
        fallasSeleccionada: fallasSeleccionadas,
        observacion: test.observaciones,
        recomendacion: test.recomendaciones,
        imagenes: test.imagenes,
      });
    };

    if (componente.test_anterior && componente.test_anterior.length > 0) {
      procesarTest(componente.test_anterior[0]);
    }
    if (componente.test_anterior && componente.tests.length > 0) {
      procesarTest(componente.tests[0]);
    }
  }, [
    componente,
    fechaGlobal,
    cargaMasiva,
    estados,
    fallas,
    setearControlesDeEquipo,
  ]);

  useEffect(() => {
    if (fallas.length) {
      const fallasArray = fallas.map((falla) => ({
        label: (
          <span
            dangerouslySetInnerHTML={{
              __html: `<div class="falla-color-wrapper"><div class="dot" style="background-color: ${falla.color}"></div>${falla.nombre}</div>`,
            }}
          />
        ),
        value: falla.id,
        color: falla.color,
      }));
      setOpcionesFallas(fallasArray);
    }
  }, [fallas]);

  useEffect(() => {
    if (guardandoDatos) {
      setearControlesDeEquipo(control);
    }
  }, [guardandoDatos, control, setearControlesDeEquipo]);

  const limpiarFormulario = () => {
    setControl((prevState) => ({ ...prevState, estado: "", fallasSeleccionada: [], observacion: "", recomendacion: "" }));
    setRecomendacion("");
    setFilesEditando([]);
  };


  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta);
  };

  return (
    <Tarjeta titulo="">
      <div className={equipoNoControlado ? "tarjeta-disabled" : ""}>
        <Fila clases="mt-2">
          <h5 className="border p-2 bg-black borde-gris mb-4">
            COMPONENTE: <strong>{componente.nombre}</strong>
          </h5>
        </Fila>
        <div className="mb-2 d-flex justify-content-between">
          <h6 className="mt-3">CONTROL: </h6>
            <Button color="link" className="pr-1" onClick={limpiarFormulario}>
              {" "}
              Limpiar Formulario
            </Button>
        </div>
        <Fila clases="formulario-carga-controles">
          <div className="form-inline fecha-estado-falla">
            <InputGroup style={{ flex: "0 0 auto" }}>
              <InputGroupAddon addonType="prepend">FECHA:</InputGroupAddon>
              {control.fecha && (
                <DatePicker
                  selected={control.fecha || null}
                  onChange={(date) => savingData("fecha", date)}
                  //disabled={equipoNoControlado || false}
                  popperPlacement="bottom-end"
                />
              )}
              {detalleCliente && !control.fecha && (
                <DatePicker
                onChange={(date) => savingData("fecha", date)}
                disabled={equipoNoControlado ? true : false}
                popperPlacement="bottom-end"
              />
            )
              }
            </InputGroup>
            <InputGroup className="estados-wrapper" id={"estados-wrap-"}>
              <InputGroupAddon addonType="prepend" className="x-trapad">
                ESTADO:
              </InputGroupAddon>
              <Dropdown
                isOpen={dropDownOpen}
                toggle={toggle}
                className="rich-dropdown borde-gris"
                disabled={equipoNoControlado ? true : false}
              >
                <DropdownToggle
                  tag="div"
                  onClick={toggle}
                  data-toggle="dropdown"
                  className="pl-2"
                >
                  {control.estado ? (
                    <div
                      className="d-flex"
                      dangerouslySetInnerHTML={{
                        __html: `<span class="estado-seleccionado-color" style="background:${control.estado?.color}"></span>${control.estado?.nombre}`,
                      }}
                    />
                  ) : (
                    "Seleccione un Estado"
                  )}
                </DropdownToggle>
                <DropdownMenu disabled={equipoNoControlado || false}>
                  {estados &&
                    estados.map((estado) => (
                      <div
                        className="color-wrapper"
                        onClick={() => {
                          savingData("estado", estado);
                          toggle();
                        }}
                        key={estado.id}
                      >
                        <span style={{ background: estado.color }}></span>
                        <div className="ml-5">{estado.nombre}</div>
                      </div>
                    ))}
                </DropdownMenu>
              </Dropdown>
            </InputGroup>
            <CustomSelect
              label="TIPO DE FALLA:"
              options={opcionesFallas}
              value={control.fallasSeleccionada}
              onChange={(el) => savingData("fallasSeleccionada", el)}
              isDisabled={equipoNoControlado || false}
              placeholder="Seleccione una o varias fallas"
            />
          </div>
        </Fila>
        <Fila>
          {observaciones && (
            <TextInput
              label="OBSERVACIONES:"
              value={control.observacion}
              onChange={(e) => savingData("observacion", e.target.value)}
              type="select"
              options={observaciones}
              disabled={equipoNoControlado || false}
            />
          )}
          <TextInput
            label="OBSERVACIONES:"
            value={control.observacion}
            onChange={(e) => savingData("observacion", e.target.value)}
            disabled={equipoNoControlado || false}
          />
          {recomendaciones && (
            <TextInput
              label="RECOMENDACIONES:"
              value={control.recomendacion}
              onChange={(e) => savingData("recomendacion", e.target.value)}
              type="select"
              options={recomendaciones}
              disabled={equipoNoControlado || false}
            />
          )}
          <TextInput
            label="RECOMENDACIONES:"
            value={control.recomendacion}
            onChange={(e) => savingData("recomendacion", e.target.value)}
            disabled={equipoNoControlado || false}
          />
        </Fila>
        <Fila>
          {control.imagenes && control.imagenes.length > 0 && console.log(control.imagenes.length)}
          {control && control.imagenes && control.imagenes.length > 0 && (
            <ListadoDeImagenes
              imagenes={control.imagenes}
              setControl={setControl}
              control={control}
            />
          )}
        </Fila>
        <Fila>
          <Archivo
            handleChangeStatus={handleChangeStatus}
            disabled={equipoNoControlado || false}
            idComponente={componente.id}
          />
        </Fila>
        <Fila>
          <hr />
        </Fila>
      </div>
    </Tarjeta>
  );
};

const mapStateToProps = (state) => ({
  detalleDeComponentesYControles:state.cargasMasivasReducer.detalleDeComponentesYControles,
  estados: state.estadosReducer.estados,
  fallas: state.fallasReducer.fallas,
  observaciones: state.autocompletarReducer.observaciones,
  recomendaciones: state.autocompletarReducer.recomendaciones,
  equipoNoControlado: state.cargasMasivasReducer.equipoNoControlado,
  fechaGlobal: state.cargasMasivasReducer.fechaGlobal,
  cargaMasiva: state.cargasMasivasReducer.cargaMasiva,
  detalleCliente: state.clientesReducer.detalleClienteState
});

export default connect(mapStateToProps, { setearControlesDeEquipo })(
  CargaControlItem
);
