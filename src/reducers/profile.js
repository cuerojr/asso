import {
    loginUser,
    logOutUser
} from '../lib/api';

const initialState = {
     user:null,
     error:null
};

const LOGIN_USER = 'LOGIN_USER';
const LOGOUT_USER = 'LOGOUT_USER';

const loginProfileUser = (user) => ({ type: LOGIN_USER, payload: user });
const logoutProfileUser = (user) => ({ type: LOGOUT_USER, payload: user });

export const fetchLoginUser = (user, password) => {
    return async (dispatch) => {
        return loginUser(user, password)
            .then(res => {
                return dispatch(loginProfileUser(res));
            })
            .catch(res => {
                console.log("error")
                return console.log(res);
            })
    }
};

export const fetchLogoutUser = () => {
    return async (dispatch) => {
        return logOutUser()
            .then(res => {
                return dispatch(logoutProfileUser(res));
            })
            .catch(res => {
                console.log("error")
                return console.log(res);
            })
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        //en todos los casos regresamos un objeto nuevo en el cual incluimos todos las propiedades del objeto state con ...state
        case LOGIN_USER:
            //cambiamos el valor de la propiedad post  
            return { ...state, user: action.payload };
        case LOGOUT_USER:
            //cambiamos el valor de la propiedad post  
            return { ...state, user: null }; 
        default:
            return { ...state };
    }
}