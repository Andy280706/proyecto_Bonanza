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

    let viewHTML = "";

    if (path.includes("productos.html")) {
        viewHTML = await ProductsView();
    } else if (path.includes("producto.html")) {
        viewHTML = await ProductDetailView();
    } else {
        // Por defecto: Página de Inicio (index.html)
        viewHTML = await HomeView();
    }

    app.innerHTML = `
    ${Header()}
    <main>${viewHTML}</main>
    ${Footer()}
`;
    actualizarContadorCarrito();
}

document.addEventListener("DOMContentLoaded", renderApp);
window.addEventListener("bonanza:cart-updated", actualizarContadorCarrito);