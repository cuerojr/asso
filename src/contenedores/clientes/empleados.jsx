import { useEffect, useState } from "react";
import { listarUsuariosEmpleados } from "../../lib/usuarios-api";
import { connect } from "react-redux";
import { fetchDetalleCliente } from "../../reducers/clientes-reducer";
import ItemListaEmpleado from "../../componentes/itemListaEmpleado";
import EditarEmpleadoModal from "../../componentes/EditarEmpleadoModal"; // CAMBIO: ajustá la ruta según donde hayas guardado el archivo
import { Col, Row } from "reactstrap";

const Empleados = (props) => {
  const { detalleCliente } = props;
  const [empleados, setEmpleados] = useState(null);

  // CAMBIO: estado del modal. `empleadoIdEditando` guarda el id del empleado
  // que se está editando (ojo: el componente EditarEmpleadoModal lo recibe
  // como prop `empresa` por como estaba armado el fetch original, aunque
  // en realidad es el id de empleado, no de empresa).
  const [empleadoIdEditando, setEmpleadoIdEditando] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargarEmpleados = () => {
    if (detalleCliente) {
      listarUsuariosEmpleados(detalleCliente.id).then((data) => {
        setEmpleados(data);
      });
    }
  };

  useEffect(() => {
    cargarEmpleados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detalleCliente]);

  const abrirModalEdicion = (empleadoId) => {
    setEmpleadoIdEditando(empleadoId);
    setModalAbierto(true);
  };

  const toggleModal = () => {
    setModalAbierto((abierto) => !abierto);
    // CAMBIO: al cerrar, refrescamos la lista por si se guardaron cambios
    if (modalAbierto) {
      cargarEmpleados();
    }
  };

  return (
    <>
      <Row className="mb-4 mt-4">
        <Col>
          <h2>Listado de usuarios "empleado" creados por el cliente:</h2>
        </Col>
      </Row>
      <Row>
        {empleados && empleados.length === 0 && (
          <Row className="w-100">
            <Col className="d-flex justify-content-center align-items-center p-4 w-100 text-muted">
              El cliente todavía no ha creado usuarios.
            </Col>
          </Row>
        )}
        {empleados &&
          empleados.length > 0 &&
          empleados.map((empleado, index) => {
            return (
              <ItemListaEmpleado
                key={index}
                item={empleado}
                cliente={detalleCliente.id}
                onEditar={abrirModalEdicion} // CAMBIO: en vez de navegar, abre el modal
              />
            );
          })}
      </Row>

      {/* CAMBIO: el modal vive acá, a nivel página, y se muestra/oculta según el estado */}
      {empleadoIdEditando && (
        <EditarEmpleadoModal
          isOpen={modalAbierto}
          toggle={toggleModal}
          cliente={detalleCliente.id}
          empresa={empleadoIdEditando}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    detalleCliente: state.clientesReducer.detalleClienteState,
  };
};
export default connect(
  //función que mapea propiedades del state con propiedades del componente
  mapStateToProps,
  //mapeo de funciones
  { fetchDetalleCliente },
)(Empleados);