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

            filteredProducts: [],

            search: "",

            loading: true,

            error: null

        };

    },


    async mounted() {

        try {

            this.products =
                await getProducts();

            this.filteredProducts =
                this.products;

        } catch (error) {

            console.error(error);

            this.error =
                "No se pudieron cargar los productos.";

        } finally {

            this.loading = false;

        }

    },


    methods: {

        filterProducts() {

            const term =
                this.search
                    .trim()
                    .toLowerCase();


            if (!term) {

                this.filteredProducts =
                    this.products;

                return;

            }


            this.filteredProducts =
                this.products.filter(product => {

                    const name =
                        product.nombre
                            ?.toLowerCase() || "";

                    const brand =
                        product.marca
                            ?.toLowerCase() || "";

                    return (
                        name.includes(term) ||
                        brand.includes(term)
                    );

                });

        }

    },


    template: `

        <div>

            <Header />


            <main class="products-page">

                <div class="container">


                    <div class="products-page__header">

                        <span>
                            CATÁLOGO
                        </span>

                        <h1>
                            Todos nuestros productos
                        </h1>

                        <p>
                            Explora nuestro catálogo.
                        </p>

                    </div>


                    <div class="products-toolbar">

                        <input
                            v-model="search"
                            @input="filterProducts"
                            type="search"
                            placeholder="Buscar producto..."
                            class="products-search"
                        />


                        <span>

                            {{ filteredProducts.length }}
                            productos

                        </span>

                    </div>


                    <Loading
                        v-if="loading"
                        message="Cargando catálogo..."
                    />


                    <div
                        v-else-if="error"
                        class="error-message"
                    >

                        {{ error }}

                    </div>


                    <div
                        v-else-if="filteredProducts.length === 0"
                        class="empty-message"
                    >

                        No encontramos productos.

                    </div>


                    <ProductGrid
                        v-else
                        :products="filteredProducts"
                    />


                </div>

            </main>


            <Footer />

        </div>

    `

};