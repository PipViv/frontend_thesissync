import  { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { API_URL_DOC } from '../constants/constants';
import '../assets/css/dashboard.css';

function ThesisList({ id_user }) {
  const [theses, setTheses] = useState([]);

  useEffect(() => {
    const fetchTheses = async () => {
      try {
        const response = await fetch(`${API_URL_DOC}/est/obtener/theses/id=${id_user}`);
        const data = await response.json();

        const updatedTheses = data.map((thesis) => {
          return {
            ...thesis,
            colorClass: calculateColorClass(thesis.calificacion),
          };
        });

        setTheses(updatedTheses);
      } catch (error) {
        console.error('Error fetching theses:', error);
      }
    };

    fetchTheses();
  }, [id_user]);

  const calculateColorClass = (rating) => {
    if (rating === null) {
      return 'wheel gray';
    } else if (rating >= 1 && rating <= 2.9) {
      return 'wheel red';
    } else if (rating >= 3 && rating <= 3.7) {
      return 'wheel orange';
    } else if (rating > 3.8) {
      return 'wheel green';
    }
  };

  const handleDownloadClick = async (thesis:number) => {
    try {
      const response = await fetch(`${API_URL_DOC}/descargar/thesis/${thesis.id}`);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(`Error al descargar la tesis: ${data.error}`);
      }
  
      // Decodifica la cadena Base64
      const decodedContent = atob(data.fileContentBase64);
  
      // Convierte el contenido decodificado a un array de bytes
      const byteCharacters = decodedContent.split('').map(char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteCharacters);
  
      // Crea un Blob con el array de bytes
      const blob = new Blob([byteArray], { type: 'application/pdf' });
  
      // Crea un enlace de descarga
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      
      // Utiliza el nombre del archivo proporcionado por el servidor
      link.download = `${data.fileName}`;
      
      link.click();
    } catch (error) {
      console.error('Error al descargar la tesis:', error);
    }
  };
  return (
    <>
      <div>
        <h3>Estimado {id_user}, estas son sus entregas:</h3>
        {theses.map((thesis) => (
          <Card key={thesis.id} className="mb-3">
            <Card.Body>
              <Card.Title>{thesis.titulo}</Card.Title>
              <Card.Body>
                Titulo: {thesis.title} <br />
                Integrante A: {thesis.codigo_a} {thesis.nombre_a} {thesis.apellido_a}<br />
                Integrante B: {thesis.codigo_b} {thesis.nombre_b} {thesis.apellido_b}<br />
                Tutor: {thesis.user_id_tutor}<br />
                Jurado: {thesis.user_id_jury}<br />
                Comentario: {thesis.comentario} <br />
                Calificación: {thesis.calificacion}
              </Card.Body>
              <div className={`color-indicator ${thesis.colorClass}`}></div><br/>
              <Card.Link href='#' onClick={() => handleDownloadClick(thesis)}>
                Descargar Tesis
              </Card.Link>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
}

export default ThesisList;