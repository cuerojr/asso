import React, { Fragment, useState } from 'react';
import { Row, Col } from "reactstrap";
import ResultadoConsulta from '../../../componentes/resultados_informes/resultadoConsulta';
import { altaInformeTipoOnline } from '../../../lib/informe-online-api';
import { NotificationManager } from "../../../components/common/react-notifications";
import GuardarInformeModal from '../../../componentes/resultados_informes/guardarInformeModal';
import EdicionGenerarConsulta from '../../../componentes/resultados_informes/edicionGenerarConsulta';
import { agregarCero } from "../../../componentes/utils/utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import { connect } from 'react-redux';

const GenerarConsulta = (props) => {
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [resultadoConsulta, setResultadoConsulta] = useState(null);
  const [mostrarModalGuarda, setMostrarModalGuarda] = useState(false);
  const [mantenerDatos, setMantenerDatos] = useState({});
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const navigate = useNavigate();
  const { cliente } = useParams(); // 👈 ahora sacamos el id del cliente

  const aplicarConsulta = (
    idEmpresa,
    seccionesIds,
    rutasIds,
    desdeMes,
    desdeAnio,
    hastaMes,
    hastaAnio,
    tipoTesteoSeleccionado
  ) => {
    setLoadingSpinner(true);
    setMantenerDatos({
      idEmpresa,
      seccionesIds,
      rutasIds,
      desdeMes,
      desdeAnio,
      hastaMes,
      hastaAnio,
      tipoTesteoSeleccionado,
    });
    setMostrarResultado(false);

    altaInformeTipoOnline(
      idEmpresa,
      JSON.stringify(seccionesIds),
      JSON.stringify(rutasIds),
      null,
      null,
      agregarCero(desdeMes),
      desdeAnio,
      agregarCero(hastaMes),
      hastaAnio,
      tipoTesteoSeleccionado,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      0
    ).then((res) => {
      if (res.stat === 0) {
        NotificationManager.error(res.err, "Hubo un error", 3000);
      } else {
        setResultadoConsulta(res);
        setMostrarResultado(true);
      }
      setLoadingSpinner(false);
    });
  };

  const finalmenteGuarda = (
    titulo,
    descripcion,
    introduccion,
    planta,
    atencionLinea1,
    atencionLinea2,
    atencionLinea3,
    referencia,
    firma,
    opcionales
  ) => {
    altaInformeTipoOnline(
      mantenerDatos.idEmpresa,
      JSON.stringify(mantenerDatos.seccionesIds),
      JSON.stringify(mantenerDatos.rutasIds),
      titulo,
      descripcion,
      agregarCero(mantenerDatos.desdeMes),
      mantenerDatos.desdeAnio,
      agregarCero(mantenerDatos.hastaMes),
      mantenerDatos.hastaAnio,
      mantenerDatos.tipoTesteoSeleccionado,
      introduccion,
      planta,
      atencionLinea1,
      atencionLinea2,
      atencionLinea3,
      referencia,
      firma,
      opcionales,
      1
    ).then((res) => {
      if (res.stat === 1) {
        NotificationManager.success(
          "El informe ha sido guardado correctamente",
          "Informe guardado",
          3000
        );
        navigate(`/app/clientes/editar-cliente/${mantenerDatos.idEmpresa}/informes`);
      } else {
        NotificationManager.error(res.err, "Hubo un error", 3000);
      }
    });
  };

  return (
    <Fragment>
      <Row>
        <Col xs="12">
          <h1 className="titulo-ruta">
            {props.detalleCliente && (
              <Link to={`/app/clientes/editar-cliente/${props.detalleCliente.id}/equipos`}>
                {props.detalleCliente.empresa}
              </Link>
            )}
            &gt;
            {props.detalleCliente && (
              <Link to={`/app/clientes/editar-cliente/${props.detalleCliente.id}/informes`}>
                INFORMES
              </Link>
            )}
            <span>&gt; Generar Consulta</span>
          </h1>
        </Col>
        <Col xs="12">
          <div className="separator mb-5"></div>
        </Col>
      </Row>

      <EdicionGenerarConsulta
        aplicarConsulta={aplicarConsulta}
        idEmpresa={cliente} // 👈 ahora pasamos desde useParams
      />

      <Row>
        <Col className="mt-4 resultados-al-vuelo position-relative">
          {loadingSpinner && (
            <div className="loading position-absolute" style={{ top: "100px" }} />
          )}
          {mostrarResultado && (
            <ResultadoConsulta
              mostrarbts={true}
              informeYaGenerado={false}
              resultadoConsulta={resultadoConsulta}
              setMostrarModalGuarda={setMostrarModalGuarda}
              idEmpresa={cliente}
            />
          )}
        </Col>
      </Row>

      <GuardarInformeModal
        mostrarModalGuarda={mostrarModalGuarda}
        setMostrarModalGuarda={setMostrarModalGuarda}
        finalmenteGuarda={finalmenteGuarda}
      />
    </Fragment>
  );
};

export default connect((state) => ({
  detalleCliente: state.clientesReducer.detalleClienteState,
}))(GenerarConsulta);
