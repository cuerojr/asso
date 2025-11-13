import React, { Fragment } from "react";
import { Card, CardBody, Button } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

export const ItemListaFalla = ({ item, seleccionarFalla, deleteFalla }) => {

	return (
		<Fragment>
			<div className="col-md-12 fallas" id={'estado-'+item.id}>
				<Card className="card d-flex mb-3">
					<div className="d-flex flex-grow-1 min-width-zero">
						<CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
							<p className="list-item-heading mb-0 truncate w-90 w-xs-60 mb-1 mt-1 d-flex align-items-center">
								<FontAwesomeIcon icon={faSquare} style={{'color':item.color}} className="mr-2 " />
								<Button color="link" className="pl-0" onClick={()=>{seleccionarFalla(item)}}>{item.nombre}</Button>
							</p>
							<div className="d-flex align-items-center">
								<Button color="link" onClick={() => { deleteFalla(item.id); }}><i className="simple-icon-trash h5" /></Button>
								<div className="handlebt border-left fecha pl-4">
									<div className="simple-icon-arrow-up" />
									<div className="simple-icon-arrow-down" />
								</div>
							</div>
						</CardBody>
					</div>
				</Card>
			</div>
		</Fragment>
	)
}
