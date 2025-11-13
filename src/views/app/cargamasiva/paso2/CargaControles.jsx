import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import CargaControlItem from './cargaControlItem/Index'
import {  Row, Col } from "reactstrap";
import {setearEquipoNoControlado, setearEquipoSeleccionadoEnCargaMasiva} from '../../../../reducers/cargas-masivas-reducer'


const CargaControles = ({
    detalleDeComponentesYControles, 
    cargaMasiva,
    equipoSeleccionadoEnCargaMasiva, 
    setearEquipoNoControlado
}) => {

    useEffect(()=>{
        if(detalleDeComponentesYControles){
            if(detalleDeComponentesYControles.noControlado !== 1){
                setearEquipoNoControlado(null)
            }
        }

    },[
        detalleDeComponentesYControles, 
        cargaMasiva.id, 
        equipoSeleccionadoEnCargaMasiva, 
        setearEquipoNoControlado
    ]);

    return (
        <Col className='mt-4 p-0'>
        {detalleDeComponentesYControles && detalleDeComponentesYControles.componentes.map((componente, index)=>{
           return <Row key={index}>
                    <Col className='mt-3'>
                        <CargaControlItem key={index} componente={componente} index={index} />
                    </Col>
                </Row>
        })}
        </Col>
    );
};


const mapStateToProps = (state) => {
    return {
        detalleDeComponentesYControles: state.cargasMasivasReducer.detalleDeComponentesYControles,
        cargaMasiva: state.cargasMasivasReducer.cargaMasiva,
        equipoSeleccionadoEnCargaMasiva: state.cargasMasivasReducer.equipoSeleccionadoEnCargaMasiva,
    }
}
export default connect(
    mapStateToProps, {setearEquipoNoControlado, setearEquipoSeleccionadoEnCargaMasiva})(CargaControles);
