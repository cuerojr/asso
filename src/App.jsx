import React, { Component, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import NotificationContainer from "./components/common/react-notifications/NotificationContainer";
import { getDirection } from "./helpers/Utils";
import { connect } from "react-redux";

const ViewMain = React.lazy(() => import("./views"));
const ViewApp = React.lazy(() => import("./views/app"));
const ViewUser = React.lazy(() => import("./views/user"));
const ViewError = React.lazy(() => import("./views/error"));
const InformeGenerado = React.lazy(() => import("./views/informe/index"));

// Ruta protegida en v6
const AuthRoute = ({ authUser, children }) => {
  const usuario = window.localStorage.getItem("usuario");
  if (authUser || usuario) {
    return children;
  }
  return <Navigate to="/user/login" replace />;
};

class App extends Component {
  constructor(props) {
    super(props);
    const direction = getDirection();
    if (direction.isRtl) {
      document.body.classList.add("rtl");
      document.body.classList.remove("ltr");
    } else {
      document.body.classList.add("ltr");
      document.body.classList.remove("rtl");
    }
    //document.body.classList.add('rounded');
  }

  render() {
    return (
      <div className="h-100">
        <React.Fragment>
          <NotificationContainer />
          <Suspense fallback={<div className="loading" />}>
            <Router basename="/admin">
              <Routes>
                {/* Rutas protegidas */}
                <Route
                  path="/app/*"
                  element={
                    <AuthRoute authUser={this.props.user}>
                      <ViewApp />
                    </AuthRoute>
                  }
                />

                {/* Rutas públicas */}
                <Route path="/user/*" element={<ViewUser />} />
                <Route path="/error" element={<ViewError />} />
                <Route path="/" element={<ViewMain />} />
                <Route
                  path="/informe-generado/:idEmpresa/:idInforme"
                  element={<InformeGenerado />}
                />

                <Route path="*" element={<Navigate to="/error" replace />} /> 
                
              </Routes>
            </Router>
          </Suspense>
        </React.Fragment>
      </div>
    );
  }
}

export default connect((state) => ({ user: state.profile.user }))(App);
