import {
    listarClientes,
    listarCantidadClientes,
    detalleCliente,
    altaCliente,
    updateCliente,
    deleteCliente,
    listarNotificaciones
} from '../lib/clientes-api';

const initialState = {
    clientes: [],
    detalleClienteState: null,
    totalClientes: 0,
    totalNotificaciones:null,
    notificaciones:[]
};

const LISTAR_CLIENTES = 'LISTAR_CLIENTES';
const LISTAR_TOTAL_CLIENTES = 'LISTAR_TOTAL_CLIENTES';
const ALTA_CLIENTE = 'ALTA_CLIENTE';
const DETALLE_CLIENTE = 'DETALLE_CLIENTE';
const UPDATE_CLIENTE = 'UPDATE_CLIENTE';
const DELETE_CLIENTE = 'DELETE_CLIENTE';
const LISTAR_NOTIFICACIONES = 'LISTAR_NOTIFICACIONES';
const TOTAL_NOTIFICACIONES = 'TOTAL_NOTIFICACIONES';

const listarClientesAction = (clientes) => ({ type: LISTAR_CLIENTES, payload: clientes });
const listarTotalClientesAction = (totalClientes) => ({ type: LISTAR_TOTAL_CLIENTES, payload: totalClientes });
const altaCLienteAction = (guardado) => ({ type: ALTA_CLIENTE, payload: guardado })
const detalleClienteAction = (detalleClienteState) => ({ type: DETALLE_CLIENTE, payload: detalleClienteState })
const updateClienteAction = (guardado) => ({ type: UPDATE_CLIENTE, payload: guardado })
const deleteClienteAction = (guardado) => ({ type: DELETE_CLIENTE, payload: guardado })
const listarNotificacionesAction = (notificaciones) => ({ type: LISTAR_NOTIFICACIONES, payload: notificaciones });
const totalNotificacionesAction = (total) => ({ type: TOTAL_NOTIFICACIONES, payload: total });

export const fetchListarClientes = () => {
    return (dispatch) => {
        listarClientes()
            .then(res => {
                if (res.stat === Number(0)) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(listarClientesAction(res));
                }
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchListarTotalClientes = () => {
    return (dispatch) => {
        listarCantidadClientes()
            .then(res => {
                if (res.stat === Number(0)) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                 dispatch(listarTotalClientesAction(res.total_empresas));
                }
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchDetalleCliente = (idEmpresa) => {
    return (dispatch) => {
        detalleCliente(idEmpresa)
            .then(res => {
                if (res.stat === Number(0)) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                dispatch(detalleClienteAction(res));
                }
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const limpiarClienteSeleccionado = () => {
    return (dispatch) => {
         return dispatch(detalleClienteAction(null))
    }
}



export const fetchAltaCliente = (email, nombre, responsable, numeroContratoVigente, tituloContrato, descripcion) => {
    return async (dispatch) => {
        return altaCliente(email, nombre, responsable, numeroContratoVigente, tituloContrato, descripcion)
            .then(res => {
                return dispatch(altaCLienteAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchUpdateCliente = (id, email, nombre, responsable, numeroContratoVigente, tituloContrato, descripcion) => {
    return async (dispatch) => {
        return updateCliente(id, email, nombre, responsable, numeroContratoVigente, tituloContrato, descripcion)
            .then(res => {
                return dispatch(updateClienteAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchdeleteCliente = (id) => {
    return async (dispatch) => {
        return deleteCliente(id)
            .then(res => {
                return dispatch(deleteClienteAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchListarNotificaciones = (id) => {
    return (dispatch) => {
        listarNotificaciones(id)
            .then(res => {
                if (res.stat === Number(0)) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(listarNotificacionesAction(res.Notificaciones));
                    dispatch(totalNotificacionesAction(res.Total));
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
        case LISTAR_CLIENTES:
            return { ...state, clientes: action.payload };
        case LISTAR_TOTAL_CLIENTES:
            return { ...state, totalClientes: action.payload };
        case DETALLE_CLIENTE:
            return { ...state, detalleClienteState: action.payload };
        case ALTA_CLIENTE:
            return { ...state, guardado: action.payload };
        case UPDATE_CLIENTE:
            return { ...state, guardado: action.payload };
        case DELETE_CLIENTE:
            return { ...state, guardado: action.payload };
        case LISTAR_NOTIFICACIONES:
            return { ...state, notificaciones: action.payload };
        case TOTAL_NOTIFICACIONES:
            return { ...state, totalNotificaciones: action.payload };
        default:
            return { ...state };
    }
}