import { obtenerProductoPorId } from "../services/productService.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import { escapeHTML } from "../utils/escapeHTML.js";

export async function ProductDetailView() {
    // Obtener ID desde la URL (?id=XYZ)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id) {
        return `
            <div class="container my-5 text-center py-5">
                <h4>Producto no encontrado.</h4>
                <a href="productos.html" class="btn btn-success mt-3">Volver al catálogo</a>
            </div>
        `;
    }

    const producto = await obtenerProductoPorId(id);

    if (!producto) {
        return `
            <div class="container my-5 text-center py-5">
                <h4>El producto solicitado no existe.</h4>
                <a href="productos.html" class="btn btn-success mt-3">Volver al catálogo</a>
            </div>
        `;
    }

    return `
        <div class="container my-5">
            <a href="productos.html" class="btn btn-outline-secondary btn-sm mb-4">← Volver al catálogo</a>
            <div class="card shadow border-0 overflow-hidden">
                <div class="row g-0">
                    <div class="col-md-6">
                        <img src="${escapeHTML(producto.imagen || 'https://via.placeholder.com/500')}" class="img-fluid w-100 h-100 object-fit-cover" style="min-height: 300px;" alt="${escapeHTML(producto.nombre)}">
                    </div>
                    <div class="col-md-6 p-4 p-md-5 d-flex flex-column justify-content-center">
                        <span class="badge bg-success align-self-start mb-2">${escapeHTML(producto.categoria)}</span>
                        <h2 class="fw-bold text-dark">${escapeHTML(producto.nombre)}</h2>
                        <h3 class="text-success fw-bold my-3">${formatCurrency(producto.precio)}</h3>
                        <p class="text-muted mb-4">${escapeHTML(producto.descripcion || 'Producto lácteo de alta calidad, elaborado con estándares artesanales para garantizar máxima frescura.')}</p>
                        <button onclick="alert('Solicitud enviada a la tienda')" class="btn btn-success btn-lg fw-bold">Pedir por WhatsApp 📱</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}