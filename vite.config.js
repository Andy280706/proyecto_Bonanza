import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "src/pages/admin/index.html"),
        productos: resolve(__dirname, "src/pages/productos.html"),
        producto: resolve(__dirname, "src/pages/producto.html"),
        carrito: resolve(__dirname, "src/pages/carrito.html"),
        pedidos: resolve(__dirname, "src/pages/pedidos.html"),
        login: resolve(__dirname, "src/pages/login.html"),
        registro: resolve(__dirname, "src/pages/registro.html"),
      },
    },
  },
});