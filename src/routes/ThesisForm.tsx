

import { Form, Row, Col, Button } from "react-bootstrap";
import { useState } from 'react';
import "../assets/css/thesisForm.css"
import { API_URL_DOC } from "../constants/constants";

export default function ThesisForm() {

    const [titulo, setTitulo] = useState("");
    const [integranteA, setIntegranteA] = useState("");
    const [integranteB, setIntegranteB] = useState("");
    const [tutor, setTutor] = useState("");
    const [comentario, setComentario] = useState("");
    const [documento, setDocumento] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            console.log('Nombre del archivo seleccionado:', selectedFile.name);
            setDocumento(selectedFile)
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        
        try {
            const fechaSend = new Date();
            const fileContent = await readFileAsBase64(documento);

            const response = await fetch(`${API_URL_DOC}/subir/thesis`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    titulo,
                    fechaSend,
                    integranteA,
                    integranteB,
                    tutor,
                    comentario,
                    documento: fileContent,
                }),
            });

            if (response.ok) {
                alert('Tesis obtenidas con éxito');
            } else {
                alert('Hubo un error al obtener las tesis');
            }
            console.log(response);
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };
    /*
    const [integranteA, setIntegranteA] = useState("");
    const [integranteB, setIntegranteB] = useState("");
    const [tutor, setTutor] = useState("");
    const [comentario, setComentario] = useState("");
    const [documento, setDocumento] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            console.log('Nombre del archivo seleccionado:', selectedFile.name);
            setDocumento(selectedFile)
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();

        
        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const fileContent = event.target.result;
                const fechaSend = new Date();
                try {
                    const response = await fetch(`${API_URL_DOC}/subir/thesis`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            fechaSend,
                            integranteA,
                            integranteB,
                            tutor,
                            comentario,
                            documento: fileContent, // Envía el archivo como una cadena base64
                        }),
                    });
                    console.log(response);
                } catch (error) {
                    console.error("Error: ", error);
                }
            };
            reader.readAsDataURL(documento);
        } catch (error) {
            console.error("Error: ", error);
        }
    }
    */

    return (
        <>

            <Form className="form" onSubmit={handleSubmit}>
            <Form.Group>
                            <Form.Label>Titulo</Form.Label>
                            <Form.Control className="inputsText"
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)} />
                        </Form.Group>
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Id P integrante</Form.Label>
                            <Form.Control className="inputsText"
                                type="text"
                                value={integranteA}
                                onChange={(e) => setIntegranteA(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Id S integrante</Form.Label>
                            <Form.Control className="inputsText" type="text"
                                value={integranteB}
                                onChange={(e) => setIntegranteB(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tutor</Form.Label>
                            <Form.Control className="inputsText" type="text"
                                value={tutor}
                                onChange={(e) => setTutor(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3  inputsText inputTextArea" >
                            <Form.Label>Comentarios</Form.Label>
                            <Form.Control as="textarea" rows={10}
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="archivoInput" className="mb-3">
                    <Form.Label>Carga el documento</Form.Label>
                    <Form.Control className="inputsText" type="file" size="lg"
                        id="custom-file"
                        accept=".pdf, .doc, .docx"
                        onChange={handleFileChange} />
                </Form.Group>
                <div className="d-grid gap-2">
                    <Button variant="outline-warning" type="submit" size="lg">Enviar</Button>{' '}
                </div>
            </Form>

        </>
    )
}





/*import { Form, Row, Col, Button } from "react-bootstrap";
import { useState } from 'react';
import "../assets/css/thesisForm.css"
import { API_URL_DOC } from "../constants/constants";

export default function ThesisForm() {
    const [integranteA, setIntegranteA] = useState("");
    const [integranteB, setIntegranteB] = useState("");
    const [tutor, setTutor] = useState("");
    const [comentario, setComentario] = useState("");
    const [documento, setDocumento] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setDocumento(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('fechaSend', new Date().toISOString());
            formData.append('integranteA', integranteA);
            formData.append('integranteB', integranteB);
            formData.append('tutor', tutor);
            formData.append('comentario', comentario);
            formData.append('documento', documento);

            const response = await fetch(`${API_URL_DOC}/subir/thesis`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                console.log("Documento enviado con éxito");
                // Puedes realizar acciones adicionales después de enviar el documento
            } else {
                console.error("Error al enviar el documento");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form className="form" onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Id P integrante</Form.Label>
                            <Form.Control className="inputsText"
                                type="text"
                                value={integranteA}
                                onChange={(e) => setIntegranteA(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Id S integrante</Form.Label>
                            <Form.Control className="inputsText" type="text"
                                value={integranteB}
                                onChange={(e) => setIntegranteB(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tutor</Form.Label>
                            <Form.Control className="inputsText" type="text"
                                value={tutor}
                                onChange={(e) => setTutor(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3  inputsText inputTextArea">
                            <Form.Label>Comentarios</Form.Label>
                            <Form.Control as="textarea" rows={10}
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>




                <Form.Group controlId="archivoInput" className="mb-3">
                    <Form.Label>Carga el documento</Form.Label>
                    <Form.Control
                        className="inputsText"
                        type="file"
                        size="lg"
                        id="custom-file"
                        accept=".pdf, .doc, .docx"
                        onChange={handleFileChange}
                    />
                </Form.Group>
                <div className="d-grid gap-2">
                    <Button
                        variant="outline-warning"
                        type="submit"
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? 'Enviando...' : 'Enviar'}
                    </Button>
                </div>
            </Form>
        </>
    )
}
*/