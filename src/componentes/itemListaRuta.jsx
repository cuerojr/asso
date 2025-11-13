import React, { Fragment } from "react";
import { Card, CardBody, Button } from "reactstrap";

export const ItemListaRuta = ({ item, seleccionarRuta }) => {
  return (
    <Fragment>
      <div className="col-md-12 rutas" id={"estado-" + item.id}>
        <Card className="card d-flex mb-3">
          <div className="d-flex flex-grow-1 min-width-zero">
            <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
              <p className="list-item-heading mb-0 truncate w-90 w-xs-60 mb-1 mt-1">
                <i className="simple-icon-organization mr-2"></i>
                <Button
                  color="link"
                  className="pl-0"
                  onClick={() => {
                    seleccionarRuta(item);
                  }}
                >
                  {item.nombre}
                </Button>
              </p>
              <div className="d-flex align-items-center">
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
  );
};
