import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from "../firebase/config.js";

const form = document.getElementById("registro-form");
const msg = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (password.value !== confirmar.value) {
    msg.innerHTML = '<div class="alert error">Las contraseñas no coinciden.</div>';
    return;
  }
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.value.trim(), password.value);
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nombre: nombre.value.trim(),
      email: email.value.trim(),
      rol: "cliente",
      fechaCreacion: serverTimestamp()
    });
    msg.innerHTML = '<div class="alert success">Cuenta creada correctamente.</div>';
    setTimeout(()=>location.href="./productos.html",700);
  } catch (err) {
    console.error(err);
    msg.innerHTML = '<div class="alert error">No se pudo crear la cuenta. Revisa el correo y la contraseña.</div>';
  }
});