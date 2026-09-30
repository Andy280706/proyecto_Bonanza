import { cartService } from '../services/cartService.js';
import { formatCurrency } from '../utils/formatCurrency.js';

export class CartView {
    constructor() {
        this.contenedor = document.getElementById("contenedorDetalleCarrito");
        this.txtCant = document.getElementById("cantProductosTexto");
        this.subtotalLabel = document.getElementById("resumenSubtotal");
        this.totalLabel = document.getElementById("resumenTotal");
        this.formCheckout = document.getElementById("formCheckoutPage");
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        const cart = cartService.getCart();
        const { totalDinero, totalItems } = cartService.getTotals();

        if (!this.contenedor) return;

        if (cart.length === 0) {
            this.contenedor.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="bi bi-cart-x display-4"></i>
                    <p class="mt-2">Tu carrito está vacío actualmente.</p>
                </div>`;
            if (this.txtCant) this.txtCant.innerText = "Productos (0)";
            if (this.subtotalLabel) this.subtotalLabel.innerText = formatCurrency ? formatCurrency(0) : "S/. 0.00";
            if (this.totalLabel) this.totalLabel.innerText = formatCurrency ? formatCurrency(0) : "S/. 0.00";
            return;
        }

        this.contenedor.innerHTML = cart.map((item, index) => {
            const imagenSrc = item.imagen || item.imagenUrl || item.image || '';
            const imagenHTML = imagenSrc 
                ? `<img src="${imagenSrc}" alt="${item.nombre}" class="img-fluid rounded" style="max-height: 100%; max-width: 100%; object-fit: contain;">`
                : `<i class="bi bi-box-seam text-secondary fs-3"></i>`;

            const precioFormateado = formatCurrency ? formatCurrency(item.precio) : `S/. ${Number(item.precio).toFixed(2)}`;

            return `
                <div class="row align-items-center mb-4 border-bottom pb-4">
                    <div class="col-md-6 col-12 mb-3 mb-md-0">
                        <div class="d-flex align-items-center">
                            <div class="bg-light rounded p-2 text-center me-3" style="width: 70px; height: 70px; display: flex; align-items: center; justify-content: center;">
                                ${imagenHTML}
                            </div>
                            <div>
                                <h6 class="fw-bold mb-1">${item.nombre || item.title || 'Producto'}</h6>
                                <small class="text-muted d-block">Vendido por: Bonanza S.A.</small>
                                <button class="btn btn-link text-danger p-0 mt-1 small text-decoration-none btn-eliminar" data-index="${index}">
                                    <i class="bi bi-trash3"></i> Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-3 col-6 text-md-center">
                        <span class="text-muted small d-block d-md-none">Precio unitario:</span>
                        <span class="fw-bold">${precioFormateado}</span>
                    </div>

                    <div class="col-md-3 col-6 text-end text-md-center">
                        <span class="text-muted small d-block d-md-none">Cantidad:</span>
                        <div class="input-group input-group-sm justify-content-md-center justify-content-end" style="max-width: 120px; margin-left: auto; margin-right: auto;">
                            <button class="btn btn-outline-secondary btn-cambiar-cant" data-index="${index}" data-cambio="-1">-</button>
                            <input type="text" class="form-control text-center bg-white" value="${item.cantidad}" readonly style="max-width: 40px;">
                            <button class="btn btn-outline-secondary btn-cambiar-cant" data-index="${index}" data-cambio="1">+</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        if (this.txtCant) this.txtCant.innerText = `Productos (${totalItems})`;
        const totalFormateado = formatCurrency ? formatCurrency(totalDinero) : `S/. ${totalDinero.toFixed(2)}`;
        if (this.subtotalLabel) this.subtotalLabel.innerText = totalFormateado;
        if (this.totalLabel) this.totalLabel.innerText = totalFormateado;
    }

    bindEvents() {
        if (this.contenedor) {
            this.contenedor.addEventListener("click", (e) => {
                const btnEliminar = e.target.closest(".btn-eliminar");
                if (btnEliminar) {
                    const index = parseInt(btnEliminar.dataset.index, 10);
                    cartService.removeItem(index);
                    this.render();
                    return;
                }

                const btnCant = e.target.closest(".btn-cambiar-cant");
                if (btnCant) {
                    const index = parseInt(btnCant.dataset.index, 10);
                    const cambio = parseInt(btnCant.dataset.cambio, 10);
                    cartService.updateQuantity(index, cambio);
                    this.render();
                }
            });
        }

        if (this.formCheckout) {
            this.formCheckout.addEventListener("submit", (e) => {
                e.preventDefault();
                alert("¡Pedido confirmado con éxito! Nos comunicaremos contigo.");
                cartService.clearCart();
                window.location.href = "/src/pages/productos.html";
            });
        }
    }
}