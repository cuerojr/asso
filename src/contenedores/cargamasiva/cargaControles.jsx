import React, { Fragment, useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { InputGroup, InputGroupAddon, Input, Row, Col, Button } from "reactstrap";
import { fetchlistarEquipos } from '../../reducers/equipos-reducer';
import { fetchDetalleDeComponentesYControles } from '../../reducers/cargas-masivas-reducer';
import { fetchlistarEstados } from '../../reducers/estados-reducer';
import { fetchlistarFallas } from '../../reducers/fallas-reducer';
import FormularioCargaControles from './formularioCargaControles';
import DatosPrincipales from './datosPrincipales';
import { cargaControlPorComponente, 
        finalizarCargaMasiva, 
        guardarEquipoNoControlado, 
        confirmDetalleFinalizarCarga 
    } from '../../lib/cargas-masivas-api';

import { NotificationManager } from "../../components/common/react-notifications";
import { Tarjeta } from "../../componentes/tarjeta";
import EquipoNoControlado from './equipoNoControlado';
import ConfirmarFinalizarCarga from './confirmFinalizar';
import {listarEquiposEnCargaMasiva} from '../../lib/equipos-api';


import moment from 'moment';
const CargaControles = (props) => {
    const childRef = useRef(null);

    const [equipoSeleccionado, setEquipoSeleccionado] = useState("");
    const [indiceEquipoSeleccionado, setIndiceEquipoSeleccionado] = useState(0);
    //const [mostrarFormularioControles, setMostrarFormularioControles] = useState(false);
    const [cargaFormulario, setCargaFormulario] = useState(false);
    const [desahabilitarSiguiente, setDesahabilitarSiguiente] = useState(false);
    const [desahabilitarAnterior, setDesahabilitarAnterior] = useState(true);
    const [equipoControlado, setEquipoControlado] = useState(false);
    const [motivoNoControlado, setMotivoNoControlado] = useState("");
    const [otroMotivoNoControlado, setOtroMotivoNoControlado] = useState("");
    const [observacionesMotivosNoControlados, setObservacionesMotivosNoControlados] = useState("");
    const [fechaEquipoNoControlado, setFechaEquipoNoControlado] = useState(moment());
    const [detalleConfirmFinalizarCarga, setDetalleConfirmFinalizarCarga] = useState("")
    const [equipos, setEquipos] = useState([]);
    const [avisarFinalizar, setavisarFinalizar] = useState(false);



    useEffect(() => {
        //props.fetchlistarEquipos(props.clienteSeleccionado, props.rutaSeleccionada);
        listarEquiposEnCargaMasiva(props.clienteSeleccionado, props.idCargaMasiva).then(res =>{
            setEquipos(res)
        })
    }, [])

    const seleccionarEquipo = (val) => {        
        setEquipoSeleccionado(val);
        setCargaFormulario(true);
        equipos.forEach((equipo, index) => {
            if (equipo.id == val) {
                setIndiceEquipoSeleccionado(index + 1)
                if (index == 0) {
                    setDesahabilitarAnterior(true);
                } else {
                    setDesahabilitarAnterior(false);
                }
                if (index == equipos.length - 1) {
                    setDesahabilitarSiguiente(true);
                } else {
                    setDesahabilitarSiguiente(false);
                }
            }
        })
        //setMostrarFormularioControles(false);
    }

    useEffect(() => {
        if (equipoSeleccionado != "") {
            props.fetchDetalleDeComponentesYControles(props.idCargaMasiva, equipoSeleccionado);
            props.fetchlistarEstados(props.clienteSeleccionado);
            props.fetchlistarFallas(props.clienteSeleccionado);
            //setMostrarFormularioControles(true);
        }
    }, [equipoSeleccionado])

    useEffect(() => {
        if (props.fallas && props.fallas.length > 0 && props.estados && props.estados.length > 0 && props.componentes) {
            setCargaFormulario(false);
        }
    }, [props.fallas, props.estados, props.componentes, cargaFormulario])

    useEffect(() => {
        if(props.detalleDeComponentesYControles && props.detalleDeComponentesYControles.noControlado == 1){
            setEquipoControlado(true);
            setMotivoNoControlado(props.detalleDeComponentesYControles.motivoNoControlado);
            setObservacionesMotivosNoControlados(props.detalleDeComponentesYControles.observacionNoControlado);
        }else{
            setEquipoControlado(false);
            setMotivoNoControlado("");
            setObservacionesMotivosNoControlados("");
        }
    }, [props.detalleDeComponentesYControles])

    const seleccionarAnteriorSiguienteEquipo = (op) => {
        equipos.forEach((equipo, index) => {
            if (equipo.id == equipoSeleccionado) {
                if (op == "anterior") {
                    seleccionarEquipo(equipos[index - 1].id);
                } else {
                    seleccionarEquipo(equipos[index + 1].id);
                }
            }
        })
    }

    const siguienteEquipoFormulario = (siguienteEquipoDesdeParent) => {
        //console.log("🚀 ~ siguienteEquipoFormulario ~ equipoControlado:", equipoControlado)
        
        if (equipoControlado) {
            let strMotivoNoControlado;
            if(otroMotivoNoControlado){
                strMotivoNoControlado = otroMotivoNoControlado;
            }else{
                strMotivoNoControlado = motivoNoControlado
            }
            guardarEquipoNoControlado(props.idCargaMasiva, equipoSeleccionado, strMotivoNoControlado, observacionesMotivosNoControlados, moment(fechaEquipoNoControlado).format("YYYY-MM-DD"));
            seleccionarAnteriorSiguienteEquipo("siguiente");
        } else {
            siguienteEquipoDesdeParent();
            seleccionarAnteriorSiguienteEquipo("siguiente");
        }
    }


    const guardar = (fechas, estadoSeleccionadoId, selectedFallasIds, observaciones, recomendaciones, archivo, componentes) => {
        props.detalleDeComponentesYControles.componentes.forEach((componente, index) => {
            cargaControlPorComponente(props.idCargaMasiva, moment(fechas[index]).format("YYYY-MM-DD"), estadoSeleccionadoId[index], componente.id, JSON.stringify(selectedFallasIds[index]), observaciones[index], recomendaciones[index], archivo[index]);
        });
    }

    const confirmarFinalizar = () =>{
        setavisarFinalizar(true)
        setTimeout(function(){
            confirmDetalleFinalizarCarga(props.idCargaMasiva).then((res)=>{
                setDetalleConfirmFinalizarCarga(res)
                //setMostrarModalConfirmar(true);
            })
        }, 1000)
    }

    const finalizar = (next, steps, step) => {

        //childRef.current.guardarDesdeParent();
        finalizarCargaMasiva(props.idCargaMasiva).then(res => {
            if (res.stat === 1) {
                NotificationManager.success("La carga masiva se ha finalizado correctamente", "Hecho", 3000, null, null, '');
                props.setearCantidades(res);
                props.onClickNext(next, steps, step);
            } else {
                NotificationManager.error(res.err, "Error");
            }
        });
    }
    
    return (
        <Fragment>
            {detalleConfirmFinalizarCarga != '' && <ConfirmarFinalizarCarga titulodeReferencia={props.titulodeReferencia} clienteSeleccionadoLabel={props.clienteSeleccionadoLabel} setDetalleConfirmFinalizarCarga={setDetalleConfirmFinalizarCarga}
            tipoDeControlSeleccionadoLabel={props.tipoDeControlSeleccionadoLabel} finalizar={finalizar} detalleConfirmFinalizarCarga={detalleConfirmFinalizarCarga}  />}
            <Tarjeta titulo="">
                <Col className="mt-2">
                    <DatosPrincipales titulodeReferencia={props.titulodeReferencia} clienteSeleccionadoLabel={props.clienteSeleccionadoLabel}
                       tipoDeControlSeleccionadoLabel={props.tipoDeControlSeleccionadoLabel} />
                </Col>
                <Row className="mt-4">
                    {indiceEquipoSeleccionado != 0 && <Col>
                        <p className='mt-2 mb-0'>{indiceEquipoSeleccionado} de {equipos.length} Equipos</p>
                    </Col>}
                    {indiceEquipoSeleccionado != 0 && <Col className="p-0 text-right pr-3">

                            <div className="d-inline" style={{'paddingRight':'200px'}}>
                                <Button color="success" onClick={ confirmarFinalizar }>
                                    FINALIZAR <span className='ml-2'>&gt;</span>
                                </Button>
                            </div>

                    </Col>}
                </Row>
                <Row className="mt-2">
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                NOMBRE DEL EQUIPO:
                            </InputGroupAddon>
                            <Input className="bg-black" type="select" name="equipo" onChange={(e) => { seleccionarEquipo(e.target.value) }} value={equipoSeleccionado}>
                                <option>-- Seleccione un equipo -- </option>
                                {equipos.map((equipo, i) => {
                                    return (<option key={i} value={equipo.id}>{equipo.nombre}</option>)
                                })}
                            </Input>
                        </InputGroup>
                    </Col>
                </Row>
                {equipoSeleccionado && <EquipoNoControlado 
                    equipoControlado={equipoControlado} 
                    setMotivoNoControlado={setMotivoNoControlado}
                    motivoNoControlado={motivoNoControlado} 
                    fechaEquipoNoControlado={fechaEquipoNoControlado} 
                    setFechaEquipoNoControlado={setFechaEquipoNoControlado} 
                    otroMotivoNoControlado={otroMotivoNoControlado}
                    setOtroMotivoNoControlado={setOtroMotivoNoControlado} 
                    observacionesMotivosNoControlados={observacionesMotivosNoControlados}
                    setObservacionesMotivosNoControlados={setObservacionesMotivosNoControlados} 
                    clienteSeleccionado={props.clienteSeleccionado} 
                />}
            </Tarjeta>
            {cargaFormulario && <Row className="position-relative" style={{"height":"100px"}}><div className="loading" style={{ "position": "relative" }} /></Row>}
            {!cargaFormulario && equipoSeleccionado !== '' && <Fragment>
                <Row className="mt-3 mb-3"></Row>
                <FormularioCargaControles 
                    ref={childRef} 
                    guardar={guardar}
                    seleccionarAnteriorSiguienteEquipo={seleccionarAnteriorSiguienteEquipo}
                    desahabilitarSiguiente={desahabilitarSiguiente} 
                    desahabilitarAnterior={desahabilitarAnterior} 
                    equipoControlado={equipoControlado} 
                    setEquipoControlado={setEquipoControlado} 
                    siguienteEquipoFormulario={siguienteEquipoFormulario} avisarFinalizar={avisarFinalizar} 
                    />
            </Fragment>}
        </Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        equipos: state.equiposReducer.equipos,
        componentes: state.componentesReducer.componentes,
        estados: state.estadosReducer.estados,
        fallas: state.fallasReducer.fallas,
        detalleDeComponentesYControles: state.cargasMasivasReducer.detalleDeComponentesYControles,
        rutaSeleccionada: state.cargasMasivasReducer.rutaSeleccionada,
    }
}
export default connect(
    mapStateToProps,
    { fetchlistarEquipos, fetchDetalleDeComponentesYControles, fetchlistarEstados, fetchlistarFallas }
)(CargaControles);

