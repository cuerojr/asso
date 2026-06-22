import { useState, useEffect } from "react";
import moment from "moment";
import ReactDOMServer from "react-dom/server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { NotificationManager } from "../components/common/react-notifications";
import { eliminarImagenDeCargaMasiva } from "../lib/cargas-masivas-api";

export const useFormularioCargaControles = (props) => {
  const [startDate, setStartDate] = useState(moment());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [estadoSeleccionadoNombre, setEstadoSeleccionadoNombre] = useState("");
  const [estadoSeleccionadoId, setEstadoSeleccionadoId] = useState("");
  const [estadoSeleccionadoColor, setEstadoSeleccionadoColor] = useState("");
  const [selectedFallas, setSelectedFallas] = useState([]);
  const [selectedFallasIds, setSelectedFallasIds] = useState([]);
  const [opcionesFallas, setOpcionesFallas] = useState([]);
  const [observaciones, setObservaciones] = useState("");
  const [recomendaciones, setRecomendaciones] = useState("");
  const [archivo, setArchivo] = useState([]);
  const [filesEditando, setFilesEditando] = useState([]);
  const [observacionAutocompletar, setobservacionAutocompletar] = useState([]);
  const [recomendacionAutocompletar, setrecomendacionAutocompletar] = useState([]);

  const setFecha = (date, event, index) => {
    let fechas = [...startDate];
    fechas[index] = date;
    setStartDate(fechas);
  };

  const guardarDesdeParent = () => {
    props.guardar(
      startDate,
      estadoSeleccionadoId,
      selectedFallasIds,
      observaciones,
      recomendaciones,
      archivo,
      props.componentes,
    );
  };

  const limpiarFormularioDesdeParent = () => {
    setObservaciones(Array(props.componentes.length).fill(""));
    setRecomendaciones(Array(props.componentes.length).fill(""));
    setSelectedFallas(Array(props.componentes.length).fill(""));
    setEstadoSeleccionadoNombre(Array(props.componentes.length).fill(""));
    setEstadoSeleccionadoId(Array(props.componentes.length).fill(""));
    setEstadoSeleccionadoColor(Array(props.componentes.length).fill(""));
    setStartDate(Array(props.componentes.length).fill(null));
    props.setEquipoControlado((prevState) => !prevState);
  };

  useEffect(() => {
    if (!props.observaciones) {
      props.fetchListarObservaciones();
    }
  }, [props.fetchListarObservaciones, props.observaciones]);

  useEffect(() => {
    if (!props.recomendaciones) {
      props.fetchListarRecomendaciones();
    }
  }, [props.fetchListarRecomendaciones, props.recomendaciones]);

  useEffect(() => {
    if (props.componentes && props.componentes.length > 0) {
      let fechaIncio = [];
      let estadosSeleccionadosNombreAr = [];
      let estadosSeleccionadosId = [];
      let estadosSeleccionadosColor = [];
      let fallasSelecionadasAmostrar = [];
      let fallasSeleccionadasAmostrarIds = [];
      let observacionesAMostrar = [];
      let recomendacionesAMostrar = [];
      let archivosAMostrar = [];
      setobservacionAutocompletar(
        Array.from({ length: props.componentes.length }, () => ""),
      );
      setrecomendacionAutocompletar(
        Array.from({ length: props.componentes.length }, () => ""),
      );

      const fullfillDataComponente = (elem) => {
        let fallasDentroDelComponente = [];
        let fallasIdDentrodelComponente = [];

        if (props.fechaGlobal) {
          fechaIncio.push(moment(props.fechaGlobal));
        } else {
          if (elem[0].fecha === "0000-00-00 00:00:00") {
            fechaIncio.push(moment("2000-01-01 00:00:00"));
          } else if (elem[0].fecha === "") {
            fechaIncio.push(moment(props.fechaGlobal));
          } else {
            fechaIncio.push(moment(elem[0].fecha));
          }
        }

        props.estados.forEach((estado) => {
          if (estado.nombre === elem[0].estado) {
            estadosSeleccionadosNombreAr.push(estado.nombre);
            estadosSeleccionadosId.push(estado.id);
            estadosSeleccionadosColor.push(estado.color);
          }
        });
        props.fallas.forEach((falla) => {
          elem[0].fallas &&
            elem[0].fallas.forEach((fallaControl) => {
              if (falla.id === fallaControl.falla) {
                let fallita = {
                  color: falla.color,
                  value: falla.id,
                  label: (
                    <span
                      dangerouslySetInnerHTML={{
                        __html:
                          '<div class="falla-color-wrapper"><div class="dot" style="background-color: ' +
                          falla.color +
                          '"></div>' +
                          falla.nombre +
                          "</div>",
                      }}
                    />
                  ),
                };
                fallasDentroDelComponente.push(fallita);
                fallasIdDentrodelComponente.push(falla.id);
              }
            });
        });
        observacionesAMostrar.push(elem[0].observaciones);
        recomendacionesAMostrar.push(elem[0].recomendaciones);
        fallasSelecionadasAmostrar.push(fallasDentroDelComponente);
        fallasSeleccionadasAmostrarIds.push(fallasIdDentrodelComponente);
        archivosAMostrar.push(elem[0].imagenes);
      };

      props.componentes.forEach((componente) => {        
        if (componente.tests.length > 0) {
          fullfillDataComponente(componente.tests);
        } else if (componente.test_anterior) {
          fullfillDataComponente(componente.test_anterior);
        } else {
          fechaIncio.push(moment(props.fechaGlobal));
          estadosSeleccionadosNombreAr.push("");
          estadosSeleccionadosId.push("");
          estadosSeleccionadosColor.push("");
          fallasSelecionadasAmostrar.push("");
          fallasSeleccionadasAmostrarIds.push("");
          observacionesAMostrar.push("");
          recomendacionesAMostrar.push("");
        }
      });

      setStartDate(fechaIncio);
      setDropdownOpen(Array(props.componentes.length).fill(false));

      setEstadoSeleccionadoNombre(estadosSeleccionadosNombreAr);
      setEstadoSeleccionadoId(estadosSeleccionadosId);
      setEstadoSeleccionadoColor(estadosSeleccionadosColor);

      setSelectedFallas(fallasSelecionadasAmostrar);
      setSelectedFallasIds(fallasSeleccionadasAmostrarIds);
      setObservaciones(observacionesAMostrar);
      setRecomendaciones(recomendacionesAMostrar);
      setArchivo(Array.from({ length: props.componentes.length }, () => []));
      setFilesEditando(archivosAMostrar);
    }
  }, [props.componentes, props.estados, props.fallas]);

  useEffect(() => {
    if (props.fallas.length) {
      let fallasAray = [];
      props.fallas.forEach((falla) => {
        let registro = {
          label: (
            <span
              dangerouslySetInnerHTML={{
                __html:
                  '<div class="falla-color-wrapper"><div class="dot" style="background-color: ' +
                  falla.color +
                  '"></div>' +
                  falla.nombre +
                  "</div>",
              }}
            />
          ),
          value: falla.id,
          color: falla.color,
        };
        fallasAray.push(registro);
      });
      setOpcionesFallas(fallasAray);
    }
  }, [props.fallas]);

  const handleChangeMulti = (el, index) => {
    if (!props.equipoControlado) {
      let fallasIds = [];
      el.forEach((falla) => {
        fallasIds.push(falla.value);
      });
      let lasfallasIds = selectedFallasIds;
      lasfallasIds[index] = fallasIds;
      setSelectedFallasIds(lasfallasIds);

      let fallasSelecionadas = [...selectedFallas];
      fallasSelecionadas[index] = el;
      setSelectedFallas(fallasSelecionadas);
    }
  };

  const toggles = (index) => {
    if (!props.equipoControlado) {
      let dropdowns = [...dropdownOpen];
      dropdowns[index] = !dropdownOpen[index];
      setDropdownOpen(dropdowns);
    }
  };

  const seleccionarEstado = (estado, index) => {
    let estados = [...estadoSeleccionadoNombre];
    let estadosIds = [...estadoSeleccionadoId];
    let estadosColor = [...estadoSeleccionadoColor];
    estados[index] = estado.nombre;
    estadosIds[index] = estado.id;
    estadosColor[index] = estado.color;

    setEstadoSeleccionadoNombre(estados);
    setEstadoSeleccionadoId(estadosIds);
    setEstadoSeleccionadoColor(estadosColor);
  };

  const cargarObservacion = (observacion, index) => {
    let lasobservaciones = [...observaciones];
    lasobservaciones[index] = observacion;
    setObservaciones(lasobservaciones);
  };

  const cargarRecomendaciones = (recomendacion, index) => {
    let lasrecomendaciones = [...recomendaciones];
    lasrecomendaciones[index] = recomendacion;
    setRecomendaciones(lasrecomendaciones);
  };

  const cargarArchivos = (laimg, index) => {
    let losarchivos = archivo;
    if (losarchivos[index].length > 0) {
      losarchivos[index].push(laimg);
    } else {
      losarchivos[index] = new Array(laimg);
    }

    setArchivo(losarchivos);
  };

  const removerArchivo = (file, index) => {
    let losarchivos = archivo;
    losarchivos[index].forEach((archivo, indice) => {
      if (archivo.name === file.name) {
        losarchivos[index].splice(indice, 1);
      }
    });
    setArchivo(losarchivos);
    setTimeout(function () {
      console.log(archivo);
    }, 3000);
  };

  const chequearCompletados = () => {
    let errorDevuelto = null;
    props.componentes.forEach((component, index) => {
      if (
        estadoSeleccionadoId[index] == "" &&
        (selectedFallas[index] != "" ||
          selectedFallas[index].length > 0 ||
          observaciones[index] != "" ||
          recomendaciones[index] ||
          document.querySelector(".dz-image-preview") != null)
      ) {
        errorDevuelto = true;
      }
    });
    if (errorDevuelto) {
      NotificationManager.error(
        "Es necesario cargar los estados para que la carga sea efectiva",
        "Error",
      );
    }
    return errorDevuelto;
  };

  const anteriorEquipo = () => {
    console.log("anterior equipo");
    let error = chequearCompletados();
    if (error) {
      return;
    }
    let yPos =
      document.querySelector("#carga-masiva").getBoundingClientRect().top +
      window.scrollY;
    window.scrollTo({ top: yPos, left: 0, behavior: "smooth" });
    setTimeout(() => {
      props.guardar(
        startDate,
        estadoSeleccionadoId,
        selectedFallasIds,
        observaciones,
        recomendaciones,
        archivo,
        props.componentes,
      );
      props.seleccionarAnteriorSiguienteEquipo("anterior");
    }, 500);
  };

  const siguienteEquipo = () => {
    console.log("guardar desde siguiente equipo", props.detalleDeComponentesYControles.componentes);
    let error = chequearCompletados();
    if (error) {
      return;

    }
    let yPos =
      document.querySelector("#carga-masiva").getBoundingClientRect().top +
      window.scrollY;
    window.scrollTo({ top: yPos, left: 0, behavior: "smooth" });
    setTimeout(() => {
      props.guardar(
        startDate,
        estadoSeleccionadoId,
        selectedFallasIds,
        observaciones,
        recomendaciones,
        archivo,
        props.componentes,
      );
      props.seleccionarAnteriorSiguienteEquipo();
    }, 500);
  };

  const eliminarImagen = (idImagenCargaMasiva, indice) => {
    let losarchivos = [...filesEditando];

    eliminarImagenDeCargaMasiva(idImagenCargaMasiva).then((res) => {
      if (res.stat == "1") {
        NotificationManager.success(
          "Imagen eliminada correctamente",
          "Hecho",
          3000,
          null,
          null,
          "",
        );
        losarchivos[indice].forEach((archivo, indice) => {
          if (archivo.id === idImagenCargaMasiva) {
            losarchivos[indice].splice(indice, 1);
          }
        });

        setFilesEditando(losarchivos);
      } else {
        NotificationManager.error(
          "Error al eliminar imagen",
          "Error",
          3000,
          null,
          null,
          "",
        );
      }
    });
  };

  const limpiarFormulario = (index) => {
    cargarObservacion("", index);
    cargarRecomendaciones("", index);
    cargarArchivos([], index);
    seleccionarEstado({ id: "", nombre: "" }, index);
    handleChangeMulti([], index);

    setTimeout(() => {
      props.guardar(
        startDate,
        estadoSeleccionadoId,
        selectedFallasIds,
        observaciones,
        recomendaciones,
        archivo,
        props.componentes,
      );
    }, 2000);
  };

  useEffect(() => {
    if (props.avisarFinalizar === true) {
      props.guardar(
        startDate,
        estadoSeleccionadoId,
        selectedFallasIds,
        observaciones,
        recomendaciones,
        archivo,
        props.componentes,
      );
    }
  }, [props.avisarFinalizar]);

  const cargarObservacionDeSelect = (index, valor) => {
    setobservacionAutocompletar((prevState) => {
      const nuevoArray = [...prevState];
      nuevoArray[index] = valor;
      return nuevoArray;
    });
  };

  const cargarRecomendacionesDeSelect = (index, valor) => {
    setrecomendacionAutocompletar((prevState) => {
      const nuevoArray = [...prevState];
      nuevoArray[index] = valor;
      return nuevoArray;
    });
  };

  const dropzoneComponentConfig = {
    postUrl: "no-url",
  };

  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta);
  };

  const dropzoneConfig = {
    thumbnailHeight: 160,
    maxFilesize: 2,
    acceptedFiles: "image/jpg, image/jpeg",
    autoProcessQueue: false,
    maxFiles: 10,
    previewTemplate: ReactDOMServer.renderToStaticMarkup(
      <div className="dz-preview dz-file-preview mb-3">
        <div className="d-flex flex-row ">
          <div className="p-0 w-30 position-relative">
            <div className="dz-error-mark">
              <span>
                <i />{" "}
              </span>
            </div>
            <div className="dz-success-mark">
              <span>
                <i />
              </span>
            </div>
            <div className="preview-container">
              {/*  eslint-disable-next-line jsx-a11y/alt-text */}
              <img data-dz-thumbnail className="img-thumbnail border-0" />
              <i className="simple-icon-doc preview-icon" />
            </div>
          </div>
          <div className="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
            <div>
              {" "}
              <span data-dz-name />{" "}
            </div>
            <div className="text-primary text-extra-small" data-dz-size />
            <div className="dz-progress">
              <span className="dz-upload" data-dz-uploadprogress />
            </div>
            <div className="dz-error-message">
              <span data-dz-errormessage />
            </div>
          </div>
        </div>
        <a href="#/" className="remove" data-dz-remove>
          {" "}
          <FontAwesomeIcon icon={faTrashCan} />{" "}
        </a>
      </div>,
    ),
    headers: { "My-Awesome-Header": "header value" },
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      padding: "10px",
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
    }),
  };

  return {
    // State
    startDate,
    dropdownOpen,
    estadoSeleccionadoNombre,
    estadoSeleccionadoId,
    estadoSeleccionadoColor,
    selectedFallas,
    selectedFallasIds,
    opcionesFallas,
    observaciones,
    recomendaciones,
    archivo,
    filesEditando,
    observacionAutocompletar,
    recomendacionAutocompletar,
    // Configs
    dropzoneComponentConfig,
    dropzoneConfig,
    customStyles,
    // Handlers
    setFecha,
    guardarDesdeParent,
    limpiarFormularioDesdeParent,
    handleChangeMulti,
    toggles,
    seleccionarEstado,
    cargarObservacion,
    cargarRecomendaciones,
    cargarArchivos,
    removerArchivo,
    handleChangeStatus,
    anteriorEquipo,
    siguienteEquipo,
    eliminarImagen,
    limpiarFormulario,
    cargarObservacionDeSelect,
    cargarRecomendacionesDeSelect,
  };
};