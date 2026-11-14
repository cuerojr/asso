/*import {
    cantidadNotificaciones,
    listarNotificaciones,
    buscarNotificacion
} from '../lib/notificaciones-api';*/

const initialState = {
    mostrarModalWhatsapp: false,
};

const MOSTRAR_MODAL_WHATSAPP = 'MOSTRAR_MODAL_WHATSAPP';

const mostrarModalWhatsappAction = (mostrarModalWhatsapp) => ({ type: MOSTRAR_MODAL_WHATSAPP, payload: mostrarModalWhatsapp });


export const setMostrarModalWhatsapp = (mostrarModalWhatsapp) => {
    return (dispatch) => {
        dispatch(mostrarModalWhatsappAction(mostrarModalWhatsapp));
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case MOSTRAR_MODAL_WHATSAPP:
            return { ...state, mostrarModalWhatsapp: action.payload };
        default:
            return { ...state };
    }
}