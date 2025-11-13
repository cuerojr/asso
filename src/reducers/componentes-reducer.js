import {
    listarComponentes,
} from '../lib/componentes-api';

const initialState = {
    componentes: [],
};

const LISTAR_COMPONENTES = 'LISTAR_COMPONENTES';

const listarcomponentesAction = (componentes) => ({ type: LISTAR_COMPONENTES, payload: componentes });

export const fetchlistarcomponentes = (idEmpresa, idEquipo) => {
    return (dispatch) => {
        listarComponentes(idEmpresa, idEquipo)
            .then(res => {
                if (res.stat == 0) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(listarcomponentesAction(res));
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
        case LISTAR_COMPONENTES:
            //cambiamos el valor de la propiedad post  
            return { ...state, componentes: action.payload };
        default:
            return { ...state };
    }
}