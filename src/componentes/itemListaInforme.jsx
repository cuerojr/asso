import React, { Fragment } from "react";
import { Card, CardBody, Button, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCode, faFileDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const ItemListaInforme = ({ item, verDetalleInforme, deleteInforme }) => {
  const navigate = useNavigate();
  let mostrar = true;

  if (item.seccionesSeleccionadas && item.seccionesSeleccionadas.length > 0) {
    const seccionesArray = item.seccion.split(",");
    const seccionesFiltradas = item.seccionesSeleccionadas.filter((element) =>
      seccionesArray.includes(element)
    );
    if (seccionesFiltradas.length === 0) {
      mostrar = false;
    }
  }

  if (item.serviciosSeleccionados && item.serviciosSeleccionados.length > 0) {
    const serviciosFiltrados = item.serviciosSeleccionados.filter(
      (servicio) => servicio === item.servicio
    );
    if (serviciosFiltrados.length === 0) {
      mostrar = false;
    }
  }

  const accederAlInforme = (e, idEmpresa, id) => {
    if (item.tipo === 0) {
      verDetalleInforme(e, idEmpresa, id);
    } else {
      navigate(`/informe-generado/${idEmpresa}/${id}`);
    }
  };

  return (
    <Fragment>
      <div className={mostrar ? "col-md-12 item-informe" : "d-none"}>
        <Card className="card d-flex mb-3">
          <div className="d-flex flex-grow-1 min-width-zero">
            <CardBody className="">
              <Row>
                <Col xs="12" className="d-flex mb-4" md="12">
                  <div className="pr-3 pt-2">
                    {item.tipo === 0 ? (
                      <FontAwesomeIcon icon={faFileDownload} size="2x" />
                    ) : (
                      <FontAwesomeIcon icon={faFileCode} size="2x" />
                    )}
                  </div>
                  <div className="pt-1">
                    <Button
                      color="link"
                      onClick={(e) => accederAlInforme(e, item.id_empresa, item.id)}
                      className="p-0 text-left"
                    >
                      <span className="h4">{item.titulo}</span>
                    </Button>
                    <p className="mb-0">
                      <span className="opacity-50">Tipo: </span> {item.tipo === 0 ? "Archivo" : "Online"}
                    </p>
                    <p>
                      <span className="opacity-50">{item.tipo === 0 ? "Subido por:" : "Generado por:"} </span>
                      {item.usuario_origen}
                    </p>
                  </div>
                </Col>
                <Col xs="6" md="3" className="mb-4"><span className="opacity-50">FECHA:</span> <br/> {item.fecha}</Col>
                <Col xs="6" md="3" className="mb-4">
                  <span className="opacity-50">TIPO:</span> <br/> {item.servicio}
                </Col>
                <Col xs="12" md="6" className="mb-4">
                  <span className="opacity-50">SECCIONES:</span> <br/> {item.seccion}
                </Col>
                <Col xs="12" className="mb-4 d-flex align-items-center justify-content-end">
                  <Button
                    color="danger"
                    onClick={() => deleteInforme(item.id)}                    
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </div>
        </Card>
      </div>
    </Fragment>
  );
};
