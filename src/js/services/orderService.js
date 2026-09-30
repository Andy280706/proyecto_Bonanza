import { getItems, createItem, updateItem } from "./crudService.js";
import { COLECCIONES } from "../utils/constants.js";

export const obtenerPedidos = async () => {
    const pedidos = await getItems(COLECCIONES.PEDIDOS);
    return pedidos.sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn));
};

export const crearPedido = (pedido) => createItem(COLECCIONES.PEDIDOS, {
    ...pedido,
    estado: "Recibido",
    creadoEn: new Date().toISOString()
});

export const actualizarEstadoPedido = (id, estado) =>
    updateItem(COLECCIONES.PEDIDOS, id, { estado });