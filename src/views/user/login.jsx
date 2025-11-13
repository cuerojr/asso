import React, { useEffect } from "react";
import { Row, Card, CardTitle, Label, FormGroup, Button, Col } from "reactstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { NotificationManager } from "../../components/common/react-notifications";
import { Formik, Form, Field } from "formik";
import { connect } from "react-redux";
import { fetchLoginUser } from "../../reducers/profile";

const Login = ({ user, error, loading, fetchLoginUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.stat === 1) {
      localStorage.setItem("usuario", JSON.stringify(user));
      navigate("/app", { replace: true });
    }
    if (error) {
      NotificationManager.warning(error, "Error de login", 3000);
    }
  }, [user, error, navigate]);

  const onUserLogin = (values) => {
    if (!loading && values.email && values.password) {
      fetchLoginUser(values.email, values.password).then((res) => {
        if (res && res.payload && res.payload.stat === 0) {
          NotificationManager.warning(res.payload.err, "Error de login", 30000);
        }
      });
    }
  };

  const validateEmail = (value) => {
    if (!value) return "Por favor ingresar el correo electrónico";
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) return "Invalid email address";
  };

  const validatePassword = (value) => {
    if (!value) return "Por favor, ingresar la contraseña";
    if (value.length < 4) return "Value must be longer than 3 characters";
  };

  const initialValues = { email: "", password: "" };

  return (
    <Row className="h-100">
      <Col xs="11" md="6" className="mx-auto my-auto">
        <Card className="auth-card">
          <div className="form-side">
            <NavLink to={`/`} className="white">
              <div className="logo-wrapper text-center px-4 mb-2">
                <img className="img-fluid p-4" src="/admin/assets/images/logo.png" alt="Asso consultores" />
              </div>
            </NavLink>
            <CardTitle className="mb-4">Bienvenido</CardTitle>

            <Formik initialValues={initialValues} onSubmit={onUserLogin}>
              {({ errors, touched }) => (
                <Form className="av-tooltip tooltip-label-bottom">
                  <FormGroup className="form-group has-float-label">
                    <Label>Correo E</Label>
                    <Field className="form-control" name="email" validate={validateEmail} />
                    {errors.email && touched.email && (
                      <div className="invalid-feedback d-block">{errors.email}</div>
                    )}
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>Contraseña</Label>
                    <Field
                      className="form-control"
                      type="password"
                      name="password"
                      validate={validatePassword}
                    />
                    {errors.password && touched.password && (
                      <div className="invalid-feedback d-block">{errors.password}</div>
                    )}
                  </FormGroup>
                  <div className="d-flex justify-content-between align-items-center">
                    <NavLink to={`/user/olvide-pwd`}>Olvidó su contraseña</NavLink>
                    <Button
                      type="submit"
                      color="primary"
                      className={`btn-shadow btn-multiple-state ${loading ? "show-spinner" : ""}`}
                      size="lg"
                    >
                      <span className="spinner d-inline-block">
                        <span className="bounce1" />
                        <span className="bounce2" />
                        <span className="bounce3" />
                      </span>
                      <span className="label">Ingresar</span>
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state) => ({
  user: state.profile.user,
  error: state.profile.error,
  loading: state.profile.loading,
});

export default connect(mapStateToProps, { fetchLoginUser })(Login);
