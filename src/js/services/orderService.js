import { db } from "../firebase/config.js";
import { getItems, createItem, updateItem } from "./crudService.js";
import { COLECCIONES } from "../utils/constants.js";
import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const obtenerPedidos = async () => {
    const pedidos = await getItems(COLECCIONES.PEDIDOS);
    return pedidos.sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn));
};

export const obtenerPedidosPorUsuario = async (uid) => {
    try {
        const consulta = query(
            collection(db, COLECCIONES.PEDIDOS),
            where("usuarioId", "==", uid)
        );
        const snapshot = await getDocs(consulta);
        return snapshot.docs.map(documento => ({
            ...documento.data(),
            id: documento.id
        }));
    } catch (error) {
        console.error("Error de Firebase al consultar los pedidos del usuario:", error);
        throw error;
    }
};

export const crearPedido = (pedido) => createItem(COLECCIONES.PEDIDOS, {
    ...pedido,
    estado: "Recibido",
    creadoEn: new Date().toISOString()
});

export const actualizarEstadoPedido = (id, estado) =>
    updateItem(COLECCIONES.PEDIDOS, id, { estado });