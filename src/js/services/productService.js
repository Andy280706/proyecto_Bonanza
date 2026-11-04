import { db } from "../firebase/config.js";
import { getItems, getItemById, createItem, deleteItem } from "./crudService.js";
import { COLECCIONES } from "../utils/constants.js";
import {
    collection, getDocs, limit, query, where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const PRODUCTOS_CACHE_KEY = "bonanza_productos_cache";

const invalidarCacheProductos = () => sessionStorage.removeItem(PRODUCTOS_CACHE_KEY);

export const obtenerProductos = async () => {
    const productosCache = sessionStorage.getItem(PRODUCTOS_CACHE_KEY);
    if (productosCache) {
        try {
            const productos = JSON.parse(productosCache);
            if (Array.isArray(productos)) return productos;
        } catch {
            invalidarCacheProductos();
        }
    }

    const productos = await getItems(COLECCIONES.PRODUCTOS);
    sessionStorage.setItem(PRODUCTOS_CACHE_KEY, JSON.stringify(productos));
    return productos;
};

export const obtenerProductosDestacados = async (limite = 4) => {
    try {
        const consulta = query(collection(db, "productos"), limit(limite));
        const snap = await getDocs(consulta);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
        console.error("Error de Firebase al consultar productos destacados:", error);
        throw error;
    }
};

export const obtenerProductosPorCategoria = async (categoria) => {
    try {
        const consulta = query(
            collection(db, "productos"),
            where("categoria", "==", categoria)
        );
        const snap = await getDocs(consulta);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
        console.error("Error de Firebase al consultar productos por categoría:", error);
        throw error;
    }
};

export const obtenerProductoPorId = (id) => getItemById(COLECCIONES.PRODUCTOS, id);
export const crearProducto = async (data) => {
    const id = await createItem(COLECCIONES.PRODUCTOS, data);
    invalidarCacheProductos();
    return id;
};
export const eliminarProducto = async (id) => {
    await deleteItem(COLECCIONES.PRODUCTOS, id);
    invalidarCacheProductos();
};