import React, {
  Fragment,
  useEffect,
  useState,
  useImperativeHandle,
} from "react";
import { Row } from "reactstrap";
import { ItemListaSecciones } from "../../componentes/itemListaSecciones";
import NuevaSeccion from "../../componentes/nuevaSeccion";
import DetalleSeccion from "../../componentes/detalleSeccion";
import Sortable from "react-sortablejs";
import { ordenSecciones } from "../../lib/secciones-api";

export const Secciones = React.forwardRef(
  ({ secciones, abrirModal, idEmpresa, recargarSecciones }, ref) => {
    const [counter, setCounter] = useState(0);
    const [mostrar, setMostrar] = useState(0);
    const [mostrarSecciones, setMostrarSecciones] = useState(1);
    const [SeccionSeleccionada, setSeccionSeleccionada] = useState(null);

    useEffect(() => {
      setMostrar(1);
      setCounter(1);
    }, [secciones]);

    const SeleccionarSeccion = (seccion) => {
      setMostrarSecciones(0);
      setSeccionSeleccionada(seccion);
    };

    const salirSeleccion = () => {
      setMostrarSecciones(1);
      setSeccionSeleccionada(null);
    };

    const recargarSeccionesdesdeAca = () => {
      recargarSecciones();
    };

    useImperativeHandle(ref, () => ({
      salirSeleccion: salirSeleccion,
    }));

    const recorrerLista = () => {
      let itemToSave = [];
      document.getElementById("lista").childNodes.forEach((item) => {
        itemToSave.push(item.getAttribute("id"));
      });
      ordenSecciones(JSON.stringify(itemToSave));
    };

    const RenderSortable = ({ secciones }) => {
      return (
        <Sortable
          className="row"
          id="lista"
          options={{
            animation: 150,
            //handle: ".handlebt",
            onEnd: recorrerLista,
          }}
        >
          {secciones &&
            secciones.map((seccion) => (
              <ItemListaSecciones
                id={seccion.id}
                key={seccion.id}
                seccion={seccion}
                seleccionarSeccion={() => SeleccionarSeccion(seccion)}
              />
            ))}
        </Sortable>
      );
    };

    return (
      <Fragment key={secciones}>
        {mostrarSecciones === 1 ? (
          mostrar === 1 ? (
            <Fragment>
              <div>
                <RenderSortable secciones={secciones} />
              </div>
              <Row>
                <NuevaSeccion
                  idEmpresa={idEmpresa}
                  recargarSecciones={recargarSeccionesdesdeAca}
                />
              </Row>
            </Fragment>
          ) : (
            <div className="loading" />
          )
        ) : (
          <Fragment>
            <DetalleSeccion
              seccion={SeccionSeleccionada}
              abrirModal={abrirModal}
              salirSeleccion={salirSeleccion}
              recargarSecciones={recargarSeccionesdesdeAca}
            />
          </Fragment>
        )}
      </Fragment>
    );
  }
);
