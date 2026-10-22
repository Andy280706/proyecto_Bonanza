import { obtenerCategorias, crearCategoria, eliminarCategoria } from "./services/categoryService.js";
import { obtenerProductos, crearProducto, eliminarProducto } from "./services/productService.js";
import { obtenerContactos, eliminarContacto } from "./services/contactService.js";
import { obtenerPedidos, actualizarEstadoPedido } from "./services/orderService.js";
import { escapeHTML } from "./utils/escapeHTML.js";
import { Header } from "./components/Header.js";

/* ==========================================================================
   ELEMENTOS DEL DOM
   ========================================================================== */
const adminTabs = document.getElementById("adminTabs");

// Categorías
const formCat = document.getElementById("formCategoria");
const tablaCat = document.getElementById("tablaCategorias");
const selectCat = document.getElementById("prodCategoria");

// Productos
const formProd = document.getElementById("formProducto");
const tablaProd = document.getElementById("tablaProductos");

// Mensajes
const tablaMsg = document.getElementById("tablaContactos");
const adminFeedback = document.getElementById("adminFeedback");
const siteHeader = document.getElementById("siteHeader");

if (siteHeader) siteHeader.innerHTML = Header();

function mostrarError(mensaje) {
    if (adminFeedback) {
        adminFeedback.innerHTML = `<div class="alert alert-danger" role="alert">${escapeHTML(mensaje)}</div>`;
    }
}

function mostrarCarga(tabla, columnas, mensaje) {
    tabla.innerHTML = `<tr><td colspan="${columnas}" class="text-center py-3"><span class="spinner-border spinner-border-sm text-success" role="status"></span> ${mensaje}</td></tr>`;
}

let accionPendiente = null;
const modalConfirmarEliminar = document.getElementById("modalConfirmarEliminar");
const textoConfirmarEliminar = document.getElementById("textoConfirmarEliminar");

function solicitarConfirmacion(mensaje, accion) {
    accionPendiente = accion;
    textoConfirmarEliminar.textContent = mensaje;
    window.bootstrap.Modal.getOrCreateInstance(modalConfirmarEliminar).show();
}

document.getElementById("btnConfirmarEliminar")?.addEventListener("click", async () => {
    const accion = accionPendiente;
    accionPendiente = null;
    if (!accion) return;

    window.bootstrap.Modal.getOrCreateInstance(modalConfirmarEliminar).hide();
    try {
        await accion();
    } catch (error) {
        console.error("No se pudo eliminar el elemento:", error);
        mostrarError("No se pudo eliminar el elemento. Inténtalo nuevamente.");
    }
});

/* ==========================================================================
   INICIALIZACIÓN
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    configurarPestanas();
    cargarTodo();
});

async function cargarTodo() {
    try {
        await Promise.all([
            renderCategorias(),
            renderProductos(),
            renderContactos(),
            renderPedidos()
        ]);
    } catch (error) {
        console.error("No se pudieron cargar los datos de administración:", error);
        mostrarError("No se pudieron cargar algunos datos. Inténtalo nuevamente.");
    }
}

/* ==========================================================================
   CONTROL DE PESTAÑAS (TAB SWITCHING)
   ========================================================================== */
function configurarPestanas() {
    if (!adminTabs) return;

    adminTabs.addEventListener("click", (e) => {
        const btn = e.target.closest(".nav-link");
        if (!btn) return;

        // Quitar estado activo de todas las pestañas y ocultar paneles
        document.querySelectorAll("#adminTabs .nav-link").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("show", "active"));

        // Activar la pestaña y el panel seleccionado
        btn.classList.add("active");
        const targetId = btn.getAttribute("data-bs-target");
        const panel = document.querySelector(targetId);
        if (panel) panel.classList.add("show", "active");
    });
}

/* ==========================================================================
   1. MÓDULO DE CATEGORÍAS
   ========================================================================== */
async function renderCategorias() {
    if (!tablaCat) return;
    mostrarCarga(tablaCat, 3, "Cargando categorías...");
    const categorias = await obtenerCategorias();

    tablaCat.innerHTML = categorias.length === 0 
        ? `<tr><td colspan="3" class="text-center text-muted py-3">No hay categorías registradas.</td></tr>`
        : categorias.map(c => `
            <tr>
                <td class="fw-bold">${escapeHTML(c.nombre)}</td>
                <td>${escapeHTML(c.descripcion || '-')}</td>
                <td class="text-center">
                    <button data-id="${escapeHTML(c.id)}" class="btn btn-sm btn-danger del-cat">Eliminar</button>
                </td>
            </tr>
        `).join('');

    if (selectCat) {
        selectCat.innerHTML = '<option value="">Seleccione categoría...</option>' + 
            categorias.map(c => `<option value="${escapeHTML(c.nombre)}">${escapeHTML(c.nombre)}</option>`).join('');
    }
}

if (formCat) {
    formCat.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            await crearCategoria({
                nombre: document.getElementById("catNombre").value.trim(),
                descripcion: document.getElementById("catDescripcion").value.trim()
            });
            formCat.reset();
            await renderCategorias();
        } catch (error) {
            console.error("No se pudo guardar la categoría:", error);
            mostrarError("No se pudo guardar la categoría. Inténtalo nuevamente.");
        }
    });
}

if (tablaCat) {
    tablaCat.addEventListener("click", async (e) => {
        const boton = e.target.closest(".del-cat");
        if (boton) {
            solicitarConfirmacion("¿Eliminar esta categoría?", async () => {
                await eliminarCategoria(boton.dataset.id);
                await renderCategorias();
            });
        }
    });
}

/* ==========================================================================
   2. MÓDULO DE PRODUCTOS
   ========================================================================== */
async function renderProductos() {
    if (!tablaProd) return;
    mostrarCarga(tablaProd, 5, "Cargando productos...");
    const productos = await obtenerProductos();

    tablaProd.innerHTML = productos.length === 0
        ? `<tr><td colspan="5" class="text-center text-muted py-3">No hay productos registrados.</td></tr>`
        : productos.map(p => `
            <tr>
                <td><img src="${escapeHTML(p.imagen || 'https://via.placeholder.com/40')}" width="40" height="40" class="rounded object-fit-cover" alt="${escapeHTML(p.nombre)}" onerror="this.onerror=null;this.src='/img/logo.png';"></td>
                <td class="fw-bold">${escapeHTML(p.nombre)}</td>
                <td><span class="badge bg-secondary">${escapeHTML(p.categoria)}</span></td>
                <td class="text-success fw-bold">S/ ${parseFloat(p.precio).toFixed(2)}</td>
                <td class="text-center">
                    <button data-id="${escapeHTML(p.id)}" class="btn btn-sm btn-danger del-prod">Eliminar</button>
                </td>
            </tr>
        `).join('');
}

if (formProd) {
    formProd.addEventListener("submit", async (e) => {
        e.preventDefault();
        const inputPrecio = document.getElementById("prodPrecio");
        const precio = Number(inputPrecio.value);
        if (!Number.isFinite(precio) || precio <= 0) {
            inputPrecio.setCustomValidity("El precio debe ser un número mayor que 0.");
            inputPrecio.reportValidity();
            return;
        }
        inputPrecio.setCustomValidity("");

        try {
            await crearProducto({
                nombre: document.getElementById("prodNombre").value.trim(),
                precio,
                categoria: selectCat ? selectCat.value : "",
                imagen: document.getElementById("prodImagen").value.trim()
            });
            formProd.reset();
            await renderProductos();
        } catch (error) {
            console.error("No se pudo guardar el producto:", error);
            mostrarError("No se pudo guardar el producto. Inténtalo nuevamente.");
        }
    });
    document.getElementById("prodPrecio").addEventListener("input", (e) => e.target.setCustomValidity(""));
}

if (tablaProd) {
    tablaProd.addEventListener("click", async (e) => {
        const boton = e.target.closest(".del-prod");
        if (boton) {
            solicitarConfirmacion("¿Eliminar este producto?", async () => {
                await eliminarProducto(boton.dataset.id);
                await renderProductos();
            });
        }
    });
}

/* ==========================================================================
   3. MÓDULO DE MENSAJES DE CLIENTES
   ========================================================================== */
async function renderContactos() {
    if (!tablaMsg) return;
    mostrarCarga(tablaMsg, 5, "Cargando mensajes...");
    const contactos = await obtenerContactos();

    tablaMsg.innerHTML = contactos.length === 0
        ? `<tr><td colspan="5" class="text-center text-muted py-3">No hay mensajes registrados.</td></tr>`
        : contactos.map(m => `
            <tr>
                <td class="small text-muted">${escapeHTML(m.fecha || '-')}</td>
                <td class="fw-bold">${escapeHTML(m.nombre)}</td>
                <td>${escapeHTML(m.correo)}</td>
                <td>${escapeHTML(m.mensaje)}</td>
                <td class="text-center">
                    <button data-id="${escapeHTML(m.id)}" class="btn btn-sm btn-outline-danger del-msg">Eliminar</button>
                </td>
            </tr>
        `).join('');
}

if (tablaMsg) {
    tablaMsg.addEventListener("click", async (e) => {
        const boton = e.target.closest(".del-msg");
        if (boton) {
            solicitarConfirmacion("¿Eliminar este mensaje?", async () => {
                await eliminarContacto(boton.dataset.id);
                await renderContactos();
            });
        }
    });
}

/* ==========================================================================
    4. MÓDULO DE PEDIDOS Y REPORTE DE VENTAS
    ========================================================================== */
const tablaPedidos = document.getElementById("tablaPedidos");
const estadosPedido = ["Recibido", "En preparación", "Listo para recojo", "En camino", "Entregado", "Cancelado"];

async function renderPedidos() {
    if (!tablaPedidos) return;
    mostrarCarga(tablaPedidos, 7, "Cargando pedidos...");
    const pedidos = await obtenerPedidos();
    const totalSolicitado = pedidos.reduce((total, pedido) => total + Number(pedido.total || 0), 0);
    const pendientes = pedidos.filter(pedido => pedido.pagoEstado === "Pendiente").length;

    document.getElementById("resumenPedidos").textContent = pedidos.length;
    document.getElementById("resumenIngresos").textContent = `S/ ${totalSolicitado.toFixed(2)}`;
    document.getElementById("resumenPendientes").textContent = pendientes;

    tablaPedidos.innerHTML = pedidos.length === 0
        ? '<tr><td colspan="7" class="text-center text-muted py-4">Aún no hay pedidos registrados.</td></tr>'
        : pedidos.map(pedido => {
            const productos = (pedido.productos || []).map(item =>
                `${escapeHTML(item.cantidad)} x ${escapeHTML(item.nombre)}`
            ).join("<br>");
            const fecha = pedido.creadoEn ? new Date(pedido.creadoEn).toLocaleString("es-PE") : "-";
            const estados = estadosPedido.map(estado => `
                <option value="${escapeHTML(estado)}" ${pedido.estado === estado ? "selected" : ""}>${escapeHTML(estado)}</option>
            `).join("");

            return `
                <tr>
                    <td class="small">${escapeHTML(fecha)}</td>
                    <td><strong>${escapeHTML(pedido.cliente)}</strong><br><small>${escapeHTML(pedido.telefono)}</small></td>
                    <td>${escapeHTML(pedido.tipoEntrega)}${pedido.direccion ? `<br><small>${escapeHTML(pedido.direccion)}, ${escapeHTML(pedido.distrito)}</small>` : ""}</td>
                    <td>${productos}</td>
                    <td class="fw-bold text-success">S/ ${Number(pedido.total || 0).toFixed(2)}</td>
                    <td>${escapeHTML(pedido.metodoPago)}<br><small class="text-muted">${escapeHTML(pedido.pagoEstado)}</small></td>
                    <td>
                        <select class="form-select form-select-sm estado-pedido" data-id="${escapeHTML(pedido.id)}" aria-label="Estado del pedido">
                            ${estados}
                        </select>
                    </td>
                </tr>`;
        }).join("");
}

if (tablaPedidos) {
    tablaPedidos.addEventListener("change", async event => {
        const selector = event.target.closest(".estado-pedido");
        if (!selector) return;
        try {
            await actualizarEstadoPedido(selector.dataset.id, selector.value);
        } catch (error) {
            console.error("No se pudo actualizar el pedido:", error);
            mostrarError("No se pudo actualizar el estado del pedido.");
            try {
                await renderPedidos();
            } catch (renderError) {
                console.error("No se pudo volver a cargar la lista de pedidos:", renderError);
            }
        }
    });
}