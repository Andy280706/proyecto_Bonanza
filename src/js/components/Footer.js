export default {
    template: `
        <footer class="footer">
            <div class="container footer__content">
                <div>
                    <h3>
                        Mi E-commerce
                    </h3>
                    <p>
                        Tu tienda virtual.
                    </p>
                </div>
                <div>
                    <h4>
                        Información
                    </h4>
                    <a href="#">
                        Nosotros
                    </a>
                    <a href="#">
                        Contacto
                    </a>
                    <a href="#">
                        Términos y condiciones
                    </a>
                </div>
                <div>
                    <h4>
                        Atención
                    </h4>
                    <p>
                        Lunes a sábado
                    </p>
                    <p>
                        9:00 AM - 6:00 PM
                    </p>
                </div>
            </div>
            <div class="footer__bottom">
                <p>
                    © {{ new Date().getFullYear() }}
                    Mi E-commerce.
                    Todos los derechos reservados.
                </p>
            </div>
        </footer>
    `
};