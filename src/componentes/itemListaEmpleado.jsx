import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardBody, Col, Row, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const itemListaEmpleado = ({ item, cliente }) => {
  
  const navigate = useNavigate();
  return (
    <Fragment>
      <div className="col-md-12 estados" id={"empleado-" + item.id}>
        <Card className="card d-flex mb-3">
          <div className="d-flex flex-grow-1 min-width-zero">
            <CardBody className="d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-start p-4 mt-2">
              <div>
                <FontAwesomeIcon icon={faUser} size="2x" />
              </div>
              <Col style={{ flexGrow: 1 }}>
                <Row className="mb-2">
                  <Col
                    sm="8"
                    className="d-flex justify-content-start flex-row mb-1 align-items-center"
                  >
                    <div>
                      <Button
                        onClick={() =>
                          navigate(
                            `/app/clientes/editar-empleado/${cliente}/empleado/${item.id}`,
                          )
                        }
                        color="link"
                        className="p-0 m-0"
                      >
                        <h3 className="mb-0 font-weight-bold">{item.nombre}</h3>
                      </Button>
                    </div>
                    <span className="ml-2 mr-2">-</span>
                    <p className="mb-0">{item.email}</p>
                  </Col>
                  <Col
                    sm="4"
                    className="d-flex justify-content-end flex-row mb-1 align-items-center"
                  >
                    <Button
                      color="primary"
                      className="mr-2"
                      onClick={() => {
                        // Aquí puedes agregar la lógica para editar el empleado
                        console.log(
                          `Editar empleado con ID: ${JSON.stringify(item)}`,
                        );
                        navigate(
                          `/app/clientes/editar-empleado/${cliente}/empleado/${item.id}`,
                        );
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      color="danger"
                      className="d-none"
                      onClick={() => {
                        // Aquí puedes agregar la lógica para eliminar el empleado
                        console.log(`Eliminar empleado con ID: ${item.id}`);
                      }}
                    >
                      Borrar
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col
                    sm="12"
                    className="d-flex justify-content-start flex-column"
                  >
                    <div className="d-flex justify-content-start flex-row">
                      {item.empleado_informes === "1" && <p> Informes |</p>}
                      {item.empleado_mensajes === "1" && (
                        <p className="ml-2"> Mensajes |</p>
                      )}
                      {item.empleado_notificaciones === "1" && (
                        <p className="ml-2"> Notificaciones |</p>
                      )}
                    </div>
                    {item.secciones.length > 0 && (
                      <div>
                        <h4 className="mb-2 font-weight-semibold">
                          {" "}
                          Secciones:{" "}
                        </h4>
                        <div className="ml-2">
                          {item.secciones.map((seccion, index) => {
                            return (
                              <span key={index}>
                                {seccion.nombre}{" "}
                                {index < item.secciones.length - 1 && (
                                  <> - </>
                                )}{" "}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              </Col>
            </CardBody>
          </div>
        </Card>
      </div>
    </Fragment>
  );
};

export default itemListaEmpleado;
