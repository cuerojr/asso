import React from "react";
import { Card, CardBody, Button, CardTitle } from "reactstrap";
import moment from "moment";
import { WithWizard } from "react-albus";

export const ItemListaCargaMasivaNoFinalizada = ({
  item,
  habDeshab,
  confirmCargaMasiva,
  seleccionarCargaMasivaInciada,
}) => {
  return (
    <div className="col-md-12 mb-3">
      <Card>
        <CardBody>
          <CardTitle className="d-flex justify-content-between mb-0">
            <div className="col-md-9 pl-0">
              <WithWizard
                render={({ push }) => (
                  <Button
                    className="p-0"
                    color="link"
                    onClick={() => {
                      seleccionarCargaMasivaInciada(item, push);
                    }}
                  >
                    {item.titulo}
                  </Button>
                )}
              />
            </div>
            <div className="col-md-3 text-right">
              <Button
                color="link"
                className="p-0"
                onClick={() => {
                  confirmCargaMasiva(item.id);
                }}
              >
                <i className="simple-icon-trash h4 mr-2" />
              </Button>
            </div>
          </CardTitle>
          <div className="row">
            <div className="col-md-9">
              {item.nombre_cliente} | Tipo: {item.ruta} | Última actualización:{" "}
              {moment(item.ultima_actualizacion).format("DD/MM/YYYY")}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
