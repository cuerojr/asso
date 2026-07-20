import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const ModalImagen = ({ mostrarImagen, setMostarImagen, imagen }) => {
  return (
    <>
      <style>{`
        .modal-imagen-fullscreen {
          max-width: 100vw !important;
          width: 100vw !important;
          height: 100vh !important;
          margin: 0 !important;
        }

        .modal-imagen-fullscreen .modal-content {
          height: 100vh;
          border-radius: 0;
        }

        .modal-imagen-fullscreen .modal-body {
          height: calc(100vh - 60px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <Modal
        isOpen={mostrarImagen}
        centered={false}
        wrapClassName="modal-imagen"
        className="modal-imagen-fullscreen"
      >
        <ModalHeader
          toggle={() => {
            setMostarImagen(false);
          }}
        ></ModalHeader>
        <ModalBody
          style={{
            textAlign: "center",
          }}
        >
          <img
            src={imagen}
            alt="imagen"
            className="img-fluid"
            style={{
              width: "auto",
              height: "100%",
            }}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default ModalImagen;