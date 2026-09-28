import { getItems, createItem, updateItem, deleteItem } from "./crudService.js";
import { COLECCIONES } from "../utils/constants.js";

export const obtenerCategorias = () => getItems(COLECCIONES.CATEGORIAS);
export const crearCategoria = (data) => createItem(COLECCIONES.CATEGORIAS, data);
export const actualizarCategoria = (id, data) => updateItem(COLECCIONES.CATEGORIAS, id, data);
export const eliminarCategoria = (id) => deleteItem(COLECCIONES.CATEGORIAS, id);