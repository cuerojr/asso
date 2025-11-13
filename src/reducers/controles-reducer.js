import {
    listarControles,
} from '../lib/controles-api';

const initialState = {
    controles: [],
    modalCargaControles: false,
};

const LISTAR_CONTROLES = 'LISTAR_CONTROLES';
const MODAL_CARGA_CONTROLES = 'MODAL_CARGA_CONTROLES';

const listarControlesAction = (controles) => ({ type: LISTAR_CONTROLES, payload: controles });
const modalCargaControlesAction = (modalCargaControles) => ({ type: MODAL_CARGA_CONTROLES, payload: modalCargaControles });

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


export default (state = initialState, action) => {
    switch (action.type) {
        //en todos los casos regresamos un objeto nuevo en el cual incluimos todos las propiedades del objeto state con ...state
        case LISTAR_CONTROLES:
            //cambiamos el valor de la propiedad post
            return { ...state, controles: action.payload };
        case MODAL_CARGA_CONTROLES:
            return { ...state, modalCargaControles: action.payload };
        default:
            return { ...state };
    }
}