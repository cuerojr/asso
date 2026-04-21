import React from "react";
import { Tarjeta } from "./tarjeta";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpDown, faFolder } from "@fortawesome/free-solid-svg-icons";

export const ItemListaSecciones = ({ seccion, seleccionarSeccion }) => {
  const abrirSeccion = (e) => {
    e.preventDefault();
    seleccionarSeccion();
  };
  return (
    <div
      className="col-md-4 col-xs-6 col-sm-6 seccion-item mb-3"
      id={seccion.id}
    >
      <Tarjeta>
        <Button color="link" className="text-left pl-0" onClick={abrirSeccion}>
          <h3 className="titulo-seccion m-0">{seccion.nombre} </h3>
        </Button>
        <div className="">
          <p className="m-0"><span className="opacity-75">Informes</span> {seccion.informes}</p>
          <p className="m-0"><span className="opacity-75">Equipos</span> {seccion.equipos}</p>
        </div>

        <div className=" mt-2">
          <div
            className="p-2 width-full h6 text-center rounded"
            style={
              seccion.estado == 1
                ? { background: "#28a745" }
                : { background: "#7b7b7b" }
            }
          >
            <span className="font-black">{seccion.estado == 1 ? "Habilitada" : "Deshabilitada"}</span>
          </div>
        </div>

        <div className="handlebt" style={{
            cursor: "grab"
        }}>
          <FontAwesomeIcon icon={faArrowsUpDown} />
        </div>
      </Tarjeta>
    </div>
  );
};
