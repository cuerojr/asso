import React, { useEffect, useState, useRef } from 'react';
import DropzoneComponent from "react-dropzone-component";
import { setearControlesDeEquipo } from '../../../../../reducers/cargas-masivas-reducer';
import { connect } from 'react-redux';
import ReactDOMServer from 'react-dom/server';

const Archivo = ({ 
    handleChangeStatus, 
    setearControlesDeEquipo, 
    controlesDelEquipo, 
    idComponente, 
    equipoSeleccionadoEnCargaMasiva 
}) => {
    const [equipo, setEquipo] = useState(null);
    const equipoRef = useRef(equipo);
    const dropzoneRef = useRef(null);

    useEffect(() => {
        setEquipo(controlesDelEquipo);
    }, [controlesDelEquipo, idComponente]);

    useEffect(() => {
        equipoRef.current = equipo;
    }, [equipo, idComponente]);

    const checkFile = (file) => {
        equipoRef.current.forEach((c) => {
            if (c.componente === idComponente) {
                if (c.file) {
                    c.file.push(file);
                } else {
                    c.file = [file];
                }
            }
        });
        setearControlesDeEquipo(equipoRef.current);
    };

    const dropzoneConfig = {
        thumbnailHeight: 160,
        maxFilesize: 2,
        acceptedFiles: 'image/jpg, image/jpeg',
        autoProcessQueue: false,
        maxFiles: 10,
        previewTemplate: ReactDOMServer.renderToStaticMarkup(
            <div className="dz-preview dz-file-preview mb-3">
                <div className="d-flex flex-row">
                    <div className="p-0 w-30 position-relative">
                        <div className="dz-error-mark">
                            <span><i />{" "}</span>
                        </div>
                        <div className="dz-success-mark">
                            <span><i /></span>
                        </div>
                        <div className="preview-container">
                            <img data-dz-thumbnail className="img-thumbnail border-0" />
                            <i className="simple-icon-doc preview-icon" />
                        </div>
                    </div>
                    <div className="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
                        <div><span data-dz-name />{" "}</div>
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
                    {" "}<i className="glyph-icon simple-icon-trash" />{" "}
                </a>
            </div>
        ),
        headers: { "My-Awesome-Header": "header value" }
    };

    const eventHandlers = {
        init: (dropzone) => {
            dropzoneRef.current = dropzone;
            dropzone.on("maxfilesexceeded", (file) => {
                dropzone.removeFile(file);
            });
        },
        addedfile: (file) => {            
            checkFile(file);
        },
        removedfile: (file) => {
            // Si necesitás manejar la eliminación en Redux, agregalo acá
        }
    };

    return (
        <>
            <DropzoneComponent
                key={`${idComponente}-${equipoSeleccionadoEnCargaMasiva}`} // 🔑 fuerza el remount automático
                className="borde-gris"
                config={{ postUrl: 'no-url' }}
                onChangeStatus={handleChangeStatus}
                djsConfig={dropzoneConfig}
                eventHandlers={eventHandlers}
            >
                <div className="dz-message">
                    <div className="col-md-12 mt-5">
                        <p><i className="simple-icon-doc dropzone-icon" /></p>
                    </div>
                    <div className="col-md-12 mt-5 mb-5">
                        <h5>ADJUNTAR UNA IMAGEN</h5>
                        <p>Arrastre una imagen aquí para adjuntarla al test</p>
                    </div>
                </div>
            </DropzoneComponent>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        controlesDelEquipo: state.cargasMasivasReducer.controlesDelEquipo,
        equipoSeleccionadoEnCargaMasiva: state.cargasMasivasReducer.equipoSeleccionadoEnCargaMasiva
    };
};

export default connect(mapStateToProps, { setearControlesDeEquipo })(Archivo);
