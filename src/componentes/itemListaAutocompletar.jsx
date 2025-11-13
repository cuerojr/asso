import React, { useState } from 'react';
import { Card, CardBody, Button, Modal, ModalBody, ModalFooter, Col, Input, Row } from "reactstrap";
import { bajaAutocompletar, updateAutocompletar } from '../lib/autocompletar-api';
import { connect } from 'react-redux';
import { fetchListarObservaciones, fetchListarRecomendaciones } from '../reducers/autocompletar-reducer';


const ItemListaAutocompletar = ({ item, fetchListarObservaciones, fetchListarRecomendaciones, tipo }) => {
    const [confirmDel, setconfirmDel] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [nombreCorto, setNombreCorto] = useState(item.nombre_corto);
    const [texto, setTexto] = useState(item.texto);


    const deleteItem = () => {
        bajaAutocompletar(item.id).then((res) => {
            if (res.stat === 1) {
                setconfirmDel(false);
                if (tipo === 'observacion') {
                    fetchListarObservaciones();
                } else {
                    fetchListarRecomendaciones();
                }
            }
        })
    }

    const updateItem = () => {
        updateAutocompletar(item.id,nombreCorto, texto).then((res)=>{
            if (res.stat === 1) {
                if (tipo === 'observacion') {
                    fetchListarObservaciones();
                } else {
                    fetchListarRecomendaciones();
                }
            }
        })
    }

    return (<>
        <Col id={`auto_item_${item.id}`} className='item-autocompletar'>
            <Card className="card d-flex mb-3">
                <div className="d-flex flex-grow-1 min-width-zero">
                    <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center pl-5 pt-4 pr-0 pb-0">
                        <div className="list-item-heading mb-0 truncate w-90 w-xs-100 mb-1 mt-1">
                            {modoEdicion ?
                                <Row className='mb-2'>
                                    <Col md={9} className='pr-0'>
                                        <Input className='mb-2 p-2' type='text' value={nombreCorto} style={{'fontSize':'1.1rem'}} onChange={(evt) => { setNombreCorto(evt.target.value) }}></Input>
                                        <Input className='p-2' type='text' value={texto} onChange={(evt) => { setTexto(evt.target.value) }}></Input>
                                    </Col>
                                    <Col md={3} className='d-flex align-items-end justify-content-start'>
                                        <Button size='sm' color='success' onClick={updateItem}>Guardar</Button>
                                        <Button size='sm' className='ml-2' color='danger' onClick={()=>{setModoEdicion(false)}}>Cancelar</Button>
                                    </Col>
                                </Row>
                                : <>
                                    <h5 className='mb-2 p-2' onClick={()=>{setModoEdicion(true)}}>{nombreCorto}</h5>
                                    <p className='p-2' onClick={()=>{setModoEdicion(true)}}>{texto}</p>
                                </>
                            }
                        </div>
                        <div className="mb-1 text-small w-10 d-flex w-xs-100">
                            <Button color="link" onClick={() => { setconfirmDel(true) }}><i className="simple-icon-trash" /></Button>
                            <div className="handlebt pt-2">
                                <div className="simple-icon-arrow-up" />
                                <div className="simple-icon-arrow-down" />
                            </div>
                        </div>

                    </CardBody>
                </div>
            </Card>
        </Col>
        <Modal isOpen={confirmDel} size="lg" >
            <ModalBody>
                <h5 className='mb-4'>¿Está seguro que quiere borrar este ítem? {item.nombre_corto}</h5>
                <ModalFooter>
                    <Button className="neutro" onClick={() => { setconfirmDel(false) }}>
                        Cancelar
                    </Button>
                    <Button color="danger" onClick={deleteItem}>
                        Si, borrar
                    </Button>
                </ModalFooter>
            </ModalBody>
        </Modal>
    </>
    );
};

export default connect(
    null,
    { fetchListarObservaciones, fetchListarRecomendaciones }
)(ItemListaAutocompletar);
