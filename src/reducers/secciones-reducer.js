import {
    listarSecciones,
    altaSeccion,
    deleteSeccion,
    updateSeccion,
} from '../lib/secciones-api';

const initialState = {
    secciones: [],
    guardado: 0
};

const LISTAR_SECCIONES = 'LISTAR_SECCIONES';
const ALTA_SECCION = 'ALTA_SECCION';
const DELETE_SECCION = 'DELETE_SECCION';
const UPDATE_SECCION = 'UPDATE_SECCION';
const RESET_SECCIONES = 'RESET_SECCIONES';


const listarSeccionesAction = (secciones) => ({ type: LISTAR_SECCIONES, payload: secciones });
const altaSeccionAction = (guardado) => ({ type: ALTA_SECCION, payload: guardado });
const deleteSeccionAction = () => ({ type: DELETE_SECCION });
const updateSeccionAction = (guardado) => ({ type: UPDATE_SECCION, payload: guardado });
const resetSeccionesAction = () => ({ type: RESET_SECCIONES });

export const fetchlistarSecciones = (idEmpresa) => {
    return (dispatch) => {
        listarSecciones(idEmpresa)
            .then(res => {
                dispatch(listarSeccionesAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchAltaSeccion = (idEmpresa, nombre, observacion) => {
    return async (dispatch) => {
        return altaSeccion(idEmpresa, nombre, observacion)
            .then(res => {
                return dispatch(altaSeccionAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchdeleteSeccion = (idSeccion) => {
    return async (dispatch) => {
        return deleteSeccion(idSeccion)
            .then(res => {
                return dispatch(deleteSeccionAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchUpdateSeccion = (idSeccion, idEmpresa, nombre, observacion, estado) => {
    return async (dispatch) => {
        return updateSeccion(idSeccion, idEmpresa, nombre, observacion, estado)
            .then(res => {
                return dispatch(updateSeccionAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const resetSecciones = () => {
    return (dispatch) => {
        dispatch(resetSeccionesAction());
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        //en todos los casos regresamos un objeto nuevo en el cual incluimos todos las propiedades del objeto state con ...state
        case LISTAR_SECCIONES:
            //cambiamos el valor de la propiedad post
            return { ...state, secciones: action.payload };
        case ALTA_SECCION:
            //cambiamos el valor de la propiedad post
            return { ...state, guardado: action.payload };
        case UPDATE_SECCION:
            //cambiamos el valor de la propiedad post
            return { ...state, guardado: action.payload };
        case DELETE_SECCION:
            return { ...state };
        case RESET_SECCIONES:
            return { ...state, secciones: [] };
        default:
            return { ...state };
    }
}