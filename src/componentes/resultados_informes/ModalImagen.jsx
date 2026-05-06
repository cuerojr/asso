import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const ModalImagen = ({ mostrarImagen, setMostarImagen, imagen }) => {
  return (
    <Modal
      isOpen={mostrarImagen}
      fullscreen={true}
      size="xl"
      centered={true}
      wrapClassName="modal-imagen"
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
  );
};

export default ModalImagen;
