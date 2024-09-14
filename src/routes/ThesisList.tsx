import React, { useEffect, useState } from 'react';
import { Card, Button, Col, Row, Modal, Form, ProgressBar, InputGroup, FormControl } from 'react-bootstrap';
import { API_URL, API_URL_ADMON, API_URL_DOC } from '../constants/constants';
import '../assets/css/dashboard.css';
import { ProfileInfo, Thesis, UserInfo } from '../types/types';
import moment from 'moment';
import Chats from './Chats';
import * as XLSX from 'xlsx';

function ThesisList({ profileInfo }: { profileInfo: ProfileInfo }) {
  const { userInfo, rol } = profileInfo;
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [companionsInfo, setCompanionsInfo] = useState<UserInfo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedThesisId, setSelectedThesisId] = useState<number | null>(null);
  const [evaluationFile, setEvaluationFile] = useState<File | null>(null);
  const [evaluationData, setEvaluationData] = useState<Record<string, number> | null>(null);
  const [showJuradoModal, setShowJuradoModal] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedJuradoId, setSelectedJuradoId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  useEffect(() => {
    const fetchTheses = async () => {
      try {
        const response = await fetch(`${API_URL_DOC}/search/documents/${userInfo}`);
        if (!response.ok) {
          throw new Error('Error fetching theses');
        }
        const data = await response.json();
        setTheses(data);
      } catch (error) {
        console.error('Error fetching theses:', error);
      }
    };

    const fetchCompanionsInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/integrant/${userInfo}`);
        if (!response.ok) {
          throw new Error('Error fetching companions');
        }
        const data = await response.json();
        console.log('Companions Data:', data);  // Añade este log para depurar
        setCompanionsInfo(data);
      } catch (error) {
        console.error('Error fetching companions:', error);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${API_URL_ADMON}/all/teachers/list`);
        if (!response.ok) {
          throw new Error('Error fetching teachers');
        }
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTheses();
    fetchCompanionsInfo();
    fetchTeachers();
  }, [userInfo]);

  function formattedDate(fecha: Date): string {
    return moment(fecha).format("DD-MM-YYYY").toString();
  }

  function getCompanionName(companionId: number): string {
    console.log('Buscando compañero con ID:', companionId);  // Log adicional
    const companion = companionsInfo.find(companion => companion.id === companionId);
    if (companion) {
      console.log('Compañero encontrado:', companion);  // Log adicional
      return `${companion.nombre} ${companion.apellido}`;
    } else {
      console.log('Compañero no encontrado para ID:', companionId);  // Log adicional
      return 'Desconocido';
    }
  }
  

  const handleDownloadClick = async (thesisId: number) => {
    try {
      const response = await fetch(`${API_URL_DOC}/descargar/thesis/${thesisId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Error al descargar la tesis: ${data.error}`);
      }
      const decodedContent = atob(data.fileContentBase64);
      const byteCharacters = decodedContent.split('').map(char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteCharacters);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${data.fileName}`;
      link.click();
    } catch (error) {
      console.error('Error al descargar la tesis:', error);
    }
  };

  const handleEvaluationFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Convert array of arrays to object
        const evaluationData: Record<string, number> = {};
        for (let i = 1; i < jsonData.length; i++) {
          const [key, value] = jsonData[i];
          if (typeof key === 'string' && typeof value === 'number') {
            evaluationData[key] = value;
          }
        }

        console.log('Evaluation Data:', evaluationData);
        setEvaluationData(evaluationData);
        setEvaluationFile(file); // Set the file if needed later
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleUploadEvaluation = async () => {
    if (!selectedThesisId || !evaluationFile || !evaluationData) return;

    try {
      const requestData = {
        thesisId: selectedThesisId,
        evaluationFile: evaluationFile,
        evaluationData: evaluationData
      };

      const response = await fetch(`${API_URL_DOC}/upload/evaluation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Indicar que se está enviando un objeto JSON
        },
        body: JSON.stringify(requestData) // Convertir el objeto a una cadena JSON
      });

      if (!response.ok) {
        throw new Error('Error uploading evaluation file');
      }

      // Close the modal and reset state
      setShowModal(false);
      setSelectedThesisId(null);
      setEvaluationFile(null);
      setEvaluationData(null);

      // Refresh thesis list
      const updatedTheses = theses.map(thesis => {
        if (thesis.document_id === selectedThesisId) {
          return {
            ...thesis,
            evaluationUploaded: true,
          };
        }
        return thesis;
      });
      setTheses(updatedTheses);
    } catch (error) {
      console.error('Error uploading evaluation file:', error);
    }
  };

  const handleGuardar = async (thesisId: number | null, juradoId: number | null) => {
    if (!juradoId || !thesisId) return;
    console.log(juradoId, thesisId)
    try {
      const response = await fetch(`${API_URL_DOC}/asignar-evaluador`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          juradoId: juradoId,
          thesisId: thesisId
        })
      });

      if (!response.ok) {
        throw new Error('Error al asignar evaluador');
      }

      setShowJuradoModal(false);
      setShowModal(false)
    } catch (error) {
      console.error('Error al asignar evaluador:', error);
    }
  };

  function getProgressBarColor(calificacion: number) {
    if (calificacion >= 1 && calificacion < 3.5) {
      return 'danger'; // Rojo
    } else if (calificacion >= 3.5 && calificacion < 4) {
      return 'warning'; // Naranja
    } else if (calificacion >= 4 && calificacion <= 5) {
      return 'success'; // Verde
    } else {
      // Manejar casos fuera del rango (opcional)
      return 'light'; // Color de barra de progreso por defecto
    }
  }

  // Filtrar tesis según el término de búsqueda
  const filteredTheses = theses.filter(thesis =>
    thesis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCompanionName(Number(thesis.user_id_tutor)).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCompanionName(Number(thesis.user_id_jurado)).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div>
        <h3>Estas son sus entregas:</h3>
        <InputGroup className="mb-3" style={{ maxWidth: '60%', margin: '0 auto' }}>
          <InputGroup.Text id="search-addon">Buscar</InputGroup.Text>
          <FormControl
            placeholder="Buscar por título, tutor o jurado"
            aria-label="Buscar"
            aria-describedby="search-addon"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        {Array.isArray(filteredTheses) && filteredTheses.length > 0 ? (
          filteredTheses.map((thesis: Thesis) => (
            <Card key={thesis.user_id_public} className="mb-2" style={{ width: '60%', margin: '0 auto' }}>
              <Card.Body>
                <Card.Title><strong>Titulada:</strong> {thesis.title}, <strong>fue publicada el:</strong> {formattedDate(thesis.fecha_creacion)}</Card.Title>
                <Row>
                  <Col md={3}>
                    <div>
                      Titulo: {thesis.title}<br />
                      {companionsInfo.length > 0 && (
                        <>
                          Integrante A: {getCompanionName(Number(thesis.user_id_a))}<br />
                          Integrante B: {getCompanionName(Number(thesis.user_id_b))}<br />
                        </>
                      )}
                    </div>
                  </Col>
                  <Col md={3}>
                    <div>
                      Tutor: {thesis.user_id_tutor ? getCompanionName(Number(thesis.user_id_tutor)) : 'No asignado'}<br />
                      Jurado: {thesis.user_id_jurado ? getCompanionName(Number(thesis.user_id_jurado)) : 'No asignado'}<br />
                      Comentario: {thesis.comentario || 'Sin comentario'}<br />
                      Calificación: {thesis.calificacion ? thesis.calificacion : 'Sin calificación'}
                    </div>
                  </Col>

                  <Col md={4}>
                    <ProgressBar now={thesis.calificacion * 20} label={`${thesis.calificacion}`} variant={getProgressBarColor(thesis.calificacion)} />
                  </Col>
                </Row>
              </Card.Body>
              <Card.Link style={{ display: 'inline' }}>
                <Button style={{ marginLeft: '25px', marginRight: '20px' }} variant="link" onClick={() => handleDownloadClick(thesis.document_id)}>Descargar Documento</Button>
                {(rol === 1 || rol === 2) && (
                  <>
                    <Button style={{ marginLeft: '25px', marginRight: '20px' }} variant="link" onClick={() => {
                      setShowModal(true);
                      setSelectedThesisId(thesis.document_id); // Guardar el ID de la tesis seleccionada al abrir el modal
                    }}>Subir Evaluación</Button>
                  </>
                )}
                {rol === 1 && (
                  <>
                    <Button style={{ marginLeft: '25px', marginRight: '20px' }} variant="secondary" onClick={() => {
                      setShowJuradoModal(true);
                      setSelectedThesisId(thesis.document_id); // Guardar el ID de la tesis seleccionada al abrir el modal de asignar evaluador
                      setSelectedJuradoId(thesis.user_id_jurado);
                    }}>
                      Asignar Evaluador
                    </Button>
                  </>
                )}
                <Chats id={thesis.document_id} />
                {rol === 1 && (
                  <>
                    <Button style={{ marginLeft: '25px', marginRight: '20px' }} variant="warning">Modificar</Button>
                  </>
                )}
                {rol === 1 && (
                  <>
                    <Button style={{ marginLeft: '25px', marginRight: '20px' }} variant="secondary">Inhabilitar</Button>
                  </>
                )}
              </Card.Link>
              <br />
            </Card>
          ))
        ) : (
          <p>No hay tesis disponibles.</p>
        )}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Subir Evaluación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="evaluationFile">
            <Form.Label>Seleccione el archivo de evaluación</Form.Label>
            <Form.Control type="file" onChange={handleEvaluationFileChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUploadEvaluation}>
            Subir
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showJuradoModal} onHide={() => setShowJuradoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Asignar Evaluador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="teacherSelect">
            <Form.Label>Jurado Asignado</Form.Label>
            {selectedJuradoId !== null ? (
              <Form.Control as="text" disabled>
                <option>{getCompanionName(selectedJuradoId)}</option>
              </Form.Control>
            ) : (
              <Form.Control as="select" onChange={(e) => {
                const selectedId = parseInt(e.target.value);
                console.log('Selected Jurado ID:', selectedId); // Log adicional
                setSelectedJuradoId(selectedId);
              }}>
                <option value="">Seleccionar</option>
                {teachers.map((teacher, index) => (
                  <option key={index} value={teacher.id}>{teacher.nombre} {teacher.apellido}</option>
                ))}
              </Form.Control>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowJuradoModal(false)}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (selectedThesisId !== null && selectedJuradoId !== null) {
                console.log('Guardando Jurado ID:', selectedJuradoId, 'para Tesis ID:', selectedThesisId);
                handleGuardar(selectedJuradoId, selectedThesisId);
              } else {
                console.error('selectedThesisId o selectedJuradoId es nulo', selectedJuradoId, selectedThesisId);
              }
            }}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}

export default ThesisList;
