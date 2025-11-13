import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Button } from "reactstrap";
import DatosPrincipales from '../paso2/DatosPrincipales';
import { WithWizard } from 'react-albus';
import { Link } from "react-router-dom";
import { enviarNotificacionCliente } from '../../../../lib/cargas-masivas-api';
import { NotificationManager } from "../../../../components/common/react-notifications";
import {setearCargaMasiva} from "../../../../reducers/cargas-masivas-reducer"
import { connect } from 'react-redux';
import moment from 'moment';
const Paso3 = ({cantidadesFinal, cargaMasiva, setearCargaMasiva}) => {
    const [enviandoNotificacion, setEnviandoNotificacion] = useState(false);
    const [clienteNotificado, setClienteNotificado] = useState(false);

    const volverAlInicio = (push) => {
        push('step1');
        setearCargaMasiva({
            tituloDeReferencia:'',
        })
    }

    const notificarAlCliente = () => {
        setEnviandoNotificacion(true);
        /*setTimeout(() => {
            setEnviandoNotificacion(false);
            setClienteNotificado(true);
        }, 10000);*/
        enviarNotificacionCliente(cargaMasiva.id).then((response) => {
            if (response.stat === 1) {
                setEnviandoNotificacion(false);
                setClienteNotificado(true);
            }else{
                NotificationManager.error(response.err, "Error");
            }
        });
    }
    return (
        <Fragment>
            <Col className="mt-2">
                <DatosPrincipales />
                {cantidadesFinal && <Row>
                    <Col className='border p-2 bg-black borde-gris'>CANT. DE EQUIPOS: {cantidadesFinal.total_equipos}</Col>
                    <Col className='border p-2 bg-black borde-gris'>CONTROLADOS: {cantidadesFinal.equipos_testeados}</Col>
                    <Col className='border p-2 bg-black borde-gris' md="6">FECHA DE INSPECCIÓN: {"ENTRE " + moment(cantidadesFinal.primer_test).format("DD/MM/YYYY") + " Y " + moment(cantidadesFinal.ultimo_test).format("DD/MM/YYYY")}</Col>
                </Row>}
            </Col>
            <Row>
                <Col className="mt-4">
                    <hr className="w-100" />
                </Col>
            </Row>
            <Row className="text-center mb-4">
                <Col className="mt-2">
                    ACCIONES
                </Col>
            </Row>
            <Row className="text-center">
                <Col>
                    <Col md="12">
                        {!enviandoNotificacion && !clienteNotificado && <Button color="warning" onClick={notificarAlCliente}>NOTIFICAR AL CLIENTE <i className='ml-3 simple-icon-paper-plane'></i></Button>}
                        {enviandoNotificacion && <Button color="warning" className="d-flex ml-auto mr-auto justify-content-around" style={{ "width": "215px" }}>
                            <div style={{ "flex": "1", "marginLeft": "75px" }}><div class="dot-flashing"></div></div>
                            <i className='ml-3 simple-icon-paper-plane'></i></Button>}
                        {clienteNotificado && <Button color="secondary" style={{ "width": "215px" }}>
                            CLIENTE NOTIFICADO <i className='ml-3 simple-icon-check'></i>
                        </Button>}
                    </Col>
                    <Col md="12">
                        Se enviará un email al cliente con el detalle de equipos controlados y sus estados.
                    </Col>
                </Col>
                <Col>
                    <Col md="12">
                        <WithWizard render={({ push }) => (
                            <Button color="success" onClick={() => { volverAlInicio(push) }}>CARGAR OTRA RUTA <i className='ml-3 simple-icon-cloud-upload'></i></Button>
                        )} />
                    </Col>
                    <Col md="12">
                        Comenzar de cero una nueva carga de ruta.
                    </Col>
                </Col>
                <Col>
                    {cargaMasiva && cargaMasiva.clienteSeleccionado && <Col md="12">
                        <Link to={`/app/clientes/nuevo-informe/${cargaMasiva.clienteSeleccionado.value}/generar-consulta`}><Button color="primary">GENERAR UN INFORME <i className='ml-3 simple-icon-doc'></i></Button></Link>
                    </Col>}
                    <Col md="12">
                        Crear un informe con los datos ingresados.
                    </Col>
                </Col>
            </Row>
            <Row className="text-center mt-4">
                <Col md='12'> Terminé por ahora: </Col>
                <Col md='12'>
                    <Link to="/app/clientes"><Button color="secondary">LISTO <i className='ml-3 simple-icon-check'></i></Button></Link>
                </Col>
            </Row>
        </Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        cargaMasiva: state.cargasMasivasReducer.cargaMasiva,
        cantidadesFinal: state.cargasMasivasReducer.cantidadesFinal
    }
}
export default connect(
    mapStateToProps, {setearCargaMasiva})(Paso3);

