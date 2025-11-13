import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client'; // <- cambio importante
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from './reducers/store';

const App = React.lazy(() => import(/* webpackChunkName: "App" */'./App'));

// Crear root
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <Suspense fallback={<div className="loading" />}>
    <Provider store={store}>
      <App />
    </Provider>
  </Suspense>
);

// Service worker
serviceWorker.register();

