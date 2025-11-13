import React, { Fragment, useState } from "react";
import { Row, Button, InputGroup, InputGroupText, Input } from "reactstrap";
import { Tarjeta } from '../../../componentes/tarjeta';
import { fetchAltaCliente, fetchListarClientes } from '../../../reducers/clientes-reducer';
import { NotificationManager } from "../../../components/common/react-notifications";
import { connect } from 'react-redux';
import ClienteCreado from "./cliente-creado";
import { useNavigate } from "react-router-dom";

const AltaCliente = ({ fetchAltaCliente, fetchListarClientes, abrirModal }) => {
    const navigate = useNavigate();

    const [nombreEmpresa, setNombreEmpresa] = useState('');
    const [nombreResponsable, setNombreResponsable] = useState('');
    const [email, setEmail] = useState('');
    const [numero, setNumero] = useState('');
    const [tituloContrato, setTituloContrato] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [mostrarClienteCreado, setMostrarClienteCreado] = useState(false);
    const [idClienteCreado, setIdClienteCreado] = useState(null);

    const guardar = () => {
        fetchAltaCliente(email, nombreEmpresa, nombreResponsable, numero, tituloContrato, descripcion)
            .then((res) => {
                if (res && res.payload && res.payload.stat === 1) {
                    NotificationManager.success("El cliente ha sido guardado", "Hecho", 3000, null, null, '');
                    setIdClienteCreado(res.payload.id);
                    setMostrarClienteCreado(true);
                    fetchListarClientes();
                } else {
                    NotificationManager.error(res.payload.err, "Error", 3000, null, null, '');
                }
            });
    };

    return (
        <Fragment>
            <Row>
                <div className="col-md-12">
                    <h1>Alta Cliente</h1>
                    <div className="text-zero top-right-button-container">
                        {!mostrarClienteCreado && (
                            <Button
                                color="success"
                                size="lg"
                                className="top-right-button"
                                onClick={guardar}
                            >
                                Guardar
                            </Button>
                        )}
                    </div>
                </div>
            </Row>

            {!mostrarClienteCreado && (
                <Row>
                    <div className="col-md-12">
                        <div className="separator mb-5"></div>
                    </div>
                    <div className="col-md-12">
                        <Tarjeta titulo="Datos del cliente">
                            <InputGroup className="mb-3">
                                <InputGroupText>Empresa</InputGroupText>
                                <Input
                                    placeholder="Nombre de la Empresa"
                                    value={nombreEmpresa}
                                    onChange={e => setNombreEmpresa(e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroupText>Responsable</InputGroupText>
                                <Input
                                    placeholder="Nombre de la persona responsable"
                                    value={nombreResponsable}
                                    onChange={e => setNombreResponsable(e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroupText>E-mail</InputGroupText>
                                <Input
                                    placeholder="email@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </InputGroup>
                        </Tarjeta>

                        <div className="mt-2 col-md-12"></div>

                        <Tarjeta titulo="Contrato vigente">
                            <InputGroup className="mb-3">
                                <InputGroupText>Número</InputGroupText>
                                <Input
                                    placeholder="C001890AR"
                                    value={numero}
                                    onChange={e => setNumero(e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroupText>Título</InputGroupText>
                                <Input
                                    placeholder="Título del contrato"
                                    value={tituloContrato}
                                    onChange={e => setTituloContrato(e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroupText>Descripción</InputGroupText>
                                <Input
                                    placeholder="Breve descripción del Contrato"
                                    value={descripcion}
                                    onChange={e => setDescripcion(e.target.value)}
                                />
                            </InputGroup>
                        </Tarjeta>
                    </div>
                </Row>
            )}

            {mostrarClienteCreado && (
                <ClienteCreado
                    idCliente={idClienteCreado}
                    abrirModal={abrirModal}
                />
            )}
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    guardado: state.clientesReducer.guardado,
});

export default connect(
    mapStateToProps,
    { fetchAltaCliente, fetchListarClientes }
)(AltaCliente);
