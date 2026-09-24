import Header
    from "../components/Header.js";

import Footer
    from "../components/Footer.js";

import Loading
    from "../components/Loading.js";

import {
    getProductById
} from "../services/productService.js";

import {
    formatCurrency
} from "../utils/formatCurrency.js";


export default {

    components: {

        Header,

        Footer,

        Loading

    },


    data() {

        return {

            product: null,

            loading: true,

            error: null

        };

    },


    async mounted() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const id =
            params.get("id");


        if (!id) {

            this.error =
                "Producto no especificado.";

            this.loading = false;

            return;

        }


        try {

            this.product =
                await getProductById(id);


            if (!this.product) {

                this.error =
                    "El producto no existe.";

            }

        } catch (error) {

            console.error(error);

            this.error =
                "No se pudo cargar el producto.";

        } finally {

            this.loading = false;

        }

    },


    methods: {

        formatPrice(value) {

            return formatCurrency(value);

        }

    },


    template: `

        <div>

            <Header />


            <main class="product-detail-page">

                <div class="container">


                    <Loading
                        v-if="loading"
                        message="Cargando producto..."
                    />


                    <div
                        v-else-if="error"
                        class="error-message"
                    >

                        {{ error }}

                    </div>


                    <section
                        v-else
                        class="product-detail"
                    >


                        <div class="product-detail__image">

                            <img
                                :src="
                                    product.imagenPrincipal ||
                                    'https://placehold.co/800x800?text=Producto'
                                "
                                :alt="product.nombre"
                            >

                        </div>


                        <div class="product-detail__info">


                            <span
                                v-if="product.marca"
                                class="product-detail__brand"
                            >

                                {{ product.marca }}

                            </span>


                            <h1>
                                {{ product.nombre }}
                            </h1>


                            <div
                                class="product-detail__price"
                            >

                                {{ formatPrice(product.precio) }}

                            </div>


                            <div
                                v-if="product.precioAnterior"
                                class="product-detail__old-price"
                            >

                                Antes:
                                {{ formatPrice(product.precioAnterior) }}

                            </div>


                            <p
                                class="product-detail__description"
                            >

                                {{
                                    product.descripcion ||
                                    "Producto disponible en nuestra tienda."
                                }}

                            </p>


                            <div
                                v-if="product.stock !== undefined"
                                class="product-detail__stock"
                            >

                                Stock disponible:
                                <strong>
                                    {{ product.stock }}
                                </strong>

                            </div>


                            <button
                                class="btn btn-primary product-detail__button"
                            >

                                Agregar al carrito

                            </button>


                        </div>


                    </section>


                </div>

            </main>


            <Footer />

        </div>

    `

};