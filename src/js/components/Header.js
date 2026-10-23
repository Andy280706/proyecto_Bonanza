import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "../firebase/config.js";
import { obtenerPerfilUsuario } from "../services/authService.js";

export function Header() {
    const path = window.location.pathname;
    const enAdminPage = path.includes("/src/pages/admin/");
    const enPages = path.includes("/src/pages/") && !enAdminPage;
    const base = enAdminPage ? "../../../" : enPages ? "../../" : "./";
    const pagesBase = enAdminPage ? "../" : enPages ? "./" : "./src/pages/";
    const adminHref = enAdminPage
        ? "./index.html"
        : enPages
            ? "./admin/index.html"
            : "./src/pages/admin/index.html";
    const misPedidosHref = enAdminPage
        ? "../pedidos.html"
        : enPages
            ? "./pedidos.html"
            : "./src/pages/pedidos.html";

    return `
        <nav class="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm py-2">
            <div class="container d-flex align-items-center justify-content-between">
                <a class="navbar-brand fw-bold fs-4 d-flex align-items-center" href="${base}index.html">
                    <img src="${base}img/logo.png" alt="" width="40" height="40" class="me-2">
                    Lácteos Bonanza
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu"
                    aria-controls="navMenu" aria-expanded="false" aria-label="Abrir menú de navegación">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navMenu">
                    <ul class="navbar-nav ms-auto gap-lg-3 align-items-start align-items-lg-center">
                        <li class="nav-item"><a class="nav-link fw-bold" href="${base}index.html">Inicio</a></li>
                        <li class="nav-item"><a class="nav-link fw-bold" href="${pagesBase}productos.html">Catálogo</a></li>
                        <li class="nav-item">
                            <a class="nav-link fw-bold" href="${pagesBase}carrito.html">
                                <i class="bi bi-cart3 me-1"></i>Carrito
                                <span class="badge rounded-pill text-bg-dark" data-cart-count>0</span>
                            </a>
                        </li>
                        <li class="nav-item" id="pedidosNavItem" hidden>
                            <a class="nav-link fw-bold" href="${misPedidosHref}">Mis Pedidos</a>
                        </li>
                        <li class="nav-item" id="adminNavItem" hidden>
                            <a class="nav-link fw-bold" href="${adminHref}">Administración</a>
                        </li>
                        <li class="nav-item" id="loginNavItem">
                            <a class="nav-link fw-bold" href="${pagesBase}login.html">Iniciar Sesión</a>
                        </li>
                        <li class="nav-item" id="logoutNavItem" hidden>
                            <button class="nav-link fw-bold border-0 bg-transparent p-0" type="button" id="logoutButton">
                                Cerrar sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `;
}

export function inicializarHeaderAuth() {
    const pedidosNavItem = document.getElementById("pedidosNavItem");
    const adminNavItem = document.getElementById("adminNavItem");
    const loginNavItem = document.getElementById("loginNavItem");
    const logoutNavItem = document.getElementById("logoutNavItem");
    const logoutButton = document.getElementById("logoutButton");

    if (!pedidosNavItem || !adminNavItem || !loginNavItem || !logoutNavItem || !logoutButton) return;

    onAuthStateChanged(auth, async user => {
        pedidosNavItem.hidden = !user;
        loginNavItem.hidden = Boolean(user);
        logoutNavItem.hidden = !user;
        adminNavItem.hidden = true;

        if (!user) return;

        try {
            const perfil = await obtenerPerfilUsuario(user.uid);
            if (auth.currentUser?.uid !== user.uid) return;
            adminNavItem.hidden = perfil?.rol !== "admin";
        } catch (error) {
            console.error("No se pudo consultar el rol del usuario:", error);
        }
    });

    logoutButton.addEventListener("click", async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("No se pudo cerrar la sesión:", error);
        }
    });
}