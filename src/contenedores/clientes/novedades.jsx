import React, { useEffect, useState } from "react";
import Notificaciones from "../../componentes/notificaciones";
import { fetchListarNotificaciones } from "../../reducers/clientes-reducer";
import { ItemListaNovedades } from "../../componentes/itemListaNovedades";
import { connect } from "react-redux";
import {
  getDetalleNotificaciones,
  deleteNotificacion,
} from "../../lib/clientes-api";
import { Row, Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { NotificationManager } from "../../components/common/react-notifications";

import Mensaje from "./mensaje";

const Novedades = (props) => {
  const [mostrarNovedad, setMostrarNovedad] = useState(null);
  const [novedad, setNovedad] = useState(null);
  const { currentTab, fetchListarNotificaciones, idEmpresa } = props;
  const [
    mostrarModalConfirmarEliminarNovedad,
    setMostrarModalConfirmarEliminarNovedad,
  ] = useState(false);
  const [novedadIdSeleccionado, setnovedadIdSeleccionado] = useState(null);

  useEffect(() => {
    if (currentTab === "novedades") {
      fetchListarNotificaciones(idEmpresa);
      setMostrarNovedad(null);
    }
  }, [currentTab, fetchListarNotificaciones, idEmpresa]);

  useEffect(() => {
    if (mostrarNovedad) {
      getDetalleNotificaciones(mostrarNovedad).then((res) => {
        setNovedad(res);
      });
    }
  }, [mostrarNovedad]);

  const borrarNotificacion = (notificacionId) => {
    deleteNotificacion(notificacionId).then((res) => {
      setMostrarModalConfirmarEliminarNovedad(false);
      if (res.stat === 1) {
        NotificationManager.success(
          "El mensaje fue eliminado satisfactoriamente",
          "Hecho",
          3000,
          null,
          null,
          ""
        );
        fetchListarNotificaciones(idEmpresa);
      } else {
        NotificationManager.error(res.err, "Error");
      }
    });
  };

  const seleccionarNovedadYpreguntar = (idNovedad) => {
    setnovedadIdSeleccionado(idNovedad);
    setMostrarModalConfirmarEliminarNovedad(true);
  };

  return (
    <>
      {!mostrarNovedad && (
        <div>
          <Row>
            <div className="col-md-12">
              {props.totalNotificaciones && (
                <h1>{props.totalNotificaciones} mensajes enviados</h1>
              )}
              <div className="text-zero top-right-button-container">
                <Notificaciones mostrarBt={true} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="separator mb-5"></div>
            </div>
          </Row>
          {!props.novedades && <div className="loading" />}
          {props.novedades &&
            props.novedades.map((novedad, index) => {
              return (
                <ItemListaNovedades
                  key={index}
                  item={novedad}
                  setMostrarNovedad={setMostrarNovedad}
                  seleccionarNovedadYpreguntar={seleccionarNovedadYpreguntar}
                />
              );
            })}
        </div>
      )}
      {mostrarNovedad && (
        <>
          {!novedad && <div className="loading" />}
          {novedad && (
            <Mensaje novedad={novedad} setMostrarNovedad={setMostrarNovedad} />
          )}
        </>
      )}
      <Modal isOpen={mostrarModalConfirmarEliminarNovedad} size="md">
        <ModalBody>
          <p>¿Desea eliminar esta mensaje?</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={() => {
              borrarNotificacion(novedadIdSeleccionado);
            }}
          >
            Si, eliminar
          </Button>
          <Button
            className="neutro"
            onClick={() => {
              setMostrarModalConfirmarEliminarNovedad(false);
            }}
          >
            No, cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    novedades: state.clientesReducer.notificaciones,
    totalNotificaciones: state.clientesReducer.totalNotificaciones,
  };
};
export default connect(mapStateToProps, { fetchListarNotificaciones })(
  Novedades
);
