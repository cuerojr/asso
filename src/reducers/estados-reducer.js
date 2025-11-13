import {
    listarEstados,
} from '../lib/estados-api';

const initialState = {
    estados: [],
};

const LISTAR_ESTADOS = 'LISTAR_ESTADOS';

const listarEstadosAction = (estados) => ({ type: LISTAR_ESTADOS, payload: estados });

export const fetchlistarEstados = (idEmpresa) => {
    return (dispatch) => {
        listarEstados(idEmpresa)
            .then(res => {
                if (res && res.stat == 0) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(listarEstadosAction(res));
                }
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        //en todos los casos regresamos un objeto nuevo en el cual incluimos todos las propiedades del objeto state con ...state
        case LISTAR_ESTADOS:
            //cambiamos el valor de la propiedad post
            return { ...state, estados: action.payload };
        default:
            return { ...state };
    }
}