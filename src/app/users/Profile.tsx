/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { API_URL } from '../../constants/constants';
import { Container, Row, Col, Tab, Form, Button, Image } from 'react-bootstrap';
import { ProfileInfo, UserResponse } from '../../types/types';
import './profile.css'
export default function ProfileComponent(profileInfo: ProfileInfo) {
  const { userInfo } = profileInfo;

  const [user, setUser] = useState<UserResponse>({});
  const [editable, setEditable] = useState(false); // Estado para rastrear si los campos son editables o no

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/user/data/${userInfo}`);
        const data = await response.json();
        console.log(data)
        setUser(data); // Asigna los datos del usuario al estado 'user'
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser(); // Llamar a fetchUser cuando userInfo cambie
  }, [userInfo]);

  //const handleEdit = () => {
    //setEditable(true); // Cambiar el estado a true para hacer los campos editables
  //};
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setUser({ ...user, data: { ...user.data[0], photo: selectedFile } });
    }
  };

  const handleSave = async () => {
    try {
      console.log('Datos guardados:', user);
      const response = await fetch(`${API_URL}/update/userInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.data[0].id,
          nombre: user.data[0].nombre,
          apellido: user.data[0].apellido,
          cedula: user.data[0].cedula,
          celular: user.data[0].celular,
          correoInsti: user.data[0].correoInsti,
          telefono: user.data[0].telefono,
          photo: user.data[0].photo,
          correoAlter: user.data[0].correoAlter,
          direccion: user.data[0].direccion,
          carrera: user.data[0].carrera
        }),
      });
      console.log(response.body)

      setEditable(false); // Cambiar el estado a false para deshabilitar la edición
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <>
      <Container>
        <Row className="mt-4">
          <Col sm={4}>
            <div className="text-center">
              {editable ? (
                <div></div>
              ) : (
                <Image src="http://ssl.gstatic.com/accounts/ui/avatar_2x.png" rounded />
              )}
            </div>
            <hr />
            <ul className="list-group">
              <li className="list-group-item text-right">
                <span className="pull-left">
                  <strong>Programas académicos</strong>
                </span>
              </li>
              {user.program && user.program.map((prog: { id: number; student: string; programd: number, nombre: string }, index: number) => (
                <li key={index} className="list-group-item">
                  Programa {index + 1}: {prog.nombre}
                </li>
              ))}
            </ul>
          </Col>
          <Col sm={8}>
            <Tab.Container defaultActiveKey="perfil">
              <Tab.Content>
                <Tab.Pane eventKey="perfil">
                  <Form className="mt-4">
                    {editable ? (
                      <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Cargar foto de perfil</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                      </Form.Group>
                    ) : (
                      <div></div>
                    )}

                    <div className="profile-panel">
                      <Form.Group controlId="nombre">
                        <Form.Label className="profile-label" >Nombre</Form.Label>
                        <div className="profile-divider"></div>
                        {user.data ? (
                          editable ? (
                            <Form.Control
                              type="text"
                              placeholder="Nombre"
                              value={user.data[0].nombre || ''}
                              onChange={(e) => setUser({ ...user, data: [{ ...user.data[0], nombre: e.target.value }, ...user.data.slice(1)] })}
                            />
                          ) : (
                            <Form.Control plaintext readOnly defaultValue={user.data[0].nombre || ''} />
                          )
                        ) : null}
                      </Form.Group>
                    </div>

                    <div className="profile-panel">
                      <Form.Group controlId="apellidos">
                        <Form.Label className="profile-label" >Apellidos</Form.Label>
                        <div className="profile-divider"></div>
                        {user.data ? (
                          editable ? (
                            <Form.Control
                              type="text"
                              placeholder="Apellidos"
                              value={user.data[0].apellido || ''}
                              onChange={(e) => setUser({ ...user, data: [{ ...user.data[0], apellido: e.target.value }, ...user.data.slice(1)] })}
                            />
                          ) : (
                            <Form.Control plaintext readOnly defaultValue={user.data[0].apellido || ''} />
                          )
                        ) : null}
                      </Form.Group>
                    </div>

                    <div className="profile-panel">
                      <Form.Group controlId="identificacion">
                        <Form.Label className="profile-label" >Identificación</Form.Label>
                        <div className="profile-divider"></div>
                        {user.data ? (
                          editable ? (
                            <Form.Control
                              type="text"
                              placeholder="Cédula"
                              value={user.data[0].cedula || ''}
                              onChange={(e) => setUser({ ...user, data: [{ ...user.data[0], cedula: e.target.value }, ...user.data.slice(1)] })}
                              disabled
                            />
                          ) : (
                            <Form.Control plaintext readOnly defaultValue={user.data[0].cedula || ''} />
                          )
                        ) : null}
                      </Form.Group>
                    </div>

                    <div className="profile-panel">
                      <Form.Group controlId="telefono">
                        <Form.Label className="profile-label" >Teléfono</Form.Label>
                        <div className="profile-divider"></div>
                        {user.data ? (
                          editable ? (
                            <Form.Control
                              type="text"
                              placeholder="Teléfono"
                              value={user.data[0].telefono || ''}
                              onChange={(e) => setUser({ ...user, data: [{ ...user.data[0], telefono: e.target.value }, ...user.data.slice(1)] })}
                            />
                          ) : (
                            <Form.Control plaintext readOnly defaultValue={user.data[0].telefono || ''} />
                          )
                        ) : null}
                      </Form.Group>
                    </div>

                    <div className="profile-panel">
                      <Form.Group controlId="celular">
                        <Form.Label className="profile-label" >Celular</Form.Label>
                        <div className="profile-divider"></div>
                        {user.data && user.data.length > 0 ? (
                          editable ? (
                            <Form.Control
                              type="text"
                              placeholder="Celular"
                              value={user.data[0].celular || ''}
                              onChange={(e) => setUser({ ...user, data: [{ ...user.data[0], celular: e.target.value }, ...user.data.slice(1)] })}
                            />
                          ) : (
                            <Form.Control plaintext readOnly defaultValue={user.data[0].celular || ''} />
                          )
                        ) : null}
                      </Form.Group>
                    </div>

                    <div className="profile-panel">
                      <Form.Group controlId="correoInsti">
                        <Form.Label className="profile-label" >Correo Institucional</Form.Label>
                        <div className="profile-divider"></div>
                        {user.data && user.data.length > 0 ? (
                          editable ? (
                            <Form.Control
                              type="email"
                              placeholder="Correo Institucional"
                              value={user.data[0].correoInsti || ''}
                              onChange={(e) => setUser({ ...user, data: [{ ...user.data[0], correoInsti: e.target.value }, ...user.data.slice(1)] })}
                            />
                          ) : (
                            <Form.Control plaintext readOnly defaultValue={user.data[0].correoInsti || ''} />
                          )
                        ) : null}
                      </Form.Group>
                    </div>

                    <div className="profile-panel">
                      <Form.Group controlId="correoAlter">
                        <Form.Label className="profile-label" >Correo Alternativo</Form.Label>
                        <div className="profile-divider"></div>
                        {user.data && user.data.length > 0 ? (
                          editable ? (
                            <Form.Control
                              type="email"
                              placeholder="Correo Alternativo"
                              value={user.data[0].correoAlter || ''}
                              onChange={(e) => setUser({ ...user, data: [{ ...user.data[0], correoAlter: e.target.value }, ...user.data.slice(1)] })}
                            />
                          ) : (
                            <Form.Control plaintext readOnly defaultValue={user.data[0].correoAlter || ''} />
                          )
                        ) : null}
                      </Form.Group>
                    </div>

                    <div className="profile-panel">
                      <Form.Group controlId="direccion" className="profile-form-group">
                        <Form.Label className="profile-label" >Dirección de residencia</Form.Label>
                        <div className="profile-divider"></div>
                        {user.data && user.data.length > 0 ? (
                          editable ? (
                            <Form.Control
                              type="text"
                              placeholder="Dirección"
                              value={user.data[0].direccion || ''}
                              onChange={(e) => setUser({ ...user, data: [{ ...user.data[0], direccion: e.target.value }, ...user.data.slice(1)] })}
                            />
                          ) : (
                            <Form.Control plaintext readOnly defaultValue={user.data[0].direccion || ''} />
                          )
                        ) : null}
                      </Form.Group>
                    </div>


                    {editable ? (
                      <div>
                        <Button
                          variant="success"
                          type="button"
                          onClick={handleSave}
                          style={{ marginRight: "10px" }} // Ajustar el espaciado
                        >
                          Guardar
                        </Button>
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => setEditable(false)} // Cambiar editable a false
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        type="button"
                        onClick={() => setEditable(true)} // Cambiar editable a true
                      >
                        Editar
                      </Button>
                    )}


                  </Form>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
    </>
  );
}
