import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { HomeView } from "./views/HomeView.js";
import { ProductsView } from "./views/ProductsView.js";
import { ProductDetailView } from "./views/ProductDetailView.js";
import { cartService } from "./services/cartService.js";

function actualizarContadorCarrito() {
    const { totalItems } = cartService.getTotals();
    document.querySelectorAll("[data-cart-count]").forEach(badge => {
        badge.textContent = totalItems;
    });
}

async function renderApp() {
    const app = document.getElementById("app");
    if (!app) return;

    const path = window.location.pathname;
    app.innerHTML = `
        ${Header()}
        <main>
            <div class="container text-center py-5" role="status" aria-live="polite">
                <div class="spinner-border text-success" aria-hidden="true"></div>
                <p class="mt-2 mb-0">Cargando datos...</p>
            </div>
        </main>
        ${Footer()}
    `;
    actualizarContadorCarrito();

    try {
        let viewHTML = "";

        if (path.includes("productos.html")) {
            viewHTML = await ProductsView();
        } else if (path.includes("producto.html")) {
            viewHTML = await ProductDetailView();
        } else {
            viewHTML = await HomeView();
        }

        app.querySelector("main").innerHTML = viewHTML;
    } catch (error) {
        console.error("No se pudo cargar la página:", error);
        app.querySelector("main").innerHTML = `
            <div class="container my-5">
                <div class="alert alert-danger" role="alert">No se pudieron cargar los datos. Inténtalo de nuevo más tarde.</div>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", renderApp);
window.addEventListener("bonanza:cart-updated", actualizarContadorCarrito);