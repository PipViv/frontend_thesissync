import '../../assets/css/footer.css'
export default function Footer() {
    return (
        <>
            <footer className="footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} SEMILLERO SERENDIPIA Fundacion Católica Lumen Genitum - Todos los derechos reservados</p>
                </div>
            </footer>
        </>);
}