import React, { Fragment, useState } from "react";
import { ItemListaUsuario } from '../../componentes/itemListaUsuarios';
import { NotificationManager } from "../../components/common/react-notifications";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, } from "reactstrap";

export const ListaUsuarios = ({ usuarios, fetchdeleteUsuario, mostrarDetalleUsuario }) => {

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [usuarioABorrar, setusuarioABorrar] = useState(null);


    const deleteUsuario = (userId) => {
        setusuarioABorrar(userId);
        toggle();
    }

    const finalmenteBorrar = () => {
        fetchdeleteUsuario(usuarioABorrar).then(function (res) {
            if (res && res.payload && res.payload.stat === 1) {
                NotificationManager.success("El usuario se ha eliminado exitosamente", "Hecho", 3000, null, null, '')
                toggle();
            }
        })
    }

    return (
        <Fragment key={usuarios}>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalBody>
                <p>Vas a eliminar un usuario administrador. Esta dirección de email ya no podrá tener acceso al sistema. </p>
                <p>Estás seguro?</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={toggle}>
                        No, cancelar
                    </Button>{' '}
                    <Button color="success" onClick={finalmenteBorrar}>
                        Si, borrar
                    </Button>
                </ModalFooter>
            </Modal>
            {usuarios.length > 0 &&
                <Fragment>
                    {usuarios.map((usuario) => {
                        return (<ItemListaUsuario key={usuario.id} item={usuario} deleteUsuario={deleteUsuario} mostrarDetalleUsuario={mostrarDetalleUsuario} />)
                    })}
                </Fragment>
            }
        </Fragment>
    );
};
