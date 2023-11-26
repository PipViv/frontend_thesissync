import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from "../../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from 'react';
import '../../assets/css/signup.css'
import { API_URL } from '../../constants/constants';
import { AuthResponseError } from '../../types/types';

export default function SignupDo() {

  const [codigo, setCodigo] = useState("");
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const rol = 2;

  const auth = useAuth();
  const goTo = useNavigate();

  /*const handleCarreraChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setCarrera(e.target.value);
  };*/

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/crear/docente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo,
          cedula,
          nombre,
          apellido,
          correo,
          contrasena,
          rol,
        }),
      });

      if (response.ok) {
        console.log("Usuario creado correctamente");
        setErrorResponse("");
        goTo("/");
      } else {
        console.log("Algo ocurrió");
        const json = (await response.json()) as AuthResponseError;
        setErrorResponse(json.body.error);
        return;
      }
    } catch (error) {
      console.error("Error: ", error);
    }

  }

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <div className="signupCard">
        <h3>Registro de estudiante</h3>
        <Form className="form" onSubmit={handleSubmit}>
          {!!errorResponse &&
            <Alert key="danger" variant="danger">
              {errorResponse}
            </Alert>}
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Codigo</Form.Label>
                <Form.Control
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={9}>
              <Form.Group>
                <Form.Label>Cedula</Form.Label>
                <Form.Control
                  type="text"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label>Correo institucional</Form.Label>
            <Form.Control
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </Form.Group>
          <Button className="btnSignup" type="submit">
            Registrarse
          </Button>
        </Form>
      </div>
    </>
  );
}
