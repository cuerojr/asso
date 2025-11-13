import {
    listarUsuarios,
    altaUsuario,
    deleteUsuario,
    updateUsuario
} from '../lib/usuarios-api';

const initialState = {
     usuarios:[],
     guardado:0
};

const LISTAR_USUARIOS = 'LISTAR_USUARIOS';
const ALTA_USUARIO = 'ALTA_USUARIO';
const DELETE_USUARIO = 'DELETE_USUARIO';
const UPDATE_USUARIO = 'UPDATE_USUARIO';

const listarUsuariosAction = (usuarios) => ({ type: LISTAR_USUARIOS, payload: usuarios });
const altaUsuarioAction = (guardado) => ({ type: ALTA_USUARIO, payload:guardado});
const deleteUsuarioAction = (guardado) => ({ type: DELETE_USUARIO, payload:guardado});
const updateUsuarioAction = (guardado) => ({ type: UPDATE_USUARIO, payload:guardado});


export const fetchlistarUsuarios = () => {
    return (dispatch) => {
        listarUsuarios()
            .then(res => {
                dispatch(listarUsuariosAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchAltaUsuario = (email,clave,nombre) => {
    return async (dispatch) => {
        return altaUsuario(email,clave,nombre)
            .then(res => {
                return dispatch(altaUsuarioAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchdeleteUsuario = (idUsuario) => {
    return async (dispatch) => {
        return deleteUsuario(idUsuario)
            .then(res => {
                return dispatch(deleteUsuarioAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export const fetchupdateUsuario = (idUsuario,email,nombre, firma) => {
    return async (dispatch) => {
        return updateUsuario(idUsuario,email,nombre, firma)
            .then(res => {
                return dispatch(updateUsuarioAction(res));
            })
            .catch(res => {
                console.log(res);
            })
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LISTAR_USUARIOS:
            return { ...state, usuarios: action.payload };
        case ALTA_USUARIO:
            return { ...state, guardado: action.payload };
        case DELETE_USUARIO:
            return { ...state, guardado: action.payload};
        case UPDATE_USUARIO:
            return { ...state, guardado: action.payload};
        default:
            return { ...state };
    }
}