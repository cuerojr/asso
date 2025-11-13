import React, { useState } from 'react';
import { Row, Card, CardTitle, Alert, Button, Input } from "reactstrap";
import { NavLink } from "react-router-dom";
import { Colxx } from "../../components/common/CustomBootstrap";
import { recuperarPwd } from "../../lib/api";
import { NotificationManager } from "../../components/common/react-notifications";

const OlvidePwd = () => {
    const [error, setError] = useState('')
    const [email, setEmail] = useState('')

    const enviarMail = () => {
        if (!email) {
            setError("Por favor ingresar el correo electrónico");
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            setError("Por favor, ingrese una dirección de correo válida");
        } else {
            recuperarPwd(email).then((res) => {
                if (res && res.stat == 1) {
                    NotificationManager.success(
                        "Información enviada",
                        "Por favor, revise su correo electrónico",
                        3000,
                        null,
                        null,
                    );
                } else if (res && res.stat == 0) {
                    NotificationManager.error(
                        res.err,
                        "Hubo un error",
                        3000,
                        null,
                        null,
                        ''
                    );
                }
            })
        }
    }
    return (
        <Row className="h-100">
            <Colxx xxs="6" className="mx-auto my-auto">
                <Card className="auth-card">
                    <div className="form-side">
                        <NavLink to={`/`} className="white">
                            <div className="logo-wrapper text-center p-2 mb-2">
                                <span className="logo-single" style={{ backgroundImage: "url('/../../assets/images/logo.png')" }} />
                            </div>
                        </NavLink>
                        <CardTitle className="mb-2 mt-2">
                            ¿Olvidó su contraseña?
                        </CardTitle>
                        <Row className="mb-4">
                            <div className="col-md-12 "><Input placeholder="Ingrese su correo electrónico" type="text" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} /></div>
                        </Row>


                        {error != '' && (<Row><div className="col-md-12">
                            <Alert color="danger">
                                {error}
                            </Alert>
                        </div></Row>)}
                        <Button color="primary" className="float-right" onClick={enviarMail} href="#">Recuperar</Button>
                    </div>
                </Card>
            </Colxx>
        </Row>
    );
};

export default OlvidePwd;