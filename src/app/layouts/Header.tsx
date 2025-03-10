import { useEffect, useState } from 'react';
import { Tabs, Tab, Container, Alert, Button } from 'react-bootstrap';
import ProfileComponent from '../users/Profile';
import ThesisList from '../../routes/ThesisList';
import Users from '../admin/Users';
import Teacher from '../admin/Teachers';
import PeriodsConfig from './PeriodsConfig';
import moment from 'moment';
import { API_URL_ADMON } from '../../constants/constants';
import { useAuth } from '../../auth/AuthProvider';
import logo from '../../assets/img/cooltext477327440798987_white.png'; // Ruta correcta del logo

interface HeaderProps {
  id: number;
  rol: number;
}

interface Period {
  id: number;
  name: string;
  tesis_up_end: string;
}

export default function Header({ id, rol }: HeaderProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_periods, setPeriods] = useState<Period[]>([]);
  const [alerts, setAlerts] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { signout } = useAuth();

  const handleSignout = () => {
    signout();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchActivePeriods();
        setPeriods(data);
        setAlerts(generateAlerts(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchActivePeriods = async (): Promise<Period[]> => {
    const response = await fetch(`${API_URL_ADMON}/periods/active`);
    if (!response.ok) {
      throw new Error('Error al obtener los períodos activos');
    }
    return await response.json();
  };

  const generateAlerts = (periods: Period[]): JSX.Element[] => {
    return periods.map((period) => {
      const daysRemaining = calculateDaysRemaining(period.tesis_up_end);
      let variant = 'success';

      if (daysRemaining <= 5) {
        variant = 'danger';
      } else if (daysRemaining <= 10) {
        variant = 'warning';
      }

      return (
        <Alert key={period.id} variant={variant}>
          Quedan {daysRemaining} días para finalizar el período {period.name}.
        </Alert>
      );
    });
  };

  const calculateDaysRemaining = (endDate: string): number => {
    const today = moment();
    const end = moment(endDate);
    return end.diff(today, 'days');
  };

  const renderBodyContent = (): JSX.Element => {
    const commonStyle = {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      lineHeight: 1.6,
      color: '#333',
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px'
    };

    if (rol === 2 || rol === 1) {
      return (
        <Container>
          <div style={commonStyle}>
            <h2 style={{ color: '#007bff', marginBottom: '15px' }}>Supervisión de Proyectos</h2>
            <p style={{ marginTop: '30px', marginBottom: '15px' }}>
              Supervisa y brinda orientación a los estudiantes en el desarrollo de sus proyectos de grado. Proporciona retroalimentación constructiva sobre las propuestas, los prototipos y los informes de avance, asegurando la calidad y la relevancia académica de cada proyecto.
            </p>
          </div>

          <div style={commonStyle}>
            <h2 style={{ color: '#007bff', marginBottom: '15px' }}>Evaluación de Proyectos</h2>
            <p style={{ marginTop: '30px', marginBottom: '15px' }}>
              Evalúa los proyectos de grado presentados por los estudiantes. Analiza la calidad del trabajo, la originalidad de las ideas, la aplicación de metodologías de investigación y la contribución al campo académico. Proporciona comentarios detallados y sugerencias para mejorar futuros proyectos.
            </p>
          </div>
        </Container>
      );
    } else {
      return (
        <Container>
          <div style={commonStyle}>
            <h2 style={{ color: '#007bff', marginBottom: '15px' }}>Propuesta de Proyecto</h2>
            <p style={{ marginTop: '30px', marginBottom: '15px' }}>
              Presenta una propuesta de proyecto de grado que aborde un problema relevante en tu área de estudio. Describe el contexto del problema, los objetivos del proyecto, la metodología de investigación y los posibles resultados esperados.
            </p>
          </div>

          <div style={commonStyle}>
            <h2 style={{ color: '#007bff', marginBottom: '15px' }}>Desarrollo de Prototipo</h2>
            <p style={{ marginTop: '30px', marginBottom: '15px' }}>
              Desarrolla un prototipo funcional basado en tu propuesta de proyecto de grado. Utiliza herramientas y tecnologías pertinentes a tu disciplina para implementar el prototipo y demuestra su viabilidad a través de pruebas y evaluaciones.
            </p>
          </div>

          <div style={commonStyle}>
            <h2 style={{ color: '#007bff', marginBottom: '15px' }}>Informe de Avance</h2>
            <p style={{ marginTop: '30px', marginBottom: '15px' }}>
              Prepara un informe de avance que documente el progreso de tu proyecto de grado hasta la fecha. Describe las tareas completadas, los desafíos enfrentados y las próximas etapas del proyecto. Incluye evidencia tangible, como código fuente, diseños, resultados de pruebas, etc.
            </p>
          </div>
        </Container>
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {/* <header style={{ height: '70px', backgroundColor: 'black', position: 'relative' }}>
        <Container />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '5px', backgroundColor: '#485EFD' }}></div>
        <Button onClick={handleSignout} variant="outline-light" style={{ position: 'absolute', top: '15px', right: '15px' }}>Cerrar sesión</Button>

      </header> */}
      <header style={{ height: '70px', backgroundColor: 'black', position: 'relative', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
        <img src={logo} alt="ThesisSync Logo" style={{ height: '50px', marginRight: '20px' }} /> 
        <Container />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '5px', backgroundColor: '#485EFD' }}></div>
        <Button onClick={handleSignout} variant="outline-light" style={{ position: 'absolute', top: '15px', right: '15px' }}>
          Cerrar sesión
        </Button>
      </header>

      <Tabs defaultActiveKey="home" id="justify-tab-example" className="mb-3" justify>
        <Tab eventKey="home" title="Inicio">
          <div>{alerts}</div>
          <div>{renderBodyContent()}</div>
        </Tab>
        {(rol === 1 || rol === 2 || rol === 3) && (
          <Tab eventKey="profile" title="Perfil">
            <ProfileComponent userInfo={id} rol={rol} />
          </Tab>
        )}
        {(rol === 1 || rol === 2 || rol === 3) && (
          <Tab eventKey="longer-tab" title="Tesis">
            <ThesisList profileInfo={{ userInfo: id, rol: rol }} />
          </Tab>
        )}
        {rol === 1 && (
          <Tab eventKey="period" title="Periodos">
            <PeriodsConfig />
          </Tab>
        )}
        {rol === 1 && (
          <Tab eventKey="teacher" title="Docentes">
            <Teacher />
          </Tab>
        )}
        {rol === 1 && (
          <Tab eventKey="student" title="Estudiantes">
            <Users />
          </Tab>
        )}
      </Tabs>
    </>
  );
}