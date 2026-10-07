import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "admin.html"),
        productos: resolve(__dirname, "src/pages/productos.html"),
        producto: resolve(__dirname, "src/pages/producto.html"),
        carrito: resolve(__dirname, "src/pages/carrito.html"),
      },
    },
  },
});