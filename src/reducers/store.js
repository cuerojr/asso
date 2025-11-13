//importamos las funciones de redux
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

//importamos nuestro reducer
import profile from './profile';
import clientesReducer from './clientes-reducer';
import serviciosReducer from './servicios-reducer';
import informesReducer from './informes-reducer';
import seccionesReducer from './secciones-reducer';
import usuariosReducer from './usuarios-reducer';
import estadosReducer from './estados-reducer';
import rutasReducer from './rutas-reducer';
import equiposReducer from './equipos-reducer';
import componentesReducer from './componentes-reducer';
import controlesReducer from './controles-reducer';
import fallasReducer from './fallas-reducer';
import cargasMasivasReducer from './cargas-masivas-reducer';
import autocompletarReducer from './autocompletar-reducer'

//creamos un reducer principal que combina todos los reducer que realicemos
const objReducer = {
  profile: profile,
  clientesReducer: clientesReducer,
  serviciosReducer: serviciosReducer,
  informesReducer: informesReducer,
  seccionesReducer: seccionesReducer,
  usuariosReducer: usuariosReducer,
  estadosReducer: estadosReducer,
  rutasReducer:rutasReducer,
  equiposReducer: equiposReducer,
  componentesReducer:componentesReducer,
  controlesReducer:controlesReducer,
  fallasReducer:fallasReducer,
  cargasMasivasReducer: cargasMasivasReducer,
  autocompletarReducer:autocompletarReducer
}
const mainReducer = combineReducers(objReducer);

const composeEnhancers =
  typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
  // other store enhancers if any
);

//creamos el store especificando que utilizamos thunk
export default createStore(mainReducer, enhancer);