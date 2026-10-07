import { db } from "../firebase/config.js";
import { 
    collection, getDocs, addDoc, doc, deleteDoc, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function ejecutarConsultaFirebase(accion, consulta) {
    try {
        return await consulta();
    } catch (error) {
        console.error(`Error de Firebase al ${accion}:`, error);
        throw error;
    }
}

export const getItems = (col) => ejecutarConsultaFirebase(`consultar ${col}`, async () => {
    const snap = await getDocs(collection(db, col));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
});

export const getItemById = (col, id) => ejecutarConsultaFirebase(`consultar un elemento de ${col}`, async () => {
    const snap = await getDoc(doc(db, col, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
});

export const createItem = (col, data) => ejecutarConsultaFirebase(`crear un elemento en ${col}`, async () =>
    (await addDoc(collection(db, col), data)).id
);

export const updateItem = (col, id, data) => ejecutarConsultaFirebase(`actualizar un elemento de ${col}`, () =>
    updateDoc(doc(db, col, id), data)
);

export const deleteItem = (col, id) => ejecutarConsultaFirebase(`eliminar un elemento de ${col}`, () =>
    deleteDoc(doc(db, col, id))
);