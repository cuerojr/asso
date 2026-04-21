import React,{useState} from 'react';
import { InputGroup, InputGroupAddon, Input, Row, Button, Col } from "reactstrap";
import { Tarjeta } from "./tarjeta";
import { connect } from 'react-redux';
import { fetchListarObservaciones, fetchListarRecomendaciones } from '../reducers/autocompletar-reducer';
import {altaAutocompletar} from '../lib/autocompletar-api';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AltaAutocompletar = ({tipo, fetchListarObservaciones, fetchListarRecomendaciones}) => {

    const [nombreCorto, setNombreCorto] = useState('');
    const [texto, setTexto] = useState();

    let titulo;
    let tipoAGuardar;
    let label;
    if(tipo === 'observacion'){
        titulo = 'observación';
        tipoAGuardar = 'o';
        label = 'Observación'
    }else{
        titulo = 'recomandación';
        tipoAGuardar = 'r';
        label = 'Recomendación'
    }

    const guardarHandle = () => {
        altaAutocompletar(texto, nombreCorto, tipoAGuardar).then((res)=>{
            if(res.stat === 1){
                setNombreCorto('');
                setTexto('');
                if(tipoAGuardar === 'o'){
                    fetchListarObservaciones();
                }else{
                    fetchListarRecomendaciones();
                }
            }
        })
    }

    return (
        <>
            <Tarjeta titulo={`Guardar ${titulo}:`}>
                <Row>
                    <Col md={4} className='pr-0'>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                Nombre Corto
                            </InputGroupAddon>
                            <Input value={nombreCorto} onChange={e => setNombreCorto(e.target.value)} />
                        </InputGroup>
                    </Col>
                    <Col md={6}>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                {label}
                            </InputGroupAddon>
                            <Input value={texto} onChange={e => setTexto(e.target.value)} />
                        </InputGroup>
                    </Col>
                    <Col md={2} className='pl-0'>
                        <Button color="success" size="lg" style={{ width: "100%" }} onClick={guardarHandle}>
                            <FontAwesomeIcon icon={faPlus} /> Guardar
                        </Button>
                    </Col>
                </Row>
            </Tarjeta>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        observaciones: state.autocompletarReducer.observaciones,
        recomendaciones: state.autocompletarReducer.recomendaciones,
    }
}
export default connect(
    mapStateToProps,
    { fetchListarObservaciones, fetchListarRecomendaciones}
)(AltaAutocompletar);