import { Fragment, useState, useEffect } from "react";

import { connect } from "react-redux";
import { fetchlistarSecciones } from "../../reducers/secciones-reducer";
import {
  fetchListarServiciosPorSeccion,
  fetchListarServicios,
} from "../../reducers/servicios-reducer";
import {
  fetchaUpdateInforme,
  fetchlistarInformes,
} from "../../reducers/informes-reducer";

import {
  Row,
  Button,
  InputGroup,
  InputGroupAddon,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Col,
} from "reactstrap";
import { Tarjeta } from "../../componentes/tarjeta";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "moment/locale/es";
import DatePicker from "react-datepicker";
import DropzoneComponent from "react-dropzone-component";
import { NotificationManager } from "../../components/common/react-notifications";
import * as XLSX from "xlsx";
import Tabla from "../../componentes/tabla";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faFileExcel,
  faTrash,
  faDownload,
  faSyncAlt, // nuevo: icono para "reemplazar"
} from "@fortawesome/free-solid-svg-icons";

let dropzoneInstance = null;

const dropzoneComponentConfig = { postUrl: "no-url" };
const dropzoneDjsConfig = {
  autoProcessQueue: false,
  maxFiles: 1,
  acceptedFiles: ".pdf,.xls,.xlsx",
};

const DetalleInforme = ({
  detalleInforme,
  fetchListarServiciosPorSeccion,
  secciones,
  fetchaUpdateInforme,
  ocultarDetalle,
  deleteInforme,
  servicios,
  fetchListarServicios,
  fetchlistarInformes,
}) => {
  const [titulo, setTitulo] = useState(detalleInforme.titulo);
  const [descripcion, setDescripcion] = useState(detalleInforme.descripcion);
  const [seccion, setSeccion] = useState(detalleInforme.id_seccion);
  const [servicio, setServicio] = useState(detalleInforme.id_servicio);
  const [
    mostrarModalConfirmarEliminarInforme,
    setMostrarModalConfirmarEliminarInforme,
  ] = useState(false);
  const [embeddedDate, setEmbeddedDate] = useState(
    moment(detalleInforme.fecha, "DD/MM/YYYY"),
  );

  const [guardando, setGuardando] = useState(false);
  const [reemplazando, setReemplazando] = useState(false); // nuevo

  // ── Estado del archivo ──────────────────────────────────────────
  // fileUrl: URL del archivo actual (original o null si fue borrado)
  // nuevoArchivo: objeto File dropeado (aún no enviado al back)
  // nuevoTipo: extensión del archivo nuevo para saber qué preview mostrar
  const getNombreArchivoOriginal = () => {
    if (!detalleInforme.FILE) return null;
    const partes = detalleInforme.FILE.split(".");
    return partes[partes.length - 1].toLowerCase();
  };

  const [fileUrl, setFileUrl] = useState(detalleInforme.FILE || null);
  const [tipoArchivo, setTipoArchivo] = useState(getNombreArchivoOriginal);
  const [nuevoArchivo, setNuevoArchivo] = useState(null);

  // ── Estado tabla Excel ──────────────────────────────────────────
  const [data, setData] = useState(null);
  const [cols, setCols] = useState(null);

  const handleChangeEmbedded = (date) => setEmbeddedDate(date);

  const seleccionSeccion = (e) => {
    setSeccion(e.target.value);
    fetchListarServiciosPorSeccion(e.target.value);
  };

  useEffect(() => {
    if (secciones <= 0) {
      fetchlistarSecciones();
    } else {
      fetchListarServiciosPorSeccion(seccion);
      fetchListarServicios();
    }
    if (tipoArchivo === "xls" || tipoArchivo === "xlsx") {
      readExcel(detalleInforme.FILE);
    }
  }, [seccion, servicio]);

  // ── Borrar archivo (solo local) ─────────────────────────────────
  // ⚠️ Esto NO llama al back, solo limpia el estado local.
  // Cuando se haga GUARDAR CAMBIOS, fileUrl será null y el back sabrá
  // que no hay archivo.
  const borrarArchivo = () => {
    setFileUrl(null);
    setTipoArchivo(null);
    setNuevoArchivo(null);
    setData(null);
    setCols(null);
    // Limpiar el dropzone si hay archivos cargados
    if (dropzoneInstance) dropzoneInstance.removeAllFiles();
  };

  // ── Archivo dropeado (solo local, aún no va al back) ───────────
  const onArchivoAgregado = (file) => {
    const extension = file.name.split(".").pop().toLowerCase();
    setNuevoArchivo(file);
    //console.log("🚀 ~ onArchivoAgregado ~ file:", file)
    setTipoArchivo(extension);
    setReemplazando(false); // nuevo: al soltar archivo, vuelvo a la vista de preview

    if (extension === "xls" || extension === "xlsx") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target.result;
        const wb = XLSX.read(buffer, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
        setData(jsonData[0]);
        setCols(jsonData.filter((_, i) => i > 0));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const onArchivoRemovido = () => {
    setNuevoArchivo(null);
    // Si había un archivo original, no restaurar — ya fue borrado intencionalmente
    // Si quieren cancelar el drop pero no borrar el original,
    // habría que guardar el original en otro estado. Por ahora: se limpia.
    setTipoArchivo(null);
    setData(null);
    setCols(null);
  };

  const readExcel = async (file) => {
    try {
      const response = await fetch(file);
      const buffer = await response.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setData(jsonData[0]);
      setCols(jsonData.filter((_, i) => i > 0));
    } catch (err) {
      NotificationManager.error(
        "No se pudo leer el archivo Excel",
        "Error",
        3000,
        null,
        null,
        "",
      );
    }
  };

  // ── Guardar cambios ─────────────────────────────────────────────
  // Por ahora manda fileUrl (que puede ser null si fue borrado,
  // o la URL original si no se tocó). nuevoArchivo queda listo
  // para cuando el back lo soporte.
  const updateInforme = () => {
    const fecha = embeddedDate.format("YYYY-MM-DD");
    setGuardando(true);
    fetchaUpdateInforme(
      detalleInforme.id,
      detalleInforme.id_empresa,
      seccion,
      servicio,
      titulo,
      descripcion,
      fecha,
      nuevoArchivo ?? fileUrl, // null si fue borrado, URL original si no se tocó
      // nuevoArchivo  ← descomentar cuando el back lo soporte
    )
      .then((res) => {
        if (res?.payload?.stat === 1) {
          NotificationManager.success(
            "El informe ha sido actualizado",
            "Hecho",
            3000,
            null,
            null,
            "",
          );
          fetchlistarInformes(detalleInforme.id_empresa);
          ocultarDetalle();
        } else {
          NotificationManager.error(
            res.payload.err,
            "Error",
            3000,
            null,
            null,
            "",
          );
        }
      })
      .finally(() => setGuardando(false));
  };

  const borrarInforme = () => {
    deleteInforme(detalleInforme.id).then((res) => {
      if (res.stat === 1) {
        NotificationManager.success(
          "El informe ha sido Eliminado",
          "Hecho",
          3000,
          null,
          null,
          "",
        );
        fetchlistarInformes(detalleInforme.id_empresa);
        setMostrarModalConfirmarEliminarInforme(false);
        ocultarDetalle();
      } else if (res.stat === 0) {
        NotificationManager.error(res.err, "Error");
      }
    });
  };

  const preguntarBorrarInforme = () =>
    setMostrarModalConfirmarEliminarInforme(true);

  const descargarArchivo = async () => {
    try {
      if (nuevoArchivo) {
        // Archivo local — ya está en memoria
        const url = URL.createObjectURL(nuevoArchivo);
        const a = document.createElement("a");
        a.href = url;
        a.download = nuevoArchivo.name;
        a.click();
        URL.revokeObjectURL(url);
      } else if (fileUrl) {
        // Archivo del servidor — fetch para forzar descarga
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileUrl.split("/").pop() || `informe.${tipoArchivo}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      NotificationManager.error(
        "No se pudo descargar el archivo",
        "Error",
        3000,
        null,
        null,
        "",
      );
      console.error(err);
    }
  };

  // ── Decide qué preview mostrar ──────────────────────────────────
  // urlPreview: si hay nuevo archivo local lo convierte a blob URL para el iframe
  const urlPreview = nuevoArchivo ? URL.createObjectURL(nuevoArchivo) : fileUrl;
  const mostrarPdf = tipoArchivo === "pdf" && urlPreview && !reemplazando;
  const mostrarExcel =
    (tipoArchivo === "xls" || tipoArchivo === "xlsx") && data && !reemplazando;
  const mostrarDropzone = (!fileUrl && !nuevoArchivo) || reemplazando; // muestra solo cuando no hay nada

  return (
    <Fragment>
      <div className="col-md-12">
        <Button color="link" className="pl-0" onClick={ocultarDetalle}>
          &lt; Informes
        </Button>
      </div>
      <div className="text-right pb-4">
        <Button
          color="success"
          className="mr-2"
          onClick={updateInforme}
          disabled={guardando}
        >
          <i className="iconsminds-save" />{" "}
          {guardando ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
        </Button>
        <Button
          color="danger"
          onClick={preguntarBorrarInforme}
          disabled={guardando}
        >
          <i className="simple-icon-close" /> ELIMINAR
        </Button>
      </div>

      <Tarjeta titulo="">
        <Row>
          <div className="col-md-12">
            <InputGroup className="mb-3">
              <InputGroupAddon addonType="prepend">
                <span className="input-group-text">
                  <i className="simple-icon-doc" /> Titulo
                </span>
              </InputGroupAddon>
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </InputGroup>
          </div>
        </Row>
        <Row>
          <div className="col-md-7">
            <InputGroup className="mb-3">
              <InputGroupAddon addonType="prepend">
                Descripción breve
              </InputGroupAddon>
              <Input
                type="textarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroupAddon addonType="prepend">
                <span className="input-group-text">
                  <i className="simple-icon-folder" /> Seccion
                </span>
              </InputGroupAddon>
              <Input type="select" value={seccion} onChange={seleccionSeccion}>
                <option>-- Seleccione una sección --</option>
                {secciones?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </Input>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroupAddon addonType="prepend">
                <span className="input-group-text">
                  <i className="simple-icon-briefcase" /> Servicio
                </span>
              </InputGroupAddon>
              <Input
                type="select"
                value={servicio}
                onChange={(e) => setServicio(e.target.value)}
              >
                <option>-- Seleccione un servicio --</option>
                {servicios?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.servicio}
                  </option>
                ))}
              </Input>
            </InputGroup>
          </div>
          <div className="col-md-5">
            <h3 className="text-center">Fecha del Informe</h3>
            <DatePicker
              locale="es"
              calendarClassName="embedded"
              inline
              selected={embeddedDate}
              onChange={handleChangeEmbedded}
            />
          </div>
        </Row>
      </Tarjeta>

      <div className="mt-2 mb-2" />

      <Row>
        <Col>
          {/* ── PDF ───────────────────────────────────────────── */}
          {mostrarPdf && (
            <Tarjeta titulo="">
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "space-between",
                  padding: 0,
                  margin: "1rem 0",
                }}
              >
                <li>
                  <Button color="primary" onClick={() => setReemplazando(true)}>
                    <FontAwesomeIcon icon={faSyncAlt} /> Reemplazar archivo
                  </Button>
                </li>
                <li>
                  <Button color="primary" onClick={descargarArchivo}>
                    <FontAwesomeIcon icon={faDownload} /> Descargar archivo
                  </Button>
                </li>
              </ul>
              {
                <iframe
                  src={urlPreview}
                  title={titulo}
                  width="100%"
                  height="300px"
                />
              }
            </Tarjeta>
          )}

          {/* ── Excel ─────────────────────────────────────────── */}
          {mostrarExcel && (
            <Tarjeta titulo="">
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  padding: 0,
                  margin: "1rem 0",
                }}
              >
                <li>
                  <Button color="primary" onClick={descargarArchivo}>
                    <FontAwesomeIcon icon={faDownload} />
                  </Button>
                </li>
                <li>
                  <Button color="danger" onClick={borrarArchivo}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </li>
              </ul>
              <Tabla data={data} cols={cols} />
            </Tarjeta>
          )}

          {/* ── Dropzone (aparece solo cuando no hay archivo) ─── */}
          {mostrarDropzone && (
            <Tarjeta titulo="">
              {reemplazando && (
                <div className="text-right mb-3">
                  <Button color="danger" onClick={() => setReemplazando(false)}>
                    Cancelar
                  </Button>
                </div>
              )}
              <DropzoneComponent
                config={dropzoneComponentConfig}
                djsConfig={dropzoneDjsConfig}
                eventHandlers={{
                  init: (dz) => {
                    dropzoneInstance = dz;
                    dz.on("maxfilesexceeded", (file) => {
                      dz.removeFile(file);
                      NotificationManager.error(
                        "Sólo puede subir un archivo",
                        "Error",
                        3000,
                        null,
                        null,
                        "",
                      );
                    });
                  },
                  addedfile: onArchivoAgregado,
                  removedfile: onArchivoRemovido,
                }}
              >
                <div className="dz-message">
                  <div className="">
                    <h4>Adjuntar archivo</h4>
                    <p>Arrástrelo o haga click aquí</p>
                  </div>
                </div>
              </DropzoneComponent>
            </Tarjeta>
          )}
        </Col>
      </Row>

      <Modal isOpen={mostrarModalConfirmarEliminarInforme} size="md">
        <ModalBody>
          <p>¿Desea eliminar este Informe?</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={borrarInforme}>
            Si, eliminar
          </Button>
          <Button
            className="neutro"
            onClick={() => setMostrarModalConfirmarEliminarInforme(false)}
          >
            No, cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  secciones: state.seccionesReducer.secciones,
  serviciosPorSeccion: state.serviciosReducer.serviciosPorSeccion,
  servicios: state.serviciosReducer.servicios,
});

export default connect(mapStateToProps, {
  fetchListarServiciosPorSeccion,
  fetchlistarSecciones,
  fetchaUpdateInforme,
  fetchListarServicios,
  fetchlistarInformes,
})(DetalleInforme);
