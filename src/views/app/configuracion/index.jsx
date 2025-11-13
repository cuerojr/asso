import React, { useState, Suspense, useEffect } from 'react';
import { Row, Col, Nav, NavItem } from "reactstrap";
import classnames from "classnames";
import { NavLink, Routes, Route, Navigate, useLocation } from 'react-router-dom';

const Servicios = React.lazy(() => import('./servicios'));
const Autocompletar = React.lazy(() => import('./autocompletar'));

const Configuracion = () => {
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState('autocompletar');

  useEffect(() => {
    const parts = location.pathname.split('/');
    const lastPart = parts[parts.length - 1];
    setCurrentTab(lastPart);
  }, [location.pathname]);

  return (
    <div className="dashboard-wrapper">
      <Row>
        <Col md={12}>
          <h1>Configuración del sistema</h1>
        </Col>
        <Col md={12}>
          <div className="separator mb-5"></div>
        </Col>
      </Row>

      <Row className="mb-5">
        <div className="col-md-12">
          <Nav tabs className="card-header-tabs">
            <NavItem>
              <NavLink
                className={classnames({ active: currentTab === "autocompletar", "nav-link": true })}
                to="autocompletar"  // Relativo
              >
                Autocompletar
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: currentTab === "servicios", "nav-link": true })}
                to="servicios"  // Relativo
              >
                Servicios
              </NavLink>
            </NavItem>
          </Nav>
        </div>
      </Row>

      <Suspense fallback={<div className="loading" />}>
        <Routes>
          {/* Redirección automática al primer tab */}
          <Route index element={<Navigate to="autocompletar" replace />} />

          {/* Rutas hijas */}
          <Route path="autocompletar/*" element={<Autocompletar />} />
          <Route path="servicios" element={<Servicios />} />

          {/* Opcional: Catch all para error */}
          {/* <Route path="*" element={<Navigate to="/error" replace />} /> */}
        </Routes>
      </Suspense>
    </div>
  );
};

export default Configuracion;
