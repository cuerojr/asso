import React, {Fragment, useState, useEffect} from 'react';
import { InputGroup, InputGroupAddon, Input, Row, Col, FormGroup } from "reactstrap";
import DatePicker from "react-datepicker";
import { listadoDeMotivosPorEquipoNoControlado } from '../../lib/cargas-masivas-api';

const EquipoNoControlado = (props) => {
    const [cargarOtroMotivoNoControlado, setCargarOtroMotivoNoControlado] = useState(false);
    const [motivos, setMotivos] = useState([]);
    const seleccionarMotivoNoControlado = (val) => {
        props.setMotivoNoControlado(val);
        if (val == "Agregar Nuevo Motivo") {
            setCargarOtroMotivoNoControlado(true);
        } else {
            setCargarOtroMotivoNoControlado(false);
        }
    }

    useEffect(() => {
        if(props.equipoControlado){
            listadoDeMotivosPorEquipoNoControlado(props.clienteSeleccionado).then(response => {
                response.push({id: 9999999, motivo: 'Agregar Nuevo Motivo'});
                setMotivos(response);
                props.setOtroMotivoNoControlado("");
            })
        }
    } , [props.equipoControlado]);

    return (
        <Fragment><Row>
        <Col md="3" style={{ "height": "45px" }}></Col>
        <Col md="6">
            {props.equipoControlado && <InputGroup>
                <InputGroupAddon addonType="prepend">
                    MOTIVO:
                </InputGroupAddon>
                <Input className="bg-black" type="select" name="motivo" onChange={(e) => { seleccionarMotivoNoControlado(e.target.value) }} value={props.motivoNoControlado}>
                    <option>SELECCIONAR MOTIVO</option>
                    {motivos.map((motivo, index) => {
                        return (<option key={index} value={motivo.motivo}>{motivo.motivo}</option>)
                    })}
                </Input>
            </InputGroup>}
        </Col>
        <Col md="2" className="form-inline fecha-motivo pl-0">
            {props.equipoControlado && <InputGroup style={{ "flex": "0 0 auto" }}>
                <InputGroupAddon addonType="prepend">
                    FECHA:
                </InputGroupAddon>
                <DatePicker selected={props.fechaEquipoNoControlado} onChange={(date) => props.setFechaEquipoNoControlado(date)}  />
            </InputGroup>}
        </Col>
    </Row>
        {props.equipoControlado && cargarOtroMotivoNoControlado && <Row className="mt-2">
            <Col md="3" style={{ "height": "45px" }}></Col>
            <Col md="6">
                <FormGroup className="mb-0">
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            OTRO MOTIVO:
                        </InputGroupAddon>
                        <Input type="text" name="text" id="otroMotivo" value={props.otroMotivoNoControlado} onChange={(e) => { props.setOtroMotivoNoControlado(e.target.value) }} />
                    </InputGroup>
                </FormGroup>
            </Col>
            {/*<Col md="3" className="pl-0">
                {props.otroMotivoNoControlado != "" && <Button color="success" onClick={pushearOtroMotivoNoControlado}>
                    APLICAR
                </Button>}
                </Col>*/}
        </Row>}
        {props.equipoControlado && <Row className="mt-2">
            <Col md="3" style={{ "height": "45px" }}></Col>
            <Col md="6">
                <InputGroup className="borde-gris mt-2">
                    <div className='legend'>OBSERVACIONES: </div>
                    <Input className='mt-2 no-border' type="textarea" id="observaciones" value={props.observacionesMotivosNoControlados} onChange={e => props.setObservacionesMotivosNoControlados(e.target.value)} />
                </InputGroup>
            </Col>
        </Row>}
    </Fragment>
    );
};

export default EquipoNoControlado;