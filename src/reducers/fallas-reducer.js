import {
    listarFallas,
} from '../lib/fallas-api';

const initialState = {
    fallas: [],
};

const LISTAR_FALLAS = 'LISTAR_FALLAS';

const listarFallasAction = (estados) => ({ type: LISTAR_FALLAS, payload: estados });

export const fetchlistarFallas = (idEmpresa) => {
    return (dispatch) => {
        listarFallas(idEmpresa)
            .then(res => {
                if (res && res.stat == 0) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(listarFallasAction(res));
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
        case LISTAR_FALLAS:
            //cambiamos el valor de la propiedad post
            return { ...state, fallas: action.payload };
        default:
            return { ...state };
    }
}