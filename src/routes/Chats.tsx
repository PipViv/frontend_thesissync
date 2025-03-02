import { useEffect, useRef, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { API_URL_CHAT_DOC } from '../constants/constants';
import "../assets/css/chats.css"

interface Message {
    id: number;
    message: string;
    autor: number;
    doc: number;
    fecha_envio: string;
    autor_nombre:string;
}
// export default function Chats({ id }: { id: number }) {
    export default function Chats({ doc, user }: { doc: number; user: number }) {
console.log('credenciales', doc, user)
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${API_URL_CHAT_DOC}/show/messages/${doc}`);
                if (!response.ok) {
                    throw new Error('Error fetching messages');
                }
                const data = await response.json();
    
                // Ordenar mensajes por fecha_envio en orden ascendente
                const sortedMessages = Array.isArray(data) 
                    ? data.sort((a, b) => new Date(a.fecha_envio).getTime() - new Date(b.fecha_envio).getTime()) 
                    : [];
    
                setMessages(sortedMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
    
        fetchMessages();
    }, [user, doc]);
    //     const fetchMessages = async () => {
    //         try {
    //             const response = await fetch(`${API_URL_CHAT_DOC}/show/messages/${doc}`);
    //             if (!response.ok) {
    //                 throw new Error('Error fetching messages');
    //             }
    //             const data = await response.json();
    //             setMessages(Array.isArray(data) ? data : []); // Asegura que data sea un array
    //         } catch (error) {
    //             console.error('Error fetching messages:', error);
    //         }
    //     };

    //     fetchMessages();
    // }, [user]);

    // const handleSendMessage = async () => {
    //     if (newMessage.trim() !== '') {
    //         const newMessageObj: Message = {
    //             id: messages.length + 1,
    //             message: newMessage,
    //             autor: 1,
    //             fecha_envio: new Date().toLocaleString(),
    //         };
    //         setMessages([...messages, newMessageObj]);
    //         setNewMessage('');
            
    //     }
    // };

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '') {
            const newMessageObj: Message = {
                id: messages.length + 1,
                message: newMessage,
                autor: user,
                doc: doc,
                fecha_envio: new Date().toLocaleString(),
                autor_nombre: ""
            };
    
            try {
                const response = await fetch(`${API_URL_CHAT_DOC}/send/message`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: newMessage,
                        autor: user, // Asegúrate de cambiar esto si el autor varía
                        doc :doc,
                        fecha_envio: new Date().toISOString(),
                    }),
                });
    
                if (!response.ok) {
                    throw new Error('Error enviando el mensaje');
                }
    
                // Opcionalmente, recibir respuesta del backend y actualizar estado
                const data = await response.json();
                console.log('Mensaje enviado con éxito:', data);
    
                setMessages([...messages, newMessageObj]);
                setNewMessage('');
            } catch (error) {
                console.error('Error al enviar mensaje:', error);
            }
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
                            <div className="chat-messages" ref={messagesEndRef}>
                                {messages.map((message) => (
                                    <div key={message.id} className={`message-container ${message.autor !== 1 ? 'message-left' : 'message-right'}`}>
                                        <div className="message-content">
                                            <div className="message-author">
                                                <strong><u>{message.autor_nombre}</u></strong>
                                            </div>
                                            <div className="message-text">{message.message}</div>
                                            <div className="message-date">{message.fecha_envio}</div>
                                        </div>
                                    </div>
                                ))}
                                {messages.length === 0 && <div>No hay mensajes disponibles</div>}
                            </div>
                            {/* <div className="chat-messages">
                                {messages.map((message) => (
                                    <div key={message.id} className={`message-container ${message.autor !== 1 ? 'message-left' : 'message-right'}`}>
                                        <div className="message-content">
                                            <div className="message-text">{message.message}</div>
                                            <div className="message-date">{message.fecha_envio}</div>
                                        </div>
                                    </div>
                                ))}
                                {messages.length === 0 && <div>No hay mensajes disponibles</div>}
                            </div> */}
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