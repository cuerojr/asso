import React, { Fragment} from "react";
import { Card, CardBody } from "reactstrap";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faEnvelopeOpen, faPaperclip, faTrashAlt} from '@fortawesome/free-solid-svg-icons';

export const ItemListaNovedades = ({ item, setMostrarNovedad, seleccionarNovedadYpreguntar }) => {

	return (
		<Fragment>
			<div className="col-md-12 novedad">
				<Card className="card d-flex mb-3">
					<div className="d-flex flex-grow-1 min-width-zero">
						<CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
							<div className="list-item-heading mb-0 truncate w-90 w-xs-60 mb-1 mt-1 d-flex">
								<div>
									<FontAwesomeIcon icon={item.visitado === "1" ? faEnvelopeOpen : faEnvelope } className="mr-2"/>
									{item.img !== "" && <FontAwesomeIcon icon={faPaperclip} className="mr-2" />}
								</div>
								<div>
									<h5 className="d-inline" style={{'cursor':'pointer'}} onClick={()=>{setMostrarNovedad(item.id)}}>{item.asunto}</h5>
									{item.usuario_origen && <p className="mt-2">Por: {item.usuario_origen}</p>}
								</div>
							</div>
							<div className="d-flex align-items-end flex-column">
								<p>{moment(item.fecha).format("DD/MM/YYYY")}</p>
								<p><FontAwesomeIcon icon={faTrashAlt} className="mr-2" onClick={()=>{seleccionarNovedadYpreguntar(item.id)}} /></p>
							</div>
						</CardBody>
					</div>
				</Card>
			</div>
		</Fragment>
	)
}
