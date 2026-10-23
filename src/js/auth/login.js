import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "../firebase/config.js";

const form = document.getElementById("login-form");
const msg = document.getElementById("mensaje");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

function mensajeErrorLogin(error) {
  const mensajes = {
    "auth/invalid-email": "El correo electrónico no tiene un formato válido.",
    "auth/user-not-found": "No existe una cuenta con ese correo.",
    "auth/wrong-password": "La contraseña es incorrecta.",
    "auth/invalid-credential": "El correo o la contraseña son incorrectos.",
    "auth/user-disabled": "Esta cuenta está deshabilitada.",
    "auth/too-many-requests": "Hubo demasiados intentos. Inténtalo más tarde.",
    "auth/network-request-failed": "No se pudo conectar. Comprueba tu conexión."
  };

  return mensajes[error.code] || error.message || "No se pudo iniciar sesión.";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
    msg.innerHTML = '<div class="alert alert-success">Inicio de sesión correcto.</div>';
    setTimeout(() => location.href = "../../index.html", 700);
  } catch (err) {
    console.error(err);
    msg.replaceChildren();
    const alert = document.createElement("div");
    alert.className = "alert alert-danger";
    alert.textContent = mensajeErrorLogin(err);
    msg.append(alert);
  }
});