// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 👈 Ajout

const firebaseConfig = {
  apiKey: "AIzaSyALZbGoTOWGYqZScjmPOL6K0hem4mPMko4",
  authDomain: "agendadecaho-29b53.firebaseapp.com",
  projectId: "agendadecaho-29b53",
  storageBucket: "agendadecaho-29b53.firebasestorage.app",
  messagingSenderId: "653088457224",
  appId: "1:653088457224:web:d994e32491b2a963afc7bd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // 👈 Export de auth
