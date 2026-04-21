import {
    listarControles,
} from '../lib/controles-api';

const initialState = {
    controles: [],
    modalCargaControles: false,
    modalEditarControl: false,
    controlIndividualSeleccionado: null,
    tipoControlSeleccionado: null,
};

const LISTAR_CONTROLES = 'LISTAR_CONTROLES';
const MODAL_CARGA_CONTROLES = 'MODAL_CARGA_CONTROLES';
const MODAL_EDITAR_CONTROL = 'MODAL_EDITAR_CONTROL';
const SET_CONTROL_SELECCIONADO = 'SET_CONTROL_SELECCIONADO';
const TIPO_CONTROL_SELECCIONADO = 'TIPO_CONTROL_SELECCIONADO';

const listarControlesAction = (controles) => ({
    type: LISTAR_CONTROLES,
    payload: controles
});

const modalCargaControlesAction = (modalCargaControles) => ({
    type: MODAL_CARGA_CONTROLES,
    payload: modalCargaControles
});
const modalEditarControlAction = (modalEditarControl) => ({
    type: MODAL_EDITAR_CONTROL,
    payload: modalEditarControl
});

const setControlIndividualSeleccionadoAction = (control) => ({
    type: SET_CONTROL_SELECCIONADO,
    payload: control
});

const tipoControlSeleccionadoAction = (tipoControl) => ({
    type: TIPO_CONTROL_SELECCIONADO,
    payload: tipoControl
});

export const setTipoControlSeleccionado = (tipoControl) => (dispatch) => dispatch(tipoControlSeleccionadoAction(tipoControl));

export const fetchlistarControles = (idEmpresa, idEquipo, idComponente) => {
    return (dispatch) => {
        listarControles(idEmpresa, idEquipo, idComponente)
            .then(res => {
                if (res.stat == 0) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(listarControlesAction(res));
                }
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchModalCargaControles = (modalCargaControles) => {
    return (dispatch) => {
        dispatch(modalCargaControlesAction(modalCargaControles));
    }
};

export const fetchModalEditarControl = (modalEditarControl) => {
    return (dispatch) => {
        dispatch(modalEditarControlAction(modalEditarControl));
    }
};

export const fetchSetControlIndividualSeleccionado = (control) => (dispatch) => dispatch(setControlIndividualSeleccionadoAction(control));

export default (state = initialState, action) => {
    switch (action.type) {
        //en todos los casos regresamos un objeto nuevo en el cual incluimos todos las propiedades del objeto state con ...state
        case LISTAR_CONTROLES:
            //cambiamos el valor de la propiedad post
            return {
                ...state, controles: action.payload
            };
        case MODAL_CARGA_CONTROLES:
            return {
                ...state, modalCargaControles: action.payload
            };
        case MODAL_EDITAR_CONTROL:
            return {
                ...state, modalEditarControl: action.payload
            };
        case SET_CONTROL_SELECCIONADO:
            return {
                ...state, controlIndividualSeleccionado: action.payload
            };
        case TIPO_CONTROL_SELECCIONADO:
            return {
                ...state, tipoControlSeleccionado: action.payload
            };
        default:
            return {
                ...state
            };
    }
}