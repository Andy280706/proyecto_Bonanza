import { formatCurrency } from "../utils/formatCurrency.js";

export default {
    props: {
        product: {
            type: Object,
            required: true
        }
    },
    methods: {
        formatPrice(value) {
            return formatCurrency(value);
        }
    },

    template: `
        <article class="product-card">
            <a
                :href="'/pages/producto.html?id=' + product.id"
                class="product-card__image"
            >
                <img
                    :src="product.imagenPrincipal || 'https://placehold.co/600x600?text=Producto'"
                    :alt="product.nombre"
                >
            </a>
            <div class="product-card__content">
                <span
                    v-if="product.marca"
                    class="product-card__brand"
                >
                    {{ product.marca }}
                </span>
                <h3 class="product-card__title">
                    <a
                        :href="'/pages/producto.html?id=' + product.id"
                    >
                        {{ product.nombre }}
                    </a>
                </h3>
                <div class="product-card__price">
                    {{ formatPrice(product.precio) }}
                </div>
                <div
                    v-if="product.precioAnterior"
                    class="product-card__old-price"
                >
                    {{ formatPrice(product.precioAnterior) }}
                </div>
                <a
                    :href="'/pages/producto.html?id=' + product.id"
                    class="btn btn-primary product-card__button"
                >
                    Ver producto
                </a>
            </div>
        </article>
    `
};