export function Header() {
    const enPages = window.location.pathname.includes("/src/pages/");
    const base = enPages ? "../../" : "./";
    const pagesBase = enPages ? "./" : "./src/pages/";

    return `
        <nav class="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm">
            <div class="container">
                <a class="navbar-brand fw-bold fs-4" href="${base}index.html">🥛 Lácteos Bonanza</a>
                <div class="collapse navbar-collapse show" id="navMenu">
                    <ul class="navbar-nav ms-auto align-items-center">
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