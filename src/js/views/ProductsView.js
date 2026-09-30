import { obtenerCategorias } from "../services/categoryService.js";
import { obtenerProductos } from "../services/productService.js";
import { ProductGrid } from "../components/ProductGrid.js";
import { escapeHTML } from "../utils/escapeHTML.js";
import { cartService } from "../services/cartService.js";

export async function ProductsView() {
    const categorias = await obtenerCategorias();
    const productos = await obtenerProductos();

    const html = `
        <div class="container my-5">
            <h2 class="fw-bold text-success text-center mb-4">Catálogo de Productos Lácteos</h2>
            
            <!-- Filtros de Categorías -->
            <div class="d-flex justify-content-center gap-2 flex-wrap mb-4" id="contenedorFiltros">
                <button class="btn btn-success btn-filtro active" data-categoria="todas">Todos</button>
                ${categorias.map(cat => `
                    <button class="btn btn-outline-success btn-filtro" data-categoria="${escapeHTML(cat.nombre)}">
                        ${escapeHTML(cat.nombre)}
                    </button>
                `).join('')}
            </div>

            <!-- Grilla de Productos -->
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" id="contenedorProductos">
                ${ProductGrid(productos, "./")}
            </div>
        </div>
    `;

    // Eventos de Filtrado
    setTimeout(() => {
        const contenedorFiltros = document.getElementById("contenedorFiltros");
        const contenedorProductos = document.getElementById("contenedorProductos");

        if (contenedorFiltros) {
            contenedorFiltros.addEventListener("click", (e) => {
                if (!e.target.classList.contains("btn-filtro")) return;

                document.querySelectorAll(".btn-filtro").forEach(b => {
                    b.classList.remove("active", "btn-success");
                    b.classList.add("btn-outline-success");
                });
                e.target.classList.add("active", "btn-success");

                const cat = e.target.dataset.categoria;
                if (cat === "todas") {
                    contenedorProductos.innerHTML = ProductGrid(productos, "./");
                } else {
                    const filtrados = productos.filter(p => p.categoria === cat);
                    contenedorProductos.innerHTML = ProductGrid(filtrados, "./");
                }
            });
        }

        if (contenedorProductos) {
            contenedorProductos.addEventListener("click", (e) => {
                const button = e.target.closest(".btn-agregar-carrito");
                if (!button) return;
                const producto = productos.find(item => item.id === button.dataset.productoId);
                if (!producto) return;
                cartService.addItem(producto);
                const original = button.innerHTML;
                button.innerHTML = '<i class="bi bi-check2 me-1"></i>Agregado';
                button.disabled = true;
                window.setTimeout(() => {
                    button.innerHTML = original;
                    button.disabled = false;
                }, 900);
            });
        }
    }, 0);

    return html;
}