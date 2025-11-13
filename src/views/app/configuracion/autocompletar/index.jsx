import React, { useState, Suspense, useEffect } from 'react';
import { Row, Col, Nav, NavItem } from "reactstrap";
import classnames from "classnames";
import { NavLink, Routes, Route, Navigate, useLocation } from 'react-router-dom';

const Observaciones = React.lazy(() => import('./observaciones'));
const Recomendaciones = React.lazy(() => import('./recomendaciones'));

const Autocompletar = () => {
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState('observaciones');

  useEffect(() => {
    const parts = location.pathname.split('/');
    const lastPart = parts[parts.length - 1];
    setCurrentTab(lastPart);
  }, [location.pathname]);

  return (
    <>
      <Row>
        <Col>
          Tips:<br />
          Crea Observaciones y Recomendaciones guardados para luego utilizarlos en la carga de controles como método rápido de autocompletar.<br />
          Asigna un nombre corto para identificar la respuesta rápidamente.<br />
          Ordénalos para que aparezcan más arriba o más abajo en el listado, según su conveniencia.
        </Col>
      </Row>

      <Row className="mb-5">
        <div className="col-md-12">
          <Nav tabs className="card-header-tabs">
            <NavItem>
              <NavLink
                className={classnames({ active: currentTab === "observaciones", "nav-link": true })}
                to="observaciones"  // Relativo
              >
                Observaciones
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: currentTab === "recomendaciones", "nav-link": true })}
                to="recomendaciones"  // Relativo
              >
                Recomendaciones
              </NavLink>
            </NavItem>
          </Nav>
        </div>
      </Row>

      <Suspense fallback={<div className="loading" />}>
        <Routes>
          {/* Redirección automática al primer tab */}
          <Route index element={<Navigate to="observaciones" replace />} />

          {/* Rutas hijas */}
          <Route path="observaciones" element={<Observaciones />} />
          <Route path="recomendaciones" element={<Recomendaciones />} />

          {/* Opcional: Catch all para error */}
          {/* <Route path="*" element={<Navigate to="/error" replace />} /> */}
        </Routes>
      </Suspense>
    </>
  );
};

export default Autocompletar;
