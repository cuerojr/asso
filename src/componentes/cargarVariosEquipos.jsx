import React, { Fragment, useState } from 'react';
import { Button, Modal, ModalBody, Label, Col, Row, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { connect } from 'react-redux';
import { mostrarOcultarModalCargarVariosEquipos, fetchlistarEquipos } from '../reducers/equipos-reducer';
import { fetchlistarSecciones } from '../reducers/secciones-reducer';
import { fetchlistarRutas } from '../reducers/rutas-reducer';
import { Tarjeta } from "./tarjeta";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faClone, faTrash} from '@fortawesome/free-solid-svg-icons';
import {cargaMasivaDeEquipos} from '../lib/equipos-api';
import { NotificationManager } from "../components/common/react-notifications";
import { booleanToNumber } from './utils/utils';
const CargarVariosEquipos = (props) => {

    const inicialValues = {
        nombre: "",
        descripcion: "",
        seccion: "",
        ruta: "",
        componentes: [{
            nombre: "",
            descripcion: ""
        }]
    }
    const [equipos, setEquipos] = useState([
        inicialValues
    ]);

    const handleChange = (evt, index) => {
        const value = evt.target.value;
        let equiposTemp = [...equipos];
        equiposTemp[index][evt.target.name] = value
        setEquipos(equiposTemp)
    }

    const handleChangeComponente = (evt, index, indice, checked = false) =>{
        const value = evt.target.value;
        let equiposTemp = [...equipos];
        if(checked){
            equiposTemp[index].componentes[indice][evt.target.name] = booleanToNumber(checked);
        }else{
            equiposTemp[index].componentes[indice][evt.target.name] = value
        }
        setEquipos(equiposTemp)
    }

    const agregarNuevoComponente = (index) =>{
        let equiposTemp = [...equipos];
        equiposTemp[index].componentes.push(inicialValues.componentes[0])
        setEquipos(equiposTemp)
    }

    const agregarNuevoEquipo = () =>{
        setEquipos(current => [...current, inicialValues])
    }

    const clonarEquipo = (index) =>{
        let copia = Object.assign({}, equipos[index])
        let componentesCopia = JSON.parse(JSON.stringify(equipos[index].componentes))//[...equipos[index].componentes]
        delete copia.componentes;
        copia.componentes = componentesCopia;
        setEquipos(current => [...current, copia])
    }

    const borrarEquipo = (index) =>{
        if(index === 0 && equipos.length === 1){
            setEquipos([inicialValues])
        }else{
        setEquipos(oldArray => {
            return oldArray.filter((value, i) => i !== index)
          })
        }
    }

    const guardar = () => {
        cargaMasivaDeEquipos(JSON.stringify(equipos)).then((res) =>{
            if (res.stat === 1) {
                NotificationManager.success("Los equipos han sido guardados", "Hecho", 3000, null, null, '');
                props.mostrarOcultarModalCargarVariosEquipos(false);
                props.fetchlistarEquipos(props.idEmpresa);
                setEquipos([inicialValues])
            }else{
                NotificationManager.error(res.err,"Error",3000,null,null,'');
            }
        })
    }

    return (
        <Fragment>
            <Modal isOpen={props.modalCargaVariosEquipos} size="lg" >
                <ModalBody>
                    <Row>
                        <Col xs="12" className="d-flex justify-content-between">
                            <h5 className='modal-title'>CARGA AGIL DE EQUIPOS</h5>
                            <div>
                                <Button color="success" size="sm" onClick={guardar}> GUARDAR</Button>
                                <Button className="ml-2" color="dark" size="sm" onClick={() => { props.mostrarOcultarModalCargarVariosEquipos(false) }}> CANCELAR</Button>
                            </div>
                        </Col>
                        <Col>
                            <hr />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="varios-equipos-wrapper">
                            {equipos.map((equipo, index) => {
                                return (
                                    <Fragment key={index}>
                                        <Tarjeta titulo="">
                                                <div className='equipo-tools'>
                                                    <Button color="link" onClick={()=>{clonarEquipo(index)}}><FontAwesomeIcon icon={faClone} /> </Button>
                                                    <Button className='pl-0' color="link" onClick={()=>{borrarEquipo(index)}}><FontAwesomeIcon icon={faTrash} /> </Button>
                                                </div>
                                            <Row>
                                                <Col xs='6'>
                                                    <Label for="nombre"><strong>NOMBRE DEL EQUIPO:</strong></Label>
                                                    <Input type="text" name="nombre" value={equipo.nombre} onChange={(evt) => { handleChange(evt, index) }} />
                                                </Col>
                                                <Col xs='6'>
                                                    <Label for="descripcion">DESCRIPCION BREVE:</Label>
                                                    <Input type="text" name="descripcion" value={equipo.descripcion} onChange={(evt) => { handleChange(evt, index) }} />
                                                </Col>
                                                <Col xs='6' className='mt-2'>
                                                    <InputGroup className="mb-3">
                                                        <InputGroupAddon addonType="prepend">
                                                            SECCIÓN:
                                                        </InputGroupAddon>
                                                        <Input type="select" name="seccion" onChange={(evt) => { handleChange(evt, index) }} value={equipo.seccion}>
                                                            <option>-- Seleccione una sección -- </option>
                                                            {props.secciones && props.secciones.map((seccion) => {
                                                                return (<option key={seccion.id} value={seccion.id}>{seccion.nombre}</option>)
                                                            })}
                                                        </Input>
                                                    </InputGroup>
                                                </Col>
                                                <Col xs='6' className='mt-2'>
                                                    <Input type="select" name="ruta" onChange={(evt) => { handleChange(evt, index) }} value={equipo.ruta}>
                                                        <option>-- Seleccione una ruta -- </option>
                                                        {props.rutas && props.rutas.map((ruta) => {
                                                            return (<option key={ruta.id} value={ruta.id}>{ruta.nombre}</option>)
                                                        })}
                                                    </Input>
                                                </Col>
                                                <Col xs="12">
                                                    <hr />
                                                </Col>
                                                <Col xs="12">
                                                {equipo.componentes.map((componente, indice) => {
                                                    return (
                                                    <div key={indice}>
                                                        <Row  className='mt-4'>
                                                            <Col xs='6'>
                                                                <Label for="nombre"><strong>NOMBRE DEL COMPONENTE:</strong></Label>
                                                                <Input type="text" name="nombre" value={componente.nombre} onChange={(evt) => { handleChangeComponente(evt, index, indice) }} />
                                                            </Col>
                                                            <Col xs='6'>
                                                                <Label for="descripcion">DESCRIPCION BREVE:</Label>
                                                                <Input type="text" name="descripcion" value={componente.descripcion} onChange={(evt) => { handleChangeComponente(evt, index, indice) }} />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs='12' className='pl-4'>
                                                                <div style={{marginLeft:'15px', marginTop:'10px'}} ><Input name="rpm" type="checkbox" checked={componente.bajaRPM} onChange={(evt)=>{handleChangeComponente(evt, index, indice, evt.target.checked)}} /> <Label>Baja RPM</Label></div>
                                                            </Col>
                                                        </Row>
                                                    </div>)
                                                })}
                                                </Col>
                                                <Col xs="12" className="mt-2">
                                                    <Button color="link" className="pl-0" onClick={()=>{agregarNuevoComponente(index)}}><FontAwesomeIcon icon={faCirclePlus} /> COMPONENTE</Button>
                                                </Col>
                                            </Row>
                                        </Tarjeta>
                                    </Fragment>
                                )
                            })}
                            <Button color="dark" onClick={agregarNuevoEquipo} size="sm"><FontAwesomeIcon icon={faCirclePlus} /> EQUIPO</Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        modalCargaVariosEquipos: state.equiposReducer.modalCargaVariosEquipos,
        secciones: state.seccionesReducer.secciones,
        rutas: state.rutasReducer.rutas,
    }
}
export default connect(
    mapStateToProps,
    { mostrarOcultarModalCargarVariosEquipos, fetchlistarSecciones, fetchlistarRutas, fetchlistarEquipos }
)(CargarVariosEquipos);

