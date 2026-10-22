export function Header() {
    const enPages = window.location.pathname.includes("/src/pages/");
    const base = enPages ? "../../" : "./";
    const pagesBase = enPages ? "./" : "./src/pages/";

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
                    </ul>
                </div>
            </div>
        </nav>
    `;
}