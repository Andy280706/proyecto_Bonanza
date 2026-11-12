import { db } from "../firebase/config.js";
import { getItems, getItemById, createItem, deleteItem } from "./crudService.js";
import { COLECCIONES } from "../utils/constants.js";
import {
    collection, getDocs, limit, query, where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const PRODUCTOS_CACHE_KEY = "bonanza_productos_cache";

const invalidarCacheProductos = () => sessionStorage.removeItem(PRODUCTOS_CACHE_KEY);

const normalizarProducto = (producto, id = producto?.id) => {
    const data = typeof producto?.data === "function" ? producto.data() : producto;

    return {
        ...data,
        id: id ?? data.id ?? "",
        nombre: data.nombre ?? data.name ?? data.title ?? "",
        precio: data.precio ?? data.price ?? 0,
        categoria: data.categoria ?? data.category ?? "",
        imagen: data.imagen ?? data.imagenUrl ?? data.imageUrl ?? data.image ?? "",
        descripcion: data.descripcion ?? data.description ?? ""
    };
};

export const obtenerProductos = async () => {
    const productosCache = sessionStorage.getItem(PRODUCTOS_CACHE_KEY);
    if (productosCache) {
        try {
            const productos = JSON.parse(productosCache);
            if (Array.isArray(productos)) {
                const normalizados = productos.map(producto => normalizarProducto(producto));
                sessionStorage.setItem(PRODUCTOS_CACHE_KEY, JSON.stringify(normalizados));
                return normalizados;
            }
        } catch {
            invalidarCacheProductos();
        }
    }

    const productos = (await getItems(COLECCIONES.PRODUCTOS)).map(producto => normalizarProducto(producto));
    sessionStorage.setItem(PRODUCTOS_CACHE_KEY, JSON.stringify(productos));
    return productos;
};

export const obtenerProductosDestacados = async (limite = 4) => {
    try {
        const consulta = query(collection(db, "productos"), limit(limite));
        const snap = await getDocs(consulta);
        return snap.docs.map(d => normalizarProducto(d.data(), d.id));
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
        return snap.docs.map(d => normalizarProducto(d.data(), d.id));
    } catch (error) {
        console.error("Error de Firebase al consultar productos por categoría:", error);
        throw error;
    }
};

export const obtenerProductoPorId = async (id) => {
    const producto = await getItemById(COLECCIONES.PRODUCTOS, id);
    return producto ? normalizarProducto(producto) : null;
};
export const crearProducto = async (data) => {
    const id = await createItem(COLECCIONES.PRODUCTOS, data);
    invalidarCacheProductos();
    return id;
};
export const eliminarProducto = async (id) => {
    await deleteItem(COLECCIONES.PRODUCTOS, id);
    invalidarCacheProductos();
};