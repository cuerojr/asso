import React, { useEffect, useState } from 'react';
import { Tarjeta } from "../../../../componentes/tarjeta";
import { Row, Col, Button } from "reactstrap";
import SelectEquipos from './SelectEquipos';
import DatosPrincipales from './DatosPrincipales';
import { connect } from 'react-redux';
import CargaControles from './CargaControles';
import { fetchlistarFallas } from "../../../../reducers/fallas-reducer";
import { fetchlistarEstados } from "../../../../reducers/estados-reducer";
import { fetchListarObservaciones, fetchListarRecomendaciones } from "../../../../reducers/autocompletar-reducer";
import NavegacionEquipo from './BtNavegacionEquipos';
import FInalizar from './FInalizar';
import EquipoNoControlado from './EquipoNoControlado';

const Paso2 = ({ 
    equiposEnCargaMasiva, 
    equipoSeleccionadoEnCargaMasiva, 
    fetchlistarFallas, 
    fetchlistarEstados, 
    cargaMasiva, 
    fetchListarRecomendaciones, 
    fetchListarObservaciones 
}) => {
    //console.log("🚀 ~ Paso2 ~ equipoSeleccionadoEnCargaMasiva:", equipoSeleccionadoEnCargaMasiva)

    const [index, setindex] = useState(0);

    useEffect(() => {
        if (equipoSeleccionadoEnCargaMasiva) { // esta función es para mostrar el texto 'itemN de N'
            const indice = equiposEnCargaMasiva.findIndex(equipo => equipo.id === equipoSeleccionadoEnCargaMasiva);
            setindex(indice + 1)
        }
    }, [equiposEnCargaMasiva, equipoSeleccionadoEnCargaMasiva])

    useEffect(() => {
        fetchlistarFallas(cargaMasiva.clienteSeleccionado.value)
        fetchlistarEstados(cargaMasiva.clienteSeleccionado.value)
        fetchListarObservaciones();
        fetchListarRecomendaciones();
    }, [])

    return (
        <>
            <Tarjeta>
                <div className='container'>
                    <div className="col-12 p-0 mt-2">
                        <DatosPrincipales />
                    </div>
                </div>
                {equipoSeleccionadoEnCargaMasiva && <div className='container mb-4'>
                    <div className='col-12 p-0 mt-2'>
                        {index} de {equiposEnCargaMasiva.length}
                    </div>
                    <div className='d-flex justify-content-end pr-0'>
                        <FInalizar />
                        <NavegacionEquipo direccion='nextYGuardar' />
                    </div>
                </div>}
                <div className='container mb-4 p-0'>
                    <SelectEquipos equipoSeleccionadoEnCargaMasiva={equipoSeleccionadoEnCargaMasiva} />
                </div>
                {equipoSeleccionadoEnCargaMasiva &&
                    (<div className='container mb-4 d-flex justify-content-end'>
                        <NavegacionEquipo direccion='soloGuardar' />
                    </div>)
                }
                <EquipoNoControlado key={equipoSeleccionadoEnCargaMasiva} />

            </Tarjeta>
            {equipoSeleccionadoEnCargaMasiva && <CargaControles />}
            {equipoSeleccionadoEnCargaMasiva && <div className='container'>
                <div className='d-flex justify-content-center'>
                    <NavegacionEquipo direccion='prev' />
                    <NavegacionEquipo direccion='nextYGuardar' />
                </div>
            </div>}
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        equiposEnCargaMasiva: state.cargasMasivasReducer.equiposEnCargaMasiva,
        equipoSeleccionadoEnCargaMasiva: state.cargasMasivasReducer.equipoSeleccionadoEnCargaMasiva,
        cargaMasiva: state.cargasMasivasReducer.cargaMasiva,
    }
}
export default connect(
    mapStateToProps, { fetchlistarFallas, fetchlistarEstados, fetchListarObservaciones, fetchListarRecomendaciones })(Paso2);