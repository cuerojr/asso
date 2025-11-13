import React, { useEffect, Fragment, useState } from "react";
import { Row, Input, Button, Col } from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "../../components/common/CustomSelectInput";
import moment from "moment";
import { listarTipoTesteos } from "../../lib/controles-api";
import { fetchlistarSecciones } from "../../reducers/secciones-reducer";
import { fetchlistarRutas } from "../../reducers/rutas-reducer";
import { connect } from "react-redux";

const meses = [
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

const EdicionGenerarConsulta = (props) => {
  const anioActual = moment().year();
  const mesActual = Number(moment().format("M"));

  const [desdeAnio, setDesdeAnio] = useState(anioActual);
  const [desdeMes, setDesdeMes] = useState(mesActual);
  const [hastaAnio, setHastaAnio] = useState(anioActual);
  const [hastaMes, setHastaMes] = useState(mesActual);

  const [secciones, setSecciones] = useState([]);
  const [seccionesIds, setSeccionesIds] = useState([]);
  const [seccionesOpciones, setSeccionesOpciones] = useState([]);

  const [rutas, setRutas] = useState([]);
  const [rutasIds, setRutasIds] = useState([]);
  const [rutasOpciones, setRutasOpciones] = useState([]);

  const [tipoDeTesteos, setTipoDeTesteos] = useState([]);
  const [tipoTesteoSeleccionado, setTipoDeTesteosSeleccionado] = useState("");

  const desdeAnioOpcion = anioActual - 10;

  const range = (start, end) => {
    return Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx);
  };
  const opcionesAnio = range(desdeAnioOpcion, anioActual);

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      padding: "10px",
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
    }),
  };

  const handleChangeMulti = (el) => {
    let obj = el.find((o) => o.value == 999999999999);
    if (obj) {
      setSecciones([obj]);

      let seccionesTemp = [];
      props.secciones.forEach((seccion) => {
        seccionesTemp.push(seccion.id);
      });
      setSeccionesIds(seccionesTemp);
    } else {
      let fallasIds = [];
      el.forEach((falla) => {
        fallasIds.push(falla.value);
      });
      setSeccionesIds(fallasIds);
      setSecciones(el);
    }
  };

  const handleChangeMultiRutas = (el) => {
    let obj = el.find((o) => o.value == 999999999999);
    if (obj) {
      setRutas([obj]);

      let rutasTemp = [];
      props.rutas.forEach((seccion) => {
        rutasTemp.push(seccion.id);
      });
      setRutasIds(rutasTemp);
    } else {
      let fallasIds = [];
      el.forEach((falla) => {
        fallasIds.push(falla.value);
      });
      setRutasIds(fallasIds);
      setRutas(el);
    }
  };

  useEffect(() => {
    if (document.querySelector("#contenedor")) {
      document.querySelector("#contenedor").classList.remove("barra-derecha");
    }
    props.fetchlistarSecciones(props.idEmpresa);
    props.fetchlistarRutas(props.idEmpresa);
    listarTipoTesteos().then((res) => {
      setTipoDeTesteos(res);
    });
  }, []);

  useEffect(() => {
    const fallasSelecionadasAmostrar = [];
    fallasSelecionadasAmostrar.push({
      value: 999999999999,
      label: (
        <span
          key={`todas-las-secciones`}
          dangerouslySetInnerHTML={{
            __html:
              '<div class="falla-color-wrapper">Todas las secciones</div>',
          }}
        />
      ),
    });
    props.secciones &&
      props.secciones.forEach((seccion) => {
        let fallita = {
          value: seccion.id,
          label: (
            <span
              key={`seccion-${seccion.id}`}
              dangerouslySetInnerHTML={{
                __html:
                  '<div class="falla-color-wrapper">' +
                  seccion.nombre +
                  "</div>",
              }}
            />
          ),
        };
        fallasSelecionadasAmostrar.push(fallita);
      });
    setSeccionesOpciones(fallasSelecionadasAmostrar);

    const rutasSelecionadasAmostrar = [];
    rutasSelecionadasAmostrar.push({
      value: 999999999999,
      label: (
        <span
          key={`todas-las-rutas`}
          dangerouslySetInnerHTML={{
            __html: '<div class="falla-color-wrapper">Todas las rutas</div>',
          }}
        />
      ),
    });
    props.rutas &&
      props.rutas.forEach((seccion) => {
        let fallita = {
          value: seccion.id,
          label: (
            <span
              key={`seccion-${seccion.id}`}
              dangerouslySetInnerHTML={{
                __html:
                  '<div class="falla-color-wrapper">' +
                  seccion.nombre +
                  "</div>",
              }}
            />
          ),
        };
        rutasSelecionadasAmostrar.push(fallita);
      });
    setRutasOpciones(rutasSelecionadasAmostrar);
  }, [props.secciones, props.rutas]);

  const aplicarConsulta = () => {
    props.aplicarConsulta(
      props.idEmpresa,
      seccionesIds,
      rutasIds,
      desdeMes,
      desdeAnio,
      hastaMes,
      hastaAnio,
      tipoTesteoSeleccionado
    );
  };

  useEffect(() => {
    if (props.resultadoConsulta) {
      setDesdeAnio(props.resultadoConsulta.desde.split("-")[1]);
      setDesdeMes(Number(props.resultadoConsulta.desde.split("-")[0]));
      setHastaAnio(props.resultadoConsulta.hasta.split("-")[1]);
      setHastaMes(Number(props.resultadoConsulta.hasta.split("-")[0]));
      if (tipoDeTesteos.length > 0) {
        tipoDeTesteos.map((tipo) => {
          if (tipo.control == props.resultadoConsulta.control) {
            setTipoDeTesteosSeleccionado(tipo.id);
          }
        });
      }
      let seccionasArray = [];
      props.resultadoConsulta.detalle_secciones.map((seccion) => {
        seccionasArray.push({
          value: seccion.id_seccion,
          label: (
            <span
              dangerouslySetInnerHTML={{
                __html:
                  '<div class="falla-color-wrapper">' +
                  seccion.seccion +
                  "</div>",
              }}
            />
          ),
        });
      });
      handleChangeMulti(seccionasArray);
      let rutasArray = [];
      props.resultadoConsulta.detalle_rutas.map((seccion) => {
        rutasArray.push({
          value: seccion.id_seccion,
          label: (
            <span
              dangerouslySetInnerHTML={{
                __html:
                  '<div class="falla-color-wrapper">' +
                  seccion.seccion +
                  "</div>",
              }}
            />
          ),
        });
      });
      handleChangeMultiRutas(rutasArray);
    }
  }, [props.resultadoConsulta, tipoDeTesteos]);

  return (
    <Fragment>
      <Row>
        <Col xs="12" md="6" lg="3" className="mb-2 mb-md-0">
          <Col xs="12" className="p-0">
            DESDE:
          </Col>
          <Row>
            <Col xs="6" className="pr-0">
              <Input
                type="select"
                name="desde-anio"
                onChange={(e) => {
                  setDesdeAnio(e.target.value);
                }}
                value={desdeAnio}
              >
                {opcionesAnio.map((anio) => {
                  return (
                    <option key={anio} value={anio}>
                      {anio}
                    </option>
                  );
                })}
              </Input>
            </Col>
            <Col xs="6" className="pl-0">
              <Input
                type="select"
                name="desde-mes"
                onChange={(e) => {
                  setDesdeMes(e.target.value);
                }}
                value={desdeMes}
              >
                {meses.map((mes, index) => {
                  return (
                    <option key={index} value={index + 1}>
                      {mes}
                    </option>
                  );
                })}
              </Input>
            </Col>
          </Row>
        </Col>
        <Col xs="12" md="6" lg="3" className="mb-2 mb-md-0">
          <Col xs="12" className="p-0">
            HASTA:
          </Col>
          <Row>
            <Col xs="6" className="pr-0">
              <Input
                type="select"
                name="hasta-anio"
                onChange={(e) => {
                  setHastaAnio(e.target.value);
                }}
                value={hastaAnio}
              >
                {opcionesAnio.map((anio) => {
                  return (
                    <option key={anio} value={anio}>
                      {anio}
                    </option>
                  );
                })}
              </Input>
            </Col>
            <Col xs="6" className="pl-0">
              <Input
                type="select"
                name="hasta-mes"
                onChange={(e) => {
                  setHastaMes(e.target.value);
                }}
                value={hastaMes}
              >
                {meses.map((mes, index) => {
                  return (
                    <option key={index} value={index + 1}>
                      {mes}
                    </option>
                  );
                })}
              </Input>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xs="12" md="6" lg="3" className="mb-4 mb-md-0">
          <Input
            type="select"
            name="tipoTesteos"
            onChange={(e) => {
              setTipoDeTesteosSeleccionado(e.target.value);
            }}
            value={tipoTesteoSeleccionado}
          >
            <option>-- TIPO DE CONTROL -- </option>
            {tipoDeTesteos.length > 0 &&
              tipoDeTesteos.map((tipo) => {
                return (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.control}
                  </option>
                );
              })}
          </Input>
        </Col>
        <Col xs="12" md="6" lg="3" className="mb-4 mb-lg-0">
          {props.secciones && (
            <Select
              components={{ Input: CustomSelectInput }}
              className="react-select-fallas"
              classNamePrefix="react-select"
              styles={customStyles}
              isMulti
              placeholder="Seleccione una sección"
              name="form-field-name"
              value={secciones}
              onChange={handleChangeMulti}
              options={seccionesOpciones}
            />
          )}
        </Col>
        <Col xs="12" md="6" lg="3" className="mb-2 mb-md-0">
          {props.rutas && (
            <Select
              components={{ Input: CustomSelectInput }}
              className="react-select-fallas"
              classNamePrefix="react-select"
              styles={customStyles}
              isMulti
              placeholder="Seleccione una ruta"
              name="form-field-name2"
              value={rutas}
              onChange={handleChangeMultiRutas}
              options={rutasOpciones}
            />
          )}
        </Col>
        <Col className="text-right">
          <Button color="success" className="mt-4" onClick={aplicarConsulta}>
            {" "}
            APLICAR
          </Button>
        </Col>
      </Row>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    secciones: state.seccionesReducer.secciones,
    rutas: state.rutasReducer.rutas,
  };
};
export default connect(
  //función que mapea propiedades del state con propiedades del componente
  mapStateToProps,
  //mapeo de funciones
  { fetchlistarSecciones, fetchlistarRutas }
)(EdicionGenerarConsulta);
