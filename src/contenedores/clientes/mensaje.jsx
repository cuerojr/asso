import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEnvelopeOpen, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Notificaciones from '../../componentes/notificaciones';
import Lightbox from 'react-image-lightbox';

const Mensaje = ({ novedad, setMostrarNovedad }) => {
    const [lightBoxAbierto, setlightBoxAbierto] = useState(false);

    return (
        <>
            <Row>
                <Col>
                    <Button color="link" className="pl-0 pr-1 pt-2" onClick={() => { setMostrarNovedad(null) }}> Mensajes &gt;</Button> {novedad.asunto}
                    <div className="text-zero top-right-button-container pb-2">
                        <Notificaciones mostrarBt={true} />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col><div className="separator mb-5"></div></Col>
            </Row>
            <Card>
                <CardBody>
                    <div className='d-flex mb-4'>
                        <div><FontAwesomeIcon icon={novedad.visitado === "1" ? faEnvelopeOpen : faEnvelope} className="mr-2" style={{ "fontSize": "2em" }} /></div>
                        <div className='d-flex flex-column ml-2'>
                            <h1 className='mb-0 pb-0'>{novedad.asunto}</h1>
                            {novedad.usuario_origen && <>Por: {novedad.usuario_origen}</>}
                        </div>
                    </div>
                    <Row>
                        <Col className='ml-4'><div dangerouslySetInnerHTML={{ __html: novedad.texto }} className='mb-3' /></Col>
                    </Row>
                    <Row>
                        <Col className="text-right mt-2"><Link to={{ pathname: novedad.link }}>{novedad.link && <Button> Ver informe</Button>}</Link></Col>
                    </Row>
                    {novedad.img && <>
                        <Row>
                            <Col><div className="separator mb-5"></div></Col>
                        </Row>
                        <Row>
                            <Col className='ml-4 mb-3'><FontAwesomeIcon icon={faPaperclip} /> Adjuntos: </Col>
                        </Row>
                        <Row>
                            <Col className='ml-4'><img src={novedad.thumb} className='img-fluid mb-4' alt={novedad.asunto} onClick={() => { setlightBoxAbierto(true) }} style={{ 'cursor': 'pointer' }} /></Col>
                        </Row>
                        {lightBoxAbierto && <Lightbox mainSrc={novedad.img} onCloseRequest={() => { setlightBoxAbierto(false) }} />}
                    </>}
                </CardBody>
            </Card>

        </>
    );
};

export default Mensaje;