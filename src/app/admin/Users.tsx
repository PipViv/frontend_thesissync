import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { API_URL, API_URL_ADMON } from '../../constants/constants';
import { User } from "../../types/types";
import { Button, Form, FormControl, InputGroup, Modal, Table } from "react-bootstrap";

// Users Component
export default function Users() {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correoInsti, setCorreoInsti] = useState("");
  const [celular, setCelular] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correoAlter, setCorreoAlter] = useState("");
  const [direccion, setDireccion] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [programaId, setProgramaId] = useState("");
  // const [rol, setRol] = useState("2"); // Default: Estudiante

  const [users, setUsers] = useState<User[]>([]);
  const [show, setShow] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  // const [cedula, setCedula] = useState("");
  // const [nombre, setNombre] = useState("");
  // const [apellido, setApellido] = useState("");
  // const [correoInsti, setCorreoInsti] = useState("");
  // const [celular, setCelular] = useState("");
  // const [contrasena, setContrasena] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  // const [programaId, setProgramaId] = useState("");
  const [programas, setProgramas] = useState<{ id: number, nombre: string }[]>([]);

  const rol = 3;

  const handleClose = () => setShow(false);
  const handleShow = (id: number) => {
    setSelectedUserId(id);
    setShow(true);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL_ADMON}/all/students/list`);
      if (!response.ok) {
        throw new Error('Error fetching users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (selectedUserId === null) return;

    try {
      const response = await fetch(`${API_URL_ADMON}/user/block/${selectedUserId}/1`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Error deleting user');
      }

      const updatedUsers = users.filter(user => user.id !== selectedUserId);
      setUsers(updatedUsers);
      handleClose();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleShowNewUserModal = () => {
    setShowNewUserModal(true);
  };

  const fetchProgramas = async () => {
    try {
      const response = await fetch(`${API_URL_ADMON}/programs/list/create`);
      if (!response.ok) throw new Error("Error fetching programs");
      
      const data = await response.json();
      
      // Transformar los datos para que muestre "nombre - jornada"
      const formattedData = data.map((programa: { id: number, nombre: string, Jornada: string }) => ({
        id: programa.id,
        nombre: `${programa.nombre} - ${programa.Jornada}`
      }));
      
      setProgramas(formattedData);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  useEffect(() => {
    if (showNewUserModal) {
      fetchProgramas();
    }
  }, [showNewUserModal]);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  
    const usuarioData = {
      cedula,
      nombre,
      apellido,
      correoInsti,
      celular,
      contrasena,
      rol,
      carrera: programaId, // Asegurar que el ID del programa sea enviado correctamente
      correoAlter: "", // Agregar si se requiere
      direccion: "", // Agregar si se requiere
      telefono: celular, // Si el backend espera "telefono", igualarlo a celular
    };
  
    try {
      const response = await fetch(`${API_URL}/create/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.body.message);
        fetchUsers();
        setCedula("");
        setNombre("");
        setApellido("");
        setCorreoInsti("");
        setCelular("");
        setContrasena("");
        setProgramaId("");
      } else {
        alert(data.body.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  // async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();

  //   try {
  //     const response = await fetch(`${API_URL}/create/user`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         cedula,
  //         nombre,
  //         apellido,
  //         correoInsti,
  //         contrasena,
  //         rol,
  //       }),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       alert(data.body.message);
  //       fetchUsers();
  //       setCedula("");
  //       setNombre("");
  //       setApellido("");
  //       setCorreoInsti("");
  //       setCelular("");
  //       setContrasena("");
  //     } else {
  //       const data = await response.json();
  //       alert(data.body.error);
  //     }
  //   } catch (error) {
  //     console.error("Error: ", error);
  //   }
  // }

  // Filtrar usuarios según el término de búsqueda
  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>

      <div className="d-inline-flex align-items-center">
        <div className="mb-3 mx-2">
          <Button variant="primary" onClick={handleShowNewUserModal}>Crear Nuevo Usuario</Button>
        </div>
        <InputGroup className="mb-3 mx-2" style={{ maxWidth: '400px' }}>
          <InputGroup.Text id="search-addon">Buscar</InputGroup.Text>
          <FormControl
            placeholder="Buscar por nombre, apellido, cédula o correo"
            aria-label="Buscar"
            aria-describedby="search-addon"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      {/*<div className="mb-3" >
        <Button variant="primary" onClick={handleShowNewUserModal}>Crear Nuevo Usuario</Button>
      </div>
      
      <Form.Control
      
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ maxWidth: '400px' }}
      />
      <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
        <InputGroup.Text id="search-addon">Buscar</InputGroup.Text>
        <FormControl
          placeholder="Buscar por nombre, apellido, cédula o correo"
          aria-label="Buscar"
          aria-describedby="search-addon"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>*/}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cedula</th>
            <th>Correo</th>
            <th>Cursos</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nombre} {user.apellido}</td>
              <td>{user.cedula}</td>
              <td>{user.correo}</td>
              <td>{user.programas.map((programa: { id: Key | null | undefined; nombre: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                <div key={programa.id}>{programa.nombre}</div>
              ))}</td>
              <td>
                <Button variant="outline-danger" onClick={() => handleShow(user.id)}>Restringir acceso</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Advertencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Estimado Administrador:

          Quisiera informarle que al presionar el botón "Aceptar", el usuario seleccionado será deshabilitado para acceder a la plataforma.

          Quedo a su disposición para cualquier consulta adicional.

          Atentamente, ThesisSync
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="primary" onClick={handleDelete}>Aceptar</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showNewUserModal} onHide={() => setShowNewUserModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Nuevo Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Cédula</Form.Label>
            <Form.Control type="text" placeholder="Ingrese su cédula" value={cedula} onChange={(e) => setCedula(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nombres</Form.Label>
            <Form.Control type="text" placeholder="Ingrese los nombres" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Apellidos</Form.Label>
            <Form.Control type="text" placeholder="Ingrese sus apellidos" value={apellido} onChange={(e) => setApellido(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo Institucional</Form.Label>
            <Form.Control type="email" placeholder="Ingrese su correo" value={correoInsti} onChange={(e) => setCorreoInsti(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo Alternativo</Form.Label>
            <Form.Control type="email" placeholder="Ingrese su correo alternativo" value={correoAlter} onChange={(e) => setCorreoAlter(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Teléfono Celular</Form.Label>
            <Form.Control type="tel" placeholder="Ingrese su número" value={celular} onChange={(e) => setCelular(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Teléfono Fijo</Form.Label>
            <Form.Control type="tel" placeholder="Ingrese su teléfono fijo" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control type="text" placeholder="Ingrese su dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" placeholder="Ingrese su contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Programa Académico</Form.Label>
            <Form.Select value={programaId} onChange={(e) => setProgramaId(e.target.value)}>
              <option value="">Seleccione un programa</option>
              {programas.map((programa) => (
                <option key={programa.id} value={programa.id}>
                  {programa.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">Enviar</Button>
        </Form>
      </Modal.Body>
    </Modal>
      {/* <Modal show={showNewUserModal} onHide={() => setShowNewUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>Nombres</Form.Label>
              <Form.Control type="text" placeholder="Ingrese los nombres" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control type="text" placeholder="Ingrese sus apellidos" value={apellido} onChange={(e) => setApellido(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicInstitutionalEmail">
              <Form.Label>Correo Institucional</Form.Label>
              <Form.Control type="email" placeholder="Ingrese su correo institucional" value={correoInsti} onChange={(e) => setCorreoInsti(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicAlternateEmail">
              <Form.Label>Cédula de identificación</Form.Label>
              <Form.Control type="text" placeholder="Ingrese su cédula de identificación" value={cedula} onChange={(e) => setCedula(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
              <Form.Label>Teléfono Celular</Form.Label>
              <Form.Control type="tel" placeholder="Ingrese su número de teléfono celular" value={celular} onChange={(e) => setCelular(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="Ingrese su contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
            </Form.Group>

            <Button variant="primary" type="submit">Enviar</Button>
          </Form>
        </Modal.Body>
      </Modal> */}
    </>
  );
}
