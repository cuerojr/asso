import React, { useEffect, useState, useRef, Fragment, useCallback } from "react";
import { connect } from "react-redux";
import {
  fetchlistarEquipos,
  filtrarEquipos,
  mostrarOcultarModalCargarVariosEquipos,
  mostrarOcultarModalImportarEquipos,
  resetEquiposAction
} from "../../reducers/equipos-reducer";
import { fetchlistarSecciones } from "../../reducers/secciones-reducer";
import { fetchlistarRutas } from "../../reducers/rutas-reducer";
import { fetchlistarEstados } from "../../reducers/estados-reducer";
import { fetchlistarFallas } from "../../reducers/fallas-reducer";

import {
  Row,
  Button,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Col,
} from "reactstrap";
import { ItemListaEquipo } from "../../componentes/itemListaEquipo";
import NuevoEquipo from "../../componentes/nuevoEquipo";
import CargarVariosEquipos from "../../componentes/cargarVariosEquipos";
import DetalleEquipo from "../../componentes/detalleEquipo";
import ImportarXLS from "../../componentes/importarXLS";
import {
  altaEquipo,
  actualizarEquipo,
  eliminarEquipo,
} from "../../lib/equipos-api";
import { NotificationManager } from "../../components/common/react-notifications";
import FiltroDeEquipos from "../../componentes/filtroDeEquipos";

const Equipos = ({
  idEmpresa,
  equipos,
  secciones,
  rutas,
  estados,
  fallas,
  fetchlistarEquipos,
  fetchlistarSecciones,
  fetchlistarRutas,
  fetchlistarEstados,
  filtrarEquipos,
  fetchlistarFallas,
  mostrarOcultarModalCargarVariosEquipos,
  mostrarOcultarModalImportarEquipos,
  nombreEmpresa,
  currentTab,
  resetEquiposAction,
}) => {
  const [modalNuevoEquipo, setModalNuevoEquipo] = useState(false);
  const [barraNuevoEquipo, setBarraNuevoEquipo] = useState(false);
  const [detalleEquipo, setDetalleEquipo] = useState(null);
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const llamarItemEquipos = useRef([]);

  // Fetch inicial
  useEffect(() => {
    if (currentTab === "equipos") {
      fetchlistarEquipos(idEmpresa);
      fetchlistarSecciones(idEmpresa);
      fetchlistarRutas(idEmpresa);
      fetchlistarEstados(idEmpresa);
      fetchlistarFallas(idEmpresa);

      setDetalleEquipo(null);
      setCurrentPage(1);
      setEquiposFiltrados([]);
    }
    
  }, [idEmpresa, currentTab]);

  // Determinar la lista a mostrar según filtros
  const equiposAMostrar = equiposFiltrados.length ? equiposFiltrados : equipos;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEquipos = equiposAMostrar.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(equiposAMostrar.length / itemsPerPage);

  // CRUD
  const cargarEquipo = (nombre, seccion, ruta) => {
    altaEquipo(idEmpresa, nombre, seccion, ruta).then((res) => {
      if (res.stat === 1) {
        NotificationManager.success("El equipo ha sido Cargado", "Hecho", 3000);
        fetchlistarEquipos(idEmpresa);
        setModalNuevoEquipo(false);
        setBarraNuevoEquipo(false);
      } else {
        NotificationManager.error(res.err, "Error");
      }
    });
  };

  const updateEquipo = (idEquipo, nombre, descripcion, idSeccion, idRuta) => {
    actualizarEquipo(
      idEmpresa,
      idEquipo,
      nombre,
      descripcion,
      idSeccion,
      idRuta
    ).then((res) => {
      if (res.stat === 1) {
        NotificationManager.success(
          "El equipo ha sido actualizado",
          "Hecho",
          3000
        );
        fetchlistarEquipos(idEmpresa);
      } else {
        NotificationManager.error(res.err, "Error");
      }
    });
  };

  const borrarEquipo = (idEquipo) => {
    eliminarEquipo(idEquipo).then((res) => {
      if (res.stat === 1) {
        NotificationManager.success(
          "El equipo ha sido eliminado",
          "Hecho",
          3000
        );
        fetchlistarEquipos(idEmpresa);
        setDetalleEquipo(null);
      } else {
        NotificationManager.error(res.err, "Error");
      }
    });
  };

  const handleFilter = useCallback((data) => {
  setEquiposFiltrados(data);
}, []);

  return (
    <Fragment>
      <CargarVariosEquipos idEmpresa={idEmpresa} />
      <ImportarXLS idEmpresa={idEmpresa} />

      {!detalleEquipo ? (
        <Fragment>
          <Row className="align-items-center justify-content-between p-4">
            <Col xs="12" md="6" className="mb-3 mb-md-0 p-0">
              <h1 className="m-0 p-0">{equipos.length} Equipos</h1>
            </Col>
            <Col xs="12" md="6" className="text-md-end p-0 text-right">
              <Dropdown
                isOpen={modalNuevoEquipo}
                toggle={() => setModalNuevoEquipo(!modalNuevoEquipo)}
              >
                <DropdownToggle color="success">NUEVO EQUIPO</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => setBarraNuevoEquipo(true)}>
                    Un Equipo
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => mostrarOcultarModalCargarVariosEquipos(true)}
                  >
                    Varios Equipos
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => mostrarOcultarModalImportarEquipos(true)}
                  >
                    Importar XLS
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>

          {/* Filtros */}
          <FiltroDeEquipos
            idEmpresa={idEmpresa}
            equipos={equipos}
            secciones={secciones}
            rutas={rutas}
            estados={estados}
            fallas={fallas}
            onFilter={handleFilter}
          />

          {/* Lista */}
          <Row>
            {currentEquipos.length === 0 ? (
              <div className="loading" />
            ) : (
              currentEquipos.map((equipo, idx) => (
                <ItemListaEquipo
                  key={equipo.id}
                  item={equipo}
                  mostrarDetalleEquipo={setDetalleEquipo}
                  llamarItemEquipos={llamarItemEquipos[idx]}
                />
              ))
            )}
          </Row>

          {/* Paginación */}
          <Row className="justify-content-center">
            {totalPages > 1 && (
              <div className="d-flex justify-content-center my-3">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Anterior
                </Button>
                <span className="mx-3 align-self-center">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </Row>

          {/* Modal de Nuevo Equipo */}
          <NuevoEquipo
            idEmpresa={idEmpresa}
            //mostrarModal={modalNuevoEquipo}
            mostrarModal={barraNuevoEquipo}
            manejarModal={setBarraNuevoEquipo}
            nombreEmpresa={nombreEmpresa}
            cargarEquipo={cargarEquipo}
          />
        </Fragment>
      ) : (
        <DetalleEquipo
          equipo={detalleEquipo}
          salirDetalleEquipo={() => setDetalleEquipo(null)}
          idEmpresa={idEmpresa}
          nombreEmpresa={nombreEmpresa}
          updateEquipo={updateEquipo}
          borrarEquipo={borrarEquipo}
        />
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  equipos: state.equiposReducer.equipos,
  secciones: state.seccionesReducer.secciones,
  rutas: state.rutasReducer.rutas,
  estados: state.estadosReducer.estados,
  fallas: state.fallasReducer.fallas,
});

export default connect(mapStateToProps, {
  fetchlistarEquipos,
  fetchlistarSecciones,
  fetchlistarRutas,
  fetchlistarEstados,
  filtrarEquipos,
  fetchlistarFallas,
  mostrarOcultarModalCargarVariosEquipos,
  mostrarOcultarModalImportarEquipos,
  resetEquiposAction
})(Equipos);
