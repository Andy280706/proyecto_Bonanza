import { ProductCard } from "./ProductCard.js";

export function ProductGrid(productos, rutaBase = "") {
    if (!productos || productos.length === 0) {
        return `
            <div class="col-12 text-center text-muted py-5">
                <h5>No se encontraron productos en esta categoría.</h5>
            </div>
        `;
    }

    return productos.map(prod => ProductCard(prod, rutaBase)).join('');
}