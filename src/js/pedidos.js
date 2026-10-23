import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { Header, inicializarHeaderAuth } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { auth, db } from "./firebase/config.js";
import { escapeHTML } from "./utils/escapeHTML.js";
import { formatCurrency } from "./utils/formatCurrency.js";

const app = document.getElementById("app");

function obtenerFecha(fecha) {
    if (fecha?.toDate) return fecha.toDate();
    return new Date(fecha);
}

function renderPedido(pedido) {
    const fecha = obtenerFecha(pedido.creadoEn);
    const fechaTexto = Number.isNaN(fecha.getTime())
        ? "Fecha no disponible"
        : fecha.toLocaleString("es-PE");
    const productos = Array.isArray(pedido.productos) ? pedido.productos : [];
    const productosHTML = productos.length
        ? productos.map(producto => `
            <li class="d-flex justify-content-between gap-3 py-2 border-bottom">
                <span>${escapeHTML(producto.cantidad)} x ${escapeHTML(producto.nombre)}</span>
                <span class="text-nowrap">${formatCurrency(Number(producto.precio) * Number(producto.cantidad))}</span>
            </li>
        `).join("")
        : '<li class="text-muted py-2">No hay detalle de productos.</li>';

    return `
        <article class="card shadow-sm border-0 mb-3">
            <div class="card-body">
                <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                    <div>
                        <h2 class="h5 mb-1">Pedido #${escapeHTML(pedido.id)}</h2>
                        <p class="text-muted small mb-0">${escapeHTML(fechaTexto)}</p>
                    </div>
                    <span class="badge text-bg-success">${escapeHTML(pedido.estado || "Recibido")}</span>
                </div>
                <ul class="list-unstyled mb-3">${productosHTML}</ul>
                <div class="d-flex justify-content-between border-top pt-3 fw-bold">
                    <span>Total</span>
                    <span>${formatCurrency(pedido.total)}</span>
                </div>
            </div>
        </article>
    `;
}

function mostrarMensaje(contenedor, texto, clase = "info") {
    contenedor.innerHTML = `<div class="alert alert-${clase}" role="status">${escapeHTML(texto)}</div>`;
}

if (app) {
    app.innerHTML = `
        ${Header()}
        <main class="container py-4">
            <h1 class="h2 mb-4">Mis Pedidos</h1>
            <div id="pedidosContenido" aria-live="polite">
                <div class="text-center py-5" role="status">
                    <div class="spinner-border text-success" aria-hidden="true"></div>
                    <p class="mt-2 mb-0">Cargando tus pedidos...</p>
                </div>
            </div>
        </main>
        ${Footer()}
    `;
    inicializarHeaderAuth();

    const pedidosContenido = document.getElementById("pedidosContenido");

    onAuthStateChanged(auth, async user => {
        if (!user) {
            window.location.href = "./login.html";
            return;
        }

        try {
            const pedidosQuery = query(
                collection(db, "pedidos"),
                where("usuarioId", "==", user.uid)
            );
            const snapshot = await getDocs(pedidosQuery);
            if (auth.currentUser?.uid !== user.uid) return;

            const pedidos = snapshot.docs
                .map(documento => ({ id: documento.id, ...documento.data() }))
                .sort((a, b) => obtenerFecha(b.creadoEn).getTime() - obtenerFecha(a.creadoEn).getTime());

            if (pedidos.length === 0) {
                mostrarMensaje(pedidosContenido, "Aún no cuentas con compras registradas.");
                return;
            }

            pedidosContenido.innerHTML = pedidos.map(renderPedido).join("");
        } catch (error) {
            console.error("No se pudieron cargar los pedidos del usuario:", error);
            mostrarMensaje(pedidosContenido, "No se pudieron cargar tus pedidos. Inténtalo nuevamente.", "danger");
        }
    });
}
