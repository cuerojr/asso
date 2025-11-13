import React, { useEffect, Fragment, useState } from "react";
import { fetchlistarSecciones } from "../../reducers/secciones-reducer";
import { connect } from "react-redux";
import Sortable from "react-sortablejs";
import { ordenSecciones } from "../../lib/secciones-api";
import { ItemListaSecciones } from "../../componentes/itemListaSecciones";
import NuevaSeccion from "../../componentes/nuevaSeccion";
import { Row } from "reactstrap";
import DetalleSeccion from "../../componentes/detalleSeccion";

const Secciones = (props) => {
  const [mostrarSecciones, setMostrarSecciones] = useState(true);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);

  useEffect(() => {
    if (props.currentTab === "secciones") {
      props.fetchlistarSecciones(props.idEmpresa);
    }
    setMostrarSecciones(true);
  }, [props.currentTab, props.fetchlistarSecciones, props.idEmpresa]);

  const recorrerLista = () => {
    const lista = document.getElementById("lista");
    if (!lista) return;

    const itemToSave = Array.from(lista.childNodes).map((item) =>
      item.getAttribute("id")
    );
    ordenSecciones(JSON.stringify(itemToSave));
  };

  const seleccionarSeccion = (seccion) => {
    setMostrarSecciones(false);
    setSeccionSeleccionada(seccion);
  };

  const salirSeleccion = () => {
    setMostrarSecciones(true);
    setSeccionSeleccionada(null);
  };

  const RenderSortable = ({ secciones }) => (
    <Sortable
      className="row lista-secciones"
      id="lista"
      options={{
        animation: 150,
        //handle: ".handlebt",
        onEnd: recorrerLista,
      }}
    >
      {secciones &&
        secciones.map((seccion) => (
          <ItemListaSecciones
            key={seccion.id}
            id={seccion.id}
            seccion={seccion}
            seleccionarSeccion={() => seleccionarSeccion(seccion)}
          />
        ))}
    </Sortable>
  );

  return (
    <Fragment>
      {mostrarSecciones ? (
        <div className="secciones">
          <Row>
            <div className="col-md-12">
              {props.secciones && props.secciones.length > 0 && (
                <h1>{props.secciones.length} Secciones</h1>
              )}
            </div>
            <div className="col-md-12">
              <div className="separator mb-5"></div>
            </div>
          </Row>

          <NuevaSeccion
            idEmpresa={props.idEmpresa}
            recargarSecciones={props.fetchlistarSecciones}
          />

          <RenderSortable secciones={props.secciones} />
        </div>
      ) : (
        <DetalleSeccion
          seccion={seccionSeleccionada}
          salirSeleccion={salirSeleccion}
          recargarSecciones={props.fetchlistarSecciones}
          abrirModal={props.abrirModal}
          volverSecciones={salirSeleccion}
          nombreEmpresa={props.nombreEmpresa}
        />
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  secciones: state.seccionesReducer.secciones,
});

export default connect(mapStateToProps, { fetchlistarSecciones })(Secciones);
