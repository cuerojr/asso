import React,{useState, useEffect, Fragment} from 'react';
import { connect } from 'react-redux';
import { InputGroup, InputGroupAddon, Input, Row, Col,  Label, FormGroup } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import DatePicker from "react-datepicker";
import { listadoDeMotivosPorEquipoNoControlado } from '../../../../lib/cargas-masivas-api';
import {setearEquipoNoControlado} from '../../../../reducers/cargas-masivas-reducer'
import moment from 'moment';

const EquipoNoControlado = ({
        equipoNoControlado, 
        cargaMasiva, 
        setearEquipoNoControlado, 
        fechaGlobal, 
        equipoSeleccionadoEnCargaMasiva, 
        equipoSeleccionadoCargaIndividual, 
        detalleCliente, 
        detalleDeComponentesYControles
    }) => {
        
    const [cargarOtroMotivoNoControlado, setCargarOtroMotivoNoControlado] = useState(false);
    const [motivos, setMotivos] = useState([]);
    const [motivoNoControlado, setMotivoNoControlado] = useState('');
    const [fechaEquipoNoControlado, setFechaEquipoNoControlado] = useState();
    const [observacionesMotivosNoControlados, setObservacionesMotivosNoControlados] = useState('');
    const [otroMotivoNoControlado, setOtroMotivoNoControlado] = useState();


    const seleccionarMotivoNoControlado = (val) => {
        setMotivoNoControlado(val);
        if (val === "Agregar Nuevo Motivo") {
            setCargarOtroMotivoNoControlado(true);
        } else {
            setCargarOtroMotivoNoControlado(false);
        }
    }

    const convertFecha = () =>{
        if(fechaGlobal){
            let fechatrans = fechaGlobal
            if(typeof fechatrans === 'string'){
                fechatrans = moment(fechaGlobal)
            }
            return fechatrans

        }
    }

    useEffect(()=>{
        setFechaEquipoNoControlado(convertFecha())
    },[fechaGlobal, equipoNoControlado])

    useEffect(() => {
        let isMounted = true; // bandera para evitar el setState desmontado

        if(equipoNoControlado){
            listadoDeMotivosPorEquipoNoControlado(
                cargaMasiva?.clienteSeleccionado?.value ?? detalleCliente?.id
            ).then(response => {
                if (!isMounted) return; // <- evita actualizar si desmontado
                response.push({id: 9999999, motivo: 'Agregar Nuevo Motivo'});
                setMotivos(response);
            });

            setMotivoNoControlado(equipoNoControlado.motivoNoControlado);
            setObservacionesMotivosNoControlados(equipoNoControlado.observacionesMotivosNoControlados);

            if(!fechaGlobal){
                setFechaEquipoNoControlado(moment(equipoNoControlado.fecha))
            }
        } else {
            setMotivoNoControlado('');
            setFechaEquipoNoControlado(null);
            setObservacionesMotivosNoControlados('')
            setOtroMotivoNoControlado(undefined)
        }

        return () => {
            isMounted = false; // cleanup al desmontar
        };
    }, [equipoNoControlado, equipoSeleccionadoEnCargaMasiva]);


    const setControladoNoControlado = () => {

        equipoNoControlado ? 
        setearEquipoNoControlado(null) : 
        setearEquipoNoControlado({ 
            idCargaMasiva:cargaMasiva.id, 
            equipoSeleccionadoEnCargaMasiva, 
            motivoNoControlado, 
            observacionesMotivosNoControlados, 
            fechaEquipoNoControlado: convertFecha()
        })

    }

    useEffect(()=>{
       if(detalleDeComponentesYControles){
        if(detalleDeComponentesYControles.noControlado === 1){
            const fecha = convertFecha()
            let fechaTrans;
            if(fecha){
                fechaTrans = moment(fecha).format('YYYY-MM-DD');
            }else{
                fechaTrans = detalleDeComponentesYControles.fechaNoControlado
            }
            setearEquipoNoControlado({
                idCargaMasiva:cargaMasiva.id,
                equipoSeleccionadoEnCargaMasiva:equipoSeleccionadoEnCargaMasiva,
                motivoNoControlado:detalleDeComponentesYControles.motivoNoControlado,
                observacionesMotivosNoControlados:detalleDeComponentesYControles.observacionNoControlado,
                fechaEquipoNoControlado: fechaTrans})
            }
        }

    },[detalleDeComponentesYControles])

    const savingData = (key, value) => {
        const equipNoContr = equipoNoControlado;
        equipNoContr[key] = value
        setearEquipoNoControlado(equipNoContr);
    };

    /*useEffect(()=>{
        console.log("fetch equipoNoControlado", equipoNoControlado)
    },[fechaEquipoNoControlado])*/

    return (
        <Fragment>
            <div className="container p-0">
                <div className="row mb-2">
                    {(equipoSeleccionadoEnCargaMasiva || equipoSeleccionadoCargaIndividual) && <Label check className="col-12">
                        EQUIPO NO CONTROLADO:
                        <div className="d-inline ml-2" onClick={setControladoNoControlado}>
                            {equipoNoControlado && <FontAwesomeIcon icon={faSquareCheck} />}
                            {!equipoNoControlado && <FontAwesomeIcon icon={faSquare} />}
                        </div>
                    </Label>}
                </div>
                <div className='row mb-2 form-equipo-no-controlado'>
                    <div className="col-12 col-md-8">
                        {equipoNoControlado && <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                MOTIVO:
                            </InputGroupAddon>
                            <Input className="bg-black" type="select" name="motivo" onChange={(e) => { seleccionarMotivoNoControlado(e.target.value); savingData('motivoNoControlado', e.target.value) }} value={motivoNoControlado}>
                                <option>SELECCIONAR MOTIVO</option>
                                {motivos.map((motivo, index) => {
                                    return (<option key={index} value={motivo.motivo}>{motivo.motivo}</option>)
                                })}
                            </Input>
                        </InputGroup>}
                    </div>
                    <div className="col-12 col-md-4">
                        {equipoNoControlado && <InputGroup>
                            <InputGroupAddon className="col-12 col-md-5 p-0" addonType="prepend">
                                FECHA:
                            </InputGroupAddon>
                            <div className="col-12 col-md-7 p-0">
                                <DatePicker 
                                selected={fechaEquipoNoControlado} 
                                onChange={(date) => {                             
                                    setFechaEquipoNoControlado(date); 
                                    savingData('fechaEquipoNoControlado', date);
                                }}
                                onInit={() => {
                                    setFechaEquipoNoControlado(convertFecha());
                                }}
                            />
                            </div>
                        </InputGroup>}
                    </div>
                </div>
                {equipoNoControlado && cargarOtroMotivoNoControlado && <div className="row mb-2">
                    <div className='col-12 col-md-6'>
                        <FormGroup className="mb-0">
                            <InputGroup className="row">
                                <InputGroupAddon addonType="prepend">
                                    OTRO MOTIVO:
                                </InputGroupAddon>
                                <Input type="text" name="text" id="otroMotivo" 
                                    value={otroMotivoNoControlado} 
                                    onChange={(e) => { 
                                        setOtroMotivoNoControlado(e.target.value); 
                                        savingData('motivoNoControlado', e.target.value) 
                                    }} 
                                />
                            </InputGroup>
                        </FormGroup>
                    </div>
                </div>}
                {equipoNoControlado && <div className="row mt-2">
                    <div className="col-12">
                        <FormGroup className="mb-0">
                            <InputGroup className="borde-gris mt-2">
                                <div className='legend'>OBSERVACIONES:</div>
                                <Input className='mt-2 no-border' type="textarea" id="observaciones" value={observacionesMotivosNoControlados} onChange={e => {setObservacionesMotivosNoControlados(e.target.value); savingData('observacionesMotivosNoControlados', e.target.value)} } />
                            </InputGroup>                            
                        </FormGroup>
                    </div>
                </div>}
            </div>
        </Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        equipoNoControlado: state.cargasMasivasReducer.equipoNoControlado,
        cargaMasiva: state.cargasMasivasReducer.cargaMasiva,
        fechaGlobal: state.cargasMasivasReducer.fechaGlobal,
        equipoSeleccionadoEnCargaMasiva: state.cargasMasivasReducer.equipoSeleccionadoEnCargaMasiva,
        equipoSeleccionadoCargaIndividual: state.equiposReducer.equipoSeleccionadoCargaIndividual,
        detalleCliente: state.clientesReducer.detalleClienteState,
        detalleDeComponentesYControles: state.cargasMasivasReducer.detalleDeComponentesYControles,
    }
}
export default connect(
    mapStateToProps, {setearEquipoNoControlado})(EquipoNoControlado);
