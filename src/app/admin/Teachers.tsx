import { useState, useEffect } from "react";
import { API_URL, API_URL_ADMON } from '../../constants/constants';
import { Teacher } from "../../types/types";
import { Button, Form, Modal, Table, InputGroup, FormControl } from "react-bootstrap";

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [show, setShow] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correoInsti, setCorreoInsti] = useState("");
  const [celular, setCelular] = useState("");
  const [contrasena, setContrasena] = useState("");
  const rol = 2;

  const handleClose = () => setShow(false);
  const handleShow = (id: number) => {
    setSelectedTeacherId(id);
    setShow(true);
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API_URL_ADMON}/all/teachers/list`);
      const data = await response.json();

      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async () => {
    if (selectedTeacherId === null) return;

    try {
      const response = await fetch(`${API_URL_ADMON}/user/block/${selectedTeacherId}/$`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Error deleting user');
      }

      // Actualizar la lista de docentes después de eliminar uno
      const updatedTeachers = teachers.filter(teacher => teacher.id !== selectedTeacherId);
      setTeachers(updatedTeachers);
      handleClose();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleShowNewUserModal = () => {
    setShowNewUserModal(true);
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
          contrasena,
          rol,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.body.message);
        // Actualizar la lista de docentes después de la creación exitosa
        fetchTeachers(); // Aquí actualizamos la lista después de crear un nuevo profesor
        setCedula("");
        setNombre("");
        setApellido("");
        setCorreoInsti("");
        setCelular("");
        setContrasena("");
      } else {
        const data = await response.json();
        alert(data.body.error);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  // Filtrar usuarios según el término de búsqueda
  const filteredTeachers = teachers.filter(teacher =>
    teacher.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div className="mb-3" style={{ maxWidth: '500px', marginLeft: '10px' }}>
          <Button variant="secondary" onClick={handleShowNewUserModal}><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
            <path d="M5 9l3 3-1 1-3-3z"></path>
          </svg>
            Crear Nuevo Usuario</Button>
        </div>

        <InputGroup className="mb-3" style={{ maxWidth: '500px', marginRight: '20px' }}>
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


      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cedula</th>
            <th>Correo Institucional</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.id}</td>
              <td>{teacher.nombre} {teacher.apellido}</td>
              <td>{teacher.cedula}</td>
              <td>{teacher.correo}</td>
              <td>
                <Button variant="outline-secondary" onClick={() => handleShow(teacher.id)}>Inhabilitar</Button>
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

            <Button variant="primary" type="submit">
              Enviar
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </>
  );
}
/*import { useState, useEffect } from "react";
import { API_URL, API_URL_ADMON } from '../../constants/constants';
import { Teacher } from "../../types/types";
import { Button, Form, Modal, Table } from "react-bootstrap";

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [show, setShow] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);

  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correoInsti, setCorreoInsti] = useState("");
  const [celular, setCelular] = useState("");
  const [contrasena, setContrasena] = useState("");
  const rol = 2;

  const handleClose = () => setShow(false);
  const handleShow = (id: number) => {
    setSelectedTeacherId(id);
    setShow(true);
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API_URL_ADMON}/all/teachers/list`);
      const data = await response.json();

      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async () => {
    if (selectedTeacherId === null) return;

    try {
      const response = await fetch(`${API_URL_ADMON}/user/block/${selectedTeacherId}/$`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Error deleting user');
      }

      // Actualizar la lista de docentes después de eliminar uno
      const updatedTeachers = teachers.filter(teacher => teacher.id !== selectedTeacherId);
      setTeachers(updatedTeachers);
      handleClose();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleShowNewUserModal = () => {
    setShowNewUserModal(true);
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
          contrasena,
          rol,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(data.body.message);
        // Actualizar la lista de docentes después de la creación exitosa
        fetchTeachers(); // Aquí actualizamos la lista después de crear un nuevo profesor
        setCedula("");
        setNombre("");
        setApellido("");
        setCorreoInsti("");
        setCelular("");
        setContrasena("");
      } else {
        const data = await response.json();
        alert(data.body.error);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }
  

  //const handleCloseAndSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //await handleSubmit(e); // Maneja el envío del formulario
    //setShowNewUserModal(false); // Cierra el Modal
  //};

  return (
    <>
      <div>
        <Button variant="primary" onClick={handleShowNewUserModal}>Crear Nuevo Usuario</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cedula</th>
            <th>Correo Institucional</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id}>
              <td>{teacher.id}</td>
              <td>{teacher.nombre} {teacher.apellido}</td>
              <td>{teacher.cedula}</td>
              <td>{teacher.correo}</td>
              <td>
                <Button variant="outline-secondary" onClick={() => handleShow(teacher.id)}>Inhabilitar</Button>
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
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>Nombres</Form.Label>
              <Form.Control type="text" placeholder="Ingrese los nombres" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control type="text" placeholder="Ingrese sus apellidos" value={apellido} onChange={(e) => setApellido(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicInstitutionalEmail">
              <Form.Label>Correo Institucional              </Form.Label>
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

            <Button variant="primary" type="submit">
              Enviar
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </>
  );
}
*/