//import { Dropdown } from 'react-bootstrap';
import { Container, Navbar } from 'react-bootstrap';
import '../../assets/css/lateralMenus.css'



export default function LateralMenu({ isOpen, toggleMenu }) {

    return (
        <>
            <div className={`side-menu ${isOpen ? 'open' : ''}`}>
                <Navbar className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand href="#home"><i className="bi bi-person">Perfil</i></Navbar.Brand>
                    </Container>
                </Navbar>
                <Navbar className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand href="/"><i className="bi bi-box-arrow-right">Salir de la sesion</i></Navbar.Brand>
                    </Container>
                </Navbar>
                <Navbar className="bg-body-tertiary">
                    <Container>
                        <Navbar.Brand href="/documentos/evaluar"><i className="bi bi-card-checklist">Admin Panel</i></Navbar.Brand>
                    </Container>
                </Navbar>
                <button className="close-button" onClick={toggleMenu}>
                    &times;
                </button>
            </div>
        </>
    )
}