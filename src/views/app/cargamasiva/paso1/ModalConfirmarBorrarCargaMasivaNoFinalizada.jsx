import React from 'react';
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import { connect } from 'react-redux';
import {setearCargaMasivaABorrar,fetchListarCargasMasivas, setearCargaMasiva} from '../../../../reducers/cargas-masivas-reducer';
import {eliminarCargaMasiva} from '../../../../lib/cargas-masivas-api';
import { NotificationManager } from "../../../../components/common/react-notifications";


const ModalConfirmarBorrarCargaMasivaNoFinalizada = ({cargaMasivaABorrar, setearCargaMasivaABorrar, fetchListarCargasMasivas, setearCargaMasiva}) => {

    const eliminar = () =>{
        eliminarCargaMasiva(cargaMasivaABorrar).then((res)=>{
            if(res.stat === 1){
                setearCargaMasivaABorrar(null)
                NotificationManager.success("La Carga masiva ha sido eliminada","Hecho",3000,null,null,'');
                fetchListarCargasMasivas();
                setearCargaMasiva({
                    tituloDeReferencia: "",
                  });
            }
        })
    }

    return (
        <Modal isOpen={cargaMasivaABorrar!=null} size="md">
            <ModalBody>
                <p>¿Desea eliminar esta Carga Masiva?</p>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={eliminar}>
                    Si, eliminar
                </Button>
                <Button className="neutro" onClick={() => { setearCargaMasivaABorrar(null) }}>
                    No, cancelar
                </Button>
            </ModalFooter>
        </Modal>
    );
};

const mapStateToProps = (state) => {
    return {
        cargaMasivaABorrar: state.cargasMasivasReducer.cargaMasivaABorrar
    }
}

export default connect(mapStateToProps, {setearCargaMasivaABorrar, fetchListarCargasMasivas, setearCargaMasiva})(ModalConfirmarBorrarCargaMasivaNoFinalizada);
