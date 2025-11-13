import React, { Fragment, useEffect } from "react";
import { Row } from "reactstrap";
import { connect } from "react-redux";
import {
  fetchListarServicios,
  fetchAltaServicio,
  fetchDeleteServicio,
} from "../../../../reducers/servicios-reducer";
import { ItemListaServicio } from "../../../../componentes/itemListaServicios";
import { AltaServicio } from "../../../../contenedores/servicios/alta-servicio";
import Sortable from "react-sortablejs";
import { NotificationManager } from "../../../../components/common/react-notifications";
import { ordenServicios } from "../../../../lib/servicios-api";

const Servicios = ({
  servicios,
  guardado,
  fetchListarServicios,
  fetchAltaServicio,
  fetchDeleteServicio,
}) => {
  useEffect(() => {
    fetchListarServicios();
  }, [fetchListarServicios, guardado]);

  const altaServicio = (nombre) => {
    fetchAltaServicio(nombre).then((res) => {
      if (res?.payload?.stat === 1) {
        NotificationManager.success(
          "El servicio ha sido creado",
          "Hecho",
          3000
        );
      }
    });
  };

  const deleteServicio = (idServicio) => {
    fetchDeleteServicio(idServicio).then((res) => {
      if (res?.payload?.stat === 1) {
        NotificationManager.success(
          "El servicio ha sido eliminado",
          "Hecho",
          3000
        );
      }
    });
  };

  const recorrerLista = () => {
    const itemToSave = Array.from(
      document.getElementById("lista").childNodes
    ).map((item) => item.getAttribute("id"));
    ordenServicios(JSON.stringify(itemToSave));
  };

  const RenderSort = ({ servicios }) => (
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
      {servicios.map((servicio) => (
        <li id={servicio.id} key={servicio.id}>
          <ItemListaServicio item={servicio} deleteServicio={deleteServicio} />
        </li>
      ))}
    </Sortable>
  );

  return (
    <Fragment>
      <Row>
        <div className="col-md-12">
          <h1>Servicios de ASSO Consultores</h1>
        </div>
        <div className="col-md-12">
          <div className="separator mb-5"></div>
        </div>
      </Row>
      <Row>
        <div className="col-md-12 mb-3">
          <AltaServicio guardar={altaServicio} guardado={guardado} />
        </div>
      </Row>
      <Row>
        <RenderSort servicios={servicios} />
      </Row>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  servicios: state.serviciosReducer.servicios,
  guardado: state.serviciosReducer.guardado,
});

export default connect(mapStateToProps, {
  fetchListarServicios,
  fetchAltaServicio,
  fetchDeleteServicio,
})(Servicios);
