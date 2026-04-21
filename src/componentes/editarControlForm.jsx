import { useState, useEffect } from "react";
import {
  InputGroup,
  InputGroupAddon,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Row,
  Col,
} from "reactstrap";
import DatePicker from "react-datepicker";
import { Tarjeta } from "./tarjeta";
import { connect } from "react-redux";
import TextInput from "../views/app/cargamasiva/paso2/cargaControlItem/TextInput";
import CustomSelect from "../views/app/cargamasiva/paso2/cargaControlItem/CustomSelect";
import Fila from "../views/app/cargamasiva/paso2/cargaControlItem/Fila";
import Archivo from "../views/app/cargamasiva/paso2/cargaControlItem/Archivo";
import { setearControlesDeEquipo } from "../reducers/cargas-masivas-reducer";
import moment from "moment";
import ListadoDeImagenes from "../views/app/cargamasiva/paso2/cargaControlItem/ListadoDeImagenes";

import { fetchlistarFallas } from "../reducers/fallas-reducer";
import { fetchlistarEstados } from "../reducers/estados-reducer";
import {
  fetchListarObservaciones,
  fetchListarRecomendaciones,
} from "../reducers/autocompletar-reducer";

const EditarControlForm = ({
  componente,
  fechaGlobal,
  estados,
  fallas,
  observaciones,
  recomendaciones,
  equipoNoControlado,
  cargaMasiva,
  setearControlesDeEquipo,
  detalleCliente,
  componenteIndividualSeleccionado,
  controlIndividualSeleccionado,
  fetchListarRecomendaciones,
  fetchListarObservaciones,
}) => {
  // Estado inicial con fecha como moment o null
  const estadoInicialControl = {
    fecha: null,
    estado: "",
    fallasSeleccionada: [],
    observacion: "",
    recomendacion: "",
    componente: componente?.id,
    idCargaMasiva: cargaMasiva?.id,
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
    fetchListarObservaciones();
    fetchListarRecomendaciones();
    //console.log("controlIndividualSeleccionado", controlIndividualSeleccionado);
  }, []);

  // Cargar datos del control individual seleccionado
  useEffect(() => {
    if (
      controlIndividualSeleccionado &&
      Object.keys(controlIndividualSeleccionado).length > 0
    ) {
      // Procesar la fecha - ASEGURARSE de convertir a moment
      let fechaControl = null;

      if (controlIndividualSeleccionado.fecha) {
        const fechaOriginal = controlIndividualSeleccionado.fecha;

        // Si es string, extraer solo la fecha y convertir a moment
        if (typeof fechaOriginal === "string") {
          const soloFecha = fechaOriginal.split(" ")[0];
          fechaControl = moment(soloFecha);
        }
        // Si es un objeto Date nativo, convertir a moment
        else if (fechaOriginal instanceof Date) {
          fechaControl = moment(fechaOriginal);
        }
        // Si ya es moment, clonarlo
        else if (moment.isMoment(fechaOriginal)) {
          fechaControl = fechaOriginal.clone();
        }

        // Validar que sea un moment válido, sino usar null
        if (!moment.isMoment(fechaControl) || !fechaControl.isValid()) {
          fechaControl = null;
        }
      }

      // Encontrar el estado seleccionado
      const estadoSeleccionado =
        estados.find(
          (estado) =>
            estado.id === controlIndividualSeleccionado.estado_id ||
            estado.nombre === controlIndividualSeleccionado.estado
        ) || "";

      // Procesar las fallas seleccionadas
      const fallasSeleccionadas =
        controlIndividualSeleccionado.fallas
          ?.map((falla, i) => {
            const opcionFalla = fallas.find(
              (opcion) =>
                opcion.id === (falla.falla_id || falla.id || falla.falla)
            );
            if (opcionFalla) {
              return {
                ...opcionFalla,
                key: i,
                label: (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: `<div class="falla-color-wrapper"><div class="dot" style="background-color: ${opcionFalla.color}"></div>${opcionFalla.nombre}</div>`,
                    }}
                  />
                ),
                value: opcionFalla.id,
              };
            }
            return null;
          })
          .filter(Boolean) || [];

      // Setear el control con los datos cargados
      setControl({
        componente: componente?.id,
        idCargaMasiva: cargaMasiva?.id,
        fecha: fechaControl, // Ahora es moment o null
        estado: estadoSeleccionado,
        fallasSeleccionada: fallasSeleccionadas,
        observacion: controlIndividualSeleccionado.observaciones || "",
        recomendacion: controlIndividualSeleccionado.recomendaciones || "",
        imagenes: controlIndividualSeleccionado.imagenes || [],
      });

      setformularioCargado(true);
    }
  }, [
    controlIndividualSeleccionado,
    estados,
    fallas,
    componente,
    cargaMasiva,
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
    setControl((prevState) => ({
      ...prevState,
      estado: "",
      fallasSeleccionada: [],
      observacion: "",
      recomendacion: "",
      fecha: null,
    }));
    setRecomendacion("");
    setFilesEditando([]);
  };

  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta);
  };

  return (
    <Tarjeta titulo="">
      <div className={equipoNoControlado ? "tarjeta-disabled" : ""}>
        <Row clases="mt-2">
          <Col xs="12">
            <h5 className="border p-2 bg-black borde-gris mb-4">
              COMPONENTE <strong>{componente.nombre}</strong>
            </h5>
          </Col>
        </Row>
        <div className="mb-2 d-flex justify-content-between">
          <h6 className="mt-3">CONTROL</h6>
          <Button color="link" className="pr-1" onClick={limpiarFormulario}>
            Limpiar Formulario
          </Button>
        </div>
        <Row>
          <Col xs="12" md="4" className="mb-3">
            <div className="d-flex">
              <div
                style={{
                  background: "#171717",
                  padding: "12px",
                  border: "1px solid #7e7e7e",
                }}
              >
                FECHA
              </div>
              <DatePicker
                selected={control.fecha}
                locale={"es"}
                onChange={(date) => savingData("fecha", date)}
                disabled={equipoNoControlado || false}
                popperPlacement="bottom-end"
              />
            </div>
          </Col>
          <Col xs="12" md="4" className="mb-3">
            <InputGroup className="estados-wrapper" id={"estados-wrap-"}>
              <InputGroupAddon addonType="prepend" className="x-trapad">
                ESTADO
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
          </Col>
          <Col xs="12" md="4" className="mb-3">
            <CustomSelect
              label="TIPO DE FALLA"
              options={opcionesFallas}
              value={control.fallasSeleccionada}
              onChange={(el) => savingData("fallasSeleccionada", el)}
              isDisabled={equipoNoControlado || false}
              placeholder="Seleccione una o varias fallas"
            />
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            {observaciones && (
              <TextInput
                label="OBSERVACIONES"
                value={control.observacion}
                onChange={(e) => savingData("observacion", e.target.value)}
                type="select"
                options={observaciones}
                disabled={equipoNoControlado || false}
              />
            )}
          </Col>
          <Col xs="12">
            <TextInput
              label="OBSERVACIONES"
              value={control.observacion}
              onChange={(e) => savingData("observacion", e.target.value)}
              disabled={equipoNoControlado || false}
            />
          </Col>
          <Col xs="12">
            {recomendaciones && (
              <TextInput
                label="RECOMENDACIONES"
                value={control.recomendacion}
                onChange={(e) => savingData("recomendacion", e.target.value)}
                type="select"
                options={recomendaciones}
                disabled={equipoNoControlado || false}
              />
            )}
          </Col>
          <Col xs="12">
            <TextInput
              label="RECOMENDACIONES"
              value={control.recomendacion}
              onChange={(e) => savingData("recomendacion", e.target.value)}
              disabled={equipoNoControlado || false}
            />
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            {control.imagenes &&
              control.imagenes.length > 0 &&
              console.log(control.imagenes.length)}
            {control && control.imagenes && control.imagenes.length > 0 && (
              <ListadoDeImagenes
                imagenes={control.imagenes}
                setControl={setControl}
                control={control}
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Archivo
              handleChangeStatus={handleChangeStatus}
              disabled={equipoNoControlado || false}
              idComponente={componente.id}
            />
          </Col>
        </Row>
        <Row>
          <hr />
        </Row>
      </div>
    </Tarjeta>
  );
};

const mapStateToProps = (state) => ({
  detalleDeComponentesYControles:
    state.cargasMasivasReducer.detalleDeComponentesYControles,
  estados: state.estadosReducer.estados,
  fallas: state.fallasReducer.fallas,
  observaciones: state.autocompletarReducer.observaciones,
  recomendaciones: state.autocompletarReducer.recomendaciones,
  equipoNoControlado: state.cargasMasivasReducer.equipoNoControlado,
  fechaGlobal: state.cargasMasivasReducer.fechaGlobal,
  cargaMasiva: state.cargasMasivasReducer.cargaMasiva,
  detalleCliente: state.clientesReducer.detalleClienteState,
  componenteIndividualSeleccionado:
    state.componentesReducer.componenteIndividualSeleccionado,
  controlIndividualSeleccionado:
    state.controlesReducer.controlIndividualSeleccionado,
});

export default connect(mapStateToProps, {
  setearControlesDeEquipo,
  fetchListarObservaciones,
  fetchListarRecomendaciones,
})(EditarControlForm);