import React,{useState, Fragment} from 'react';
import { Row, Button} from "reactstrap";
import  DetalleInforme  from "./detalleInforme";

export const DetalleInformeCargado = ({informe, nombreArchivo, cerrarModal, setMostrarDetalle, actualizarInforme}) => {
    const [edicionInforme, setEdicionInforme] = useState(0);

    const editarInforme = () => {
        setEdicionInforme(1)
    }

    const ocultarDetalle = () => {
        setEdicionInforme(0)
        actualizarInforme(informe.id_empresa, informe.id)
    }

    return (
        <Fragment>
        {edicionInforme === 0 && <Row>
            <div className="col-md-12 text-center mb-4">
                <h2>NUEVO INFORME CARGADO:</h2>
                <h3>{nombreArchivo}</h3>
            </div>
            <div className="col-md-6">
                <p><strong>TÍTULO:</strong> {informe.titulo}</p>
                <p><strong>DESCRIPCIÓN:</strong><br />
                {informe.descripcion}</p>
                <p><strong>SECCIÓN:</strong> {informe.seccion}</p>
                <p><strong>SERVICIO:</strong> {informe.servicio}</p>
                <p><strong>FECHA:</strong> {informe.fecha}</p>
            </div>
            <div className="col-md-6">
            <Button color="warning" size="lg" className="mb-4" onClick={editarInforme} style={{"width":"100%"}}> 
                <i className="simple-icon-pencil"></i> EDITAR
            </Button>
            <Button color="primary" size="lg" className="mb-4" onClick={() => {setMostrarDetalle(0)}} style={{"width":"100%"}}> 
                <i className="glyph-icon simple-icon-cloud-upload"></i> CARGAR OTRO
            </Button>
            <Button color="secondary" size="lg" className="mb-4" onClick={cerrarModal} style={{"width":"100%"}}> 
                <i className="simple-icon-check"></i> FINALIZAR
            </Button>
            </div>
        </Row>}
        {edicionInforme === 1 && <Row>
            <DetalleInforme detalleInforme={informe} ocultarDetalle={ocultarDetalle}  />
        </Row>}
        </Fragment>
    );
};