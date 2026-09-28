import { getItems, createItem, deleteItem } from "./crudService.js";
import { COLECCIONES } from "../utils/constants.js";

export const obtenerContactos = () => getItems(COLECCIONES.CONTACTOS);
export const crearContacto = (data) => createItem(COLECCIONES.CONTACTOS, data);
export const eliminarContacto = (id) => deleteItem(COLECCIONES.CONTACTOS, id);