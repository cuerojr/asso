import React, { Fragment } from "react";
import { Card, CardBody, Button, Row, Col } from "reactstrap";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export const ItemListaEquipo = ({ item, mostrarDetalleEquipo }) => {
	let mostrar = true;

	if (item.seccionesSeleccionadas && item.seccionesSeleccionadas.length > 0) {
		const seccionesFiltradas = item.seccionesSeleccionadas.filter(seccion => { return seccion === item.seccion });
		if (seccionesFiltradas.length === 0) {
			mostrar = false;
		}
	}

	if (item.rutasSeleccionadas && item.rutasSeleccionadas.length > 0) {
		const rutasFiltradas = item.rutasSeleccionadas.filter(ruta => { return ruta === item.ruta });
		if (rutasFiltradas.length === 0) {
			mostrar = false;
		}
	}

	if (item.nombreEquipo && item.nombreEquipo.length > 0) {
		var NombreUnsensitive = item.nombre.toLowerCase();
		var nombreEquipoUnsesitive = item.nombreEquipo.toLowerCase();
		if (NombreUnsensitive.search(nombreEquipoUnsesitive) === -1) {
			mostrar = false;
		}
	}

	if (item.estadosSeleccionadas && item.estadosSeleccionadas.length > 0) {
		const estadosFiltrados1 = item.estadosSeleccionadas.filter(estado => { return estado == item.estados["1"].estado });
		const estadosFiltrados2 = item.estadosSeleccionadas.filter(estado => { return estado == item.estados["2"].estado });
		if (estadosFiltrados1.length === 0 && estadosFiltrados2.length === 0) {
			mostrar = false;
		}
	}

	if (item.fallasSeleccionadas && item.fallasSeleccionadas.length > 0) {
		const fallasFiltrados1 = item.fallasSeleccionadas.filter(falla => { return falla == item.estados["1"].fallas });
		const fallasFiltrados2 = item.fallasSeleccionadas.filter(falla => { return falla == item.estados["2"].fallas });
		if (fallasFiltrados1.length == 0 && fallasFiltrados2.length == 0) {
			mostrar = false;
		}
	}

	if (item.fechasSeleccionadas && item.fechasSeleccionadas.length > 0) {
		const fechasFiltradas1 = item.fechasSeleccionadas.filter(fecha => { return fecha == moment(item.estados["1"].fecha).format("YYYY-MM-DD") });
		const fechasFiltradas2 = item.fechasSeleccionadas.filter(fecha => { return fecha == moment(item.estados["2"].fecha).format("YYYY-MM-DD") });
		if (fechasFiltradas1.length == 0 && fechasFiltradas2.length == 0) {
			mostrar = false;
		}
	}

	return (
		<Fragment>
			<div className={mostrar ? "col-md-12 item-equipo" : "d-none"}>
				<Card className="card d-flex mb-3">
					<div className="d-flex flex-grow-1 min-width-zero">
						<CardBody className="align-self-center pt-0">
							<Row>
								<div className="list-item-heading mb-0 mb-1 mt-3 d-flex col-md-6">
									<div className='pt-3 pr-2'><FontAwesomeIcon icon={faCog} className='engranaje-icon' /></div>
									<div style={{ "flex": "0 0 84%" }}>
										<h2><Button color="link" className="pl-0 pb-0 pt-2" onClick={() => { mostrarDetalleEquipo(item) }}>{item.nombre}</Button></h2>
										<p className="mb-0" style={{ "fontSize": "11px" }}>SECCIÓN: {item.seccion}</p>
										<p className="mb-0" style={{ "fontSize": "11px" }}>RUTA: {item.ruta}</p>
									</div>
									<div className="rounded-wrapper" data-tip data-for={'componentes_' + item.id}>{item.componentes}</div>
									<ReactTooltip id={'componentes_' + item.id} place="top" effect="solid" type="info">
										{(()=>{
											if(item.componentes == 0) {
												return <Fragment>No hay componentes en este equipo</Fragment>
											}else if(item.componentes == 1){
												return <Fragment>1 componente en este equipo</Fragment>
											}else{
												return <Fragment>{item.componentes} componentes en este equipo</Fragment>
											}
										})()}
									</ReactTooltip>
								</div>
								<div className="list-item-heading mb-0 mb-1 mt-1 border-left pl-3 d-flex col-md-6 flex-column mt-4" style={{ "minHeight": "100px", "justifyContent": "space-evenly", "fontSize": "11px", "lineHeight": "25px" }}>
									{item.estados["1"].id_estado && <Fragment>
										<Row style={{ "color": "#999", "fontSize": "10px" }}>
											<Col xs='4' className='ml-0 pt-2'>TIPO DE CONTROL:</Col>
											<Col xs='4' className='ml-0 pt-2 pl-0'>FECHA ULT. CONTROL:</Col>
											<Col xs='4' className='ml-0 pt-2 pl-0'>ESTADO:</Col>
										</Row>
										<Row className="mt-2">
											<Col xs='4' style={{ "textTransform": "uppercase" }} className='ml-0'><strong>{item.estados["1"].control}</strong></Col>
											<Col xs='4' className='ml-0 pl-0'>{moment(item.estados["1"].fecha).format("DD/MM/YYYY")}</Col>
											<Col xs='4' className='ml-0 pl-0'>
												<span className='estados-tag pl-2 pr-2 pt-1 pb-1 mr-2' style={{ 'background': item.estados["1"].color }}>{item.estados["1"].estado}</span>
												{item.estados["1"].fallas != "" && <Fragment><div className="rounded-wrapper mt-0" data-tip data-for={'fail_1_' + item.id}><FontAwesomeIcon icon={faExclamationTriangle} /></div>
													<ReactTooltip id={'fail_1_' + item.id} place="top" effect="solid" type="info">
														{item.estados["1"].fallas}
													</ReactTooltip></Fragment>}
											</Col>
										</Row>
										{/*<p className="p-2">FALLAS: {item.estados["1"].fallas}</p>*/}
									</Fragment>}

									{item.estados["2"].id_estado && <Fragment>
										<Row className='position-relative mt-2'>
											<Col xs='4' style={{ "textTransform": "uppercase" }}><strong>{item.estados["2"].control}</strong></Col>
											<Col xs='4' className='pl-0'>{moment(item.estados["2"].fecha).format("DD/MM/YYYY")}</Col>
											<Col xs='4' className='pl-0'>
												<span className='estados-tag pl-2 pr-2 pt-1 pb-1 mr-2' style={{ 'background': item.estados["2"].color }}>{item.estados["2"].estado}</span>
												{item.estados["2"].fallas != "" && <Fragment><p className="rounded-wrapper mt-0" data-tip data-for={'fail_2_' + item.id}><FontAwesomeIcon icon={faExclamationTriangle} /></p>
													<ReactTooltip id={'fail_2_' + item.id} place="top" effect="solid" type="info">
														{item.estados["2"].fallas}
													</ReactTooltip></Fragment>}
											</Col>
										</Row>
										{/*<p className="p-2">FALLAS: {item.estados["2"].fallas}</p>*/}
									</Fragment>}
								</div>
							</Row>
						</CardBody>
					</div>
				</Card>
			</div>
		</Fragment>
	)
}
