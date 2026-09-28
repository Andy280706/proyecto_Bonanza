import { defineConfig } from "vite";

export default defineConfig({
    build: {
        rollupOptions: {
            input: [
                "index.html",
                "admin.html",
                "src/pages/productos.html",
                "src/pages/producto.html"
            ]
        }
    }
});