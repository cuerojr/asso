import React, {Fragment} from "react";
import { Card, CardBody, CardTitle} from "reactstrap";

export const Tarjeta = ({titulo, children}) => {

    return(
        <Fragment>
            <Card>
                <CardBody>
                    <CardTitle>{titulo}</CardTitle>
                    {children}
                </CardBody>
            </Card>
        </Fragment>
    )

}