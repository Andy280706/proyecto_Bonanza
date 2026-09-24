import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "../firebase/config.js";

const COLLECTION_NAME = "productos";

export async function getProducts() {
    const reference =
        collection(db, COLLECTION_NAME);
    const q = query(
        reference,
        where("activo", "==", true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(document => ({
        id: document.id,
        ...document.data()
    }));
}

export async function getAllProducts() {
    const reference =
        collection(db, COLLECTION_NAME);
    const snapshot =
        await getDocs(reference);
    return snapshot.docs.map(document => ({
        id: document.id,
        ...document.data()
    }));
}

export async function getProductById(id) {
    const reference =
        doc(db, COLLECTION_NAME, id);
    const snapshot =
        await getDoc(reference);
    if (!snapshot.exists()) {
        return null;
    }
    return {
        id: snapshot.id,
        ...snapshot.data()
    };
}