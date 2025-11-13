import React from 'react';
import { Tarjeta } from "./tarjeta";
import { Button } from "reactstrap";

export const ItemListaSecciones = ({ seccion, seleccionarSeccion }) => {
    const abrirSeccion = (e) =>{
        e.preventDefault();
        seleccionarSeccion();
    }
    return (
        <div className="col-md-4 col-xs-6 col-sm-6 seccion-item mb-3" id={seccion.id}>
            <Tarjeta>
                <h3 className="titulo-seccion"><Button color="link" onClick={abrirSeccion} href="#">{seccion.nombre} </Button></h3>
                <div className='d-flex justify-content-between'>
                    <div><span>{seccion.informes} Informes</span> <span className='ml-2'>{seccion.equipos} Equipos</span></div>
                    <div><span className='estados-tag pl-2 pr-2 ml-2' style={ seccion.estado == 1 ? {'background': '#28a745'}:{'background':'#7b7b7b'}}>{seccion.estado == 1 ? 'habilitada':'deshabilitada'}</span></div>
                </div>                
                <i className="simple-icon-folder-alt" />
                <div className="handlebt">
                    <div className="simple-icon-arrow-up" />
                    <div className="simple-icon-arrow-down" />
                </div>
            </Tarjeta>
        </div>
    );
};