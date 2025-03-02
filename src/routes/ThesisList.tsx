import React, { useEffect, useState } from 'react';
import { Card, Button, Col, Row, Modal, Form, ProgressBar, InputGroup, FormControl } from 'react-bootstrap';
import { API_URL, API_URL_ADMON, API_URL_DOC } from '../constants/constants';
import '../assets/css/dashboard.css';
import { ProfileInfo, Thesis, UserInfo } from '../types/types';
import moment from 'moment';
import Chats from './Chats';
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";

interface EvaluationAspect {
  aspect: string;
  weight: number;
  score: number;
  weightedScore: number;
  observations: string;
}

interface EvaluationData {
  title: string;
  evaluator: string;
  email: string;
  evaluation: EvaluationAspect[];
  finalScore: number;
}

function ThesisList({ profileInfo }: { profileInfo: ProfileInfo }) {

  const { userInfo, rol } = profileInfo;
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [companionsInfo, setCompanionsInfo] = useState<UserInfo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedThesisId, setSelectedThesisId] = useState<number | null>(null);
  // const [evaluationFile, setEvaluationFile] = useState<File | null>(null);
  // const [evaluationData, setEvaluationData] = useState<Record<string, number> | null>(null);
  const [showJuradoModal, setShowJuradoModal] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedJuradoId, setSelectedJuradoId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(null);
  const [evaluationFile, setEvaluationFile] = useState<File | null>(null);
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
  

  // const handleDownloadClick = async (thesisId: number) => {
  //   try {
  //     const response = await fetch(`${API_URL_DOC}/descargar/thesis/${thesisId}`);
  //     const data = await response.json();
  //     if (!response.ok) {
  //       throw new Error(`Error al descargar la tesis: ${data.error}`);
  //     }
  //     const decodedContent = atob(data.fileContentBase64);
  //     const byteCharacters = decodedContent.split('').map(char => char.charCodeAt(0));
  //     const byteArray = new Uint8Array(byteCharacters);
  //     const blob = new Blob([byteArray], { type: 'application/pdf' });
  //     const link = document.createElement('a');
  //     link.href = URL.createObjectURL(blob);
  //     link.download = `${data.fileName}`;
  //     link.click();
  //   } catch (error) {
  //     console.error('Error al descargar la tesis:', error);
  //   }
  // };

  const generateExcel = (data: any) => {
    const { evaluator_name, evaluator_email, final_score, fecha_evaluacion, detalles } = data;
  
    // Crear la primera hoja con la información general de la evaluación
    const generalData = [
      ["Evaluador", evaluator_name],
      ["Correo Evaluador", evaluator_email],
      ["Fecha Evaluación", fecha_evaluacion],
      ["Puntaje Final", final_score],
    ];
    const generalSheet = XLSX.utils.aoa_to_sheet(generalData);
  
    // Crear la segunda hoja con los detalles de la evaluación
    const detailSheetData = [
      ["Aspecto", "Peso", "Calificación", "Puntaje Ponderado", "Observaciones"], // Encabezados
      ...detalles.map((detalle: any) => [
        detalle.aspect,
        detalle.weight,
        detalle.score,
        detalle.weighted_score,
        detalle.observations,
      ]),
    ];
    const detailSheet = XLSX.utils.aoa_to_sheet(detailSheetData);
  
    // Crear el libro de Excel con ambas hojas
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, generalSheet, "Resumen");
    XLSX.utils.book_append_sheet(wb, detailSheet, "Detalles");
  
    // Generar el archivo Excel y descargarlo
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `Evaluacion_${data.thesis_id}.xlsx`);
  };

  const handleDownloadExcel = async (documentId: number) => {
    try {
      const response = await fetch(`${API_URL_DOC}/ver/calificacion/${documentId}`);
      if (!response.ok) throw new Error("Error al descargar la información");
      
      const data = await response.json();
      generateExcel(data);
      
    } catch (error) {
      console.error("Error al generar el Excel:", error);
    }
  };
  

  const handleDownloadClick = async (thesisId: number) => {
    try {
      const response = await fetch(`${API_URL_DOC}/descargar/thesis/${thesisId}`);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(`Error al descargar la tesis: ${data.error}`);
      }
  
      if (!data.fileContentBase64) {
        throw new Error("El contenido del archivo está vacío.");
      }
  
      // Extraer solo la parte Base64 (después de "base64,")
      const base64Data = data.fileContentBase64.split(",")[1];
  
      if (!base64Data) {
        throw new Error("Formato Base64 inválido.");
      }
  
      // Decodificar Base64
      const decodedContent = atob(base64Data);
      const byteCharacters = new Uint8Array([...decodedContent].map(char => char.charCodeAt(0)));
  
      // Determinar el tipo MIME real
      const mimeType = data.fileContentBase64.split(";")[0].split(":")[1] || "application/octet-stream";
  
      const blob = new Blob([byteCharacters], { type: mimeType });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = data.fileName || "documento";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al descargar la tesis:", error);
    }
  };
  
  // const handleEvaluationFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     const file = e.target.files[0];
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const data = new Uint8Array(event.target.result as ArrayBuffer);
  //       const workbook = XLSX.read(data, { type: 'array' });
  //       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  //       // Convert array of arrays to object
  //       const evaluationData: Record<string, number> = {};
  //       for (let i = 1; i < jsonData.length; i++) {
  //         const [key, value] = jsonData[i];
  //         if (typeof key === 'string' && typeof value === 'number') {
  //           evaluationData[key] = value;
  //         }
  //       }

  //       console.log('Evaluation Data:', evaluationData);
  //       setEvaluationData(evaluationData);
  //       setEvaluationFile(file); // Set the file if needed later
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
  // };
  // const handleEvaluationFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

  //   if (!e.target.files || e.target.files.length === 0) return;
    
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  
  //   reader.onload = (event) => {
  //     const data = new Uint8Array(event.target?.result as ArrayBuffer);
  //     const workbook = XLSX.read(data, { type: 'array' });
  //     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //     const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  //     console.log("Raw Excel Data:", jsonData); // 👀 Ver la estructura del archivo
  
  //     // Extraer título, evaluador y email
  //     const evaluationInfo = {
  //       title: jsonData[4]?.[1] || "", // Título del proyecto
  //       evaluator: jsonData[8]?.[1] || "", // Nombre del evaluador
  //       email: jsonData[9]?.[1] || "" // Email del evaluador
  //     };
  
  //     // Extraer la tabla de evaluación (saltamos las primeras 11 filas)
  //     const evaluationData = jsonData.slice(11, 20).map((row) => ({
  //       aspect: row[0] || "",
  //       weight: parseFloat(row[1]) / 100 || 0, // Convertimos 5% a 0.05
  //       score: parseFloat(row[2]) || 0,
  //       weightedScore: parseFloat(row[3]) || 0,
  //       observations: row[4] || "",
  //     }));
  
  //     // Extraer la calificación final
  //     const finalScore = parseFloat(jsonData[20]?.[1]) || 0;
  
  //     // Construir el JSON final
  //     const formattedEvaluation = {
  //       ...evaluationInfo,
  //       evaluation: evaluationData,
  //       finalScore
  //     };
  
  //     console.log('Evaluation Data:', formattedEvaluation);
  //     setEvaluationData(formattedEvaluation);
  //     setEvaluationFile(file);
  //   };
  
  //   reader.readAsArrayBuffer(file);
  // };


  // const handleEvaluationFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     const file = e.target.files[0];
  //     const reader = new FileReader();
  //     console.log("reader",reader)
  //     reader.onload = (event) => {
  //       const data = new Uint8Array(event.target.result as ArrayBuffer);
  //       const workbook = XLSX.read(data, { type: 'array' });
  //       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  //       console.log("Datos en bruto desde Excel:", jsonData); // 🔥 Imprime la estructura de Excel

  //       // Extraer la información correctamente
  //       const getMergedCells = (row: number, columns: number[]) => 
  //         columns.map(col => jsonData[row]?.[col] || "").join(" ").trim();
  
  //       const title = getMergedCells(3, [1]); // Fila 6
  //       console.log('title',title)
  //       const authors = getMergedCells(7, [2, 3, 5, 6, 7, 8]); // Fila 8
  //       const evaluator = getMergedCells(8, [2, 3, 5, 6, 7, 8]); // Fila 9
  //       const email = getMergedCells(9, [2, 3, 5, 6, 7, 8]); // Fila 10
  
  //       // Extraer la evaluación (desde la fila 12 hasta la 21)
  //       const evaluation: {
  //         aspect: string;
  //         weight: number;
  //         score: number;
  //         weightedScore: number;
  //         observations: string;
  //       }[] = [];
  
  //       for (let i = 11; i <= 20; i++) {
  //         const row = jsonData[i];
  //         if (!row || row.length < 5) continue;
  
  //         evaluation.push({
  //           aspect: row[1] || "",
  //           weight: parseFloat(row[2]) || 0,
  //           score: parseFloat(row[3]) || 0,
  //           weightedScore: parseFloat(row[4]) || 0,
  //           observations: row[5] || "",
  //         });
  //       }
  
  //       // Extraer la nota final
  //       const finalScore = parseFloat(jsonData[21]?.[4]) || 0;
  
  //       // Crear el objeto de evaluación
  //       const evaluationData = {
  //         title,
  //         authors,
  //         evaluator,
  //         email,
  //         evaluation,
  //         finalScore,
  //       };
  
  //       console.log("Evaluation Data:", evaluationData);
  //       setEvaluationData(evaluationData);
  //       setEvaluationFile(file);
  //     };
  
  //     reader.readAsArrayBuffer(file);
  //   }
  // };
  const handleEvaluationFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log("Archivo cargado:", file); // 🔥 Imprime el archivo en la consola
  
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
        console.log("Datos en bruto desde Excel:", jsonData); // 🔥 Imprime la estructura de Excel
  
        // Extraer la información correctamente
        const title = jsonData[3]?.[1] || "";
        const authors = jsonData[5]?.[1] || "";
        const evaluator = jsonData[6]?.[1] || "";
        const email = jsonData[7]?.[1] || "";
  
        // Extraer la evaluación desde la fila 9 hasta la fila 17
        const evaluation: {
          aspect: string;
          weight: number;
          score: number;
          weightedScore: number;
          observations: string;
        }[] = [];
  
        for (let i = 9; i <= 17; i++) {
          const row = jsonData[i];
          if (!row || row.length < 5) continue;
  
          evaluation.push({
            aspect: row[0] || "",
            weight: parseFloat(row[1]) || 0,
            score: parseFloat(row[2]) || 0,
            weightedScore: parseFloat(row[3]) || 0,
            observations: row[4] || "",
          });
        }
  
        // Extraer la nota final
        const finalScore = parseFloat(jsonData[18]?.[3]) || 0;
  
        // Crear el objeto de evaluación
        const evaluationData = {
          title,
          authors,
          evaluator,
          email,
          evaluation,
          finalScore,
        };
  
        console.log("Evaluation Data:", evaluationData); // 🔥 Imprime los datos extraídos correctamente
  
        setEvaluationData(evaluationData);
        setEvaluationFile(file);
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

  // function getProgressBarColor(calificacion: number) {
  //   if (calificacion >= 1 && calificacion < 3.5) {
  //     return 'danger'; // Rojo
  //   } else if (calificacion >= 3.5 && calificacion < 4) {
  //     return 'warning'; // Naranja
  //   } else if (calificacion >= 4 && calificacion <= 5) {
  //     return 'success'; // Verde
  //   } else {
  //     // Manejar casos fuera del rango (opcional)
  //     return 'light'; // Color de barra de progreso por defecto
  //   }
  // }
function getProgressBarColor(calificacion: number) {
  if (calificacion >= 1 && calificacion < 3.5) {
    return "danger"; // Rojo
  } else if (calificacion >= 3.5 && calificacion < 4) {
    return "warning"; // Naranja
  } else if (calificacion >= 4 && calificacion <= 5) {
    return "success"; // Verde
  } else {
    return "secondary"; // Color gris si el valor es inválido
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
                      {/* {companionsInfo.length > 0 && ( */}
                        <div>
                          Autor: {thesis.public_nombre}<br />
                          Integrante A: {thesis.a_nombre || ""}<br />
                          Integrante B: {thesis.b_nombre || ""}<br />
                        </div>
                      {/* )} */}
                    </div>
                  </Col>
                  <Col md={3}>
                    <div>
                      Tutor: {thesis.tutor_nombre || ""}<br />
                      Jurado: {thesis.jurado_nombre || ""}<br />
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
                {/* {(rol === 1 || rol === 2) && (
                  <>
                    <Button style={{ marginLeft: '25px', marginRight: '20px' }} variant="link" onClick={() => {
                      setShowModal(true);
                      setSelectedThesisId(thesis.document_id); // Guardar el ID de la tesis seleccionada al abrir el modal
                    }}>Subir Evaluación</Button>
                  </>
                )} */}
                {(rol === 1 || rol === 2) && (
  <>
    {thesis.calificacion > 0 ? (
      <Button 
        style={{ marginLeft: '25px', marginRight: '20px' }} 
        variant="success" 
        onClick={() => handleDownloadExcel(thesis.document_id)}
      >
        Descargar Evaluación
      </Button>
    ) : (
      <Button 
        style={{ marginLeft: '25px', marginRight: '20px' }} 
        variant="link" 
        onClick={() => {
          setShowModal(true);
          setSelectedThesisId(thesis.document_id);
        }}
      >
        Subir Evaluación
      </Button>
    )}
  </>
)}

{rol === 3 && thesis.calificacion > 0 && (
  <Button 
    style={{ marginLeft: '25px', marginRight: '20px' }} 
    variant="success" 
    onClick={() => handleDownloadExcel(thesis.document_id)}
  >
    Descargar Evaluación
  </Button>
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
                <Chats doc={thesis.document_id} user={userInfo} />
                {/*{rol === 1 && (
                  <>
                    <Button style={{ marginLeft: '25px', marginRight: '20px' }} variant="warning">Modificar</Button>
                  </>
                )}*/}
                {rol === 1 && (
                  <>
                    <Button style={{ marginLeft: '25px', marginRight: '20px' }} variant="danger">Inhabilitar</Button>
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
            <Form.Control type="file" accept=".xlsx, .xls" onChange={handleEvaluationFileChange} />
            {/* <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleEvaluationFileChange} />
      {evaluationData && (
        <div>
          <h3>{evaluationData.title}</h3>
          <p>Evaluador: {evaluationData.evaluator}</p>
          <p>Correo: {evaluationData.email}</p>
          <p>Nota final: {evaluationData.finalScore}</p>
          <ul>
            {evaluationData.evaluation.map((item, index) => (
              <li key={index}>
                <strong>{item.aspect}:</strong> {item.score} ({item.weightedScore})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div> */}
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
