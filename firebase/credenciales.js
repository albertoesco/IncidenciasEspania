// Importa las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Agrega esta importación

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC-fo6bMF1sDefJasnWHuztj32xl38gzlo",
  authDomain: "incidencias-a2746.firebaseapp.com",
  projectId: "incidencias-a2746",
  storageBucket: "incidencias-a2746.appspot.com",
  messagingSenderId: "704021114823",
  appId: "1:704021114823:web:7ed6325585ab6a8763b3e2"
};

// Inicializa tu app de Firebase
const appFirebase = initializeApp(firebaseConfig);

// Obtiene una instancia de Firestore
const db = getFirestore(appFirebase);

// Obtiene una instancia de Authentication
const auth = getAuth(appFirebase);

export { appFirebase, db, auth }; // Exporta la instancia de la aplicación y de Firestore para usarlas en otros archivos
