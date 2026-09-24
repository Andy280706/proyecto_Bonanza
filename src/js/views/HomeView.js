import Header
    from "../components/Header.js";

import Footer
    from "../components/Footer.js";

import ProductGrid
    from "../components/ProductGrid.js";

import Loading
    from "../components/Loading.js";

import {
    getProducts
} from "../services/productService.js";


export default {

    components: {

        Header,

        Footer,

        ProductGrid,

        Loading

    },


    data() {

        return {

            products: [],

            loading: true,

            error: null

        };

    },


    async mounted() {

        try {

            const products =
                await getProducts();

            this.products =
                products.slice(0, 8);

        } catch (error) {

            console.error(error);

            this.error =
                "No se pudieron cargar los productos.";

        } finally {

            this.loading = false;

        }

    },


    template: `

        <div>

            <Header />


            <main>


                <section class="hero">

                    <div class="container hero__content">

                        <div>

                            <span class="hero__eyebrow">
                                TIENDA ONLINE
                            </span>

                            <h1>
                                Encuentra lo que necesitas
                            </h1>

                            <p>
                                Descubre nuestros productos
                                y compra de manera rápida
                                y sencilla.
                            </p>

                            <a
                                href="/pages/productos.html"
                                class="btn btn-primary"
                            >

                                Ver productos

                            </a>

                        </div>

                    </div>

                </section>


                <section class="container home-products">

                    <div class="section-heading">

                        <div>

                            <span>
                                NUESTRA TIENDA
                            </span>

                            <h2>
                                Productos destacados
                            </h2>

                        </div>


                        <a
                            href="/pages/productos.html"
                        >

                            Ver todos

                        </a>

                    </div>


                    <Loading
                        v-if="loading"
                        message="Cargando productos..."
                    />


                    <div
                        v-else-if="error"
                        class="error-message"
                    >

                        {{ error }}

                    </div>


                    <ProductGrid
                        v-else
                        :products="products"
                    />


                </section>


            </main>


            <Footer />

        </div>

    `
};