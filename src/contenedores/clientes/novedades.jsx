import React, { useEffect, useState } from "react";
import Notificaciones from "../../componentes/notificaciones";
import {
  fetchListarNotificaciones,
  fetchBuscarNotificaciones,
} from "../../reducers/clientes-reducer";
import { ItemListaNovedades } from "../../componentes/itemListaNovedades";
import { connect } from "react-redux";
import {
  getDetalleNotificaciones,
  deleteNotificacion,
} from "../../lib/clientes-api";
import { Row, Button, Modal, ModalBody, ModalFooter, Col } from "reactstrap";
import { NotificationManager } from "../../components/common/react-notifications";

import Mensaje from "./mensaje";
import BuscarMensaje from "../../componentes/mensajes/buscar-mensajes";
import useSearchHook from "../../hooks/useSearchHook"; // Ajusta la ruta

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronRight,
  faCircleChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

const Novedades = (props) => {
  const {
    fetchBuscarNotificaciones,
    fetchListarNotificaciones,
    idEmpresa,
    novedades,
  } = props;

  // Hook personalizado que maneja búsqueda y paginación
  const {
    handleSearch,
    contadorPaginas,
    totalPaginas,
    anteriorSiguiente,
    irAPagina,
  } = useSearchHook({
    idEmpresa,
    fetchBuscarNotificaciones,
    fetchListarNotificaciones,
    novedades,
    itemsPorPagina: 20,
  });

  const [mostrarNovedad, setMostrarNovedad] = useState(null);
  const [novedad, setNovedad] = useState(null);
  const [
    mostrarModalConfirmarEliminarNovedad,
    setMostrarModalConfirmarEliminarNovedad,
  ] = useState(false);
  const [novedadIdSeleccionado, setnovedadIdSeleccionado] = useState(null);

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
        fetchListarNotificaciones("ln", "0", contadorPaginas, idEmpresa, "0");
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
              {novedades && (
                <h1>
                  {novedades.Total || novedades.Notificaciones?.length || 0}{" "}
                  mensajes enviados
                </h1>
              )}
              <div className="text-zero top-right-button-container">
                <Notificaciones mostrarBt={true} />
              </div>
              <div className="mt-4 px-3">
                <BuscarMensaje onSearch={handleSearch} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="separator mb-5"></div>
            </div>
          </Row>

          {!novedades.Notificaciones && <div className="loading" />}

          {novedades.Notificaciones &&
            novedades.Notificaciones.map((novedad) => (
              <ItemListaNovedades
                key={novedad.id}
                item={novedad}
                setMostrarNovedad={setMostrarNovedad}
                seleccionarNovedadYpreguntar={seleccionarNovedadYpreguntar}
              />
            ))}

          <Row>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon
                icon={faCircleChevronLeft}
                className="mr-2"
                style={{ fontSize: "26px", cursor: "pointer" }}
                onClick={() => anteriorSiguiente("anterior")}
              />
              {Array.from({ length: totalPaginas }, (_, index) => (
                <button
                  key={index}
                  onClick={() => irAPagina(index)}
                  style={{
                    padding: "8px 12px",
                    margin: "0 4px",
                    color: contadorPaginas === index ? "#244b80" : "#333",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  {index + 1}
                </button>
              ))}
              <FontAwesomeIcon
                icon={faCircleChevronRight}
                className="ml-2"
                style={{ fontSize: "26px", cursor: "pointer" }}
                onClick={() => anteriorSiguiente("siguiente")}
              />
            </Col>
          </Row>
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
          <p>¿Desea eliminar este mensaje?</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={() => {
              borrarNotificacion(novedadIdSeleccionado);
            }}
          >
            Sí, eliminar
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

export default connect(mapStateToProps, {
  fetchListarNotificaciones,
  fetchBuscarNotificaciones,
})(Novedades);
