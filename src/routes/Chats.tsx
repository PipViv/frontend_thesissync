import { useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { API_URL_CHAT_DOC } from '../constants/constants';
import "../assets/css/chats.css"

interface Message {
    id: number;
    message: string;
    autor: number;
    fecha_envio: string;
}

export default function Chats({ id }: { id: number }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${API_URL_CHAT_DOC}/show/messages/${id}`);
                if (!response.ok) {
                    throw new Error('Error fetching messages');
                }
                const data = await response.json();
                setMessages(Array.isArray(data) ? data : []); // Asegura que data sea un array
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [id]);

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '') {
            const newMessageObj: Message = {
                id: messages.length + 1,
                message: newMessage,
                autor: 1,
                fecha_envio: new Date().toLocaleString(),
            };
            setMessages([...messages, newMessageObj]);
            setNewMessage('');
            
        }
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button style={{ marginLeft: '25px', marginRight: '20px' }} variant="primary" onClick={handleShow}>
                Retroalimentación
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Chat de Retroalimentación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <div className="chat-container">
                            <div className="chat-messages">
                                {messages.map((message) => (
                                    <div key={message.id} className={`message-container ${message.autor !== 1 ? 'message-left' : 'message-right'}`}>
                                        <div className="message-content">
                                            <div className="message-text">{message.message}</div>
                                            <div className="message-date">{message.fecha_envio}</div>
                                        </div>
                                    </div>
                                ))}
                                {messages.length === 0 && <div>No hay mensajes disponibles</div>}
                            </div>
                            <div className="chat-input">
                                <Form.Control
                                    type="text"
                                    placeholder="Escribe un mensaje..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <Button variant="primary" onClick={handleSendMessage}>Enviar</Button>
                            </div>
                        </div>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}




/*import { useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { API_URL_CHAT_DOC } from '../constants/constants';

interface Message {
    id: number;
    text: string;
    sender: string;
}

export default function Chats({ id }: { id: number }) {

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${API_URL_CHAT_DOC}/show/messages/${id}`);
                if (!response.ok) {
                    throw new Error('Error fetching messages');
                }
                const data = await response.json();
                setMessages(data || []); // Si no hay mensajes, establecer el estado como un array vacío
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [id]);

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '') {
            const newMessageObj: Message = {
                id: messages.length + 1, // Opcional: puedes usar messages.length + 1
                text: newMessage,
                sender: 'Me',
            };
            setMessages([...messages, newMessageObj]);
            setNewMessage('');

            // Aquí podrías agregar la lógica para enviar el mensaje al servidor si es necesario
        }
    };

    //MODAL
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
    };


    return (<>

        <Button variant="primary" onClick={() => handleShow()} >Retroalimentación</Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Container>
                    <div className="chat-container">
                        <div className="chat-messages">
                            {messages.map((message) => (
                                <div key={message.id} className={message.sender === 'Me' ? 'message-right' : 'message-left'}>
                                    <div className="message-text">{message.text}</div>
                                    <div className="message-sender">{message.sender}</div>
                                </div>
                            ))}
                            {messages.length === 0 && <div>No hay mensajes disponibles</div>}
                        </div>
                        <div className="chat-input">
                            <Form.Control
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <Button variant="primary" onClick={handleSendMessage}>Send</Button>
                        </div>
                    </div>
                </Container>



            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>


    </>
    );
}
*/