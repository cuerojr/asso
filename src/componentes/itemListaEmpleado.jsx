import React,{Fragment} from 'react';
import { Card, CardBody, Col, Row } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser} from '@fortawesome/free-solid-svg-icons';

const itemListaEmpleado = ({item}) => {
    return (
		<Fragment>
			<div className="col-md-12 estados" id={'empleado-'+item.id}>
				<Card className="card d-flex mb-3">
					<div className="d-flex flex-grow-1 min-width-zero">
						<CardBody className="d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-start p-4 mt-2">
							<div>
                                <FontAwesomeIcon icon={faUser} size="2x" />
                            </div>
                            <Col style={{flexGrow: 1}}>
                                <Row>
								    <Col sm='12' className='d-flex justify-content-start flex-row mb-1'>
                                            <div>{item.nombre}<span className='ml-2 mr-2 text-muted'>|</span></div><div className='text-muted'>{item.email}</div>
                                    </Col>
                                 </Row>
                                 <Row>
                                    <Col sm='12' className='d-flex justify-content-start flex-column text-muted'>
                                        <div>
                                            {item.empleado_informes === '1' && <span> Informes |</span>}
                                            {item.empleado_mensajes === '1' && <span> Mensajes |</span>}
                                            {item.empleado_notificaciones === '1' && <span> Notificaciones |</span>}
                                        </div>
                                        {item.secciones.length > 0 && <div>
                                            <span> Secciones: </span>
                                            {item.secciones.map((seccion, index)=>{
                                                return <span key={index}>{seccion.nombre} {index < item.secciones.length-1 && <> - </>} </span>
                                            })}
                                        </div>}
                                    </Col>
                                 </Row>
                          	</Col>
                     	</CardBody>
					</div>
				</Card>
			</div>
		</Fragment>
	)
};

export default itemListaEmpleado;