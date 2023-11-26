import '../../assets/css/footer.css'
export default function Footer() {
    return (
        <>
            <footer className="footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Tu Empresa - Todos los derechos reservados</p>
                </div>
            </footer>
        </>);
}