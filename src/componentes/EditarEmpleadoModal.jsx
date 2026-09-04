/*
import { Fragment, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Button,
  InputGroup,
  InputGroupText,
  Input,
  Col,
  FormGroup,
  Label,
} from "reactstrap";
import Select from "react-select";
import { connect } from "react-redux";

import { Tarjeta } from "../../../componentes/tarjeta";
import { fetchUsuarioEmpleado, fetchUpdateUsuarioEmpleado } from "../../../reducers/usuarios-reducer";
import { fetchDetalleCliente } from "../../../reducers/clientes-reducer";
import { fetchlistarSecciones } from "../../../reducers/secciones-reducer"; 
import { listarUsuariosEmpleados } from "../../../lib/usuarios-api";
import CustomSelectInput from "../../../components/common/CustomSelectInput";

const EditarEmpleado = ({
  detalleCliente,
  fetchUsuarioEmpleado,
  fetchDetalleCliente,
  fetchlistarSecciones, 
  secciones: seccionesDelState,
  listarUsuariosEmpleados,
  usuarioEmpresa,
  abrirModal,
  fetchUpdateUsuarioEmpleado 
}) => {
  const { cliente, empresa } = useParams();
  const navigate = useNavigate();

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      padding: "10px",
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
    }),
  };

  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [empleadoInformes, setEmpleadoInformes] = useState(false);
  const [empleadoMensajes, setEmpleadoMensajes] = useState(false);
  const [empleadoNotificaciones, setEmpleadoNotificaciones] = useState(false);
  const [secciones, setSecciones] = useState([]); // formato react-select: [{value, label}] — las YA seleccionadas
  const [seccionesOpciones, setSeccionesOpciones] = useState([]); // catálogo completo para el dropdown
  const [seccionesIdsEmpleado, setSeccionesIdsEmpleado] = useState([]); // ids que trae el empleado, hasta que lleguen las opciones del fetch
  const [servicios, setServicios] = useState([]); // [{id_servicio, nombre}] — TODO: confirmar la key real, no vino en el ejemplo
  const [nuevoServicio, setNuevoServicio] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetchlistarSecciones(empresa);
  }, [empresa, fetchlistarSecciones]);

  useEffect(() => {
    const opciones = [];
    seccionesDelState &&
      seccionesDelState.forEach((seccion) => {
        opciones.push({
          value: seccion.id,
          label: (
            <span
              key={`seccion-${seccion.id}`}
              dangerouslySetInnerHTML={{
                __html:
                  '<div class="falla-color-wrapper">' +
                  seccion.nombre +
                  "</div>",
              }}
            />
          ),
        });
      });
    setSeccionesOpciones(opciones);
  }, [seccionesDelState]);

  useEffect(() => {
    if (seccionesOpciones.length === 0 || seccionesIdsEmpleado.length === 0)
      return;
    const seleccionadas = seccionesOpciones.filter((op) =>
      seccionesIdsEmpleado.includes(op.value),
    );
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
    fetchUsuarioEmpleado(empresa).then((res) => {
      if (res && res.payload && res.payload.stat !== 0) {
        const usuario = res.payload.data || res.payload;
        cargarEmpleadoEnFormulario(usuario);
      } else {
        NotificationManager.error(
          "No puede editar este usuario empleado",
          "Error",
          4000,
          null,
          null,
          "",
        );
        // navigate("/app/clientes/editar-cliente/" + cliente + "/info"); // (ya estaba comentado en el original)
      }
    });
  }, [empresa, fetchUsuarioEmpleado]);

  useEffect(() => {
    fetchDetalleCliente(cliente);
  }, [cliente, fetchDetalleCliente]);

  const volverAClientes = () => {
    navigate("/app/clientes");
  };

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
      secciones: secciones.map((s) => ( s.value )), 
      servicios: ['1'], // el label es JSX, no se manda
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
        //navigate("/app/clientes/editar-cliente/" + cliente + "/info");
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

  if (!detalleCliente) {
    return <div className="loading" />;
  }

  return (
    <Fragment>
      <div className="container">
        <Row>
          <div className="col-md-12 mb-2">
            <Button color="link" className="pl-0" onClick={volverAClientes}>
              &lt; Volver
            </Button>
          </div>
        </Row>
        <Row>
          <div className="col-md-12">
            <h1>{detalleCliente.empresa}</h1>
          </div>
          <div className="col-md-12">
            <div className="separator mb-5"></div>
          </div>
        </Row>

        <Row className="mb-5">
          <div className="col-md-12"></div>
          <div className="col-md-12">
            <div className="separator mt-3"></div>
          </div>
        </Row>

        <Row>
          <Col sm="12">
            <Tarjeta titulo="Datos del empleado">
              <div>
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
                      onChange={(e) =>
                        setEmpleadoNotificaciones(e.target.checked)
                      }
                    />
                    <Label check htmlFor="empleadoNotificaciones">
                      Notificaciones
                    </Label>
                  </FormGroup>
                </FormGroup>

                
                <FormGroup className="mb-3">
                  <Label className="d-block">Secciones</Label>
                  <Select
                    components={{ Input: CustomSelectInput }}
                    className="react-select-fallas"
                    classNamePrefix="react-select"
                    styles={customStyles}
                    isMulti
                    placeholder="Seleccione una sección"
                    name="secciones"
                    value={secciones}
                    onChange={handleChangeMulti}
                    options={seccionesOpciones}
                  />
                </FormGroup>

                <Button
                  type="button" 
                  color="success"
                  size="lg"
                  className="top-right-button mt-4"
                  disabled={guardando}
                  onClick={handleSubmit} 
                >
                  {guardando ? "Guardando..." : "Editar"}
                </Button>
              </div>
            </Tarjeta>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  detalleCliente: state.clientesReducer.detalleClienteState,
  usuarioEmpresa: state.usuariosReducer.usuariosEmpleado,
  secciones: state.seccionesReducer.secciones, // CAMBIO: nuevo
});

export default connect(mapStateToProps, {
  fetchUsuarioEmpleado,
  listarUsuariosEmpleados,
  fetchDetalleCliente,
  fetchlistarSecciones, // CAMBIO: nuevo
  fetchUpdateUsuarioEmpleado, // CAMBIO: nuevo
})(EditarEmpleado);
*/

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
import { connect } from "react-redux";

import { fetchUsuarioEmpleado, fetchUpdateUsuarioEmpleado } from "../reducers/usuarios-reducer";
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
  console.log("🚀 ~ EditarEmpleadoModal ~ empresa:", empresa)
  
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
    const opciones = [];
    seccionesDelState &&
      seccionesDelState.forEach((seccion) => {
        opciones.push({
          value: seccion.id,
          label: (
            <span
              key={`seccion-${seccion.id}`}
              dangerouslySetInnerHTML={{
                __html:
                  '<div class="falla-color-wrapper">' +
                  seccion.nombre +
                  "</div>",
              }}
            />
          ),
        });
      });
    setSeccionesOpciones(opciones);
  }, [seccionesDelState]);

  useEffect(() => {
    if (seccionesOpciones.length === 0 || seccionesIdsEmpleado.length === 0)
      return;
    const seleccionadas = seccionesOpciones.filter((op) =>
      seccionesIdsEmpleado.includes(op.value),
    );
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
    if (!isOpen || !empresa) return;
    fetchUsuarioEmpleado(empresa).then((res) => {
      if (res && res.payload && res.payload.stat !== 0) {
        const usuario = res.payload.data || res.payload;
        cargarEmpleadoEnFormulario(usuario);
      } else {
        NotificationManager.error(
          "No puede editar este usuario empleado",
          "Error",
          4000,
          null,
          null,
          "",
        );
        // CAMBIO: en vez de navegar, cerramos el modal al no poder editar
        toggle();
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
                  onChange={(e) =>
                    setEmpleadoNotificaciones(e.target.checked)
                  }
                />
                <Label check htmlFor="empleadoNotificaciones">
                  Notificaciones
                </Label>
              </FormGroup>
            </FormGroup>

            <FormGroup className="mb-3">
              <Label className="d-block">Secciones</Label>
              <Select
                components={{ Input: CustomSelectInput }}
                className="react-select-fallas"
                classNamePrefix="react-select"
                styles={{
                  ...customStyles,
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                isMulti
                placeholder="Seleccione una sección"
                name="secciones"
                value={secciones}
                onChange={handleChangeMulti}
                options={seccionesOpciones}
                menuPortalTarget={document.body} // CAMBIO: necesario para que el dropdown no quede recortado por el overflow del modal
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