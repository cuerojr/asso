import React, { Fragment } from 'react';
import { Button, ModalBody, ModalFooter } from "reactstrap";

export const NotificacionEnviada = (props) => {
    return (
        <Fragment>
            <ModalBody>
                <div className="row">
                    <div className="col-12">
                        <h4>Se ha enviado el mensaje al cliente {props.cliente.empresa}</h4>
                    </div>

                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="success" onClick={props.volver}>Enviar otra novedad</Button>
                <Button color="primary" onClick={props.finalizar}>Finalizar</Button>
            </ModalFooter>
        </Fragment>
    );
};

