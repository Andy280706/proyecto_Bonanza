import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "../firebase/config.js";

const form = document.getElementById("login-form");
const msg = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, email.value.trim(), password.value);
    msg.innerHTML = '<div class="alert success">Inicio de sesión correcto.</div>';
    setTimeout(()=>location.href="./productos.html",700);
  } catch (err) {
    console.error(err);
    msg.innerHTML = '<div class="alert error">No se pudo iniciar sesión. Verifica tus datos.</div>';
  }
});