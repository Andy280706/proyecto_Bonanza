import { getItems, getItemById, createItem, deleteItem } from "./crudService.js";
import { COLECCIONES } from "../utils/constants.js";

export const obtenerProductos = () => getItems(COLECCIONES.PRODUCTOS);
export const obtenerProductoPorId = (id) => getItemById(COLECCIONES.PRODUCTOS, id);
export const crearProducto = (data) => createItem(COLECCIONES.PRODUCTOS, data);
export const eliminarProducto = (id) => deleteItem(COLECCIONES.PRODUCTOS, id);