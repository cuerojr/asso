import React, { Suspense } from "react";
import ReactDOM from "react-dom/client"; // <- cambio importante
import {
  BrowserRouter as Router,
} from "react-router-dom";

//import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import store from "./reducers/store";

const App = React.lazy(() => import(/* webpackChunkName: "App" */ "./App"));

// Crear root
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <Provider store={store}>
    <Suspense fallback={<div className="loading" />}>
      <Router basename="/admin">
        <App />
      </Router>
    </Suspense>
  </Provider>
);

// Service worker
//serviceWorker.register();
