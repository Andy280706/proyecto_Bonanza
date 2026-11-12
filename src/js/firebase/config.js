import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  enableIndexedDbPersistence, getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCF7bdyPVTAE2iQ9KYc0CDdUs0g4ju2xaU",
  authDomain: "proyect-bonanza.firebaseapp.com",
  projectId: "proyect-bonanza",
  storageBucket: "proyect-bonanza.firebasestorage.app",
  messagingSenderId: "609672770932",
  appId: "1:609672770932:web:3049b171e415b7d613a821"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((error) => {
  console.warn("No se pudo habilitar la persistencia offline de Firestore:", error);
});