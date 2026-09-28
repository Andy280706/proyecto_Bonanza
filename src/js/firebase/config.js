import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDd92abtSNQK0EnL76Dux0sn1bq7fR_g70",
  authDomain: "proyecto-bonanza-e0fa3.firebaseapp.com",
  projectId: "proyecto-bonanza-e0fa3",
  storageBucket: "proyecto-bonanza-e0fa3.firebasestorage.app",
  messagingSenderId: "1064243018142",
  appId: "1:1064243018142:web:4ee1f7ef6bcab7be55fe8f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);