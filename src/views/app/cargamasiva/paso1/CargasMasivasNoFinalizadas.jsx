import React from 'react';
import { connect } from 'react-redux';
import ItemListaCargaMasivaNoFinalizada from './ItemListaCargaMasivaNoFinalizada';
import ModalConfirmarBorrarCargaMasivaNoFinalizada from './ModalConfirmarBorrarCargaMasivaNoFinalizada';
import { Row, Col } from "reactstrap";
const CargasMasivasNoFinalizadas = (props) => {
    return (
        <>
            <ModalConfirmarBorrarCargaMasivaNoFinalizada />
            <Row>
                <Col>
                    <h3>CARGA NO FINALIZADAS</h3>
                </Col>
            </Row>
            <Row><Col className='p-0'>
            {props.cargasMasivas.map((item, index) => {
                return <ItemListaCargaMasivaNoFinalizada key={index} item={item} />
            })}
            </Col></Row>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        cargasMasivas: state.cargasMasivasReducer.cargasMasivas
    }
}

export default connect(mapStateToProps, null)(CargasMasivasNoFinalizadas);
