import { Link } from 'react-router-dom';
import { Navbar, Image, Button } from 'react-bootstrap';
import '../../assets/css/header.css'
import { useState } from 'react';
import LateralMenu from '../layouts/LateralMenu'

export default function Header() {

    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    return (
        <>

            <div className='headerNav'>
                <Navbar expand="lg">
                    <Link to="/" className="nav-link">
                        <Image className='imgUHome' src="./src/assets/img/Logo-UNICATOLICA-blanco-horizontal.png" />
                    </Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">

                    </Navbar.Collapse>
                    <div className="dashboard-container">
                        {isMenuOpen && (
                            <div className="overlay" onClick={toggleMenu}></div>
                        )}
                        <Button className="menu-toggle-button" variant="light" onClick={toggleMenu}>
                            ☰
                        </Button>
                        <LateralMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
                    </div>
                </Navbar>
            </div>


        </>
    )
}