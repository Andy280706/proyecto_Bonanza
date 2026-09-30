import { obtenerCategorias, crearCategoria, eliminarCategoria } from "./services/categoryService.js";
import { obtenerProductos, crearProducto, eliminarProducto } from "./services/productService.js";
import { obtenerContactos, eliminarContacto } from "./services/contactService.js";
import { obtenerPedidos, actualizarEstadoPedido } from "./services/orderService.js";
import { escapeHTML } from "./utils/escapeHTML.js";

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

/* ==========================================================================
   INICIALIZACIÓN
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    configurarPestanas();
    cargarTodo();
});

async function cargarTodo() {
    await Promise.all([
        renderCategorias(),
        renderProductos(),
        renderContactos(),
        renderPedidos()
    ]);
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
        await crearCategoria({
            nombre: document.getElementById("catNombre").value.trim(),
            descripcion: document.getElementById("catDescripcion").value.trim()
        });
        formCat.reset();
        await renderCategorias();
    });
}

if (tablaCat) {
    tablaCat.addEventListener("click", async (e) => {
        if (e.target.classList.contains("del-cat")) {
            if (confirm("¿Eliminar esta categoría?")) {
                await eliminarCategoria(e.target.dataset.id);
                await renderCategorias();
            }
        }
    });
}

/* ==========================================================================
   2. MÓDULO DE PRODUCTOS
   ========================================================================== */
async function renderProductos() {
    if (!tablaProd) return;
    const productos = await obtenerProductos();

    tablaProd.innerHTML = productos.length === 0
        ? `<tr><td colspan="5" class="text-center text-muted py-3">No hay productos registrados.</td></tr>`
        : productos.map(p => `
            <tr>
                <td><img src="${escapeHTML(p.imagen || 'https://via.placeholder.com/40')}" width="40" height="40" class="rounded object-fit-cover"></td>
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
        await crearProducto({
            nombre: document.getElementById("prodNombre").value.trim(),
            precio: parseFloat(document.getElementById("prodPrecio").value),
            categoria: selectCat ? selectCat.value : "",
            imagen: document.getElementById("prodImagen").value.trim()
        });
        formProd.reset();
        await renderProductos();
    });
}

if (tablaProd) {
    tablaProd.addEventListener("click", async (e) => {
        if (e.target.classList.contains("del-prod")) {
            if (confirm("¿Eliminar este producto?")) {
                await eliminarProducto(e.target.dataset.id);
                await renderProductos();
            }
        }
    });
}

/* ==========================================================================
   3. MÓDULO DE MENSAJES DE CLIENTES
   ========================================================================== */
async function renderContactos() {
    if (!tablaMsg) return;
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
        if (e.target.classList.contains("del-msg")) {
            if (confirm("¿Eliminar este mensaje?")) {
                await eliminarContacto(e.target.dataset.id);
                await renderContactos();
            }
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
            alert("No se pudo actualizar el estado del pedido.");
            await renderPedidos();
        }
    });
}