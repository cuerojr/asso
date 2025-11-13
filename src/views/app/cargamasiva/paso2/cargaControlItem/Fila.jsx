import React from 'react';
import { Row, Col } from 'reactstrap';

const Fila = ({ clases, children }) => (
    <Row className={clases}>
        <Col>
            {children}
        </Col>
    </Row>
);

export default Fila;