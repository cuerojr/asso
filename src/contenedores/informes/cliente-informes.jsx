import React, { Fragment, useEffect, useState, useImperativeHandle } from "react";
import { Row, Button } from "reactstrap";
import { ItemListaInforme } from "../../componentes/itemListaInforme";
import DetalleInforme from "./detalleInforme";
import { useNavigate } from "react-router-dom";

const Render = ({ informes, verDetalleInforme, abrirModal, deleteInforme, empresa }) => {
    const navigate = useNavigate();

    return (
        <Fragment>
            <Row>
                <div className="col-md-12">
                    {informes && informes.length > 0 && <h1>{informes.length} Informes</h1>}
                    <div className="text-zero top-right-button-container">
                        <Button
                            color="success"
                            size="lg"
                            className="top-right-button"
                            onClick={() => { abrirModal(empresa.id) }}
                        >
                            Nuevo Informe
                        </Button>
                    </div>
                </div>
            </Row>
            <Row>
                {informes && informes.length > 0 ? (
                    <div className="col-md-12">
                        {informes.map((informe) => (
                            <ItemListaInforme
                                key={informe.id}
                                item={informe}
                                verDetalleInforme={verDetalleInforme}
                                deleteInforme={deleteInforme}
                                navigate={navigate} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="col-md-12 text-center">
                        <h2>Esta sección no posee informes cargados</h2>
                    </div>
                )}
            </Row>
        </Fragment>
    );
};

export const ClienteInformes = React.forwardRef(({ informes, fetchgetDetalleInforme, detalleInforme, abrirModal, deleteInforme, empresa }, ref) => {
    const [counter, setCounter] = useState(0);
    const [mostrar, setMostrar] = useState(0);
    const [mostrarDetalle, setMostrarDetalle] = useState(0);

    useEffect(() => {
        if (counter > 0) setMostrar(1);
        setCounter(1);
    }, [informes, counter]);

    const verDetalleInforme = (e, idEmpresa, idInforme) => {
        e.preventDefault();
        fetchgetDetalleInforme(idEmpresa, idInforme).then(() => {
            setMostrarDetalle(1);
        });
    };

    const ocultarDetalle = () => {
        setMostrarDetalle(0);
    };

    useImperativeHandle(ref, () => ({
        ocultarDetalle
    }));

    return (
        <Fragment>
            {mostrarDetalle === 0 ? (
                mostrar === 1 ? (
                    <Render
                        informes={informes}
                        verDetalleInforme={verDetalleInforme}
                        abrirModal={abrirModal}
                        deleteInforme={deleteInforme}
                        empresa={empresa}
                    />
                ) : (
                    <div className="loading" />
                )
            ) : detalleInforme ? (
                <DetalleInforme
                    detalleInforme={detalleInforme}
                    ocultarDetalle={ocultarDetalle}
                    deleteInforme={deleteInforme}
                    // dentro de DetalleInforme se debería usar useNavigate
                />
            ) : (
                <div className="loading" />
            )}
        </Fragment>
    );
});
