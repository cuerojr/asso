import { useEffect, useState } from "react";
import { listarUsuariosEmpleados } from "../../lib/usuarios-api";
import { connect } from "react-redux";
import { fetchDetalleCliente } from "../../reducers/clientes-reducer";
import ItemListaEmpleado from "../../componentes/itemListaEmpleado";
import { Col, Row } from "reactstrap";

const Empleados = (props) => {
  const { detalleCliente } = props;
  const [empleados, setEmpleados] = useState(null);
  useEffect(() => {
    if (detalleCliente) {
      listarUsuariosEmpleados(detalleCliente.id).then((data) => {        
        setEmpleados(data);
      });
    }
  }, [detalleCliente]);

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
            return <ItemListaEmpleado key={index} item={empleado} cliente={detalleCliente.id} />;
          })}
      </Row>
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
