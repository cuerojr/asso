import { Fragment, useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  InputGroup,
  InputGroupText,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import Select from "react-select";
import SelectMultiple from "../componentes/selectMultiple";
import { connect } from "react-redux";

import {
  fetchUsuarioEmpleado,
  fetchUpdateUsuarioEmpleado,
} from "../reducers/usuarios-reducer";
import { fetchDetalleCliente } from "../reducers/clientes-reducer";
import { fetchlistarSecciones } from "../reducers/secciones-reducer";
import { listarUsuariosEmpleados } from "../lib/usuarios-api";
import CustomSelectInput from "../components/common/CustomSelectInput";
import { NotificationManager } from "../components/common/react-notifications";

// CAMBIO: el componente ahora es un modal controlado.
// - `isOpen`: boolean que dice si el modal está abierto (lo maneja el padre, ej. la tabla de empleados)
// - `toggle`: función para cerrar/abrir el modal (se la pasa el padre, ej. () => setModalAbierto(false))
// - `empresa` y `cliente` ahora vienen como props en vez de useParams, porque el modal
//   ya no vive en su propia ruta. Si en tu caso siguen viniendo de la URL del padre,
//   dejá el useParams ahí arriba y pasalos igual.
const EditarEmpleadoModal = ({
  isOpen,
  toggle,
  cliente,
  empresa,
  detalleCliente,
  fetchUsuarioEmpleado,
  fetchDetalleCliente,
  fetchlistarSecciones,
  secciones: seccionesDelState,
  listarUsuariosEmpleados,
  usuarioEmpresa,
  fetchUpdateUsuarioEmpleado,
}) => {

  const customStyles = {
    option: (provided) => ({
      ...provided,
      padding: "10px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
    }),
  };

  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [empleadoInformes, setEmpleadoInformes] = useState(false);
  const [empleadoMensajes, setEmpleadoMensajes] = useState(false);
  const [empleadoNotificaciones, setEmpleadoNotificaciones] = useState(false);
  const [secciones, setSecciones] = useState([]);
  const [seccionesOpciones, setSeccionesOpciones] = useState([]);
  const [seccionesIdsEmpleado, setSeccionesIdsEmpleado] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [guardando, setGuardando] = useState(false);

  // CAMBIO: los fetch de datos ahora dependen de `isOpen`, no se disparan
  // apenas se monta el componente (el modal puede estar montado pero cerrado).
  useEffect(() => {
    if (!isOpen || !cliente) return;
    fetchlistarSecciones(cliente);
  }, [isOpen, cliente, fetchlistarSecciones]);

  useEffect(() => {
    setSeccionesOpciones(seccionesDelState);    
  }, [seccionesDelState]);

  useEffect(() => {
    if (seccionesOpciones.length === 0 || seccionesIdsEmpleado.length === 0)
      return;
    const seleccionadas = seccionesOpciones.filter((op) =>
      seccionesIdsEmpleado.includes(op.value),
    );
    console.log("🚀 ~ EditarEmpleadoModal ~ seleccionadas:", seleccionadas)
    setSecciones(seleccionadas);
  }, [seccionesOpciones, seccionesIdsEmpleado]);

  const cargarEmpleadoEnFormulario = (usuario) => {    
    setId(usuario?.id ?? null);
    setNombre(usuario?.nombre ?? "");
    setEmail(usuario?.email ?? "");
    setEmpleadoInformes(
      usuario?.empleado_informes === "1" || usuario?.empleado_informes === 1,
    );
    setEmpleadoMensajes(
      usuario?.empleado_mensajes === "1" || usuario?.empleado_mensajes === 1,
    );
    setEmpleadoNotificaciones(
      usuario?.empleado_notificaciones === "1" ||
        usuario?.empleado_notificaciones === 1,
    );
    setSeccionesIdsEmpleado(
      (usuario?.secciones ?? []).map((s) => s.id_seccion),
    );
    setServicios(usuario?.servicios ?? []);
  };

  const handleChangeMulti = (seleccionadas) => {
    setSecciones(seleccionadas || []);
  };

  useEffect(() => {
    console.log("🚀 ~ EditarEmpleadoModal ~ empresa:", empresa)
    if (!isOpen || !empresa) return;

    fetchUsuarioEmpleado(empresa).then((res) => {
      
      if (res && res.payload && res.payload.stat !== 0) {

        const usuario = res.payload.data || res.payload;
        cargarEmpleadoEnFormulario(usuario);
      } else {
        toggle();
        NotificationManager.error(
          "No puede editar este usuario empleado",
          "Error",
          4000,
          null,
          null,
          "",
        );
        // CAMBIO: en vez de navegar, cerramos el modal al no poder editar
      }
    });
  }, [isOpen, empresa, fetchUsuarioEmpleado]);

  useEffect(() => {
    if (!isOpen || !cliente) return;
    fetchDetalleCliente(cliente);
  }, [isOpen, cliente, fetchDetalleCliente]);

  const validarFormulario = () => {
    if (!nombre.trim()) {
      NotificationManager.error(
        "El nombre es requerido",
        "Error",
        4000,
        null,
        null,
        "",
      );
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      NotificationManager.error(
        "El email no es válido",
        "Error",
        4000,
        null,
        null,
        "",
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    const payload = {
      id,
      nombre,
      email,
      acccesoInformes: empleadoInformes ? 1 : 0,
      accesoMensajes: empleadoMensajes ? 1 : 0,
      accesoNotificaciones: empleadoNotificaciones ? 1 : 0,
      secciones: secciones.map((s) => s.value),
      servicios: ["1"],
    };
    try {
      setGuardando(true);
      const res = await fetchUpdateUsuarioEmpleado(payload);

      if (res && res.payload && res.payload.stat !== 0) {
        NotificationManager.success(
          "Empleado actualizado correctamente",
          "Éxito",
          3000,
          null,
          null,
          "",
        );
        // CAMBIO: en vez de navegar, cerramos el modal al guardar OK
        toggle();
      } else {
        NotificationManager.error(
          res?.payload?.err || "Ocurrió un error al actualizar",
          "Error",
          4000,
          null,
          null,
          "",
        );
      }
    } catch (error) {
      NotificationManager.error(
        "Ocurrió un error al actualizar",
        "Error",
        4000,
        null,
        null,
        "",
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" backdrop="static">
      <ModalHeader toggle={toggle}>
        {detalleCliente ? detalleCliente.empresa : "Editar empleado"}
      </ModalHeader>

      <ModalBody>
        {!detalleCliente ? (
          <div className="loading" />
        ) : (
          <Fragment>
            <InputGroup className="mb-3">
              <InputGroupText>Nombre</InputGroupText>
              <Input
                placeholder="Nombre del empleado"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroupText>E-mail</InputGroupText>
              <Input
                type="email"
                placeholder="email@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>

            <FormGroup className="mb-3">
              <Label className="d-block">Permisos</Label>
              <FormGroup check inline>
                <Input
                  type="checkbox"
                  id="empleadoInformes"
                  checked={empleadoInformes}
                  onChange={(e) => setEmpleadoInformes(e.target.checked)}
                />
                <Label check htmlFor="empleadoInformes">
                  Informes
                </Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  type="checkbox"
                  id="empleadoMensajes"
                  checked={empleadoMensajes}
                  onChange={(e) => setEmpleadoMensajes(e.target.checked)}
                />
                <Label check htmlFor="empleadoMensajes">
                  Mensajes
                </Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  type="checkbox"
                  id="empleadoNotificaciones"
                  checked={empleadoNotificaciones}
                  onChange={(e) => setEmpleadoNotificaciones(e.target.checked)}
                />
                <Label check htmlFor="empleadoNotificaciones">
                  Notificaciones
                </Label>
              </FormGroup>
            </FormGroup>

            <FormGroup className="mb-3">
              <Label className="d-block">Secciones</Label>

              <SelectMultiple
              
                name="secciones"
                items={seccionesOpciones}
                handleChangeMulti={handleChangeMulti}
                itemsSeleccionados={secciones}
                placeholderSingular="seccion"
                placeholderPlural="secciones"
                isDisabled={false}
              />
            </FormGroup>
          </Fragment>
        )}
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={toggle} disabled={guardando}>
          Cancelar
        </Button>
        <Button color="success" disabled={guardando} onClick={handleSubmit}>
          {guardando ? "Guardando..." : "Editar"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  detalleCliente: state.clientesReducer.detalleClienteState,
  usuarioEmpresa: state.usuariosReducer.usuariosEmpleado,
  secciones: state.seccionesReducer.secciones,
});

export default connect(mapStateToProps, {
  fetchUsuarioEmpleado,
  listarUsuariosEmpleados,
  fetchDetalleCliente,
  fetchlistarSecciones,
  fetchUpdateUsuarioEmpleado,
})(EditarEmpleadoModal);
