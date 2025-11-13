import React, { useEffect, useState } from "react";
import { NuevaFalla } from "../../componentes/nuevaFalla";
import { ItemListaFalla } from "../../componentes/itemListaFalla";
import Sortable from "react-sortablejs";
import { fetchlistarFallas } from "../../reducers/fallas-reducer";
import { connect } from "react-redux";
import EditarFalla from "../../componentes/editarFalla";
import {
  altaFalla,
  actualizarFalla,
  eliminarFalla,
  ordenarFallas,
} from "../../lib/fallas-api";
import { NotificationManager } from "../../components/common/react-notifications";

const Fallas = (props) => {
  const [fallaSeleccionada, setFallaSeleccionada] = useState(null);
  const [modalEditarFalla, setModalEditarFalla] = useState(false);

  useEffect(() => {
    props.fetchlistarFallas(props.idEmpresa);
  }, [props.idEmpresa, props.fetchlistarFallas]);

  const seleccionarFalla = (falla) => {
    setFallaSeleccionada(falla);
    setModalEditarFalla(true);
  };

  const recorrerLista = () => {
    let div_list = document.querySelectorAll(".fallas");
    let ids = Array.from(div_list).map(
      (item) => item.getAttribute("id").split("-")[1]
    );

    ordenarFallas(JSON.stringify(ids), ids.length).then((res) => {
      if (res && res.stat === 0) {
        NotificationManager.error(res.err, "Error");
      } else {
        NotificationManager.success(
          "Fallas ordenadas correctamente",
          "Hecho",
          3000,
          null,
          null,
          ""
        );
      }
    });
  };

  const cargarFalla = (nombre, color, nombreCorto, descripcion) => {
    altaFalla(props.idEmpresa, nombre, color, nombreCorto, descripcion).then(
      (res) => {
        if (res.stat === 1) {
          NotificationManager.success(
            "La falla ha sido cargada",
            "Hecho",
            3000,
            null,
            null,
            ""
          );
          props.fetchlistarFallas(props.idEmpresa);
        }
      }
    );
  };

  const updateFalla = (id, nombre, color, nombreCorto, descripcion) => {
    actualizarFalla(
      props.idEmpresa,
      id,
      nombre,
      color,
      nombreCorto,
      descripcion
    ).then((res) => {
      if (res.stat === 1) {
        NotificationManager.success(
          "El estado ha sido actualizado",
          "Hecho",
          3000,
          null,
          null,
          ""
        );
        props.fetchlistarFallas(props.idEmpresa);
        setModalEditarFalla(false);
      } else {
        NotificationManager.error(res.err, "Error");
      }
    });
  };

  const deleteFalla = (id) => {
    eliminarFalla(id).then((res) => {
      if (res.stat === 1) {
        NotificationManager.success(
          "La falla ha sido eliminada",
          "Hecho",
          3000,
          null,
          null,
          ""
        );
        props.fetchlistarFallas(props.idEmpresa);
      } else {
        NotificationManager.error(res.err, "Error");
      }
    });
  };

  const RenderSortable = ({ fallas }) => (
    <Sortable
      className="row"
      id="lista"
      options={{
        animation: 150,
        //handle: ".handlebt",
        onEnd: recorrerLista,
      }}
    >
      {fallas &&
        fallas.map((falla, index) => (
          <ItemListaFalla
            key={index}
            item={falla}
            seleccionarFalla={seleccionarFalla}
            deleteFalla={deleteFalla}
          />
        ))}
    </Sortable>
  );

  return (
    <div>
      <NuevaFalla cargarFalla={cargarFalla} />
      {props.fallas && <RenderSortable fallas={props.fallas} />}
      {(!props.fallas || props.fallas.length === 0) && (
        <div className="text-center h4 mt-5">No hay fallas cargadas</div>
      )}
      <EditarFalla
        mostrarModal={modalEditarFalla}
        idEmpresa={props.idEmpresa}
        falla={fallaSeleccionada}
        manejarModal={setModalEditarFalla}
        updateFalla={updateFalla}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  fallas: state.fallasReducer.fallas,
});

export default connect(mapStateToProps, { fetchlistarFallas })(Fallas);
