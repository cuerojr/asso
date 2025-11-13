import {
    listarAutocompletar,
} from '../lib/autocompletar-api';

const initialState = {
    observaciones: null,
    recomendaciones: null,
};

const LISTAR_OBSERVACIONES = 'LISTAR_OBSERVACIONES';
const LISTAR_RECOMENDACIONES = 'LISTAR_RECOMENDACIONES';

const listarObservacionesAction = (observaciones) => ({ type: LISTAR_OBSERVACIONES, payload: observaciones });
const listarRecomendacionesAction = (observaciones) => ({ type: LISTAR_RECOMENDACIONES, payload: observaciones });

export const fetchListarObservaciones = () => {
    return (dispatch) => {
        //dispatch(listarObservacionesAction(null));
        listarAutocompletar('o')
            .then(res => {
                if (res && Number(res.stat) === 0) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(listarObservacionesAction(res));
                }
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchListarRecomendaciones = () => {
    return (dispatch) => {
        //dispatch(listarRecomendacionesAction(null));
        listarAutocompletar('r')
            .then(res => {
                if (res && Number(res.stat) === 0) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(listarRecomendacionesAction(res));
                }
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LISTAR_OBSERVACIONES:
            return { ...state, observaciones: action.payload };
        case LISTAR_RECOMENDACIONES:
            return { ...state, recomendaciones: action.payload };
        default:
            return { ...state };
    }
}