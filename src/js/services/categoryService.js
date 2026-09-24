import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "../firebase/config.js";

const COLLECTION_NAME = "categorias";
export async function getCategories() {
    const reference =
        collection(db, COLLECTION_NAME);

    const q = query(
        reference,
        where("activo", "==", true)
    );

    const snapshot =
        await getDocs(q);

    return snapshot.docs.map(document => ({
        id: document.id,
        ...document.data()
    }));
}