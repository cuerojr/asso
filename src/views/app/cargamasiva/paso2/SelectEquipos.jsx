import React, { useEffect } from 'react';
import { InputGroup, InputGroupAddon, Input } from "reactstrap";
import { connect } from 'react-redux';
import { fetchListarEquiposEnCargaMasivaSeleccionada, setearEquipoSeleccionadoEnCargaMasiva, fetchDetalleDeComponentesYControles, setearEquipoNoControlado } from '../../../../reducers/cargas-masivas-reducer';

const SelectEquipos = ({
    equiposEnCargaMasiva, 
    fetchListarEquiposEnCargaMasivaSeleccionada, 
    cargaMasiva, 
    setearEquipoSeleccionadoEnCargaMasiva, 
    equipoSeleccionadoEnCargaMasiva, 
    fetchDetalleDeComponentesYControles, 
    setearEquipoNoControlado
}) => {
    
    useEffect(()=>{
        fetchListarEquiposEnCargaMasivaSeleccionada(cargaMasiva.clienteSeleccionado.value, cargaMasiva.id);
    },[fetchListarEquiposEnCargaMasivaSeleccionada, cargaMasiva])

    useEffect(()=>{
        if(equipoSeleccionadoEnCargaMasiva){
            fetchDetalleDeComponentesYControles(cargaMasiva.id, equipoSeleccionadoEnCargaMasiva)
        }
    },[equipoSeleccionadoEnCargaMasiva, fetchDetalleDeComponentesYControles, cargaMasiva])

    return (
                <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                        NOMBRE DEL EQUIPO::
                    </InputGroupAddon>
                    <Input 
                        className="bg-black" 
                        type="select" 
                        name="equipo" 
                        onChange={(e) => { 
                            setearEquipoSeleccionadoEnCargaMasiva(e.target.value); 
                            setearEquipoNoControlado(null) 
                            }} 
                        value={equipoSeleccionadoEnCargaMasiva || ""} >
                        <option>-- Seleccione un equipo -- </option>
                        {equiposEnCargaMasiva && equiposEnCargaMasiva.map((equipo, i) => {
                            return (<option key={i} value={equipo.id}>{equipo.nombre}</option>)
                        })}
                    </Input>
                </InputGroup>
    );
};

const mapStateToProps = (state) => {
    return {
        equiposEnCargaMasiva: state.cargasMasivasReducer.equiposEnCargaMasiva,
        cargaMasiva: state.cargasMasivasReducer.cargaMasiva,
        equipoSeleccionadoEnCargaMasiva: state.cargasMasivasReducer.equipoSeleccionadoEnCargaMasiva
      }
}
export default connect(
    mapStateToProps,
    { 
        fetchListarEquiposEnCargaMasivaSeleccionada, 
        setearEquipoSeleccionadoEnCargaMasiva, 
        fetchDetalleDeComponentesYControles, 
        setearEquipoNoControlado }
)(SelectEquipos);

