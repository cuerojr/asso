import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Button, Modal, ModalBody, Label, Col, Row } from "reactstrap";
import { connect } from 'react-redux';
import { mostrarOcultarModalImportarEquipos, fetchlistarEquipos } from '../reducers/equipos-reducer';
import "dropzone/dist/min/dropzone.min.css";
import DropzoneComponent from "react-dropzone-component";
import { NotificationManager } from "../components/common/react-notifications";
import { altaMasivaEquiposExcel, altaMasivaEquiposExcelSegundaEtapa } from '../lib/importar-xls-api'

let dropzone = null;
import ReactDOMServer from 'react-dom/server';

const dropzoneComponentConfig = {
    postUrl: 'no-url'
};

const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta)

}

const dropzoneConfig = {
    thumbnailHeight: 160,
    maxFilesize: 2,
    acceptedFiles: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    autoProcessQueue: false,
    maxFiles: 1,
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
                <i className="glyph-icon simple-icon-trash" />{" "}
            </a>
        </div>
    ),
    headers: { "My-Awesome-Header": "header value" }
};

const ImportarXLS = (props) => {
    const { idEmpresa, mostrarOcultarModalImportarEquipos, fetchlistarEquipos } = props;
    const [archivo, setArchivo] = useState('');
    const [disabled, setDisabled] = useState(true);

    const dropzoneRef = useRef(null);

    useEffect(()=>{
        if(archivo !== ''){
            setDisabled(false)
        }else{
            setDisabled(true)
        }
    },[archivo])


    const guardar = () => {
        setDisabled(true)
        altaMasivaEquiposExcel(idEmpresa, archivo).then((res) => {
            if (res.stat === 1) {
                altaMasivaEquiposExcelSegundaEtapa(idEmpresa, res.token).then((resSecond)=>{
                    if (res.stat === 1) {
                        NotificationManager.success("Los archivos se importaron con éxito","Excelente", 3000, null, null, '' );
                        fetchlistarEquipos(idEmpresa);
                        mostrarOcultarModalImportarEquipos(false);
                    }
                })
            }else{
                NotificationManager.error(res.err, "Error", 3000, null, null, '');
                setArchivo(null);
                dropzone.removeAllFiles();
            }
        })
    }

    return (
        <Fragment>
            <Modal isOpen={props.modalImportarXLS} size="lg" >
                <ModalBody>
                    <Row>
                        <Col xs="12" className="d-flex justify-content-between">
                            <h5 className='modal-title'>IMPORTAR XLS</h5>
                            <div>
                                <Button className="ml-2" color="dark" size="sm" onClick={() => { mostrarOcultarModalImportarEquipos(false) }}> CANCELAR</Button>
                            </div>
                        </Col>
                        <Col>
                            <hr />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <DropzoneComponent
                                ref={dropzoneRef}
                                config={dropzoneComponentConfig}
                                onChangeStatus={handleChangeStatus}
                                djsConfig={dropzoneConfig}
                                eventHandlers={{
                                    init: function (esto) {
                                        dropzone = esto;
                                        esto.on("maxfilesexceeded", function (file) {
                                            esto.removeFile(file);
                                            NotificationManager.error("Sólo puede subir un archivo", "Error", 3000, null, null, '')
                                        });
                                    },

                                    addedfile: (file) => {
                                        setArchivo(file);
                                    },
                                    removedfile: () => {
                                        setArchivo('')
                                    }

                                }}
                            >
                                <div className="dz-message">
                                    <div className="col-md-12"><p><i className="simple-icon-doc dropzone-icon" /></p></div>
                                    <div className="col-md-12 mt-4">
                                        <h4>Adjuntar archivo</h4>
                                        <p>Arrástrelo o haga click aquí</p>
                                    </div>

                                </div>
                            </DropzoneComponent>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='pt-2 text-right'>
                            <Button onClick={guardar} disabled={disabled}>Cargar Archivo</Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        modalImportarXLS: state.equiposReducer.modalImportarXLS,
    }
}
export default connect(
    mapStateToProps,
    { mostrarOcultarModalImportarEquipos, fetchlistarEquipos }
)(ImportarXLS);
