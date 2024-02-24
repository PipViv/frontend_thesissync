import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import "../assets/css/login.css"
import '../assets/css/index.css'
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { API_URL } from '../constants/constants';
import { AuthResponse, AuthResponseError } from '../types/types';
//import {Dashboard} from './Dashboard';


export default function Login() {

  const [usuario, setUsername] = useState("");
  const [contrasena, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorResponse, setErrorResponse] = useState("");
  const auth = useAuth();
  const goTo = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario,
          contrasena
        }),
      });

      if (response.ok) {
        console.log("Login correctamente");
        setErrorResponse("");
        const json = (await response.json()) as AuthResponse;
        console.log(json.body.accessToken)

        if (json.body.accessToken && json.body.refreshToken) {
          auth.saveUser(json);
          goTo(`/dashboard?id=${json.body.user.id}&rol=${json.body.user.rol}`);
        }



      } else {
        console.log("Algo ocurrió");
        const json = (await response.json()) as AuthResponseError;
        setErrorResponse(json.body.error);
        return;
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }

  }

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" />
  }


  return (
    <>

      <div className="loginCard">
        <div className="imageDiv">
          <div className="imagen" ></div>
        </div>
        <Form className="form" onSubmit={handleSubmit}>
          {!!errorResponse &&
            <Alert key="danger" variant="danger">
              {errorResponse}
            </Alert>}
          <Form.Group>
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              type="text"
              value={usuario}
              onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={contrasena}
              onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
          <Button id='btnlogin' className="btnLogin" type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <>
                Cargando... <Spinner animation="border" size="sm" />
              </>
            ) : (
              'Iniciar sesión'
            )}
          </Button>{' '}
        </Form>
      </div>
    </>
  )
}