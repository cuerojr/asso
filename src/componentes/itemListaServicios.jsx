import React from "react";
import { Card, CardBody, Button } from "reactstrap";

export const ItemListaServicio = ({ item, deleteServicio }) => {



    return (
        <div className="col-md-12">
            <Card className="card d-flex mb-3">
                <div className="d-flex flex-grow-1 min-width-zero">
                    <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
                        <p className="list-item-heading mb-0 truncate w-20 w-xs-100 mb-1 mt-1">{item.servicio}</p>
                        <div className="mb-1 text-small w-70 w-xs-100">
                        {item.informes} informes asociados
                        </div>
                        <div className="mb-1 text-small w-10 w-xs-100">
                            <Button color="link" onClick={() => {deleteServicio(item.id)}}><i className="simple-icon-trash" /></Button>
                        </div>
                        <div className="mb-1 text-small w-10 w-xs-100">
                            <div className="handlebt">
                                <div className="simple-icon-arrow-up" />
                                <div className="simple-icon-arrow-down" />
                            </div>
                        </div>
                    </CardBody>
                </div>
            </Card>
        </div>
    )
}
