import { cartService } from '../services/cartService.js';
import { crearPedido } from '../services/orderService.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { escapeHTML } from '../utils/escapeHTML.js';
import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";

export class CartView {
    constructor() {
        this.app = document.getElementById("app");
    }

    init() {
        if (!this.app) return;
        
        // 1. Renderizar estructura base completa (con su propio Header)
        this.app.innerHTML = `${Header()}${this.getTemplate()}${Footer()}`;

        // 2. Guardar referencias del DOM
        this.contenedor = document.getElementById("contenedorDetalleCarrito");
        this.txtCant = document.getElementById("cantProductosTexto");
        this.subtotalLabel = document.getElementById("resumenSubtotal");
        this.totalLabel = document.getElementById("resumenTotal");
        this.formCheckout = document.getElementById("formCheckoutPage");
        this.checkoutFeedback = document.getElementById("checkoutFeedback");
        this.checkoutButton = document.getElementById("btnContinuarCompra");
        this.tipoEntrega = document.getElementById("tipoEntrega");
        this.datosDomicilio = document.getElementById("datosDomicilio");

        // 3. Cargar datos y listeners
        this.render();
        this.bindEvents();
    }

    getTemplate() {
        return `
            <main class="container my-4">
                <h2 class="mb-4 fw-bold"><i class="bi bi-cart3 me-2"></i>Tu carrito</h2>
                <div id="checkoutFeedback" class="mb-3" aria-live="polite"></div>

                <div class="row g-4">
                    <!-- Lista de Productos -->
                    <div class="col-lg-8 col-12">
                        <div class="card shadow-sm border-0 p-4 mb-3 bg-white">
                            <h5 class="border-bottom pb-3 mb-3 fw-bold" id="cantProductosTexto">Productos (0)</h5>

                            <div id="contenedorDetalleCarrito">
                                <div class="text-center py-5 text-muted">
                                    <i class="bi bi-cart-x display-4"></i>
                                    <p class="mt-2">Tu carrito está vacío actualmente.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Resumen de la Orden -->
                    <div class="col-lg-4 col-12">
                        <div class="card shadow-sm border-0 p-4 bg-white sticky-top" style="top: 20px; z-index: 10;">
                            <h5 class="fw-bold border-bottom pb-3 mb-3">Resumen de la orden</h5>

                            <div class="d-flex justify-content-between mb-2 text-muted">
                                <span>Subtotal productos</span>
                                <span id="resumenSubtotal">S/. 0.00</span>
                            </div>
                            <hr>

                            <div class="d-flex justify-content-between mb-4 fs-4 fw-bold">
                                <span>Total:</span>
                                <span class="text-success" id="resumenTotal">S/. 0.00</span>
                            </div>

                            <button id="btnContinuarCompra" class="btn btn-success w-100 py-3 fw-bold mb-2" data-bs-toggle="modal"
                                data-bs-target="#modalPago" disabled>
                                Continuar compra <i class="bi bi-arrow-right ms-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <!-- Modal de Simulación de Pago -->
            <div class="modal fade" id="modalPago" tabindex="-1" aria-labelledby="modalPagoLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="modalPagoLabel">
                                <i class="bi bi-lock-fill me-2"></i>Formulario de Pago y Envío
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-4">
                            <form id="formCheckoutPage">
                                <h6 class="text-secondary border-bottom pb-2 mb-3 fw-bold">Datos del cliente</h6>
                                <div class="mb-3">
                                    <label for="nombreCliente" class="form-label">Nombre Completo</label>
                                    <input type="text" class="form-control" id="nombreCliente" name="nombreCliente" placeholder="Ej. Juan Pérez" required>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="telefonoCliente" class="form-label">Teléfono / WhatsApp</label>
                                        <input type="tel" class="form-control" id="telefonoCliente" name="telefonoCliente" placeholder="987654321" inputmode="numeric" minlength="9" maxlength="9" pattern="[0-9]{9}" title="Ingresa un número de 9 dígitos" required>
                                    </div>
                                </div>
                                <h6 class="text-secondary border-bottom pb-2 mb-3 mt-2 fw-bold">Entrega</h6>
                                <div class="mb-3">
                                    <label for="tipoEntrega" class="form-label">Modalidad</label>
                                    <select class="form-select" id="tipoEntrega" name="tipoEntrega" required>
                                        <option value="Recojo en tienda">Recojo en tienda</option>
                                        <option value="Entrega a domicilio">Entrega a domicilio</option>
                                    </select>
                                </div>
                                <div id="datosDomicilio" class="d-none">
                                    <div class="mb-3">
                                        <label for="distritoCliente" class="form-label">Distrito</label>
                                        <input type="text" class="form-control" id="distritoCliente" name="distrito" placeholder="Ej. Apata / Huancayo">
                                    </div>
                                    <div class="mb-3">
                                        <label for="direccionCliente" class="form-label">Dirección de Entrega</label>
                                        <input type="text" class="form-control" id="direccionCliente" name="direccion" placeholder="Av. Principal 123">
                                    </div>
                                </div>

                                <h6 class="text-secondary border-bottom pb-2 mb-3 mt-4 fw-bold">Método de Pago Preferido</h6>
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="radio" name="metodoPago" id="pagoYape" value="Yape / Plin (coordinar por WhatsApp)" checked>
                                    <label class="form-check-label" for="pagoYape">Yape / Plin</label>
                                </div>
                                <div class="form-check mb-4">
                                    <input class="form-check-input" type="radio" name="metodoPago" id="pagoEfectivo" value="Efectivo contra entrega">
                                    <label class="form-check-label" for="pagoEfectivo">Efectivo contra entrega</label>
                                </div>
                                <p class="small text-muted mb-3">Pedido simulado: no se realizará ningún cobro en esta página.</p>

                                <div class="d-flex gap-2 justify-content-end">
                                    <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="submit" class="btn btn-success px-4">
                                        <i class="bi bi-check-circle me-1"></i> Confirmar Pedido
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
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
            if (this.checkoutButton) this.checkoutButton.disabled = true;
            return;
        }

        this.contenedor.innerHTML = cart.map((item, index) => {
            const imagenSrc = escapeHTML(item.imagen || item.imagenUrl || item.image || '');
            const imagenHTML = imagenSrc 
                ? `<img src="${imagenSrc}" alt="${escapeHTML(item.nombre)}" class="img-fluid rounded" style="max-height: 100%; max-width: 100%; object-fit: contain;" onerror="this.onerror=null;this.src='/img/logo.png';">`
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
                                <h6 class="fw-bold mb-1">${escapeHTML(item.nombre || item.title || 'Producto')}</h6>
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
        if (this.checkoutButton) this.checkoutButton.disabled = false;
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
            this.tipoEntrega?.addEventListener("change", () => this.actualizarCamposEntrega());
            this.actualizarCamposEntrega();
            const telefonoInput = document.getElementById("telefonoCliente");
            telefonoInput?.addEventListener("input", () => telefonoInput.setCustomValidity(""));

            this.formCheckout.addEventListener("submit", async (e) => {
                e.preventDefault();
                const cart = cartService.getCart();
                if (cart.length === 0) return;

                const formData = new FormData(this.formCheckout);
                const telefono = String(formData.get("telefonoCliente")).trim();
                if (!/^\d{9}$/.test(telefono)) {
                    telefonoInput?.setCustomValidity("Ingresa un teléfono de exactamente 9 dígitos.");
                    telefonoInput?.reportValidity();
                    return;
                }
                telefonoInput?.setCustomValidity("");
                const metodoPago = formData.get("metodoPago");
                const pedido = {
                    cliente: String(formData.get("nombreCliente")).trim(),
                    telefono,
                    tipoEntrega: String(formData.get("tipoEntrega")),
                    distrito: String(formData.get("distrito") || "").trim(),
                    direccion: String(formData.get("direccion") || "").trim(),
                    metodoPago: String(metodoPago),
                    pagoEstado: "Pendiente",
                    productos: cart.map(item => ({
                        id: item.id,
                        nombre: item.nombre,
                        precio: Number(item.precio),
                        cantidad: Number(item.cantidad)
                    })),
                    total: cart.reduce((sum, item) => sum + Number(item.precio) * Number(item.cantidad), 0)
                };

                const submitButton = this.formCheckout.querySelector('[type="submit"]');
                if (submitButton) submitButton.disabled = true;

                try {
                    const pedidoId = await crearPedido(pedido);
                    const mensaje = [
                        `Hola, quiero coordinar el pedido ${pedidoId} de Bonanza.`,
                        ...pedido.productos.map(item => `${item.cantidad} x ${item.nombre} - ${formatCurrency(item.precio * item.cantidad)}`),
                        `Total: ${formatCurrency(pedido.total)}`,
                        `Entrega: ${pedido.tipoEntrega}`,
                        pedido.direccion ? `Dirección: ${pedido.direccion}, ${pedido.distrito}` : "",
                        `Pago preferido: ${pedido.metodoPago} (pendiente de coordinación)`
                    ].filter(Boolean).join("\n");

                    cartService.clearCart();
                    this.render();
                    this.formCheckout.reset();
                    this.actualizarCamposEntrega();

                    const modalElem = document.getElementById("modalPago");
                    if (modalElem) {
                        const modalInstance = window.bootstrap?.Modal.getInstance(modalElem) || window.bootstrap?.Modal.getOrCreateInstance(modalElem);
                        modalInstance?.hide();
                    }

                    if (this.checkoutFeedback) {
                        this.checkoutFeedback.innerHTML = `
                            <div class="alert alert-success">
                                Pedido <strong>${escapeHTML(pedidoId)}</strong> registrado. El pago sigue pendiente y será coordinado por WhatsApp.
                                <a class="alert-link d-block mt-2" target="_blank" rel="noopener noreferrer"
                                    href="https://wa.me/?text=${encodeURIComponent(mensaje)}">
                                    <i class="bi bi-whatsapp me-1"></i>Continuar por WhatsApp
                                </a>
                            </div>`;
                    }
                } catch (error) {
                    console.error("No se pudo registrar el pedido:", error);
                    if (this.checkoutFeedback) {
                        this.checkoutFeedback.innerHTML = '<div class="alert alert-danger">No se pudo registrar el pedido. Inténtalo nuevamente.</div>';
                    }
                } finally {
                    if (submitButton) submitButton.disabled = false;
                }
            });
        }
    }

    actualizarCamposEntrega() {
        if (!this.tipoEntrega || !this.datosDomicilio) return;
        const requiereDomicilio = this.tipoEntrega.value === "Entrega a domicilio";
        this.datosDomicilio.classList.toggle("d-none", !requiereDomicilio);
        this.datosDomicilio.querySelectorAll("input").forEach(input => {
            input.required = requiereDomicilio;
        });
    }
}