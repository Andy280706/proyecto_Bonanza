import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDkrRBS0JjiTArduSD71_dW05dLrnBcgSo",
    authDomain: "yancasaycoc.firebaseapp.com",
    projectId: "yancasaycoc",
    storageBucket: "yancasaycoc.firebasestorage.app",
    messagingSenderId: "695992987149",
    appId: "1:695992987149:web:c8f6e4e7c6281a568caf44"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { app, db };