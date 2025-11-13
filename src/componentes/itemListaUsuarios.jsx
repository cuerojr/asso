import React from "react";
import { Card, CardBody, Button} from "reactstrap";

export const ItemListaUsuario = ({item, deleteUsuario, mostrarDetalleUsuario}) =>{

	return(
			<Card className="card d-flex mb-3">
				<div className="d-flex flex-grow-1 min-width-zero">
				  <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
				  	<div className="list-item-heading mb-0 truncate w-60 w-xs-100 mb-1 mt-1">
					  	<Button color="link" onClick={() => {mostrarDetalleUsuario(item)}}>{item.nombre}</Button>
						{item.perfil === 'a' && <p className="pl-4">Admin</p>}
						{item.perfil === 'u' && <p className="pl-4">Editor</p>}
					  </div>
				  	<p className="mb-0 truncate w-10 w-xs-100 mb-1 mt-1">
                          <Button color="link" onClick={() => {deleteUsuario(item.id)}}><i className="simple-icon-trash" /></Button>
                      </p>
				  </CardBody>
				</div>
			</Card>
		)
}
