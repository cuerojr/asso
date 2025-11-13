import React, { Fragment, useEffect, useState } from 'react';
import { Row } from "reactstrap";
import { fetchlistarRutas } from '../../reducers/rutas-reducer';
import { connect } from 'react-redux';
import { NuevaRuta } from "../../componentes/nuevaRuta";
import Sortable from "react-sortablejs";
import { ItemListaRuta } from '../../componentes/itemListaRuta';
import { DetalleRuta } from '../../componentes/detalleRuta';
import { altaRuta, actualizarRuta, eliminarRuta, ordenarRutas } from '../../lib/rutas-api';
import { NotificationManager } from "../../components/common/react-notifications";

const Rutas = (props) => {
    const [mostrarDetalleRuta, setMostrarDetalleRuta] = useState(false);
    const [rutaSeleccionada, setRutaSeleccionada] = useState(null);

    useEffect(() => {
        if (props.currentTab === 'rutas') {
            props.fetchlistarRutas(props.idEmpresa);
        }
    }, [props.currentTab, props.fetchlistarRutas, props.idEmpresa]);

    const recorrerLista = () => {
        const div_list = document.querySelectorAll('.rutas');
        const ids = Array.from(div_list).map(item => item.getAttribute('id').split('-')[1]);

        ordenarRutas(JSON.stringify(ids), ids.length).then(res => {
            if (res && res.stat === 0) {
                NotificationManager.error(res.err, "Error");
            } else {
                NotificationManager.success("Rutas ordenadas correctamente", "Hecho", 3000, null, null, '');
            }
        });
    };

    const seleccionarRuta = (ruta) => {
        setRutaSeleccionada(ruta);
        setMostrarDetalleRuta(true);
    };

    const salirDetalleRuta = () => {
        setMostrarDetalleRuta(false);
        setRutaSeleccionada(null);
    };

    const cargarRuta = (nombre, descripcion) => {
        altaRuta(props.idEmpresa, nombre, descripcion).then((res) => {
            if (res.stat === 1) {
                NotificationManager.success("La ruta ha sido creada", "Hecho", 3000, null, null, '');
                props.fetchlistarRutas(props.idEmpresa);
            } else {
                NotificationManager.error(res.err, "Error");
            }
        });
    };

    const updateRuta = (idRuta, nombre, descripcion) => {
        actualizarRuta(props.idEmpresa, idRuta, nombre, descripcion).then((res) => {
            if (res.stat === 1) {
                NotificationManager.success("La ruta ha sido actualizada", "Hecho", 3000, null, null, '');
                props.fetchlistarRutas(props.idEmpresa);
                salirDetalleRuta();
            } else {
                NotificationManager.error(res.err, "Error");
            }
        });
    };

    const borrarRuta = (idRuta) => {
        eliminarRuta(idRuta).then((res) => {
            if (res.stat === 1) {
                NotificationManager.success("La ruta ha sido eliminada", "Hecho", 3000, null, null, '');
                props.fetchlistarRutas(props.idEmpresa);
                salirDetalleRuta();
            } else {
                NotificationManager.error(res.err, "Error");
            }
        });
    };

    const RenderSortable = ({ rutas }) => (
        <Sortable
            className="row"
            id="lista"
            options={{
                animation: 150,
                //handle: ".handlebt",
                onEnd: recorrerLista
            }}
        >
            {rutas && rutas.map((ruta, index) => (
                <ItemListaRuta
                    key={index}
                    item={ruta}
                    seleccionarRuta={seleccionarRuta}
                />
            ))}
        </Sortable>
    );

    return (
        <Fragment>
            {!mostrarDetalleRuta ? (
                <Fragment>
                    <Row>
                        <div className="col-md-12">
                            {props.rutas && <h1>{props.rutas.length} Rutas</h1>}
                        </div>
                        <div className="col-md-12">
                            <div className="separator mb-5"></div>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-md-12">
                            <NuevaRuta cargarRuta={cargarRuta} />
                        </div>
                        <div className="col-md-12 mt-4">
                            {props.rutas && <RenderSortable rutas={props.rutas} />}
                        </div>
                    </Row>
                </Fragment>
            ) : (
                <DetalleRuta
                    ruta={rutaSeleccionada}
                    salirDetalleRuta={salirDetalleRuta}
                    updateRuta={updateRuta}
                    borrarRuta={borrarRuta}
                />
            )}
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    rutas: state.rutasReducer.rutas,
});

export default connect(
    mapStateToProps,
    { fetchlistarRutas }
)(Rutas);
