import React, { Fragment, useEffect, useState } from 'react';
import { fetchDetalleCliente } from '../../../reducers/clientes-reducer';
import { connect } from 'react-redux';
import Row from 'reactstrap/lib/Row';
import { Tarjeta } from '../../../componentes/tarjeta';
import Button from 'reactstrap/lib/Button';
import { notificarCliente } from '../../../lib/clientes-api';
import { NotificationManager } from "../../../components/common/react-notifications";
import { useNavigate } from 'react-router-dom';

const ClienteCreado = ({ idCliente, detalleClienteState, fetchDetalleCliente, abrirModal }) => {
    const [clienteNotificado, setClienteNotificado] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDetalleCliente(idCliente);
    }, [idCliente, fetchDetalleCliente]);

    const gestionarSecciones = () => {
        if (!detalleClienteState) return;
        navigate(`/app/clientes/editar-cliente/86/secciones/editar-cliente/${detalleClienteState.id}/secciones`, {
            state: { currentTab: 'secciones', cliente: detalleClienteState }
        });
    };

    const listo = () => {
        navigate('/app/clientes/lista-clientes');
    };

    const notificarClienteHandler = () => {
        notificarCliente(idCliente).then((res) => {
            if (res && res.stat === 1) {
                NotificationManager.success("El cliente ha sido notificado", "Hecho", 3000, null, null, '');
                setClienteNotificado(true);
            } else {
                NotificationManager.error(res.err, "Error", 3000, null, null, '');
            }
        });
    };

    return (
        <Fragment>
            {detalleClienteState && (
                <Row>
                    <div className="col-md-6">
                        <Tarjeta>
                            <h3>EMPRESA:</h3>
                            <p>{detalleClienteState.empresa}</p>
                            <h3 className="mt-2">RESPONSABLE:</h3>
                            <p>{detalleClienteState.responsable}</p>
                            <h3 className="mt-2">EMAIL:</h3>
                            <p>{detalleClienteState.email}</p>
                            <h2 className="mt-3 mb-3">CONTRATO VIGENTE:</h2>
                            <h3 className="mt-2">NRO. DE CONTRATO:</h3>
                            <p>{detalleClienteState.contrato_vigente_nro}</p>
                            <h3 className="mt-2">TÍTULO DEL CONTRATO:</h3>
                            <p>{detalleClienteState.titulo}</p>
                            <h3 className="mt-2">DESCRIPCIÓN DEL CONTRATO:</h3>
                            <p>{detalleClienteState.descripcion}</p>
                        </Tarjeta>
                    </div>

                    <div className="col-md-6 text-center">
                        <Tarjeta>
                            <h2 className="mt-2 mb-3">ACCIONES:</h2>

                            <div className="mb-4">
                                <p>Enviar vía email al cliente con el nombre de usuario y contraseña:</p>
                                {clienteNotificado ? (
                                    <Button color="warning" size="lg" style={{ width: "300px" }} disabled>
                                        <i className="iconsminds-mail-send" /> CLIENTE NOTIFICADO
                                    </Button>
                                ) : (
                                    <Button color="warning" size="lg" style={{ width: "300px" }} onClick={notificarClienteHandler}>
                                        <i className="iconsminds-mail-send" /> NOTIFICAR AL CLIENTE
                                    </Button>
                                )}
                            </div>

                            <div className="mb-4 mt-4">
                                <p>Comenzar a gestionar las secciones del cliente:</p>
                                <Button color="primary" size="lg" style={{ width: "300px" }} onClick={gestionarSecciones}>
                                    <i className="iconsminds-folder-add--" /> GESTIONAR SECCIONES
                                </Button>
                            </div>

                            <div className="mb-4 mt-4">
                                <p>Cargar un nuevo informe en la sección predeterminada:</p>
                                <Button color="primary" size="lg" style={{ width: "300px" }} onClick={abrirModal}>
                                    <i className="simple-icon-cloud-upload" /> CARGAR UN INFORME
                                </Button>
                            </div>

                            <div className="mt-4 mb-3">
                                <p>Terminé por ahora:</p>
                                <Button color="secondary" outline size="lg" style={{ width: "300px" }} onClick={listo}>
                                    <i className="simple-icon-check" /> LISTO
                                </Button>
                            </div>
                        </Tarjeta>
                    </div>
                </Row>
            )}
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    detalleClienteState: state.clientesReducer.detalleClienteState
});

export default connect(
    mapStateToProps,
    { fetchDetalleCliente }
)(ClienteCreado);
