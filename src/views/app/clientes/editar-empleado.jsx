import { Fragment, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Button,
  InputGroup,
  InputGroupText,
  Input,
  Col,
  Form,
  FormGroup, // CAMBIO: agregado para los checkboxes de permisos
  Label, // CAMBIO: agregado para los checkboxes de permisos
  Badge, // CAMBIO: agregado para mostrar/quitar servicios
} from "reactstrap";
import Select from "react-select"; // CAMBIO: nuevo, para el multi-select de secciones
import { connect } from "react-redux";

import { Tarjeta } from "../../../componentes/tarjeta";
import { fetchUsuarioEmpleado, fetchUpdateUsuarioEmpleado } from "../../../reducers/usuarios-reducer";
import { fetchDetalleCliente } from "../../../reducers/clientes-reducer";
import { fetchlistarSecciones } from "../../../reducers/secciones-reducer"; // CAMBIO: nuevo, trae el catálogo de secciones de la empresa
import { NotificationManager } from "../../../components/common/react-notifications";
import { listarUsuariosEmpleados } from "../../../lib/usuarios-api";
import CustomSelectInput from "../../../components/common/CustomSelectInput"; // CAMBIO: nuevo, mismo input custom que usa EdicionGenerarConsulta
// TODO: importar la acción real de actualización cuando la tengas en el reducer/api
// import { actualizarUsuarioEmpleado } from "../../../lib/usuarios-api";

const EditarEmpleado = ({
  detalleCliente,
  fetchUsuarioEmpleado,
  fetchDetalleCliente,
  fetchlistarSecciones, // CAMBIO: nueva prop, viene del connect
  secciones: seccionesDelState, // CAMBIO: nueva prop (catálogo completo desde el store), renombrada para no chocar con el estado local "secciones"
  listarUsuariosEmpleados,
  usuarioEmpresa,
  abrirModal,
  fetchUpdateUsuarioEmpleado 
}) => {
  const { cliente, empresa } = useParams();
  const navigate = useNavigate();

  // CAMBIO: estilos custom para el Select, copiados tal cual del patrón de EdicionGenerarConsulta
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      padding: "10px",
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
    }),
  };

  // CAMBIO: se quitó console.log("🚀 ~ EditarEmpleado ~ detalleCliente:", detalleCliente) que estaba antes acá

  // CAMBIO: todos estos estados son nuevos — antes los inputs eran no controlados (value={""} fijo)
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

  // CAMBIO: nuevo. Dispara el fetch del catálogo de secciones de la empresa al montar.
  // Ojo: asumí que "empresa" (param de la URL) es el mismo id que espera fetchlistarSecciones
  // (en tu otro componente lo llamás props.idEmpresa) — confirmame si es otro valor.
  useEffect(() => {
    fetchlistarSecciones(empresa);
  }, [empresa, fetchlistarSecciones]);

  // CAMBIO: nuevo. Arma seccionesOpciones a partir de lo que trae el store,
  // igual al patrón visto en EdicionGenerarConsulta (label con dangerouslySetInnerHTML).
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

  // CAMBIO: nuevo. El empleado trae sus secciones asignadas como {id_seccion, nombre},
  // pero el catálogo (seccionesOpciones) usa {value: seccion.id, label: JSX}. Acá cruzamos
  // ambos por id apenas los dos estén disponibles, para preseleccionar el Select.
  useEffect(() => {
    if (seccionesOpciones.length === 0 || seccionesIdsEmpleado.length === 0)
      return;
    const seleccionadas = seccionesOpciones.filter((op) =>
      seccionesIdsEmpleado.includes(op.value),
    );
    setSecciones(seleccionadas);
  }, [seccionesOpciones, seccionesIdsEmpleado]);

  // CAMBIO: nuevo. Antes el primer useEffect (fetchUsuarioEmpleado) no hacía nada con la
  // respuesta ("Aquí cargar los datos..." quedaba vacío). Ahora esta función carga
  // todos los campos del empleado en el formulario.
  const cargarEmpleadoEnFormulario = (usuario) => {
    setId(usuario?.id ?? null);
    setNombre(usuario?.nombre ?? "");
    setEmail(usuario?.email ?? "");
    // CAMBIO: los checkboxes vienen como string "1"/"0" desde el backend, se convierten a boolean acá
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

  // CAMBIO: nuevo. Handler del Select multi de secciones.
  const handleChangeMulti = (seleccionadas) => {
    setSecciones(seleccionadas || []);
  };

  useEffect(() => {
    fetchUsuarioEmpleado(empresa).then((res) => {
      // console.log("🚀 ~ EditarEmpleado ~ res:", res) // CAMBIO: se quitó este log
      if (res && res.payload && res.payload.stat !== 0) {
        // CAMBIO: antes este bloque estaba vacío ("Aquí cargar los datos en el formulario...")
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

  // CAMBIO: nuevo. Validación mínima antes de enviar.
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

  // CAMBIO: nuevo. Es el handler de submit que pediste. Arma el payload con el shape
  // real del empleado.
  // CAMBIO (este turno): ya no recibe el evento del form (se llama desde onClick del botón),
  // por eso se sacó el e.preventDefault().
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
            {/* CAMBIO: título de la Tarjeta actualizado de "Datos del cliente" a "Datos del empleado" */}
            <Tarjeta titulo="Datos del empleado">
              {/* CAMBIO (este turno): se sacó el <Form onSubmit={...}>, ahora es un div normal */}
              <div>
                {/* CAMBIO: se agregó Nombre, se sacó "Responsable" (no existe en el shape real) */}
                <InputGroup className="mb-3">
                  <InputGroupText>Nombre</InputGroupText>
                  <Input
                    placeholder="Nombre del empleado"
                    value={nombre} // CAMBIO: antes value={""} fijo
                    onChange={(e) => setNombre(e.target.value)} // CAMBIO: antes llamaba a setNombreEmpresa, que no existía
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroupText>E-mail</InputGroupText>
                  <Input
                    type="email" // CAMBIO: agregado type="email"
                    placeholder="email@email.com"
                    value={email} // CAMBIO: antes value={""} fijo
                    onChange={(e) => setEmail(e.target.value)} // CAMBIO: antes llamaba a setEmail, que no existía
                  />
                </InputGroup>

                {/* CAMBIO: bloque nuevo completo — checkboxes de permisos */}
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

                {/* CAMBIO: bloque nuevo completo — multi-select de secciones */}
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
                  type="button" // CAMBIO (este turno): antes era type="submit"
                  color="success"
                  size="lg"
                  className="top-right-button mt-4"
                  disabled={guardando}
                  onClick={handleSubmit} // CAMBIO (este turno): antes se disparaba por el onSubmit del Form
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