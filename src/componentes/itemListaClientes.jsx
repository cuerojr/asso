import React from "react";
import { Card, CardBody, Button, CardTitle } from "reactstrap";
import { useNavigate } from "react-router-dom";

export const ItemListaCliente = ({ item }) => {
  const navigate = useNavigate();

  const irAeditar = (currentTab) => {
    // Mantener clase si es necesario
    document.querySelector("#app-container")?.classList.add("sub-hidden");

    // Ruta absoluta para evitar problemas con rutas relativas
    navigate(`/app/clientes/editar-cliente/${item.id}/${currentTab}`, {
      state: { currentTab, cliente: item },
    });
  };

  return (
    <div className="col-md-6 mb-3">
      <Card>
        <CardBody>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <CardTitle tag="h3" className="d-flex justify-content-between mb-0">
                <Button
                  className="p-0"
                  color="link"
                  onClick={() => irAeditar("equipos")}
                >
                  <i className="simple-icon-user h4 mr-2" />
                  <h3 className="">{item.empresa}</h3>
                </Button>
              <Button
                className="p-0"
                color="link"
                onClick={() => irAeditar("info")}
              >
                <i className="iconsminds-gear" />
              </Button>
            </CardTitle>

            <div className="">
              {item.habilitado === "1" ? (
                <span className="estados-tag bg-success p-2">HABILITADO</span>
              ) : (
                <span className="estados-tag bg-secondary p-2">
                  DESHABILITADO
                </span>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-6">
                  <Button
                    className="p-0 mb-2"
                    color="link"
                    onClick={() => irAeditar("equipos")}
                  >
                    {item.equipos} Equipos
                  </Button>
                </div>
                <div className="col-md-6">
                  <Button
                    className="p-0 mb-2"
                    color="link"
                    onClick={() => irAeditar("secciones")}
                  >
                    {item.secciones} Secciones
                  </Button>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Button
                    className="p-0 mb-2"
                    color="link"
                    onClick={() => irAeditar("informes")}
                  >
                    {item.informes} Informes
                  </Button>
                </div>
                <div className="col-md-6">
                  <Button
                    className="p-0 mb-2"
                    color="link"
                    onClick={() => irAeditar("rutas")}
                  >
                    {item.rutas} Rutas
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
