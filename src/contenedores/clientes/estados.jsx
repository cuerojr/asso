import React, { useEffect, useState } from "react";
import { NuevoEstado } from "../../componentes/nuevoEstado";
import { fetchlistarEstados } from "../../reducers/estados-reducer";
import { connect } from "react-redux";
import { ItemListaEstado } from "../../componentes/itemListaEstado";
import Sortable from "react-sortablejs";
import EditarEstado from "../../componentes/editarEstado";
import {
  altaEstado,
  actualizarEstado,
  eliminarEstado,
  ordenarEstados,
} from "../../lib/estados-api";
import { NotificationManager } from "../../components/common/react-notifications";

const Estados = (props) => {
  useEffect(() => {
    props.fetchlistarEstados(props.idEmpresa);
  }, [props.idEmpresa]);

  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [modalEditarEstado, setModalEditarEstado] = useState(false);

  const recorrerLista = () => {
    let div_list = document.querySelectorAll(".estados");
    let div_array = [...div_list];
    let ids = [];
    div_array.forEach((item) => {
      let id = item.getAttribute("id");
      id = id.split("-")[1];
      ids.push(id);
    });

    ordenarEstados(JSON.stringify(ids), ids.length).then((res) => {
      if (res && res.stat === 0) {
        NotificationManager.error(res.err, "Error");
      } else {
        NotificationManager.success(
          "Estados ordenados correctamente",
          "Hecho",
          3000
        );
      }
    });
  };

  const seleccionarEstado = (estado) => {
    setEstadoSeleccionado(estado);
    setModalEditarEstado(true);
  };

  const cargarEstado = (nombre, color, descripcion, nombreCorto) => {
    altaEstado(props.idEmpresa, nombre, color, descripcion, nombreCorto).then(
      (res) => {
        if (res.stat === 1) {
          NotificationManager.success(
            "El estado ha sido cargado",
            "Hecho",
            3000
          );
          props.fetchlistarEstados(props.idEmpresa);
        }
      }
    );
  };

  const updateEstado = (id, nombre, color, descripcion, nombreCorto) => {
    actualizarEstado(
      props.idEmpresa,
      id,
      nombre,
      color,
      descripcion,
      nombreCorto
    ).then((res) => {
      if (res.stat === 1) {
        NotificationManager.success(
          "El estado ha sido actualizado",
          "Hecho",
          3000
        );
        props.fetchlistarEstados(props.idEmpresa);
        setModalEditarEstado(false);
      } else {
        NotificationManager.error(res.err, "Error");
      }
    });
  };

  const deleteEstado = (id) => {
    eliminarEstado(id).then((res) => {
      if (res.stat === 1) {
        NotificationManager.success(
          "El estado ha sido eliminado",
          "Hecho",
          3000
        );
        props.fetchlistarEstados(props.idEmpresa);
      } else {
        NotificationManager.error(res.err, "Error");
      }
    });
  };

  const RenderSortable = ({ estados }) => {
    return (
      <Sortable
        className="row"
        id="lista"
        options={{
          animation: 150,
          //handle: ".handlebt",
          onEnd: recorrerLista,
        }}
      >
        {estados &&
          estados.map((estado, index) => (
            <ItemListaEstado
              key={index}
              item={estado}
              seleccionarEstado={seleccionarEstado}
              deleteEstado={deleteEstado}
            />
          ))}
      </Sortable>
    );
  };

  return (
    <div>
      <NuevoEstado cargarEstado={cargarEstado} />
      {props.estados && <RenderSortable estados={props.estados} />}
      {(!props.estados || props.estados.length === 0) && (
        <div className="text-center h4 mt-5">No hay estados cargados</div>
      )}
      <EditarEstado
        mostrarModal={modalEditarEstado}
        idEmpresa={props.idEmpresa}
        estado={estadoSeleccionado}
        manejarModal={setModalEditarEstado}
        updateEstado={updateEstado}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  estados: state.estadosReducer.estados,
});

export default connect(mapStateToProps, { fetchlistarEstados })(Estados);
