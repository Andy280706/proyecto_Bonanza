import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { HomeView } from "./views/HomeView.js";
import { ProductsView } from "./views/ProductsView.js";
import { ProductDetailView } from "./views/ProductDetailView.js";

async function renderApp() {
    const app = document.getElementById("app");
    if (!app) return;

    // Detectar en qué página estamos según la URL
    const path = window.location.pathname;
    const esSubpagina = path.includes("/pages/");
    const rutaBase = esSubpagina ? "../" : "./";

    // 1. Obtener el contenido de la vista actual
    let viewHTML = "";

    if (path.includes("productos.html")) {
        viewHTML = await ProductsView();
    } else if (path.includes("producto.html")) {
        viewHTML = await ProductDetailView();
    } else {
        // Por defecto: Página de Inicio (index.html)
        viewHTML = await HomeView();
    }

    // 2. Renderizar Header + Vista + Footer en la pantalla
    app.innerHTML = `
    ${Header()}
    <main>${viewHTML}</main>
    ${Footer()}
`;
}

// Ejecutar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", renderApp);