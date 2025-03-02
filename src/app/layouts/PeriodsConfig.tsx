/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { API_URL_ADMON } from '../../constants/constants';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import moment from 'moment';

interface Period {
  id: number;
  name: string;
  startPeriod: string;
  tesisUpEnd: string;
  tesisEvaluationEnd: string;
  endPeriod: string;
}

interface PeriodResponse {
  id: number;
  name: string;
  start_period: string;
  tesis_up_end: string;
  tesis_evaluation_end: string;
  end_period: string;
}

const PeriodsConfig: React.FC = () => {
  const [formData, setFormData] = useState<Period>({
    id: 0,
    name: '',
    startPeriod: '',
    tesisUpEnd: '',
    tesisEvaluationEnd: '',
    endPeriod: ''
  });

  const [message, setMessage] = useState<string>('');
  const [activePeriods, setActivePeriods] = useState<PeriodResponse[]>([]);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    fetchActivePeriods();
  }, []);

  function formattedDate(fecha: Date): string {
    return moment(fecha).format("DD-MM-YYYY").toString();
  }

  const fetchActivePeriods = async () => {
    try {
      const response = await fetch(`${API_URL_ADMON}/all/periods`);
      if (!response.ok) {
        throw new Error('Error al obtener los períodos activos');
      }
      const data = await response.json();
      setActivePeriods(data);
      setShowForm(data.length === 0); // Muestra el formulario si no hay períodos activos
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validaciones de fechas
    const startDate = new Date(formData.startPeriod);
    const tesisUpEndDate = new Date(formData.tesisUpEnd);
    const tesisEvaluationEndDate = new Date(formData.tesisEvaluationEnd);
    const endDate = new Date(formData.endPeriod);

    if (tesisUpEndDate < startDate) {
      alert('La fecha límite para subir tesis no puede ser anterior al inicio del período.');
      return;
    }

    if (tesisEvaluationEndDate < tesisUpEndDate) {
      alert('La fecha límite para la evaluación de tesis no puede ser anterior a la fecha límite para subir tesis.');
      return;
    }

    const sixMonthsFromStartDate = new Date(startDate);
    sixMonthsFromStartDate.setMonth(sixMonthsFromStartDate.getMonth() + 6);
    if (endDate > sixMonthsFromStartDate) {
      alert('El período de finalización del período académico no puede ser más de 6 meses después del inicio del período.');
      return;
    }

    try {
      const response = await fetch(`${API_URL_ADMON}/periods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al guardar el período académico');
      }

      alert('Período académico guardado exitosamente');
      setFormData({
        ...formData,
        id: 0
      });
      fetchActivePeriods(); // Actualiza la lista de períodos activos
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al guardar el período académico');
    }
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const handleShowForm = () => {
    setShowForm(true);
    setShowModal(false); // Oculta el modal cuando se muestra el formulario
  };

  return (
    <Container className="mt-5">
      {activePeriods.length > 0 && (
        <Row>
          <Col md={12}>
            <ul className="list-group">
              {activePeriods.map((period) => (
                <li key={period.id} className="list-group-item">
                  <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px', padding: '20px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <h5>{period.name}</h5>
                    <p><strong>Inicio:</strong> {formattedDate(new Date(period.start_period))}</p>
                    <p><strong>Límite para subir tesis:</strong> {formattedDate(new Date(period.tesis_up_end))}</p>
                    <p><strong>Límite para evaluación de tesis:</strong> {formattedDate(new Date(period.tesis_evaluation_end))}</p>
                    <p><strong>Fin:</strong> {formattedDate(new Date(period.end_period))}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar nuevo período</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Nombre del período:</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="startPeriod">
              <Form.Label>Fecha de inicio del período:</Form.Label>
              <Form.Control type="date" name="startPeriod" value={formData.startPeriod} onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="tesisUpEnd">
              <Form.Label>Fecha límite para subir tesis:</Form.Label>
              <Form.Control type="date" name="tesisUpEnd" value={formData.tesisUpEnd} onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="tesisEvaluationEnd">
              <Form.Label>Fecha límite para evaluación de tesis:</Form.Label>
              <Form.Control type="date" name="tesisEvaluationEnd" value={formData.tesisEvaluationEnd} onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="endPeriod">
              <Form.Label>Fecha de fin del período:</Form.Label>
              <Form.Control type="date" name="endPeriod" value={formData.endPeriod} onChange={handleChange} required />
            </Form.Group>

            <Button variant="primary" type="submit">Registrar</Button>
          </Form>
          {message && <p className="message">{message}</p>}
        </Modal.Body>
      </Modal>

      {!showForm && (
        <Row className="justify-content-md-center mt-4">
          <Col md={6} className="text-center">
            <Button variant="primary" onClick={handleShowModal}>Registrar nuevo período</Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PeriodsConfig;
