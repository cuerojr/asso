import { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  InputGroup,
  InputGroupAddon,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import { connect } from "react-redux";
import { setMostrarModalWhatsapp } from "../reducers/notificacionesWhatsapp-reducer";
import { useModalNotificacionWhatsapp } from "../hooks/useModalNotificacionWhatsapp";
import { fetchListarUsuariosEmpleados } from "../reducers/usuarios-reducer";

const limpiarTelefono = (valor = "") => String(valor ?? "").replace(/\D/g, "");

const tieneTelefonoValido = (usuario) => {
  const tel = limpiarTelefono(usuario?.wsp);
  return tel.length >= 10 && tel.length <= 15;
};

const ModalNotificacionWhatsapp = ({
  mostrarModalWhatsapp,
  clienteId: clienteIdProp,
  detalleCliente,
  setMostrarModalWhatsapp,
  usuariosEmpleado,
  listaUsuariosEmpleados,
  fetchListarUsuariosEmpleados,
  cargaMasiva,
  mensaje,
}) => {
 const clienteId =
    clienteIdProp ?? detalleCliente?.id ?? cargaMasiva?.clienteSeleccionado?.value;

  useEffect(() => {
    if (!mostrarModalWhatsapp || !clienteId) return;
    if (!listaUsuariosEmpleados || listaUsuariosEmpleados.length === 0) {
      fetchListarUsuariosEmpleados(clienteId);
    }
  }, [mostrarModalWhatsapp, clienteId, fetchListarUsuariosEmpleados]);

  const {
    phoneNumber,
    setPhoneNumber,
    usuariosSeleccionados,
    toggleUsuario,
    enviando,
    enviar,
    cerrar,
  } = useModalNotificacionWhatsapp({
    email: detalleCliente?.email ?? "",
    abierto: mostrarModalWhatsapp,
    usuarios: listaUsuariosEmpleados,
    mensaje,
    onCerrar: () => setMostrarModalWhatsapp(false),
  });

  return (
    <Modal
      isOpen={mostrarModalWhatsapp}
      size="lg"
      centered
      style={{
        boxShadow: "none",
      }}
    >
      <ModalHeader toggle={cerrar}>
        Enviar notificaciones por WhatsApp
      </ModalHeader>
      <ModalBody className="h-full">
        <div className="card-body">
          <p className="mb-2">Se enviará un mensaje de WhatsApp al cliente para notificar la carga de un informe de equipos controlados y sus estados. (El número de teléfono se obtiene del cliente seleccionado en la carga masiva).</p>
          <p className="mb-2 font-weight-bold">Usuarios a notificar</p>
          <div
            className="p-3 mb-3"
            style={{ maxHeight: 220, overflowY: "auto" }}
          >
            {listaUsuariosEmpleados?.map((usuario) => {
              const sinTelefono = !tieneTelefonoValido(usuario);

              return (
                <FormGroup
                  check
                  key={usuario.id}
                  className="mb-2"
                  disabled={sinTelefono}
                >
                  <Label
                    check
                    className="d-flex justify-content-between w-100"
                    style={{
                      cursor: sinTelefono ? "not-allowed" : "pointer",
                      opacity: sinTelefono ? 0.6 : 1,
                    }}
                  >
                    <span className="font-weight-bold font-size-14 font-white">
                      <Input
                        type="checkbox"
                        disabled={sinTelefono}
                        checked={usuariosSeleccionados.includes(usuario.id)}
                        onChange={() => toggleUsuario(usuario.id)}
                      />{" "}
                      {usuario.nombre}
                    </span>
                    <span className="text-muted">
                      {sinTelefono ? "Sin teléfono" : usuario.telefono}
                    </span>
                  </Label>
                </FormGroup>
              );
            })}
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <Button color="secondary" onClick={cerrar}>
            No por ahora
          </Button>
          <Button
            className="ml-2"
            color="primary"
            onClick={enviar}
            disabled={enviando}
          >
            {enviando ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  mostrarModalWhatsapp:
    state.notificacionesWhatsappReducer.mostrarModalWhatsapp,
  detalleCliente: state.clientesReducer.detalleCliente, // ajustá a tu state real
  cargaMasiva: state.cargasMasivasReducer.cargaMasiva,
  usuariosEmpleado: state.usuariosReducer.usuariosEmpleado, // ajustá a tu state real
  listaUsuariosEmpleados: state.usuariosReducer.listaUsuariosEmpleados, // ajustá a tu state real
});

export default connect(mapStateToProps, {
  setMostrarModalWhatsapp,
  fetchListarUsuariosEmpleados,
})(ModalNotificacionWhatsapp);
