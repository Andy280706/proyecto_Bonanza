import ProductCard from "./ProductCard.js";

export default {
    components: {
        ProductCard
    },
    
    props: {
        products: {
            type: Array,
            required: true
        }
    },

    template: `
        <div class="product-grid">
            <ProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
            />
        </div>
    `
};