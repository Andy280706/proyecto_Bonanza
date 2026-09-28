import { obtenerProductos } from "../services/productService.js";
import { crearContacto } from "../services/contactService.js";
import { ProductGrid } from "../components/ProductGrid.js";

export async function HomeView() {
    const productos = await obtenerProductos();
    // Mostramos solo los primeros 4 productos como destacados
    const destacados = productos.slice(0, 4);

    const html = `
        <!-- Banner Principal -->
        <header class="bg-white py-5 text-center border-bottom shadow-sm">
            <div class="container">
                <h1 class="display-5 fw-bold text-success">🥛 Lácteos Bonanza</h1>
                <p class="lead text-muted">Productos 100% frescos del campo a tu mesa.</p>
                <a href="./src/pages/productos.html" class="btn btn-success fw-bold px-4 py-2">Ver Catálogo Completo 🧀</a>
            </div>
        </header>

        <main class="container my-5">
            <!-- Productos Destacados -->
            <section class="mb-5">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="fw-bold text-success mb-0">Productos Destacados</h3>
                    <a href="./src/pages/productos.html" class="text-success text-decoration-none fw-bold">Ver todos →</a>
                </div>
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
                    ${ProductGrid(destacados, "./src/")}
                </div>
            </section>

            <!-- Sección de Contacto Integrada -->
            <section class="pt-4 border-top">
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <div class="card shadow border-0 p-4">
                            <h4 class="text-center text-success fw-bold mb-3">📩 Déjanos tu Consulta o Pedido</h4>
                            <form id="formContacto">
                                <div class="mb-3">
                                    <label for="contactoNombre" class="form-label fw-bold">Nombre</label>
                                    <input type="text" id="contactoNombre" class="form-control" placeholder="Tu nombre completo" required>
                                </div>
                                <div class="mb-3">
                                    <label for="contactoCorreo" class="form-label fw-bold">Correo Electrónico</label>
                                    <input type="email" id="contactoCorreo" class="form-control" placeholder="nombre@correo.com" required>
                                </div>
                                <div class="mb-3">
                                    <label for="contactoMensaje" class="form-label fw-bold">Mensaje</label>
                                    <textarea id="contactoMensaje" class="form-control" rows="3" placeholder="¿Qué productos deseas solicitar?" required></textarea>
                                </div>
                                <button type="submit" class="btn btn-success w-100 fw-bold">Enviar Mensaje</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    `;

    // Asignar el evento al formulario de contacto
    setTimeout(() => {
        const formContacto = document.getElementById("formContacto");
        if (formContacto) {
            formContacto.addEventListener("submit", async (e) => {
                e.preventDefault();
                await crearContacto({
                    nombre: document.getElementById("contactoNombre").value.trim(),
                    correo: document.getElementById("contactoCorreo").value.trim(),
                    mensaje: document.getElementById("contactoMensaje").value.trim(),
                    fecha: new Date().toLocaleDateString("es-PE")
                });
                alert("¡Gracias por escribirnos! Tu mensaje ha sido enviado.");
                formContacto.reset();
            });
        }
    }, 0);

    return html;
}