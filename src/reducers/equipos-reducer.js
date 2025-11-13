import {
    listarEquipos,
} from '../lib/equipos-api';

const initialState = {
    equipos: [],
    modalCargaVariosEquipos:false,
    modalImportarXLS:false,
    equipoSeleccionadoCargaIndividual:null
};

const LISTAR_EQUIPOS = 'LISTAR_EQUIPOS';
const RESET_EQUIPOS = 'RESET_EQUIPOS';
const FILSTRAR_EQUIPOS = 'FILSTRAR_EQUIPOS';
const MODAL_CARGA_VARIOS_EQUIPOS = 'MODAL_CARGA_VARIOS_EQUIPOS';
const MODAL_IMPORTAR_XLS = 'MODAL_IMPORTAR_XLS';
const EQUIPO_SELECCIONADO_CARGA_INDIVIDUAL = 'EQUIPO_SELECCIONADO_CARGA_INDIVIDUAL';

const listarEquiposAction = (equipos) => ({ type: LISTAR_EQUIPOS, payload: equipos });
export const resetEquiposAction = () => ({ type: RESET_EQUIPOS });
const filtrarEquiposAction = (equipos) => ({ type: FILSTRAR_EQUIPOS, payload: equipos });
const modalCargaVariosEquiposAction = (visibilidad) => ({ type: MODAL_CARGA_VARIOS_EQUIPOS, payload: visibilidad });
const modalImportarEquiposAction = (visibilidad) => ({ type: MODAL_IMPORTAR_XLS, payload: visibilidad });
const equipoSeleccionadoCargaIndividualAction = (equipo) => ({ type: EQUIPO_SELECCIONADO_CARGA_INDIVIDUAL, payload: equipo });

export const fetchlistarEquipos = (idEmpresa, idRuta) => {
    return (dispatch) => {
        listarEquipos(idEmpresa, idRuta)
            .then(res => {
                if (res.stat == 0) {
                    window.localStorage.removeItem('usuario');
                    window.location.href = window.location.protocol + "//" + window.location.host + '/admin/user/login'
                } else {
                    dispatch(listarEquiposAction(res));
                }

            }, () => {
                dispatch(listarEquiposAction([]));
            })
            .catch(res => {
                resetEquiposAction()
                console.log(res);

            })
    }
};

export const filtrarEquipos = (secciones, rutas, estados, fechas, nombreEquipo, fallas, idEmpresa) => {
    return async (dispatch) => {
        listarEquipos(idEmpresa)
            .then(res => {
                let equiposFiltrados = [];
                res.forEach(equipo => {
                    equipo.seccionesSeleccionadas = secciones;
                    equipo.rutasSeleccionadas = rutas;
                    equipo.estadosSeleccionadas = estados;
                    equipo.fallasSeleccionadas = fallas;
                    equipo.fechasSeleccionadas = fechas;
                    equipo.nombreEquipo = nombreEquipo;
                })
                equiposFiltrados = res;
                return dispatch(filtrarEquiposAction(equiposFiltrados));
            })
    }

}

export const mostrarOcultarModalCargarVariosEquipos = (visibilidad) => {
    return (dispatch) => {
        return dispatch(modalCargaVariosEquiposAction(visibilidad));
    }
}

export const mostrarOcultarModalImportarEquipos = (visibilidad) => {
    return (dispatch) => {
        return dispatch(modalImportarEquiposAction(visibilidad));
    }
}

export const seleccionarEquipoCargaIndividual = (equipo) => {
    return (dispatch) => {
        return dispatch(equipoSeleccionadoCargaIndividualAction(equipo));
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        //en todos los casos regresamos un objeto nuevo en el cual incluimos todos las propiedades del objeto state con ...state
        case LISTAR_EQUIPOS:
            //cambiamos el valor de la propiedad post
            return { ...state, equipos: action.payload };
        case RESET_EQUIPOS:
            return { ...state, equipos: [] };
        case FILSTRAR_EQUIPOS:
            return { ...state, equipos: action.payload };
        case MODAL_CARGA_VARIOS_EQUIPOS:
            return { ...state, modalCargaVariosEquipos: action.payload };
        case MODAL_IMPORTAR_XLS:
            return { ...state, modalImportarXLS: action.payload };
        case EQUIPO_SELECCIONADO_CARGA_INDIVIDUAL:
            return { ...state, equipoSeleccionadoCargaIndividual: action.payload };
        default:
            return { ...state };
    }
}