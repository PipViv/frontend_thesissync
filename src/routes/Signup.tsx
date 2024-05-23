import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { SetStateAction, useEffect, useState } from 'react';
import '../assets/css/signup.css'
import { API_URL } from '../constants/constants';
import { AuthResponseError } from '../types/types';

interface Carrera {
  id: string;
  nombre: string;
}


export default function Signup() {

  //const [codigo, setCodigo] = useState("");
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correoInsti, setCorreoInsti] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [carrera, setCarrera] = useState("");
  const [carrerasList, setCarrerasList] = useState<Carrera[]>([]);

  const [errorResponse, setErrorResponse] = useState("");
  const rol = 3;

  const auth = useAuth();
  const goTo = useNavigate();

  useEffect(() => {
    // Llamar a la función para obtener las carreras cuando el componente se monta
    obtenerCarreras();
  }, []);

  const handleCarreraChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setCarrera(e.target.value);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/create/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cedula,
          nombre,
          apellido,
          correoInsti,
          carrera,
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
  const obtenerCarreras = async () => {
    try {
      const response = await fetch(`${API_URL}/carreras`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCarrerasList(data); // Almacenar las carreras en el estado local
      } else {
        console.log('Error al obtener las carreras');
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };


  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <div className="signupCard">
        <div><h3>Registro de estudiante</h3></div>
        
        <Form className="form" onSubmit={handleSubmit}>
          {!!errorResponse &&
            <Alert key="danger" variant="danger">
              {errorResponse}
            </Alert>}
          <Row>
            
            <Col md={12}>
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
                <Form.Label>Apellidos</Form.Label>
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
              value={correoInsti}
              onChange={(e) => setCorreoInsti(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group>
            <Form.Label>Carrera</Form.Label>
            <Form.Select aria-label="Default select example" value={carrera} onChange={handleCarreraChange}>
              <option value="0">Seleccionar carrera</option>
              {carrerasList.map((carrera) => (
                <option key={carrera.id} value={carrera.id}>
                  {carrera.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </Form.Group>
          <Button variant="success" className="btnSignup" type="submit">
            Registrarme
          </Button>
        </Form>
      </div>
    </>
  );
}
