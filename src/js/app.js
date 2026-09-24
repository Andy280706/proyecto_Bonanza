import {
    createApp
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";


import HomeView
    from "./views/HomeView.js";

import ProductsView
    from "./views/ProductsView.js";

import ProductDetailView
    from "./views/ProductDetailView.js";


// Determinar página actual

const page =
    document.body.dataset.page;


// Seleccionar View

let View;


switch (page) {

    case "home":

        View = HomeView;

        break;


    case "productos":

        View = ProductsView;

        break;


    case "producto":

        View = ProductDetailView;

        break;


    default:

        View = HomeView;

}


// Iniciar Vue

createApp(View)
    .mount("#app");