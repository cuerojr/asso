import {
    listarRutas,
} from '../lib/rutas-api';

const initialState = {
    rutas: [],
};

const LISTAR_RUTAS = 'LISTAR_RUTAS';
const RESET_RUTAS = 'RESET_RUTAS';


const listarRutasAction = (rutas) => ({ type: LISTAR_RUTAS, payload: rutas });
const resetRutasAction = () => ({ type: RESET_RUTAS });

export const fetchlistarRutas = (idEmpresa) => {
    return (dispatch) => {
        listarRutas(idEmpresa)
            .then(res => {
                if (res.stat == 0) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(listarRutasAction(res));
                }
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const resetRutas = () => {
    return (dispatch) => {
        dispatch(resetRutasAction());
    };
};

export default (state = initialState, action) => {
    switch (action.type) {
        //en todos los casos regresamos un objeto nuevo en el cual incluimos todos las propiedades del objeto state con ...state
        case LISTAR_RUTAS:
            //cambiamos el valor de la propiedad post
            return { ...state, rutas: action.payload };
        case RESET_RUTAS:
            return { ...state, rutas: [] }; // Reinicia las rutas a un arreglo vacío
        default:
            return { ...state };
    }
}