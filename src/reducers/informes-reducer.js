import {
    listarInformes,
    listarInformesEmpresaSeccionServicio,
    listarCantidadInformes,
    getDetalleInforme,
    altaInforme,
    deleteInforme,
    updateInforme
} from '../lib/informes-api';

const initialState = {
    informes: null,
    totalInformes: 0,
    detalleInforme: null,
    informesEmpresaSeccionServicio: [],
    modalCompartirInforme:false
};

const LISTAR_INFORMES = 'LISTAR_INFORMES';
const LISTAR_INFORMES_EMPRESA_SECCION_SERVICIO = 'LISTAR_INFORMES_EMPRESA_SECCION_SERVICIO';
const LISTAR_CANTIDAD_INFORMES = 'LISTAR_CANTIDAD_INFORMES';
const DETALLE_INFORME = 'DETALLE_INFORME';
const ALTA_INFORME = 'ALTA_INFORME';
const DELETE_INFORME = 'DELETE_INFORME';
const UPDATE_INFORME = 'UPDATE_INFORME';
const FILTRAR_INFORMES = 'FILTRAR_INFORMES';
const MODAL_COMPARTIR_INFORME = 'MODAL_COMPARTIR_INFORME'

const listarInformesAction = (clientes) => ({ type: LISTAR_INFORMES, payload: clientes });
const listarInformesEmpresaSeccionServicioAction = (informesEmpresaSeccionServicio) => ({ type: LISTAR_INFORMES_EMPRESA_SECCION_SERVICIO, payload: informesEmpresaSeccionServicio })
const altaInformeAction = (guardado) => ({ type: ALTA_INFORME, payload: guardado })
const detalleInformeAction = (detalleInforme) => ({ type: DETALLE_INFORME, payload: detalleInforme })
const listarCantidadInformesAction = (totalInformes) => ({ type: LISTAR_CANTIDAD_INFORMES, payload: totalInformes })
const deleteInformeAction = (guardado) => ({ type: DELETE_INFORME, payload: guardado })
const updateInformeAction = (guardado) => ({ type: UPDATE_INFORME, payload: guardado })
const filtrarInformesAction = (informes) => ({ type: FILTRAR_INFORMES, payload: informes })
const modalCompartirInformeAction = (visibilidad) => ({type:MODAL_COMPARTIR_INFORME, payload:visibilidad})

export const fetchlistarInformes = (idEmpresa) => {
    return (dispatch) => {
        listarInformes(idEmpresa)
            .then(res => {
                if (res.stat == 0) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(listarInformesAction(res));
                }
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const filtrarInformes = (idSecciones, idservicios, idEmpresa) => {
    return async (dispatch) => {
        listarInformes(idEmpresa)
            .then(res => {
                let informesFiltrados = [];
                res.forEach(informe => {

                    /*idSecciones.forEach(idSeccion => {
                        if (informe.id_seccion == idSeccion) {
                            informesFiltrados.push(informe);
                        }
                    })

                    idservicios.forEach(idServicio => {
                        if (informe.id_servicio == idServicio) {
                            informesFiltrados.indexOf(informe) == -1 ? informesFiltrados.push(informe) : console.log('no se agrego');
                        }
                    })*/
                    informe.seccionesSeleccionadas = idSecciones;
                    informe.serviciosSeleccionados = idservicios;
                })
                informesFiltrados = res;
                return dispatch(filtrarInformesAction(informesFiltrados));
            })
    }

}

export const fetchlistarCantidadInformes = () => {
    return (dispatch) => {
        listarCantidadInformes()
            .then(res => {
                if (res.stat == 0) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(listarCantidadInformesAction(res.total_informes));
                }
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchlistarInformesEmpresaSeccionServicio = (idEmpresa, idSeccion, idServicio) => {
    return (dispatch) => {
        listarInformesEmpresaSeccionServicio(idEmpresa, idSeccion, idServicio)
            .then(res => {
                if (res.stat == 0) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(listarInformesEmpresaSeccionServicioAction(res));
                }
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchgetDetalleInforme = (idEmpresa, idInforme) => {
    return async (dispatch) => {
        return getDetalleInforme(idEmpresa, idInforme)
            .then(res => {
                return dispatch(detalleInformeAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchaltaInforme = (idEmpresa, idSeccion, idServicio, titulo, descripcion, fecha, file) => {
    return async (dispatch) => {
        return altaInforme(idEmpresa, idSeccion, idServicio, titulo, descripcion, fecha, file)
            .then(res => {
                return dispatch(altaInformeAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchDeleteInforme = (idInforme) => {
    return async (dispatch) => {
        return deleteInforme(idInforme)
            .then(res => {
                return dispatch(deleteInformeAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchaUpdateInforme = (idInforme, idEmpresa, idSeccion, idServicio, titulo, descripcion, fecha, file) => {
    return async (dispatch) => {
        return updateInforme(idInforme, idEmpresa, idSeccion, idServicio, titulo, descripcion, fecha, file)
            .then(res => {
                return dispatch(updateInformeAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const mostrarOcultarModalCompartir = (valor) => {
    return (dispatch) => {
         return dispatch(modalCompartirInformeAction(valor))
    }
}


export default (state = initialState, action) => {
    switch (action.type) {
        //en todos los casos regresamos un objeto nuevo en el cual incluimos todos las propiedades del objeto state con ...state
        case LISTAR_INFORMES:
            //cambiamos el valor de la propiedad post  
            return { ...state, informes: action.payload };
        case LISTAR_INFORMES_EMPRESA_SECCION_SERVICIO:
            return { ...state, informesEmpresaSeccionServicio: action.payload };
        case DETALLE_INFORME:
            return { ...state, detalleInforme: action.payload };
        case LISTAR_CANTIDAD_INFORMES:
            return { ...state, totalInformes: action.payload };
        case ALTA_INFORME:
            return { ...state, guardado: action.payload };
        case DELETE_INFORME:
            return { ...state, guardado: action.payload };
        case UPDATE_INFORME:
            return { ...state, guardado: action.payload };
        case FILTRAR_INFORMES:
            return { ...state, informes: action.payload };
        case MODAL_COMPARTIR_INFORME:
            return { ...state, modalCompartirInforme: action.payload };

        default:
            return { ...state };
    }
}