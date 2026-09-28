import { formatCurrency } from "../utils/formatCurrency.js";
import { escapeHTML } from "../utils/escapeHTML.js";

export function ProductCard(producto, rutaBase = "") {
    const imagen = escapeHTML(producto.imagen || "https://via.placeholder.com/300x200?text=Lacteo+Bonanza");
    
    return `
        <div class="col">
            <div class="card h-100 shadow-sm">
                <img src="${imagen}" class="card-img-top object-fit-cover" alt="${escapeHTML(producto.nombre)}" style="height: 180px;">
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-light text-success align-self-start mb-2">${escapeHTML(producto.categoria)}</span>
                    <h6 class="card-title text-dark mb-1">${escapeHTML(producto.nombre)}</h6>
                    <p class="text-success fw-bold fs-5 mb-3">${formatCurrency(producto.precio)}</p>
                    <a href="${rutaBase}producto.html?id=${escapeHTML(producto.id)}" class="btn btn-success btn-sm w-100 mt-auto">
                        Ver Detalle 🔎
                    </a>
                </div>
            </div>
        </div>
    `;
}