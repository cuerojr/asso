import React, {Fragment} from "react";
import { Card, CardBody} from "reactstrap";

export const MiniTarjeta = ({ children, classes}) => {

    return(
        <Fragment>
            <Card className={classes}>
                <CardBody className="p-3">
                    {children}
                </CardBody>
            </Card>
        </Fragment>
    )

}