import {
    listarServicios,
    listarServiciosPorSeccion,
    altaServicio,
    deleteServicio
} from '../lib/servicios-api';

const initialState = {
    servicios: [],
    serviciosPorSeccion: [],
    guardado: 0
};

const LISTAR_SERVICIOS = 'LISTAR_SERVICIOS';
const LISTAR_SERVICIOS_POR_SECCION = 'LISTAR_SERVICIOS_POR_SECCION';
const ALTA_SERVICIO = 'ALTA_SERVICIO';
const DELETE_SERVICIO = 'DELETE_SERVICIO';

const listarServiciosAction = (clientes) => ({ type: LISTAR_SERVICIOS, payload: clientes });
const listarServiciosPorSeccionAction = (serviciosPorSeccion) => ({ type: LISTAR_SERVICIOS_POR_SECCION, payload: serviciosPorSeccion });
const altaServicioAction = (guardado) => ({ type: ALTA_SERVICIO, payload: guardado })
const deleteServicioAction = (guardado) => ({ type: DELETE_SERVICIO, payload: guardado })

export const fetchListarServicios = () => {
    return (dispatch) => {
        listarServicios()
            .then(res => {
                dispatch(listarServiciosAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchListarServiciosPorSeccion = (idSeccion) => {
    return async (dispatch) => {
        return listarServiciosPorSeccion(idSeccion)
            .then(res => {
                return dispatch(listarServiciosPorSeccionAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchAltaServicio = (nombreServicio) => {
    return async (dispatch) => {
        return altaServicio(nombreServicio)
            .then(res => {
                return dispatch(altaServicioAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchDeleteServicio = (idServicio) => {
    return async (dispatch) => {
        return deleteServicio(idServicio)
            .then(res => {
                return dispatch(deleteServicioAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        //en todos los casos regresamos un objeto nuevo en el cual incluimos todos las propiedades del objeto state con ...state
        case LISTAR_SERVICIOS:
            //cambiamos el valor de la propiedad post  
            return { ...state, servicios: action.payload };
        case LISTAR_SERVICIOS_POR_SECCION:
            //cambiamos el valor de la propiedad post  
            return { ...state, serviciosPorSeccion: action.payload };
        case ALTA_SERVICIO:
            return { ...state, guardado: action.payload };
        case DELETE_SERVICIO:
            return { ...state, guardado: action.payload };
        default:
            return { ...state };
    }
}