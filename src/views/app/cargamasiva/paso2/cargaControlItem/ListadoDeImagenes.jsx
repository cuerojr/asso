import React from 'react';
import { Button } from 'reactstrap';
import { eliminarImagenDeCargaMasiva } from '../../../../../lib/cargas-masivas-api';
import { NotificationManager } from "../../../../../components/common/react-notifications";

const ListadoDeImagenes = ({ imagenes, setControl, control }) => {

  const handleEliminarImagen = (archivoId) => {
    const nuevasImagenes = control.imagenes.filter(img => img.id !== archivoId);
    setControl({ ...control, imagenes: nuevasImagenes });
    eliminarImagenDeCargaMasiva(archivoId).then((res) => {
      if (res.stat === 1) {
        NotificationManager.success("Imagen eliminada con éxito", "Hecho", 3000, null, null, '');
      }
    });
  };

  return (
    <div className="mt-2 container ss">
      <div className='col-md-12'><h4>Imágenes adjuntas</h4></div>
      <div className="row">
        {imagenes.map((archivo) => (
          <div className='col-xs-12 col-md-3 position-relative mb-4' key={archivo.id}>
            <div style={{ background: "#6A6A6A" }} className="text-center">
              <img src={archivo.filename} alt={archivo.id} className="img-fluid" />
              <Button className="position-absolute remove-image" color="danger" onClick={() => handleEliminarImagen(archivo.id)}>
                <i className='simple-icon-trash' />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListadoDeImagenes;
