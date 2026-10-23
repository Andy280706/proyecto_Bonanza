import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from "../firebase/config.js";

const form = document.getElementById("registro-form");
const msg = document.getElementById("mensaje");
const nombreInput = document.getElementById("nombre");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmarInput = document.getElementById("confirmar");

function mensajeErrorRegistro(error) {
  const mensajes = {
    "auth/invalid-email": "El correo electrónico no tiene un formato válido.",
    "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
    "auth/weak-password": "La contraseña es demasiado débil. Usa al menos 6 caracteres.",
    "auth/operation-not-allowed": "El registro por correo y contraseña no está habilitado.",
    "auth/network-request-failed": "No se pudo conectar. Comprueba tu conexión."
  };

  return mensajes[error.code] || error.message || "No se pudo crear la cuenta.";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (passwordInput.value !== confirmarInput.value) {
    msg.innerHTML = '<div class="alert alert-danger">Las contraseñas no coinciden.</div>';
    return;
  }
  try {
    const cred = await createUserWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nombre: nombreInput.value.trim(),
      email: emailInput.value.trim(),
      rol: "cliente",
      fechaCreacion: serverTimestamp()
    });
    msg.innerHTML = '<div class="alert alert-success">Cuenta creada correctamente.</div>';
    setTimeout(()=>location.href="./productos.html",700);
  } catch (err) {
    console.error(err);
    msg.replaceChildren();
    const alert = document.createElement("div");
    alert.className = "alert alert-danger";
    alert.textContent = mensajeErrorRegistro(err);
    msg.append(alert);
  }
});