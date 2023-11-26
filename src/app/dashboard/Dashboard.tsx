import Header from '../layouts/Header';
//import Footer from '../layouts/Footer'
//import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../assets/css/dashboard.css';
import { useState, useEffect } from 'react';
import Tesis from '../../routes/ThesisForm'
import ThesisList from '../../routes/ThesisList';
import { useLocation } from 'react-router-dom';
import TeacherPanel from '../Teacher/TeacherPanel';

export default function Dashboard() {
  // Crea un estado para controlar si el modal está abierto o cerrado
  const [showModal, setShowModal] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = Number(searchParams.get('id'));
  const rol = Number(searchParams.get('rol'));


  // Función para abrir el modal
  const handleShowModal = () => {
    setShowModal(true);
  }

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
  }
  useEffect(() => {
    console.log('ID:', id);
    console.log('Rol:', rol);
  }, [id, rol]);

  const renderComponentBasedOnId = () => {
    if (rol == 3) {
      return (
        <>
          <Header />
          <ThesisList id_user={id}/>
          <Button className='customButtonTesis' variant='warning' onClick={handleShowModal}>
            <i className="bi bi-plus"></i>
          </Button>
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Agregar Tesis</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Tesis />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    } else if (rol == 2) {
      // Renderiza el componente específico para id === '2'
      return <>
      <Header />
      <TeacherPanel id_user={id}/>
      </>;
    } else {
      return <>
      <div>Panel  de admin</div>
      </>;
    }
  };

  return (
    <div>
      {renderComponentBasedOnId()}
      {/* Agrega otros componentes según sea necesario */}
    </div>
  );
}


/*
  return (
    <>
      <Header />

      <ThesisList />

      <Button className='customButtonTesis' variant='warning' onClick={handleShowModal} >
        <i className="bi bi-plus"></i>
      </Button >

      {<Footer />}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Tesis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tesis />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}*/
