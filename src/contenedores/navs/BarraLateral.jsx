import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Nav, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCogs,
  faHouse,
  faUser,
  faXmark,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";

export const BarraLateral = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 9999,
          borderRadius: ".35rem",
        }}
        outline
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-light"
      >
        {isOpen ? (
          <FontAwesomeIcon icon={faXmark} />
        ) : (
          <FontAwesomeIcon icon={faBars} /> 
        )}
      </Button>
      <div className={`sidebar ${isOpen ? "show" : "main-hidden"}`}>
        <div className="main-menu">
          <div className="scroll">
            <PerfectScrollbar
              options={{ suppressScrollX: true, wheelPropagation: false }}
            >
              <Nav vertical className="list-unstyled">
                <NavItem className="submenu">
                  <NavLink to="/app/clientes" className="submenu">
                    <FontAwesomeIcon className="mb-2" icon={faHouse} />{" "}
                    <span className="">
                      Inicio
                    </span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/app/usuarios">
                    <FontAwesomeIcon className="mb-2" icon={faUser} />{" "}
                    <span className="">
                      Usuarios
                    </span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/app/configuracion">
                    <FontAwesomeIcon className="mb-2" icon={faCogs} />
                    <span className="">
                      Configuración
                    </span>
                  </NavLink>
                </NavItem>
              </Nav>
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </>
  );
};
