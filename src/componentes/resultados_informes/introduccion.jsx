import React, { useEffect, Fragment, useState } from 'react';
import { Row,  Col } from "reactstrap";
import { MiniTarjeta } from './miniTarjeta';

const Introduccion = (props) => {
    
    return (
        <Fragment>
            <MiniTarjeta classes='pt-4'>
            <Row>
                <div style={{ "overflowX": "hidden" }} className="col-12 contenido-introduccion" dangerouslySetInnerHTML={{ __html: props.contenidoHTML }} />
            </Row>
            </MiniTarjeta>
        </Fragment>
    );
};

export default Introduccion;