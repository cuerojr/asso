import React, { useState, useEffect } from 'react';
import { Row, Input, Button } from "reactstrap";
import SubirArchivo from "../../componentes/subirArchivo";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import 'moment/locale/es'
import { fetchListarClientes } from '../../reducers/clientes-reducer';
import { fetchlistarSecciones } from '../../reducers/secciones-reducer';
import { fetchListarServicios } from '../../reducers/servicios-reducer';
import { fetchaltaInforme, fetchlistarInformes, fetchgetDetalleInforme, fetchlistarInformesEmpresaSeccionServicio } from '../../reducers/informes-reducer';
import { NotificationManager } from "../../components/common/react-notifications";
import { DetalleInformeCargado } from './detalleInformeCargado';
import { connect } from 'react-redux';


const CargarNuevoInforme = (props) => {

    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState(moment());
    const [empresa, setEmpresa] = useState('');
    const [servicio, setServicio] = useState('');
    const [archivo, setArchivo] = useState(null);
    const [seccion, setSeccion] = useState('');
    const [detalleInformeSubido, setDetalleInformeSubido] = useState(null);
    const [mostrarDetalle, setMostrarDetalle] = useState(0);
    const [nombreDelArchivo, setNombreDelArchivo] = useState("");
    useEffect(() => {
        if (props.clientes <= 0) {
            props.fetchListarClientes();

        }
        /*props.fetchgetDetalleInforme(5, 12).then(function(res){
            setMostrarDetalle(1)
            setNombreDelArchivo("archivo.pdf")
            setDetalleInformeSubido(res);
        })*/
    }, []);

    useEffect(() => {
        if (props.clienteACargarEnElInforme) {
            setEmpresa(props.clienteACargarEnElInforme)
        }
    }, [props.clientes])

    useEffect(() => {
        console.log(props.seccionACargarEnElInforme)
        if (props.seccionACargarEnElInforme) {
            setSeccion(props.seccionACargarEnElInforme)
            props.fetchListarServicios()
        }
    }, [props.secciones])

    const handleChangeEmbedded = (date) => {
        setFecha(date)
        console.log(date.format('YYYY-MM-DD'));
    }

    const seleccionEmpresa = (e) => {
        setEmpresa(e.target.value)
        props.fetchlistarSecciones(e.target.value);
    }

    const seleccionSeccion = (e) => {
        setSeccion(e.target.value)
        props.fetchListarServicios()
    }

    const cargarAchivo = (file) => {
        setArchivo(file)
        setNombreDelArchivo(file.name)
    }

    const seleccionServicio = (e) => {
        setServicio(e.target.value)
    }

    const guardarInforme = () => {
        const fechaFormateada = fecha.format('YYYY-MM-DD')
        props.fetchaltaInforme(empresa, seccion, servicio, titulo, descripcion, fechaFormateada, archivo).then(function (res) {
            if (res && res.payload && res.payload.stat === 1) {
                props.fetchlistarInformes(empresa)
                props.fetchlistarInformesEmpresaSeccionServicio(empresa, seccion, servicio)
                NotificationManager.success("El informe ha sido cargado", "Hecho", 3000, null, null, '')
                //props.abrirModal()
                props.fetchgetDetalleInforme(empresa, res.payload.id).then(function (res) {
                    setMostrarDetalle(1)
                    setDetalleInformeSubido(res);
                })
            } else {
                NotificationManager.error(res.payload.err, "Error", 3000, null, null, '')
            }
        })
    }

    const actualizarInforme = (idEmpresa, idInforme) => {
        props.fetchgetDetalleInforme(idEmpresa, idInforme).then(function (res) {
            setMostrarDetalle(1)
            setDetalleInformeSubido(res);
        })
    }

    return (

        <div className="container">
            {mostrarDetalle === 0 && <Row><div className="col-md-7">
                <div className="col-md-12 mb-3">
                    <SubirArchivo cargarAchivo={cargarAchivo} />
                </div>
                <div className="col-md-12 mb-3">
                    TÍTULO
                    <Input placeholder="Título del informe" value={titulo} onChange={e => setTitulo(e.target.value)} />
                </div>
                <div className="col-md-12 mb-3">
                    DESCRIPCIÓN BREVE
                    <Input type="textarea" placeholder="Breve descripción que se utiliza para la comunicación del informe" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                </div>
                <div className="col-md-12 mb-3">
                    CLIENTE
                    <Input type="select" name="select" id="exampleSelect" onChange={seleccionEmpresa} value={empresa}>
                        <option>Seleccione un cliente</option>
                        {props.clientes.map((cliente) => {
                            return (<option key={cliente.id} value={cliente.id}>{cliente.empresa}</option>)
                        })}
                    </Input>
                </div>
                <div className="col-md-12 mb-3">
                    SECCIONES
                    <Input type="select" name="select" id="exampleSelect" onChange={seleccionSeccion} value={seccion}>
                        <option>-- Seleccione una sección -- </option>
                        {props.secciones && props.secciones.map((seccion) => {
                            return (<option key={seccion.id} value={seccion.id}>{seccion.nombre}</option>)
                        })}
                    </Input>
                </div>
                <div className="col-md-12 mb-3">
                    SERVICIOS
                    <Input type="select" name="select" id="exampleSelect" onChange={seleccionServicio}>
                        <option>-- Seleccione un servicio -- </option>
                        {props.servicios && props.servicios.map((servicio) => {
                            return (<option key={servicio.id} value={servicio.id}>{servicio.servicio}</option>)
                        })}
                    </Input>
                </div>
            </div>
                <div className="col-md-5">
                    <h3 className="text-center">Fecha del Informe</h3>
                    <div className="col-md-12 mb-3">
                        <DatePicker
                            locale={'es'}
                            calendarClassName="embedded"
                            inline
                            selected={fecha}
                            onChange={handleChangeEmbedded} />
                    </div>
                    <div className="col-md-12 mb-3">
                        <Button color="primary" size="lg" disabled={!titulo || !descripcion} onClick={guardarInforme}>
                            <i className="glyph-icon simple-icon-cloud-upload" style={{ fontSize: "1.5em" }} />  CARGAR NUEVO INFORME
                        </Button>
                    </div>
                </div></Row>}
            {mostrarDetalle === 1 && (
                detalleInformeSubido ? (
                    <DetalleInformeCargado informe={detalleInformeSubido.payload} nombreArchivo={nombreDelArchivo} cerrarModal={props.abrirModal} setMostrarDetalle={setMostrarDetalle}
                        actualizarInforme={actualizarInforme} />
                ) : (
                    <div className="loading" />
                )
            )}
        </div >
    );
};


const mapStateToProps = (state) => {
    return {
        clientes: state.clientesReducer.clientes,
        secciones: state.seccionesReducer.secciones,
        servicios: state.serviciosReducer.servicios,
    }
}

export default connect(
    //función que mapea propiedades del state con propiedades del componente
    mapStateToProps,
    //mapeo de funciones
    { fetchListarClientes, fetchlistarSecciones, fetchListarServicios, fetchaltaInforme, fetchlistarInformes, fetchgetDetalleInforme, fetchlistarInformesEmpresaSeccionServicio }
)(CargarNuevoInforme);
