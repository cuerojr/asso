import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import Sortable from "react-sortablejs";
import ItemListaAutocompletar from "../../../../componentes/itemListaAutocompletar";
import AltaAutocompletar from "../../../../componentes/altaAutocompletar";
import { connect } from "react-redux";
import { ordenarAutocompletar } from "../../../../lib/autocompletar-api";
import { NotificationManager } from "../../../../components/common/react-notifications";

const AutocompletarGrid = (props) => {
  const { tipo, observaciones, recomendaciones } = props;
  const [loading, setloading] = useState(false);

  useEffect(() => {
    if (tipo === "observacion") {
      if (!observaciones) {
        setloading(true);
      } else {
        setloading(false);
      }
    } else {
      if (!recomendaciones) {
        setloading(true);
      } else {
        setloading(false);
      }
    }
  }, [observaciones, recomendaciones, tipo]);

  const recorrerLista = () => {
    const arrayIds = [];
    document.querySelectorAll(".item-autocompletar").forEach((elem) => {
      arrayIds.push(elem.attributes["id"].value.split("auto_item_")[1]);
    });
    ordenarAutocompletar(JSON.stringify(arrayIds)).then((res) => {
      if (res.stat === 1) {
        NotificationManager.success(
          "Los items han sido reordenados",
          "Hecho",
          3000,
          null,
          null,
          ""
        );
      }
    });
  };

  const RenderSort = (props) => {
    return (
      <Sortable
        tag="ul"
        id="lista"
        className="list-unstyled"
        options={{
          animation: 150,
          //handle: ".handlebt",
          onEnd: recorrerLista,
        }}
      >
        {props.items.map((item, index) => {
          return (
            <li key={index}>
              <ItemListaAutocompletar item={item} tipo={tipo} />
            </li>
          );
        })}
      </Sortable>
    );
  };

  return (
    <>
      <Row>
        <Col>
          <div className="separator mb-5"></div>
        </Col>
      </Row>
      <Row>
        <div className="col-md-12 mb-3">
          <AltaAutocompletar tipo={props.tipo} />
        </div>
      </Row>
      {loading && (
        <Col className="position-relative mt-4">
          <div className="loading" style={{ position: "absolute" }} />
        </Col>
      )}
      {tipo === "observacion" ? (
        <Row>
          {observaciones && <RenderSort items={observaciones} />}
          {observaciones && observaciones.length === 0 && (
            <p>No hay resultados</p>
          )}
        </Row>
      ) : (
        <Row>
          {recomendaciones && <RenderSort items={recomendaciones} />}
          {recomendaciones && recomendaciones.length === 0 && (
            <Col>
              <p>No hay resultados</p>
            </Col>
          )}
        </Row>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    observaciones: state.autocompletarReducer.observaciones,
    recomendaciones: state.autocompletarReducer.recomendaciones,
  };
};
export default connect(mapStateToProps, null)(AutocompletarGrid);
