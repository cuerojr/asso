import { Card, CardBody, Button } from "reactstrap";
import moment from "moment";

export const ItemListaControles = ({ item, editarControlSeleccionado }) => {
  return (
    <Button
      color="link"
      className="w-100 p-0  mb-3"
      onClick={() => editarControlSeleccionado(item)}
	  style={{
		textDecoration: "none",
		color: "inherit"
	  }}
    >
      <Card className="card">
        <CardBody className="d-flex align-items-center">
          <p className="list-item-heading mb-0 pl-0 d-flex flex-column align-items-start text-uppercase">
            <span className="opacity-50 mb-2">TIPO DE CONTROL</span>{" "}
            {item.nombre}
          </p>
          <div className="mb-0 d-flex align-items-center justify-content-between ml-auto">
            <p className="border-right list-item-heading mb-0 pr-4 d-flex flex-column align-items-start">
              <span className="opacity-50 mb-2">FECHA</span>{" "}
              {moment(item.fecha).format("DD/MM/YYYY")}
            </p>
            <p className="list-item-heading mb-0 pl-4 d-flex flex-column align-items-start">
              <span className="opacity-50 mb-2">ESTADO</span>
              <span
                className="estados-tag pl-2 pr-2 ml-2 p-1"
                style={{ background: item.color_estado }}
              >
                {item.estado}
              </span>
            </p>
          </div>
        </CardBody>
      </Card>
    </Button>
  );
};
