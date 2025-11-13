import React, { Fragment, useState, useEffect } from "react";
import { Row, Button, InputGroup, InputGroupAddon, Input } from "reactstrap";
import { Tarjeta } from '../../componentes/tarjeta';
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import 'moment/locale/es'
import DatePicker from "react-datepicker";
import { fetchlistarSecciones } from '../../reducers/secciones-reducer';
import { fetchListarServiciosPorSeccion, fetchListarServicios } from '../../reducers/servicios-reducer';
import { fetchaUpdateInforme, fetchlistarInformes } from '../../reducers/informes-reducer';
import { connect } from 'react-redux';
import { NotificationManager } from "../../components/common/react-notifications";
import * as XLSX from "xlsx";
import Tabla from '../../componentes/tabla';

const DetalleInforme = ({ detalleInforme, fetchListarServiciosPorSeccion, secciones, serviciosPorSeccion, fetchaUpdateInforme, ocultarDetalle, deleteInforme, servicios, fetchListarServicios, fetchlistarInformes }) => {
    const [titulo, setTitulo] = useState(detalleInforme.titulo)
    const [descripcion, setDescripcion] = useState(detalleInforme.descripcion)
    const [seccion, setSeccion] = useState(detalleInforme.id_seccion)
    const [servicio, setServicio] = useState(detalleInforme.id_servicio)
    const [embeddedDate, setEmbeddedDate] = useState(moment(detalleInforme.fecha, 'DD/MM/YYYY'));
    const nombreFileArray = detalleInforme.FILE.split(".")
    const tipoArchivo = nombreFileArray[nombreFileArray.length - 1];

    const [data, setData] = useState(null)
    const [cols, setCols] = useState(null);

    const handleChangeEmbedded = (date) => {
        setEmbeddedDate(date)
    }

    const seleccionSeccion = (e) => {
        setSeccion(e.target.value)
        fetchListarServiciosPorSeccion(e.target.value)
        setServicio(null)
    }
    useEffect(() => {
        if (secciones <= 0) {
            fetchlistarSecciones();
        } else {
            fetchListarServiciosPorSeccion(seccion)
            fetchListarServicios()
            //setServicio(detalleInforme.id_servicio)
        }
        if (tipoArchivo == 'xls') {
            readExcel(detalleInforme.FILE);
        }


    }, [seccion, servicio]);

    const updateInforme = () => {
        const fecha = embeddedDate.format('YYYY-MM-DD');

        fetchaUpdateInforme(detalleInforme.id, detalleInforme.id_empresa, seccion, servicio, titulo, descripcion, fecha, detalleInforme.FILE).then(function (res) {
            if (res && res.payload && res.payload.stat === 1) {
                NotificationManager.success("El informe ha sido actualizado", "Hecho", 3000, null, null, '');
                fetchlistarInformes(detalleInforme.id_empresa);
                ocultarDetalle()
            } else {
                NotificationManager.error(res.payload.err, "Error", 3000, null, null, '')
            }
        })
    }

    const borrarInforme = () => {
        deleteInforme(detalleInforme.id);
        ocultarDetalle();
    }

    const readExcel = (file) => {
        fetch(file)
            .then(response => response.arrayBuffer())
            .then(buffer => {
                const wb = XLSX.read(buffer, { type: "buffer" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                setData(data[0])
                const cols = data.filter((id, ind) => { return ind > 0 })
                console.log(cols);
                setCols(cols)

            })
            .catch(err => console.error(err));

    };

    return (
        <Fragment>
             <div className="col-md-12">
                    <Button color="link" className="pl-0" onClick={ocultarDetalle}>&lt; Informes</Button>
                </div>
            <div className="text-right pb-4">
                <Button color="success" className="mr-2" onClick={updateInforme}>
                    <i className="iconsminds-save"></i> GUARDAR CAMBIOS
                </Button>
                <Button color="danger" onClick={borrarInforme}>
                    <i className="simple-icon-close"></i> ELIMINAR
                </Button>
            </div>
            <Tarjeta titulo="">
                <Row>
                    <div className="col-md-12">
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                <span className="input-group-text"><i className="simple-icon-doc" /></span>
                            </InputGroupAddon>
                            <Input value={titulo} onChange={e => setTitulo(e.target.value)} />
                        </InputGroup>
                    </div>
                </Row>
                <Row>
                    <div className="col-md-7">
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                Descripción breve
                            </InputGroupAddon>
                            <Input type="textarea" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                <span className="input-group-text"><i className="simple-icon-folder" /></span>
                            </InputGroupAddon>
                            <Input type="select" value={seccion} name="select" id="exampleSelect" onChange={seleccionSeccion}>
                                <option>-- Seleccione una sección -- </option>
                                {secciones && secciones.map((seccion) => {
                                    return (<option key={seccion.id} value={seccion.id}>{seccion.nombre}</option>)
                                })}
                            </Input>
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                <span className="input-group-text"><i className="simple-icon-briefcase" /></span>
                            </InputGroupAddon>
                            <Input type="select" value={servicio} name="select" id="exampleSelect" onChange={e => setServicio(e.target.value)} >
                                <option>-- Seleccione un servicio -- </option>
                                {servicios && servicios.map((servicio) => {
                                    return (<option key={servicio.id} value={servicio.id}>{servicio.servicio}</option>)
                                })}
                            </Input>
                        </InputGroup>
                    </div>
                    <div className="col-md-5">
                        <h3 className="text-center">Fecha del Informe</h3>
                        <DatePicker
                            locale={'es'}
                            calendarClassName="embedded"
                            inline
                            selected={embeddedDate}
                            onChange={handleChangeEmbedded} />
                    </div>
                </Row>
            </Tarjeta>
            <div className="mt-2 mb-2"></div>
            {tipoArchivo == 'pdf' && <Tarjeta titulo="">
                <iframe src={detalleInforme.FILE} title={detalleInforme.titulo} width="100%" height="500px" />
            </Tarjeta>}
            {data && <Tarjeta titulo="">
                <Tabla data={data} cols={cols} />
            </Tarjeta>}
        </Fragment>
    );
};


const mapStateToProps = (state) => {
    return {
        secciones: state.seccionesReducer.secciones,
        serviciosPorSeccion: state.serviciosReducer.serviciosPorSeccion,
        servicios: state.serviciosReducer.servicios,
    }
}
export default connect(
    //función que mapea propiedades del state con propiedades del componente
    mapStateToProps,
    //mapeo de funciones
    { fetchListarServiciosPorSeccion, fetchlistarSecciones, fetchaUpdateInforme, fetchListarServicios, fetchlistarInformes }
)(DetalleInforme);

