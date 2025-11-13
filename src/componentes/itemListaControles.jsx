import React, { Fragment } from "react";
import { Card, CardBody, Button } from "reactstrap";
import moment from "moment";

export const ItemListaControles = ({ item, editarControlSeleccionado }) => {

	return (
		<Fragment>
			<div className="col-md-12">
				<Card className="card d-flex mb-3">
					<div className="d-flex flex-grow-1 min-width-zero">
						<CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
							<p className="list-item-heading mb-0 truncate w-50 w-xs-60 mb-1 mt-1">
								<i className="simple-icon-target mr-2" ></i>
								<Button color="link" className="pl-0" onClick={()=>{editarControlSeleccionado(item)}}>CONTROL: {item.nombre}</Button>
								
							</p>
                            <div className="list-item-heading mb-0 truncate w-30 d-flex align-items-center justify-content-end" style={{"height":"50px", "lineHeight":"50px"}}>
								<div className="border-right fecha pr-2 mr-2">Fecha: {moment(item.fecha).format("DD/MM/YYYY")}</div>
								Estado: <span className='estados-tag pl-2 pr-2 ml-2 p-1' style={{'background':item.color_estado}}>{item.estado}</span>
							</div>
                        </CardBody>
					</div>
				</Card>
			</div>
		</Fragment>
	)
} 
