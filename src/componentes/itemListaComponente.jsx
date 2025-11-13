import React, { Fragment } from "react";
import { Card, CardBody, Button } from "reactstrap";
import moment from "moment";


export const ItemListaComponente = ({ item, mostrarDetalleComponente }) => {
	
	return (
		<Fragment>
			<div className="col-md-12">
				<Card className="card d-flex mb-3">
					<div className="d-flex flex-grow-1 min-width-zero">
						<CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
							<p className="list-item-heading mb-0 truncate w-40 w-xs-50 mb-1 mt-1">
								<i className="simple-icon-puzzle mr-2" />
								<Button color="link" className="pl-0" onClick={() => { mostrarDetalleComponente(item) }}>{item.nombre}</Button>
								{item.baja_rpm === '1' && <span style={{color:'#8a8a8a', fontSize:'12px', borderLeft: '1px solid', paddingLeft: '10px'}}>Baja RPM</span>}
							</p>
							{item.estados["1"].estado && <div className="list-item-heading mb-0 truncate w-30 w-xs-60 mb-1 mt-1">
								<p className="mb-0">{item.estados["1"].nombrecontrol}</p>
								<p>{moment(item.estados["1"].fecha).format('DD/MM/YYYY')} <span className='estados-tag pl-2 pr-2 ml-2' style={{ 'background': item.estados["1"].color }}>{item.estados["1"].estado}</span>
								</p>
							</div>}
							{item.estados["2"].estado && <div className="list-item-heading mb-0 truncate w-30 w-xs-60 mb-1 mt-1">
								<p className="mb-0">{item.estados["2"].nombrecontrol}</p>
								 <p>{moment(item.estados["2"].fecha).format('DD/MM/YYYY')}
									<span className='estados-tag pl-2 pr-2 ml-2' style={{ 'background': item.estados["2"].color }}>{item.estados["2"].estado}</span>
								</p>
							</div>}
						</CardBody>
					</div>
				</Card>
			</div>
		</Fragment>
	)
}
