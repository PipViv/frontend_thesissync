import { useState, useEffect } from "react";
import { Card, Button, Accordion } from 'react-bootstrap';
import { API_URL_DOC } from '../../constants/constants';

export default function TeacherPanel({ id_user }) {
  const [theses, setTheses] = useState([]);

  useEffect(() => {
    const fetchTheses = async () => {
      try {
        const response = await fetch(`${API_URL_DOC}/doc/obtener/theses/id=${id_user}`);
        const data = await response.json();

        console.log('Data from API:', data); // Agregado para verificar datos de la API

        setTheses(data);
      } catch (error) {
        console.error('Error fetching theses:', error);
      }
    };

    fetchTheses();
  }, [id_user]);

  const handleDownloadClick = async (thesis) => {
    try {
      const response = await fetch(`${API_URL_DOC}/descargar/thesis/${thesis.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Error al descargar la tesis: ${data.error}`);
      }

      // Resto del código para descargar la tesis...
    } catch (error) {
      console.error('Error al descargar la tesis:', error);
      // Manejar el error adecuadamente, por ejemplo, mostrando un mensaje al usuario
    }
  };

  return (
    <>
    <Accordion>
    {theses.map((thesis) => (
      <Accordion.Item key={thesis.id} eventKey={thesis.id.toString()}>
        <Accordion.Header>{thesis.title}</Accordion.Header>
        <Accordion.Body>
          <p>
            Integrante A: {thesis.user_id_a}<br />
            Integrante B: {thesis.user_id_b}<br />
            Tutor: {thesis.user_id_tutor}<br />
            Jurado: {thesis.user_id_jury}<br />
            Comentario: {thesis.comentario}
          </p>
          <Button variant="primary" onClick={() => handleDownloadClick(thesis)}>
            Descargar Tesis
          </Button>
        </Accordion.Body>
      </Accordion.Item>
    ))}
  </Accordion>
  </>
  );
}
