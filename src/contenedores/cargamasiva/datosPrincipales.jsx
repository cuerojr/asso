import React, { Fragment, useEffect, useState} from 'react';
import {  Row, Col } from "reactstrap";
import { connect } from 'react-redux';

const DatosPrincipales = (props) => {
    /* const [secciones, setSecciones] = useState([])
    useEffect(()=>{
        let seccionesLabel = []
        props.seccionesSeleccionadas.map((seccion)=>{
            var tempElement = document.createElement('div');
                tempElement.innerHTML = seccion.label.props.dangerouslySetInnerHTML.__html
                seccionesLabel.push(tempElement.textContent)
        })
        setSecciones(seccionesLabel)

    },[props.seccionesSeleccionadas]) */
    return (
        <Fragment>
                <Row>
                    <Col className="border p-2 bg-black borde-gris">
                        <h1 className='mb-0 pb-0'>{props.titulodeReferencia}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col className="border p-2 bg-black borde-gris">
                        CLIENTE: {props.clienteSeleccionadoLabel}
                    </Col>
                </Row>
                <Row>
                    <Col className='border p-2 bg-black borde-gris'>RUTA: {props.rutaSeleccionadaLabel.map((ruta, index)=>{return <Fragment key={index}>{ruta}, </Fragment>})}</Col>
                    <Col className='border p-2 bg-black borde-gris'>TIPO DE CONTROL: {props.tipoDeControlSeleccionadoLabel}</Col>
                </Row>
                {props.seccionesSeleccionadasLabel && <Row>
                    <Col className='border p-2 bg-black borde-gris'>SECCIONES: {props.seccionesSeleccionadasLabel.map((seccion, index)=>{return <Fragment key={index}>{seccion}, </Fragment>})}</Col>
                </Row>}
            </Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        rutaSeleccionadaLabel: state.cargasMasivasReducer.rutaSeleccionadaLabel,
        seccionesSeleccionadas: state.cargasMasivasReducer.seccionesSeleccionadas,
        seccionesSeleccionadasLabel: state.cargasMasivasReducer.seccionesSeleccionadasLabel
    }
}

export default connect(
    mapStateToProps,
    null
)(DatosPrincipales);
