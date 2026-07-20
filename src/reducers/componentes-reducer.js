import {
    listarComponentes,
    listarComponentesPorEmpresa
} from '../lib/componentes-api';

const initialState = {
    componentes: [],
    componentesPorEmpresa: [],
    componenteIndividualSeleccionado: null,
};

const LISTAR_COMPONENTES = 'LISTAR_COMPONENTES';
const LISTAR_COMPONENTES_POR_EMPRESA = 'LISTAR_COMPONENTES_POR_EMPRESA';

const SET_COMPONENTE_SELECCIONADO = 'SET_COMPONENTE_SELECCIONADO';

const listarcomponentesAction = (componentes) => ({ type: LISTAR_COMPONENTES, payload: componentes });
const listarcomponentesPorEmpresaAction = (componentes) => ({ type: LISTAR_COMPONENTES_POR_EMPRESA, payload: componentes });

const componenteIndividualSeleccionadoAction = (componente) => ({
    type: SET_COMPONENTE_SELECCIONADO,
    payload: componente
});

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

export const fetchlistarcomponentesPorEmpresa = (idEmpresa) => {
    return (dispatch) => {
        listarComponentesPorEmpresa(idEmpresa)
            .then(res => {
                if (res.stat == 0) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(listarcomponentesPorEmpresaAction(res));
                }
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const setComponenteSeleccionado = (componente) => {    
    return (dispatch) => dispatch(componenteIndividualSeleccionadoAction(componente));
}

export default (state = initialState, action) => {
    switch (action.type) {
        //en todos los casos regresamos un objeto nuevo en el cual incluimos todos las propiedades del objeto state con ...state
        case LISTAR_COMPONENTES:
            //cambiamos el valor de la propiedad post  
            return { ...state, componentes: action.payload };
        case LISTAR_COMPONENTES_POR_EMPRESA:
            return { ...state, componentesPorEmpresa: action.payload };
        case SET_COMPONENTE_SELECCIONADO:
            return { ...state, componenteIndividualSeleccionado: action.payload };
        default:
            return { ...state };
    }
}