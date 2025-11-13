import React, { Fragment, useState, useEffect } from 'react';
import { InputGroup, InputGroupAddon, Input, Row, Col, Button } from "reactstrap";
import { listarTipoTesteos } from '../../lib/controles-api';
import { altaCargaMasiva, modificacionCargaMasiva } from '../../lib/cargas-masivas-api';
import { WithWizard } from 'react-albus';
import { connect } from 'react-redux';
import { fetchlistarSecciones } from '../../reducers/secciones-reducer';
import SelectMultiple from '../../componentes/selectMultiple';
import { setearRutaSeleccionada, setearRutaSeleccionadaLabel, setearSeccionesSeleccionadas, setearSeccionesSeleccionadasLabel, setearFechaGlobal } from '../../reducers/cargas-masivas-reducer'
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatosGlobales = (props) => {

    const [tituloReferencia, setTituloReferencia] = useState(props.titulodeReferencia);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(props.clienteSeleccionado);
    const [tipoTesteos, setTipoTesteos] = useState(null);
    const [tipoTesteoSeleccionado, setTipoTesteoSeleccionado] = useState(props.tipoDeControlSeleccionado);
    const [secciones, setSecciones] = useState([])
    const [seccionesIds, setSeccionesIds] = useState([])
    const [rutasIds, setRutasIds] = useState([]);
    const [rutasParaSelector, setRutasParaSelector] = useState([]);
    const [fecha, setFecha] = useState(moment());

    useEffect(() => {
        listarTipoTesteos().then((res) => {
            setTipoTesteos(res);
        })
    }, [])

    const setearTituloReferencia = (e) => {
        setTituloReferencia(e.target.value);
        props.setTitulodeReferencia(e.target.value);
    }

    const seleccionEmpresa = (e) => {
        setClienteSeleccionado(e.target.value)
        props.setClienteSeleccionadoLabel(e.target.options[e.target.selectedIndex].text)
        props.seleccionarEmpresa(e.target.value);
        props.fetchlistarSecciones(e.target.value)
        setTipoTesteoSeleccionado("");
    }


    const seleccionarTipoTesteo = (e) => {
        setTipoTesteoSeleccionado(e.target.value)
        props.setTipoDeControlSeleccionado(e.target.value);
        props.setTipoDeControlSeleccionadoLabel(e.target.options[e.target.selectedIndex].text)
    }

    const guardar = (next, steps, step) => {
        if (props.cargaMasivaNoFinalizada) {
            props.setearFechaGlobal(moment(props.cargaMasivaNoFinalizada.fecha_global_controles));
            modificacionCargaMasiva(props.cargaMasivaNoFinalizada.id, tituloReferencia, clienteSeleccionado, props.cargaMasivaNoFinalizada.id_rutas, tipoTesteoSeleccionado, props.cargaMasivaNoFinalizada.id_secciones).then((res) => {
                if (res.stat == 1) {
                    props.onClickNext(next, steps, step)
                    console.log(step);
                }
            })
        } else {
            altaCargaMasiva(tituloReferencia, clienteSeleccionado, JSON.stringify(rutasIds), tipoTesteoSeleccionado, JSON.stringify(seccionesIds), moment(fecha).format("YYYY-MM-DD")).then((res) => {
                if (res.error) {
                    alert(res.error);
                } else {
                    props.setearFechaGlobal(moment(fecha).format("YYYY-MM-DD"));
                    props.setIdCargaMasiva(res.id);
                    props.onClickNext(next, steps, step)
                }
            })
        }
    }

    useEffect(() => {
        if (props.cargaMasivaNoFinalizada) {
            setTituloReferencia(props.cargaMasivaNoFinalizada.titulo);
            props.setTitulodeReferencia(props.cargaMasivaNoFinalizada.titulo);
            props.clientes.forEach(cliente => {
                if (cliente.empresa === props.cargaMasivaNoFinalizada.nombre_cliente) {
                    setClienteSeleccionado(cliente.id);
                    props.setClienteSeleccionadoLabel(cliente.empresa);
                    props.seleccionarEmpresa(cliente.id);
                    setTipoTesteoSeleccionado("");

                }
            });
            props.setIdCargaMasiva(props.cargaMasivaNoFinalizada.id);
            setTipoTesteoSeleccionado(props.cargaMasivaNoFinalizada.id_control);
            props.setTipoDeControlSeleccionado(props.cargaMasivaNoFinalizada.id_control);
            props.fetchlistarSecciones(props.cargaMasivaNoFinalizada.id_empresa)
            if (tipoTesteos) {
                tipoTesteos.forEach(tipoTesteo => {
                    if (tipoTesteo.id === props.cargaMasivaNoFinalizada.id_control) {
                        props.setTipoDeControlSeleccionadoLabel(tipoTesteo.control);
                    }
                })
            }
            if(props.cargaMasivaNoFinalizada.fecha_global_controles === '0000-00-00'){
                setFecha(moment())
            }else{
                setFecha(moment(props.cargaMasivaNoFinalizada.fecha_global_controles))
            }

        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.cargaMasivaNoFinalizada])

    useEffect(() => {
        const rutasTemp = [];
        const seccionesTemp = [];
        const rutasLabelTemp = [];
        const seccionesLabelTemp = [];
        if (props.rutas && props.secciones && props.cargaMasivaNoFinalizada) {
            const rutasIdsDeLaCargaMasiva = JSON.parse(props.cargaMasivaNoFinalizada.id_rutas)
            const seccionesDeLaCargaMasiva = JSON.parse(props.cargaMasivaNoFinalizada.id_secciones)
            props.rutas.forEach(ruta => {
                rutasIdsDeLaCargaMasiva.forEach(idRuta => {
                    if (Number(ruta.id) === idRuta) {
                        rutasLabelTemp.push(ruta.nombre)
                        let rutalabel = { value: ruta.id, label: <span dangerouslySetInnerHTML={{ __html: '<div class="falla-color-wrapper">' + ruta.nombre + '</div>' }} /> }
                        rutasTemp.push(rutalabel);
                    }
                })
            })
            props.secciones.forEach(seccion => {
                seccionesDeLaCargaMasiva.forEach(idSeccion => {
                    if (Number(seccion.id) === idSeccion) {
                        seccionesLabelTemp.push(seccion.nombre)
                        let rutalabel = { value: seccion.id, label: <span dangerouslySetInnerHTML={{ __html: '<div class="falla-color-wrapper">' + seccion.nombre + '</div>' }} /> }
                        seccionesTemp.push(rutalabel);
                    }
                })

            })

            setRutasParaSelector(rutasTemp);
            props.setearRutaSeleccionadaLabel(rutasLabelTemp)
            props.setearRutaSeleccionada(JSON.parse(props.cargaMasivaNoFinalizada.id_rutas));
            props.setearSeccionesSeleccionadasLabel(seccionesLabelTemp);
            setSecciones(seccionesTemp);
        }
    }, [props.rutas, props.cargaMasivaNoFinalizada, props.secciones])

    const handleChangeMulti = (el) => {
        let obj = el.find(o => o.value == 999999999999);
        if (obj) {
            setSecciones([obj])
            props.setearSeccionesSeleccionadas([obj])
            setSeccionesIds([])
        } else {
            let seccionesIdTem = [];
            let seccionesLabel = []
            el.forEach(seccion => {
                seccionesIdTem.push(seccion.value);
                var tempElement = document.createElement('div');
                tempElement.innerHTML = seccion.label.props.dangerouslySetInnerHTML.__html
                seccionesLabel.push(tempElement.textContent)
            })
            setSecciones(el);
            setSeccionesIds(seccionesIdTem)
            props.setearSeccionesSeleccionadas(el)

            props.setearSeccionesSeleccionadasLabel(seccionesLabel)
        }
    };

    const handleChangeMultiRuta = (el) => {
        let obj = el.find(o => o.value == 999999999999);
        if (obj) {
            setRutasParaSelector([obj])

            let rutasTemp = []
            let rutasLabelTemp = []
            props.rutas.forEach((seccion) => {
                rutasTemp.push(seccion.id)
                rutasLabelTemp.push(seccion.nombre)
            })
            setRutasIds([])
            props.setearRutaSeleccionada(rutasTemp);
            props.setearRutaSeleccionadaLabel(rutasLabelTemp);
        } else {
            let rutasIdsTemp = [];
            let rutasLabels = []
            el.forEach(falla => {
                rutasIdsTemp.push(falla.value)
                var tempElement = document.createElement('div');
                tempElement.innerHTML = falla.label.props.dangerouslySetInnerHTML.__html
                rutasLabels.push(tempElement.textContent)
            })
            setRutasIds(rutasIdsTemp)
            props.setearRutaSeleccionada(rutasIdsTemp);
            props.setearRutaSeleccionadaLabel(rutasLabels);
            setRutasParaSelector(el)

        }
    };

    const handleChangeEmbedded = (date) => {
        setFecha(date)
        console.log(date.format('YYYY-MM-DD'));
    }

    return (
        <Fragment>
            <div className='paso-uno'>
                <Row className='mt-4 titulo-referencia'>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                TÍTULO DE REFERENCIA
                            </InputGroupAddon>
                            <Input value={tituloReferencia} onChange={e => setearTituloReferencia(e)} />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                CLIENTE
                            </InputGroupAddon>
                            <Input type="select" name="cliente" onChange={seleccionEmpresa} value={clienteSeleccionado} disabled={props.deshabilitarCargaSeleccionada}>
                                <option>Seleccione un cliente</option>
                                {props.clientes.map((cliente) => {
                                    return (<option key={cliente.id} value={cliente.id}>{cliente.empresa}</option>)
                                })}
                            </Input>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                SECCIONES
                            </InputGroupAddon>
                            {props.secciones && <SelectMultiple items={props.secciones} handleChangeMulti={handleChangeMulti}
                                itemsSeleccionados={secciones} placeholderSingular="seccion" placeholderPlural="secciones" isDisabled={props.deshabilitarCargaSeleccionada} />}
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                RUTAS
                            </InputGroupAddon>
                            {props.rutas && <SelectMultiple items={props.rutas} handleChangeMulti={handleChangeMultiRuta}
                                itemsSeleccionados={rutasParaSelector} placeholderSingular="ruta" placeholderPlural="rutas" isDisabled={props.deshabilitarCargaSeleccionada} />}
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputGroup className="mb-3 d-flex flex-row align-items-start justify-content-start">
                            <InputGroupAddon addonType="prepend">
                                FECHA DE CONTROL
                            </InputGroupAddon>
                            <div className='flex-fill'>
                                <DatePicker locale={'es'} selected={fecha} onChange={handleChangeEmbedded} disabled={props.deshabilitarCargaSeleccionada} />
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
                            <Input type="select" name="select" id="exampleSelect" onChange={(e) => { seleccionarTipoTesteo(e) }} value={tipoTesteoSeleccionado} disabled={props.deshabilitarCargaSeleccionada}>
                                <option value="">Seleccione un control</option>
                                {tipoTesteos && tipoTesteos.map((tipo) => {
                                    return (<option key={tipo.id} value={tipo.id}>{tipo.control}</option>)
                                })}
                            </Input>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col className="">
                        <WithWizard render={({ next, previous, step, steps }) => (
                            <div className="wizard-buttons d-flex justify-content-center">
                                <Button color="success" disabled={!tituloReferencia || !clienteSeleccionado || !props.rutaSeleccionada || !tipoTesteoSeleccionado} onClick={() => { guardar(next, steps, step) }}>
                                    SIGUIENTE | CARGA DE CONTROLES <span className='ml-2'>&gt;</span>
                                </Button>
                            </div>
                        )} />
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
        rutaSeleccionada: state.cargasMasivasReducer.rutaSeleccionada,
        rutaSeleccionadaLabel: state.cargasMasivasReducer.rutaSeleccionadaLabel,
        fechaGlobal: state.cargasMasivasReducer.fechaGlobal
    }
}

export default connect(
    //función que mapea propiedades del state con propiedades del componente
    mapStateToProps,
    //mapeo de funciones
    { fetchlistarSecciones, setearRutaSeleccionada, setearRutaSeleccionadaLabel, setearSeccionesSeleccionadas, setearSeccionesSeleccionadasLabel, setearFechaGlobal }
)(DatosGlobales);

