import { useState, useEffect } from 'react';
import Header from '../layouts/Header';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../assets/css/dashboard.css';
import Tesis from '../../routes/ThesisForm';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { API_URL_ADMON } from '../../constants/constants';
import Footer from '../layouts/Footer';
import { ReactComponent as SaveIcon } from './save.svg';


interface Period {
  start_period: string;
  end_period: string;
}

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [activePeriods, setActivePeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = Number(searchParams.get('id'));
  const rol = Number(searchParams.get('rol'));
  const auth = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchActivePeriods();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchActivePeriods = async () => {
    const response = await fetch(`${API_URL_ADMON}/periods/active`);
    if (!response.ok) {
      throw new Error('Error al obtener los períodos activos');
    }
    const data = await response.json();
    setActivePeriods(data);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const isPeriodActive = () => {
    const currentDate = new Date();
    return activePeriods.some((period) => {
      const startDate = new Date(period.start_period);
      const endDate = new Date(period.end_period);
      return currentDate >= startDate && currentDate <= endDate;
    });
  };

  const renderComponentBasedOnRole = () => {
    switch (rol) {
      case 1:
        return <>
          {isPeriodActive() && (
            <Button className='customButtonTesis' variant='warning' onClick={handleShowModal}>
              <i className="bi bi-plus"></i>
            </Button>
          )}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Agregar Tesis</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Tesis id={id} rol={rol} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      case 2:
        return <div>Another Component</div>;
      case 3:
        return (
          <>
            {isPeriodActive() && (
              <Button className='customButtonTesis' variant='warning' onClick={handleShowModal}>
                <i className="bi bi-plus"></i>
              </Button>
            )}
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Agregar Tesis</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Tesis id={id} rol={rol} />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        );
      default:
        return null;
    }
  };

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Header id={id} rol={rol} />
      <div>
        {renderComponentBasedOnRole()}
      </div>
      <Footer />
    </>
  );
}

/*import { useState, useEffect } from 'react';
import Header from '../layouts/Header';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../assets/css/dashboard.css';
import Tesis from '../../routes/ThesisForm';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { API_URL_ADMON } from '../../constants/constants';

interface Period {
  start_period: string;
  end_period: string;
}

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [activePeriods, setActivePeriods] = useState<Period[]>([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = Number(searchParams.get('id'));
  const rol = Number(searchParams.get('rol'));
  const auth = useAuth();

  useEffect(() => {
    fetchActivePeriods();
  }, []);

  const fetchActivePeriods = async () => {
    try {
      const response = await fetch(`${API_URL_ADMON}/periods/active`);
      if (!response.ok) {
        throw new Error('Error al obtener los períodos activos');
      }
      const data = await response.json();
      setActivePeriods(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const isPeriodActive = () => {
    const currentDate = new Date();
    for (const period of activePeriods) {
      const startDate = new Date(period.start_period);
      const endDate = new Date(period.end_period);
      if (currentDate >= startDate && currentDate <= endDate) {
        return true;
      }
    }
    return false;
  };
  

  const renderComponentBasedOnId = () => {
    switch (rol) {
      case 1:
        // Return admin panel component here
        break;
      case 2:
        // Return another component here
        break;
      case 3:
        return (
          <>
            {isPeriodActive() && (
              <Button className='customButtonTesis' variant='warning' onClick={handleShowModal}>
                <i className="bi bi-plus"></i>
              </Button>
            )}
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Agregar Tesis</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Tesis id={id} rol={rol} />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        );
      default:
        break;
    }
  };

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header id={id} rol={rol} />
      <div>
        {renderComponentBasedOnId()}
      </div>
    </>
  );
}
*/

/*import Header from '../layouts/Header';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../assets/css/dashboard.css';
import { useState, useEffect } from 'react';
import Tesis from '../../routes/ThesisForm';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = Number(searchParams.get('id'));
  const rol = Number(searchParams.get('rol'));
  const auth = useAuth();

  useEffect(() => {
    console.log('ID:', id);
    console.log('Rol:', rol);
  }, [id, rol]);

  const handleShowModal = () => {
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const renderComponentBasedOnId = () => {
    switch (rol) {
      case 1:
        // Return admin panel component here
        break;
      case 2:
        // Return another component here
        break;
      case 3:
        return (
          <>
            <Button className='customButtonTesis' variant='warning' onClick={handleShowModal}>
              <i className="bi bi-plus"></i>
            </Button>
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Agregar Tesis</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Tesis id={id} rol={rol} />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        );
      default:
        break;
    }
  };

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header id={id} rol={rol} />
      <div>
        {renderComponentBasedOnId()}
      </div>
    </>
  );
}
*/