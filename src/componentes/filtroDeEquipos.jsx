import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Row, Button, Input } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FiltroDeEquipos = ({
  idEmpresa,
  equipos,
  secciones,
  rutas,
  estados,
  fallas,
  currentTab,
  onFilter,
}) => {
  const [startDateRange, setStartDateRange] = useState(null);
  const [endDateRange, setEndDateRange] = useState(null);
  const [filtroSeccion, setFiltroSeccion] = useState([]);
  const [filtroRuta, setFiltroRuta] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState([]);
  const [filtroFalla, setFiltroFalla] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [navRefVisible, setNavRefVisible] = useState(true);
  const [mostrarBotonLimpiarFecha, setMostrarBotonLimpiarFecha] =
    useState(false);

  const filterNavRef = useRef(null);

  // Calcular rango de fechas seleccionado
  useEffect(() => {
    if (startDateRange && endDateRange) {
      const date_range = [];
      let st_date = new Date(startDateRange);
      while (st_date <= endDateRange) {
        const month = ("0" + (st_date.getMonth() + 1)).slice(-2);
        const day = ("0" + st_date.getDate()).slice(-2);
        date_range.push(`${st_date.getFullYear()}-${month}-${day}`);
        st_date.setDate(st_date.getDate() + 1);
      }
      setFiltroFecha(date_range);
    } else {
      setFiltroFecha([]);
    }
  }, [startDateRange, endDateRange]);

  // Función para limpiar fechas
  const clearRangos = () => {
    setStartDateRange(null);
    setEndDateRange(null);
    setMostrarBotonLimpiarFecha(false);
    setTimeout(() => setMostrarBotonLimpiarFecha(true), 500);
  };

  const toggleInformeFiltro = () => {
    setNavRefVisible(!navRefVisible);
  };

  // Manejar checkboxes de filtros
  const recorrerFiltros = (tipo, valor, checked) => {
    switch (tipo) {
      case "seccion":
        setFiltroSeccion((prev) =>
          checked ? [...prev, valor] : prev.filter((v) => v !== valor)
        );
        break;
      case "ruta":
        setFiltroRuta((prev) =>
          checked ? [...prev, valor] : prev.filter((v) => v !== valor)
        );
        break;
      case "estado":
        setFiltroEstado((prev) =>
          checked ? [...prev, valor] : prev.filter((v) => v !== valor)
        );
        break;
      case "falla":
        setFiltroFalla((prev) =>
          checked ? [...prev, valor] : prev.filter((v) => v !== valor)
        );
        break;
      default:
        break;
    }
  };

  // 🔎 Filtrado en memoria y envío al padre
  useEffect(() => {
    if (!equipos) return;

    const filtrados = equipos
      .filter((eq) =>
        eq.nombre?.toLowerCase().includes(filtroNombre.toLowerCase())
      )
      .filter((eq) =>
        filtroSeccion.length ? filtroSeccion.includes(eq.seccion) : true
      )
      .filter((eq) => (filtroRuta.length ? filtroRuta.includes(eq.ruta) : true))
      .filter((eq) =>
        filtroEstado.length
          ? Object.values(eq.estados || {}).some(
              (e) => e.estado && filtroEstado.includes(e.estado)
            )
          : true
      )
      .filter((eq) =>
        filtroFalla.length
          ? Object.values(eq.estados || {}).some(
              (e) => e.fallas && filtroFalla.includes(e.fallas)
            )
          : true
      )
      .filter((eq) =>
        filtroFecha.length
          ? Object.values(eq.estados || {}).some(
              (e) => e.fecha && filtroFecha.includes(e.fecha.split(" ")[0])
            )
          : true
      );

    if (onFilter) onFilter(filtrados);
  }, [
    equipos,
    filtroNombre,
    filtroSeccion,
    filtroRuta,
    filtroEstado,
    filtroFalla,
    filtroFecha,
    onFilter,
  ]);

  return (
    <>
      <div
        style={{
          zIndex: "1000",
          right: "10px",
          top: "100px",
          position: "fixed",
        }}
      >
        <Button className="mb-4" outline onClick={toggleInformeFiltro}>
          {!navRefVisible ? "X" : "Ver Filtros"}
        </Button>
      </div>

      <div
        ref={filterNavRef}
        className={`app-menu ${!navRefVisible ? "shown" : "main-hidden"}`}
      >
        <div className="scrollbar-container ps">
          <div className="app-menu-content px-4">
            <h3 className="mt-3">FILTRAR EQUIPOS</h3>

            {/* Fecha */}
            <Row>
              <div className="col-md-5 pr-0 fecha-desde">
                <DatePicker
                  selected={startDateRange}
                  selectsStart
                  startDate={startDateRange}
                  endDate={endDateRange}
                  onChange={setStartDateRange}
                  placeholderText="Desde"
                />
              </div>
              <div className="col-md-5 pr-0 fecha-hasta">
                <DatePicker
                  selected={endDateRange}
                  selectsEnd
                  startDate={startDateRange}
                  endDate={endDateRange}
                  onChange={setEndDateRange}
                  placeholderText="Hasta"
                />
              </div>
              {mostrarBotonLimpiarFecha && (
                <div className="col-md-10 text-right pr-0">
                  <Button color="link" className="pr-0" onClick={clearRangos}>
                    Limpiar fechas
                  </Button>
                </div>
              )}
            </Row>

            {/* Nombre */}
            <Row>
              <div className="col-md-10 pr-0">
                <h4 className="mt-3">Nombre:</h4>
                <Input
                  value={filtroNombre}
                  onChange={(e) => setFiltroNombre(e.target.value)}
                  placeholder="Buscar por nombre"
                />
              </div>
            </Row>

            {/* Secciones */}
            <Row>
              <div className="col-md-12">
                <h4 className="mt-3">Sección</h4>
                <div className="ml-3">
                  {secciones?.map((seccion) => (
                    <div key={seccion.id}>
                      <Input
                        type="checkbox"
                        onChange={(e) =>
                          recorrerFiltros(
                            "seccion",
                            seccion.nombre,
                            e.target.checked
                          )
                        }
                      />
                      {seccion.nombre}
                    </div>
                  ))}
                </div>
              </div>
            </Row>

            {/* Rutas */}
            <Row>
              <div className="col-md-12">
                <h4 className="mt-3">Ruta</h4>
                <div className="ml-3">
                  {rutas?.map((ruta) => (
                    <div key={ruta.id}>
                      <Input
                        type="checkbox"
                        onChange={(e) =>
                          recorrerFiltros("ruta", ruta.nombre, e.target.checked)
                        }
                      />
                      {ruta.nombre}
                    </div>
                  ))}
                </div>
              </div>
            </Row>

            {/* Estados */}
            <Row>
              <div className="col-md-12">
                <h4 className="mt-3">Estado</h4>
                <div className="ml-3">
                  {estados?.map((estado) => (
                    <div key={estado.id} className="mb-2 pt-1">
                      <Input
                        type="checkbox"
                        onChange={(e) =>
                          recorrerFiltros(
                            "estado",
                            estado.nombre,
                            e.target.checked
                          )
                        }
                      />
                      <div
                        className="estados-tag estados-tag-filtros mt-1"
                        style={{ background: estado.color }}
                      >
                        {estado.nombre}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Row>

            {/* Fallas */}
            <Row>
              <div className="col-md-12">
                <h4 className="mt-3">Fallas</h4>
                <div className="ml-3">
                  {fallas?.map((falla) => (
                    <div key={falla.id} className="mb-2 pt-1">
                      <Input
                        type="checkbox"
                        onChange={(e) =>
                          recorrerFiltros(
                            "falla",
                            falla.nombre,
                            e.target.checked
                          )
                        }
                      />
                      <div
                        className="estados-tag estados-tag-filtros mt-1"
                        style={{ background: falla.color }}
                      >
                        {falla.nombre}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  equipos: state.equiposReducer.equipos,
  secciones: state.seccionesReducer.secciones,
  rutas: state.rutasReducer.rutas,
  estados: state.estadosReducer.estados,
  fallas: state.fallasReducer.fallas,
});

export default connect(mapStateToProps, {})(FiltroDeEquipos);
