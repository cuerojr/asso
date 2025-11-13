import React,{useState, useEffect, Fragment} from 'react';
import { connect } from 'react-redux';
import { InputGroup, InputGroupAddon, Input, Row, Col,  Label, FormGroup } from "reactstrap";
import { listadoDeMotivosPorEquipoNoControlado } from '../lib/cargas-masivas-api';



const EditarCargarControlEquipoNoControlado = ({idEmpresa, guardarDatosNoControlados}) => {
    const [motivos, setMotivos] = useState([]);
    const [motivoNoControlado, setMotivoNoControlado] = useState('');
    const [observacionesMotivosNoControlados, setObservacionesMotivosNoControlados] = useState('');
    const [cargarOtroMotivoNoControlado, setCargarOtroMotivoNoControlado] = useState(false);
    const [otroMotivoNoControlado, setOtroMotivoNoControlado] = useState();

    useEffect(()=>{
        listadoDeMotivosPorEquipoNoControlado(idEmpresa).then(response => {
            response.push({id: 9999999, motivo: 'Agregar Nuevo Motivo'});
            setMotivos(response);
            //props.setOtroMotivoNoControlado("");
        })
    },[])

    const seleccionarMotivoNoControlado = (val) => {
        setMotivoNoControlado(val);
        if (val === "Agregar Nuevo Motivo") {
            setCargarOtroMotivoNoControlado(true);
        } else {
            setCargarOtroMotivoNoControlado(false);
        }
    }

    return (
        <Fragment>
            <Row>
                <Col md="12">
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            MOTIVO:
                        </InputGroupAddon>
                        <Input className="bg-black" type="select" name="motivo" onChange={(e) => { seleccionarMotivoNoControlado(e.target.value); guardarDatosNoControlados('motivos', e.target.selectedOptions[0].text) }} value={motivoNoControlado}>
                            <option>SELECCIONAR MOTIVO</option>
                            {motivos.map((motivo, index) => {
                                return (<option key={index} value={motivo.motivo}>{motivo.motivo}</option>)
                            })}
                        </Input>
                    </InputGroup>
                </Col>
            </Row>
            {cargarOtroMotivoNoControlado && <Row className="mt-2">
             <Col md="12">
                 <FormGroup className="mb-0">
                     <InputGroup>
                         <InputGroupAddon addonType="prepend">
                             OTRO MOTIVO:
                         </InputGroupAddon>
                         <Input type="text" name="text" id="otroMotivo" value={otroMotivoNoControlado} onChange={(e) => { setOtroMotivoNoControlado(e.target.value); guardarDatosNoControlados('motivos', e.target.value) }} />
                     </InputGroup>
                 </FormGroup>
             </Col>
         </Row>}
            <Row className="mt-2 no-controlado">
                <Col md="12">
                    <InputGroup className="borde-gris mt-2">
                        <div className='legend'>OBSERVACIONES: </div>
                        <Input className='mt-2 no-border' type="textarea" id="observaciones" value={observacionesMotivosNoControlados} onChange={e => {setObservacionesMotivosNoControlados(e.target.value);guardarDatosNoControlados('observacion', e.target.value)} } />
                    </InputGroup>
                </Col>
         </Row>
     </Fragment>
    );
};

export default EditarCargarControlEquipoNoControlado;