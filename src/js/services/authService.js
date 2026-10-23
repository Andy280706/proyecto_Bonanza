import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "../firebase/config.js";

export async function obtenerPerfilUsuario(uid) {
    const usuario = await getDoc(doc(db, "usuarios", uid));
    return usuario.exists() ? usuario.data() : null;
}
