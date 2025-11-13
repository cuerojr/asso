import React, { Fragment } from 'react';
import { Row, Col } from "reactstrap";
import { connect } from 'react-redux';

// Definir el componente Columna
const Columna = ({ children }) => (
  <Col className="border p-2 bg-black borde-gris">
    {children}
  </Col>
);

// Definir el componente Fila
const Fila = ({ columnas }) => (
  <Row>
    {columnas.map((columna, index) => (
      <Columna key={index}>
        {columna}
      </Columna>
    ))}
  </Row>
);

const DatosPrincipales = (props) => {
  const { cargaMasiva } = props;
  return (
    <Fragment>
      <Fila columnas={[
        <h1 className='mb-0 pb-0'>{cargaMasiva.tituloDeReferencia}</h1>
      ]} />
      <Fila columnas={[
        <>CLIENTE: {cargaMasiva.clienteSeleccionado?.label}</>
      ]} />
      <Fila columnas={[
        <>RUTA: {cargaMasiva.rutasSeleccionadas.map((ruta, index) => (
          <div key={index} className='datos-principales-rutas-label'>{ruta.label}, </div>
        ))}</>,
        <>TIPO DE CONTROL: {cargaMasiva.tipoTesteo.label}</>
      ]} />
      <Fila columnas={[
        <>SECCIONES: {cargaMasiva.seccionSeleccionada.map((seccion, index) => (
          <div className='datos-principales-secciones-label' key={index}>{seccion.label}, </div>
        ))}</>
      ]} />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    cargaMasiva: state.cargasMasivasReducer.cargaMasiva
  }
}

export default connect(mapStateToProps, null)(DatosPrincipales);