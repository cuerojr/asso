import React, { Fragment, useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Input } from "reactstrap";
import { mostrarOcultarModalCompartir } from '../../reducers/informes-reducer';
import { modificacionPublicShare, enviarInformePorEmail } from '../../lib/informe-online-api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faLink, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import { NotificationManager } from "../../components/common/react-notifications";



const CompartirModal = (props) => {

    const [habilitacionCompartir, setHabilitarCompartir] = useState(false);
    const [linkPublico, setLinkPublico] = useState('');
    const [mostrarMensajeCopiado, setMostrarMensajeCopiado] = useState(false);
    const [mailTemporal, setMailTemporal] = useState("");
    const [mailsAEnviar, setMailAEnviar] = useState([]);
    const [mailEnviado, setMailEnviado] = useState(false);

    const urlPrincipal = "https://clientes.assoconsultores.ar/informe/";
    const enviar = () => {
        enviarInformePorEmail(props.idInforme, props.idEmpresa, JSON.stringify(mailsAEnviar)).then((res) => {
            if (res.stat === 1) {
                setMailEnviado(true);
                setMailAEnviar([]);
                NotificationManager.success("El informe ha sido compartido", "Hecho", 3000, null, null, '');
            } else {
                NotificationManager.error(res.err, "Error", 3000, null, null, '');
            }
        })
    }

    const obtenerLink = (bool) => {
        if (bool) {
            modificacionPublicShare(props.idInforme, props.idEmpresa, 1).then((res) => {
                if (res.stat === 1) {
                    setLinkPublico(`h${urlPrincipal}#${res.h}`)
                }
            })

        } else {
            modificacionPublicShare(props.idInforme, props.idEmpresa, 0).then((res) => {
                setLinkPublico("")
            })

        }
    }

    const copiarTexto = () => {
        navigator.clipboard.writeText(linkPublico)
        setMostrarMensajeCopiado(true)
        setTimeout(() => { setMostrarMensajeCopiado(false) }, 3000)
    }

    const _handleKeyDown = (e) => {
        if (e.key == " " ||  e.code == "Space" || e.keyCode == 32){
            setMailAEnviar(current => [...current, mailTemporal])
            setMailTemporal('')
        }
    }

    const quitarMailDeLaLista = (mail) => {
        setMailAEnviar(mailsAEnviar.filter(item => item !== mail))
    }

    useEffect(() => {
        if (props.hps) {
            setLinkPublico(`${urlPrincipal}#${props.hps}`)
            setHabilitarCompartir(true);
        }
    }, [props.hps])

    return (
        <Fragment>
            <Modal isOpen={props.modalCompartirInforme} size="lg" wrapClassName="modal-compartir" >
                <ModalHeader toggle={() => { props.mostrarOcultarModalCompartir(false) }}>Compartir "{props.titulo}"</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col className='d-flex justify-content-between habilitar-wrapper'>
                            <p>
                                <strong>Habilitar link de acceso general.</strong><br />
                                Cualquier persona con el enlace tendrá acceso a este informe.
                            </p>

                            <Switch
                                className="custom-switch custom-switch-primary-inverse"
                                checked={habilitacionCompartir}
                                onChange={switchCheckedPrimaryInverse => {
                                    setHabilitarCompartir(switchCheckedPrimaryInverse);
                                    obtenerLink(switchCheckedPrimaryInverse)
                                }}
                            />
                        </Col>
                    </Row>
                    {linkPublico !== '' && <Fragment>
                        <Row>
                            <Col className="link-publico-wrapper mt-3">
                                {linkPublico}
                            </Col>
                        </Row>
                        <Row>
                            <Col className="d-flex justify-content-end mt-3 pr-0">
                                {mostrarMensajeCopiado && <p className={mostrarMensajeCopiado ? 'text-success mr-3 mt-3 fade-out' : 'text-success mr-3 mt-3'}>¡Enlace copiado!</p>}
                                <Button color="light" onClick={copiarTexto}><FontAwesomeIcon icon={faLink} /> COPIAR LINK </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='p-0'>
                                <hr />
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col className="p-0">
                                <p>
                                    <strong>Enviar enlace por email:</strong><br />
                                    Se enviará un email con el link a ver el informe. Puede agregar más de una dirección.
                                </p>
                                <Input value={mailTemporal} className="form-title" onChange={e => setMailTemporal(e.target.value)} onKeyDown={_handleKeyDown} />
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col className="d-flex justify-content-start p-0">
                                {mailsAEnviar && mailsAEnviar.map((direccion) => {
                                    return (<div className='border border-dark mr-2 mb-2 p-2'>{direccion} <FontAwesomeIcon icon={faXmark} className="ml-4" onClick={() => { quitarMailDeLaLista(direccion) }} /></div>)
                                })}
                            </Col>
                        </Row>
                    </Fragment>}
                </ModalBody>
                {linkPublico !== '' && <ModalFooter>
                    {!mailEnviado && <Button color="primary" onClick={enviar} disabled={mailsAEnviar.length === 0 || linkPublico === ''}>
                        ENVIAR <FontAwesomeIcon icon={faPaperPlane} className="ml-3" />
                    </Button>}
                    {mailEnviado && <Button color="success" disabled>
                        ENVIADO <FontAwesomeIcon icon={faPaperPlane} className="ml-3" />
                    </Button>}
                </ModalFooter>}

            </Modal>
        </Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        modalCompartirInforme: state.informesReducer.modalCompartirInforme,
    }
}
export default connect(
    mapStateToProps,
    { mostrarOcultarModalCompartir }
)(CompartirModal);
