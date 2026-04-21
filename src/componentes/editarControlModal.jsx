import {
  Modal,
  ModalBody,
  ModalHeader,
  InputGroup,
  InputGroupAddon,
  Button,
} from "reactstrap";
import { Tarjeta } from "./tarjeta";
import { connect } from "react-redux";

import {
  fetchSetControlIndividualSeleccionado,
  fetchModalEditarControl,
  fetchlistarControles,
} from "../reducers/controles-reducer";
import {
  setComponenteSeleccionado,
  fetchlistarcomponentes,
} from "../reducers/componentes-reducer";
import EditarControlForm from "./editarControlForm";
import EquipoNoControlado from "../views/app/cargamasiva/paso2/EquipoNoControlado";
import {
  seleccionarEquipoCargaIndividual,
  fetchlistarEquipos,
} from "../reducers/equipos-reducer";
import {
  setearEquipoNoControlado,
  setearCargaMasiva,
  fetchDetalleDeComponentesYControles,
} from "../reducers/cargas-masivas-reducer";
import { fetchlistarFallas } from "../reducers/fallas-reducer";
import { fetchlistarEstados } from "../reducers/estados-reducer";

import useEditarControl from "../hooks/useEditarControl";

const EditarControlModal = ({
  modalEditarControl,
  componentes,
  controlesDelEquipo,
  equipoNoControlado,
  detalleCliente,
  equipo,
  equipos,
  estados,
  fallas,
  detalleDeComponentesYControles,
  rutaSeleccionada,
  controlIndividualSeleccionado,
  componenteIndividualSeleccionado,
  fetchModalEditarControl,
  setearEquipoNoControlado,
  setearCargaMasiva,
  fetchlistarEquipos,
  fetchlistarControles,
  fetchlistarcomponentes,
  fetchSetControlIndividualSeleccionado,
  controles,
}) => {
  const { handleGuardar } = useEditarControl({
    equipoNoControlado,
    equipo,
    detalleCliente,
    controlIndividualSeleccionado,
    componenteIndividualSeleccionado,
    controlesDelEquipo,
    controles,
    estados,
    fetchModalEditarControl,
    setearCargaMasiva,
    setearEquipoNoControlado,
    fetchlistarEquipos,
    fetchlistarControles,
    fetchlistarcomponentes,
    fetchSetControlIndividualSeleccionado,
  });

  return (
    <Modal
      isOpen={modalEditarControl}
      size="lg"
      className="modal-carga-varios-controles bg-black"
    >
      <ModalHeader
        toggle={() => fetchModalEditarControl(false)}
        style={{
          padding: "3rem",
        }}
      />
      <ModalBody>
        <Tarjeta titulo={"EDITAR CONTROL DEL COMPONENTE"}>
          <InputGroup className="mb-3">
            <InputGroupAddon
              addonType="prepend"
              style={{ background: "#000", color: "#FFF" }}
            >
              NOMBRE DEL EQUIPO:
            </InputGroupAddon>
            <div
              style={{
                border: "1px solid #424242",
                flex: "1",
                lineHeight: "40px",
                paddingLeft: "20px",
              }}
            >
              {equipo?.nombre}
            </div>
          </InputGroup>
          <Button
            color="success"
            onClick={handleGuardar}
            style={{ position: "absolute", right: "30px" }}
          >
            GUARDAR
          </Button>
          <EquipoNoControlado />
        </Tarjeta>

        {componentes &&
          componentes
            .filter((c) => c.id === componenteIndividualSeleccionado)
            .map((componente, index) => (
              <EditarControlForm key={index} componente={componente} />
            ))}
      </ModalBody>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    modalEditarControl: state.controlesReducer.modalEditarControl,
    componentes: state.componentesReducer.componentes,
    controlesDelEquipo: state.cargasMasivasReducer.controlesDelEquipo,
    equipoNoControlado: state.cargasMasivasReducer.equipoNoControlado,
    detalleCliente: state.clientesReducer.detalleClienteState,
    equipos: state.equiposReducer.equipos,
    estados: state.estadosReducer.estados,
    fallas: state.fallasReducer.fallas,
    detalleDeComponentesYControles:
      state.cargasMasivasReducer.detalleDeComponentesYControles,
    rutaSeleccionada: state.cargasMasivasReducer.rutaSeleccionada,
    controlIndividualSeleccionado:
      state.controlesReducer.controlIndividualSeleccionado,
    componenteIndividualSeleccionado:
      state.componentesReducer.componenteIndividualSeleccionado,
    controles: state.controlesReducer.controles,
  };
};

export default connect(mapStateToProps, {
  fetchModalEditarControl,
  seleccionarEquipoCargaIndividual,
  setearEquipoNoControlado,
  setearCargaMasiva,
  fetchlistarEquipos,
  fetchDetalleDeComponentesYControles,
  fetchlistarEstados,
  fetchlistarFallas,
  fetchSetControlIndividualSeleccionado,
  setComponenteSeleccionado,
  fetchlistarControles,
  fetchlistarcomponentes,
})(EditarControlModal);
