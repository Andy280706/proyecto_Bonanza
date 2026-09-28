import { db } from "../firebase/config.js";
import { 
    collection, getDocs, addDoc, doc, deleteDoc, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const getItems = async (col) => {
    const snap = await getDocs(collection(db, col));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getItemById = async (col, id) => {
    const snap = await getDoc(doc(db, col, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const createItem = async (col, data) => (await addDoc(collection(db, col), data)).id;

export const updateItem = (col, id, data) => updateDoc(doc(db, col, id), data);

export const deleteItem = (col, id) => deleteDoc(doc(db, col, id));