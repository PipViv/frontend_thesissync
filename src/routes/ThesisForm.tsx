import { Form, Row, Col, Button } from "react-bootstrap";
import { useState } from 'react';
import "../assets/css/thesisForm.css"
import { API_URL_DOC } from "../constants/constants";
import {HeaderProps} from "../app/layouts/Header"

export default function ThesisForm({ id }: HeaderProps) {
    const [titulo, setTitulo] = useState("");
    const [integranteA, setIntegranteA] = useState("");
    const [integranteB, setIntegranteB] = useState("");
    const [tutor, setTutor] = useState("");
    const [comentario, setComentario] = useState("");
    const [documento, setDocumento] = useState<File | null>(null); // Se define el tipo de documento como File | null
    const autorPublic = id
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { // Se agrega el tipo de evento
        const selectedFile = event.target.files && event.target.files[0]; // Se asegura de que exista event.target.files
        if (selectedFile) {
            console.log('Nombre del archivo seleccionado:', selectedFile.name);
            setDocumento(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // Se agrega el tipo de evento
        e.preventDefault();

        try {
            if (!documento) {
                throw new Error("No se ha seleccionado ningún archivo.");
            }
            const fileContent = await readFileAsBase64(documento);

            const response = await fetch(`${API_URL_DOC}/subir/thesis`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    titulo,
                    autorPublic,
                    integranteA,
                    integranteB,
                    tutor,
                    comentario,
                    documento: fileContent,
                    extension: documento.name.split('.').pop() // Obtiene la extensión del archivo
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
    };

    /*const readFileAsBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => { // Se define el tipo de promesa como string
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };*/

    const readFileAsBase64 = (file:File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            //reader.onload = () => resolve(reader.result.split(',')[1] as string);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Titulo</Form.Label>
                    <Form.Control
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                </Form.Group>
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Cedula del primer integrante</Form.Label>
                            <Form.Control className="inputsText"
                                type="text"
                                value={integranteA}
                                onChange={(e) => setIntegranteA(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Cedula del segundo integrante</Form.Label>
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
                        onChange={handleFileChange}
                        required />
                </Form.Group>
                <Button variant="outline-warning" type="submit" size="lg">
                    Enviar
                </Button>
            </Form>
        </>
    )
}


/*
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
    const [documento, setDocumento] = useState<File | null>(null); // Se define el tipo de documento como File | null

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { // Se agrega el tipo de evento
        const selectedFile = event.target.files && event.target.files[0]; // Se asegura de que exista event.target.files
        if (selectedFile) {
            console.log('Nombre del archivo seleccionado:', selectedFile.name);
            setDocumento(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // Se agrega el tipo de evento
        e.preventDefault();

        try {
            const fechaSend = new Date();
            if (!documento) {
                throw new Error("No se ha seleccionado ningún archivo.");
            }
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
    };

    const readFileAsBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => { // Se define el tipo de promesa como string
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    return (
        <>
        

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Titulo</Form.Label>
                    <Form.Control
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
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
                <Button variant="outline-warning" type="submit" size="lg">
                    Enviar
                </Button>
            </Form>


        </>
    )
}
*/