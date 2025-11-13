import {
    listarCargasMasivas,
    detalleDeComponentesYControles,
} from '../lib/cargas-masivas-api';
import {
    listarEquiposEnCargaMasiva
} from '../lib/equipos-api';

import {
    listarTipoTesteos
} from '../lib/controles-api';

const initialState = {
    cargasMasivas: null,
    detalleDeComponentesYControles: null,
    rutaSeleccionada: '',
    rutaSeleccionadaLabel: '',
    seccionesSeleccionadas: [],
    seccionesSeleccionadasLabel: [],
    fechaGlobal: null,
    cargaMasivaABorrar: null,
    cargaMasiva: {
        tituloDeReferencia: '',
    }, //esta es la carga masiva en cuestión la general.
    tipoTesteos: null,
    equiposEnCargaMasiva: null,
    equipoSeleccionadoEnCargaMasiva: null,
    equipoNoControlado: null,
    controlesDelEquipo: [],
    disabledInput: false,
    cantidadesFinal: null,
    navegacionCargando: false,
};

const LISTAR_CARGAS_MASIVAS = 'LISTAR_CARGAS_MASIVAS';
const DETALLE_DE_COMPONENTES_Y_CONTROLES = 'DETALLE_DE_COMPONENTES_Y_CONTROLES';
const RUTASELECCIONADA = 'RUTASELECCIONADA';
const RUTASELECCIONADALABEL = 'RUTASELECCIONADALABEL';
const SECCIONESSELECCIONADAS = 'SECCIONESSELECCIONADAS';
const SECCIONESSELECCIONADASLABEL = 'SECCIONESSELECCIONADASLABEL';
const FECHAGLOBAL = 'FECHAGLOBAL';
const CARGAMASIVAABORRAR = 'CARGAMASIVAABORRAR'
const CARGAMASIVA = 'CARGAMASIVA';
const TIPOTESTEO = 'TIPOTESTEO';
const EQUIPOSENCARGAMASIVA = 'EQUIPOSENCARGAMASIVA';
const EQUIPOSELECCIONADOENCARGAMASIVA = 'EQUIPOSELECCIONADOENCARGAMASIVA';
const EQUIPONOCONTROLADO = 'EQUIPONOCONTROLADO';
const CONTROLESDEEQUIPO = 'CONTROLESDEEQUIPO';
const CLEAN_CONTROLESDEEQUIPO = 'CLEAN_CONTROLESDEEQUIPO';
const DISABLED_INPUTS = 'DISABLED_INPUTS';
const CANTIDADES_FINAL = 'CANTIDADES_FINAL';
const NAVEGACION_CARGANDO = 'NAVEGACION_CARGANDO';

const cargasMasivasAction = (cargasMasivas) => ({
    type: LISTAR_CARGAS_MASIVAS,
    payload: cargasMasivas
});
const rutaSeleccionadaAction = (ruta) => ({
    type: RUTASELECCIONADA,
    payload: ruta
});
const rutaSeleccionadaLabelAction = (rutaLabel) => ({
    type: RUTASELECCIONADALABEL,
    payload: rutaLabel
});
const seccionesSeleccionadasAction = (secciones) => ({
    type: SECCIONESSELECCIONADAS,
    payload: secciones
});
const seccionesSeleccionadasLabelAction = (secciones) => ({
    type: SECCIONESSELECCIONADASLABEL,
    payload: secciones
});
const setFechaGlobalAction = (fecha) => ({
    type: FECHAGLOBAL,
    payload: fecha
});
//const setCargaNasivaSeleccionada = (cargaMasiva) => ({ type: CARGAMASIVASELECCIONADA, payload: cargaMasiva });
const setCargaMasivaABorrar = (cargaMasivaId) => ({
    type: CARGAMASIVAABORRAR,
    payload: cargaMasivaId
})
const setCargaMasiva = (cargaMasiva) => ({
    type: CARGAMASIVA,
    payload: cargaMasiva
})
const setTipoTesteo = (tipoTesteo) => ({
    type: TIPOTESTEO,
    payload: tipoTesteo
})
const setEquiposEnCargaMasiva = (equipCargaMasiva) => ({
    type: EQUIPOSENCARGAMASIVA,
    payload: equipCargaMasiva
})
const setEquipoSeleccionadoEnCargaMasiva = (equipSeleccionadoEnCargaMasiva) => ({
    type: EQUIPOSELECCIONADOENCARGAMASIVA,
    payload: equipSeleccionadoEnCargaMasiva
})
const setEquipoNoControlado = (equiponocontr) => ({
    type: EQUIPONOCONTROLADO,
    payload: equiponocontr
})
const setControlesDeEquipo = (ctrlDeEquipo) => ({
    type: CONTROLESDEEQUIPO,
    payload: ctrlDeEquipo
})
const cleanControlesDelEquipoAction = () => ({
    type: CLEAN_CONTROLESDEEQUIPO
});
const disabledInputAction = (bool) => ({
    type: DISABLED_INPUTS,
    payload: bool
});
const cantidadesFinalAction = (cant) => ({
    type: CANTIDADES_FINAL,
    payload: cant
})
const setNavegacionCargandoAction = (bool) => ({
    type: NAVEGACION_CARGANDO,
    payload: bool
});

export const cleanControlesDelEquipo = () => {
    return (dispatch) => {
        return dispatch(cleanControlesDelEquipoAction());
    }
};

export const setearDisabledInputs = (bool) => {
    return (dispatch) => {
        return dispatch(disabledInputAction(bool));
    }
};

export const setNavegacionCargando = (bool) => {
    return (dispatch) => {
        return dispatch(setNavegacionCargandoAction(bool));
    }
};

export const setearCantidadesFinalesAction = (cant) => {
    return (dispatch) => {
        return dispatch(cantidadesFinalAction(cant));
    }
}

export const resetdetalleDeComponentesYControles = () => {
    return (dispatch) => {
        return dispatch(detalleDeComponentesYControlesAction(null));
    }
}


export const fetchListarCargasMasivas = () => {
    return (dispatch) => {
        listarCargasMasivas()
            .then(res => {
                if (res && Number(res.stat) === 0) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(cargasMasivasAction(res));
                }
            })
            .catch(res => {
                console.log(res);
            })
    }
};

const detalleDeComponentesYControlesAction = (detalleDeComponentesYControles) => ({
    type: DETALLE_DE_COMPONENTES_Y_CONTROLES,
    payload: detalleDeComponentesYControles
});

export const fetchDetalleDeComponentesYControles = (idCargaMasiva, idEquipo) => {
    return (dispatch) => {
        detalleDeComponentesYControles(idCargaMasiva, idEquipo)
            .then(res => {
                if (res && res.stat == 0) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(detalleDeComponentesYControlesAction(res));
                }
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const setearRutaSeleccionada = (ruta) => {
    return (dispatch) => {
        return dispatch(rutaSeleccionadaAction(ruta));
    }
}

export const setearControlesDeEquipo = (control) => {
    return (dispatch) => {
        return dispatch(setControlesDeEquipo(control))
    }
}

export const setearRutaSeleccionadaLabel = (ruta) => {
    return (dispatch) => {
        return dispatch(rutaSeleccionadaLabelAction(ruta));
    }
}
export const setearSeccionesSeleccionadas = (secciones) => {
    return (dispatch) => {
        return dispatch(seccionesSeleccionadasAction(secciones));
    }
}

export const setearSeccionesSeleccionadasLabel = (secciones) => {
    return (dispatch) => {
        return dispatch(seccionesSeleccionadasLabelAction(secciones));
    }
}

export const setearFechaGlobal = (fecha) => {
    return (dispatch) => {
        return dispatch(setFechaGlobalAction(fecha));
    }
}

export const setearCargaMasivaABorrar = (idCargaMasiva) => {
    return (dispatch) => {
        return dispatch(setCargaMasivaABorrar(idCargaMasiva))
    }
}

export const setearCargaMasiva = (cargaMasiva) => {
    return (dispatch) => {
        return dispatch(setCargaMasiva(cargaMasiva))
    }
}



export const setearEquipoSeleccionadoEnCargaMasiva = (equipoEnCargaMasivaId) => {
    //console.log("🚀 ~ setearEquipoSeleccionadoEnCargaMasiva ~ equipoEnCargaMasiva:", equipoEnCargaMasivaId)    
    return (dispatch) => dispatch(setEquipoSeleccionadoEnCargaMasiva(equipoEnCargaMasivaId));
}

export const setearEquipoNoControlado = (equipoNoControlado) => {
    return (dispatch) => {
        return dispatch(setEquipoNoControlado(equipoNoControlado))
    }
}

export const fetchListarTipoTesteos = () => {
    return (dispatch) => {
        listarTipoTesteos()
            .then(res => {
                if (res && Number(res.stat) === 0) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(setTipoTesteo(res));
                }
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchListarEquiposEnCargaMasivaSeleccionada = (idEmpresa, idCargaMasiva) => {
    return (dispatch) => {
        listarEquiposEnCargaMasiva(idEmpresa, idCargaMasiva)
            .then(res => {
                if (res && Number(res.stat) === 0) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(setEquiposEnCargaMasiva(res));
                }
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LISTAR_CARGAS_MASIVAS:
            return {
                ...state, cargasMasivas: action.payload
            };
        case DETALLE_DE_COMPONENTES_Y_CONTROLES:
            return {
                ...state, detalleDeComponentesYControles: action.payload
            };
        case RUTASELECCIONADA:
            return {
                ...state, rutaSeleccionada: action.payload
            }
        case RUTASELECCIONADALABEL:
            return {
                ...state, rutaSeleccionadaLabel: action.payload
            }
        case SECCIONESSELECCIONADAS:
            return {
                ...state, seccionesSeleccionadas: action.payload
            }
        case SECCIONESSELECCIONADASLABEL:
            return {
                ...state, seccionesSeleccionadasLabel: action.payload
            }
        case FECHAGLOBAL:
            return {
                ...state, fechaGlobal: action.payload
            }
        case CARGAMASIVAABORRAR:
            return {
                ...state, cargaMasivaABorrar: action.payload
            };
        case CARGAMASIVA:
            return {
                ...state, cargaMasiva: action.payload
            };
        case EQUIPOSENCARGAMASIVA:
            return {
                ...state, equiposEnCargaMasiva: action.payload
            }
        case TIPOTESTEO:
            return {
                ...state, tipoTesteos: action.payload
            }
        case EQUIPOSELECCIONADOENCARGAMASIVA:
            return {
                ...state, equipoSeleccionadoEnCargaMasiva: action.payload
            }
        case EQUIPONOCONTROLADO:
            return {
                ...state, equipoNoControlado: action.payload
            }
        case CONTROLESDEEQUIPO: {
                                                        const updatedControles = Array.isArray(action.payload) ? action.payload : [action.payload];

                                                        const newControlesDelEquipo = state.controlesDelEquipo.map(control => {
                                                            const foundControl = updatedControles.find(updatedControl => updatedControl.componente === control.componente);
                                                            return foundControl ? foundControl : control;
                                                        });

                                                        const newControlsToAdd = updatedControles.filter(updatedControl =>
                                                            !state.controlesDelEquipo.find(control => control.componente === updatedControl.componente)
                                                        );

                                                        return {
                                                            ...state,
                                                            controlesDelEquipo: [...newControlesDelEquipo, ...newControlsToAdd]
                                                        };
                                                    }
        case CLEAN_CONTROLESDEEQUIPO:
            return {
                ...state, controlesDelEquipo: []
            };
        case DISABLED_INPUTS:
            return {
                ...state, disabledInput: action.payload
            }
        case CANTIDADES_FINAL:
            return {
                ...state, cantidadesFinal: action.payload
            }
        case NAVEGACION_CARGANDO:
            return {
                ...state, navegacionCargando: action.payload
            }
        default:
            return {
                ...state
            };
    }
}