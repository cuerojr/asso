/*import {
    cantidadNotificaciones,
    listarNotificaciones,
    buscarNotificacion
} from '../lib/notificaciones-api';*/

const initialState = {
    mostrarModalWhatsapp: false,
    redirect: null,
};

const MOSTRAR_MODAL_WHATSAPP = 'MOSTRAR_MODAL_WHATSAPP';
const REDIRECT_WHATSAPP = 'REDIRECT_WHATSAPP';

const mostrarModalWhatsappAction = (mostrarModalWhatsapp) => ({ type: MOSTRAR_MODAL_WHATSAPP, payload: mostrarModalWhatsapp });
const redirectWhatsappAction = (redirect) => ({ type: REDIRECT_WHATSAPP, payload: redirect });

export const setMostrarModalWhatsapp = (mostrarModalWhatsapp) => {
    return (dispatch) => {
        dispatch(mostrarModalWhatsappAction(mostrarModalWhatsapp));
    }
}

export const setRedirectWhatsapp = (redirect) => {
    return (dispatch) => {
        dispatch(redirectWhatsappAction(redirect));
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case MOSTRAR_MODAL_WHATSAPP:
            return { ...state, mostrarModalWhatsapp: action.payload };
        case REDIRECT_WHATSAPP:
            return { ...state, redirect: action.payload };
        default:
            return { ...state };
    }
}