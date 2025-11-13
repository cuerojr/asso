import React, { useEffect, Fragment, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import { 
  fetchgetDetalleInforme, 
  fetchlistarInformes, 
  filtrarInformes 
} from '../../reducers/informes-reducer';
import { deleteInforme } from '../../lib/informes-api';
import { ItemListaInforme } from "../../componentes/itemListaInforme";
import DetalleInforme from "../informes/detalleInforme";

import { 
  Row, Button, Input, 
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, 
  Modal, ModalBody, ModalFooter  
} from "reactstrap";

import { fetchlistarSecciones } from '../../reducers/secciones-reducer';
import { fetchListarServicios } from '../../reducers/servicios-reducer';

import { NotificationManager } from "../../components/common/react-notifications";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

const Informes = (props) => {
  const [mostrarDetalle, setMostrarDetalle] = useState(0);
  const [seccionesIds, setSeccionesIds] = useState([]);
  const [serviciosIds, setServiciosIds] = useState([]);
  const [totalInformes, setTotalInformes] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mostrarModalConfirmarEliminarInforme, setMostrarModalConfirmarEliminarInforme] = useState(false);
  const [idInformeABorrar, setIdInformeABorrar] = useState(0);
  const [navRefVisible, setNavRefVisible] = useState(true);
  const filterNavRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (props.currentTab === 'informes') {
      props.fetchlistarInformes(props.idEmpresa);
      props.fetchlistarSecciones(props.idEmpresa);
      props.fetchListarServicios();
    }
    setMostrarDetalle(0);
  }, [props.currentTab]);

  const verDetalleInforme = (e, idEmpresa, idInforme) => {
    e.preventDefault();
    props.fetchgetDetalleInforme(idEmpresa, idInforme).then(() => {
      setMostrarDetalle(1);
    });
  };

  const ocultarDetalle = () => {
    setMostrarDetalle(0);
  };

  const recorrerInformes = (id, checkeado) => {
    if (checkeado) {
      setSeccionesIds(prev => [...prev, id]);
    } else {
      setSeccionesIds(seccionesIds.filter(idSeccion => idSeccion !== id));
    }
  };

  const recorrerServicios = (id, checkeado) => {
    if (checkeado) {
      setServiciosIds(prev => [...prev, id]);
    } else {
      setServiciosIds(serviciosIds.filter(idServicio => idServicio !== id));
    }
  };

  useEffect(() => {
    if (seccionesIds.length > 0 || serviciosIds.length > 0) {
      props.filtrarInformes(seccionesIds, serviciosIds, props.idEmpresa);
      setTimeout(() => {
        if (totalInformes !== null) {
          setTotalInformes(document.querySelectorAll(".item-informe").length);
        }
      }, 500);
    } else {
      props.fetchlistarInformes(props.idEmpresa);
    }
  }, [seccionesIds, serviciosIds]);

  useEffect(() => {
    if (seccionesIds.length === 0 && serviciosIds.length === 0 && props.informes != null) {
      setTotalInformes(props.informes.length);
    }
  }, [props.informes]);

  const toggle = () => setDropdownOpen(!dropdownOpen);

  const toggleInformeFiltro = () => {
    setNavRefVisible(!navRefVisible);
  };

  const borrarInforme = () => {
    deleteInforme(idInformeABorrar).then((res) => {
      if (res.stat === 1) {
        props.fetchlistarInformes(props.idEmpresa);
        NotificationManager.success("El informe ha sido Eliminado", "Hecho", 3000, null, null, '');
        setMostrarModalConfirmarEliminarInforme(false);
      } else if (res.stat === 0) {
        NotificationManager.error(res.err, "Error");
      }
    });
  };

  const preguntarBorrarInforme = (idInforme) => {
    setIdInformeABorrar(idInforme);
    setMostrarModalConfirmarEliminarInforme(true);
  };

  return (
    <Fragment>
      {mostrarDetalle === 0 && props.informes &&
        <Fragment>
          <div className="row">
            <div className="col-md-12">
              {totalInformes > 0 && <h1>{totalInformes} Informes</h1>}
              <div className="text-zero top-right-button-container">
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                  <DropdownToggle
                    onClick={toggle}
                    data-toggle="dropdown"
                    color="success"
                  >
                    Nuevo Informe
                    <FontAwesomeIcon icon={faAngleDown} className='ml-2 mt-1' />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => { props.abrirModal(props.idEmpresa) }}>Tipo Archivo</DropdownItem>
                    <DropdownItem 
                      onClick={() => navigate(`/app/clientes/nuevo-informe/${props.idEmpresa}/generar-consulta`)}
                    >
                      Tipo Online
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            <div className="col-md-12">
              <div className="separator mb-5"></div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-12">
              {props.informes && props.informes.map((informe) => (
                <ItemListaInforme 
                  key={informe.id} 
                  item={informe} 
                  verDetalleInforme={verDetalleInforme} 
                  deleteInforme={preguntarBorrarInforme} 
                  typo="archivo" 
                />
              ))}
            </div>
          </div>

          <div 
            className='' 
            style={{ zIndex: '1000', right: '10px', top: '100px', position: 'fixed' }}
          >
            <Button 
              className='mb-4' 
              outline
              onClick={toggleInformeFiltro}
            >
              {!navRefVisible ? "X" : "Ver Filtros"}
            </Button>
          </div>

          <div ref={filterNavRef} className={`app-menu ${!navRefVisible ? "shown" : "main-hidden"}`}>
            <div className='scrollbar-container ps'>
              <div className='app-menu-content px-4'>
                <h3 className='mt-3'>FILTRAR INFORMES</h3>

                <h4 className='mt-3'>Sección</h4>
                <div className='ml-3'>
                  {props.secciones && props.secciones.map((seccion) => (
                    <div key={seccion.id} className='position-relative'>
                      <Input
                        type="checkbox"
                        onChange={(e) => recorrerInformes(seccion.nombre, e.target.checked)}
                      />
                      {seccion.nombre}
                    </div>
                  ))}
                </div>

                <h4 className='mt-3'>Servicio</h4>
                <div className='ml-3'>
                  {props.servicios && props.servicios.map((servicio) => (
                    <div key={servicio.id} className='position-relative'>
                      <Input
                        type="checkbox"
                        onChange={(e) => recorrerServicios(servicio.servicio, e.target.checked)}
                      />
                      {servicio.servicio}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      }

      {typeof(totalInformes) === 'number' && totalInformes === 0 && (
        <div className="col-md-12 text-center"><h2>No se encontraron informes</h2></div>
      )}

      {totalInformes === null && <div className="loading" />}

      {mostrarDetalle === 1 && (
        props.detalleInforme ? (
          <DetalleInforme 
            detalleInforme={props.detalleInforme}  
            ocultarDetalle={ocultarDetalle} 
            deleteInforme={props.fetchDeleteInforme} 
          />
        ) : (
          <div className="loading" />
        )
      )}

      <Modal isOpen={mostrarModalConfirmarEliminarInforme} size="md">
        <ModalBody>
          <p>¿Desea eliminar este Informe?</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={borrarInforme}>
            Si, eliminar
          </Button>
          <Button className="neutro" onClick={() => setMostrarModalConfirmarEliminarInforme(false)}>
            No, cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    informes: state.informesReducer.informes,
    detalleInforme: state.informesReducer.detalleInforme,
    secciones: state.seccionesReducer.secciones,
    servicios: state.serviciosReducer.servicios,
  };
};

export default connect(
  mapStateToProps,
  { fetchlistarInformes, fetchgetDetalleInforme, fetchlistarSecciones, fetchListarServicios, filtrarInformes }
)(Informes);
