// Importa las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Corrige la importación del módulo de almacenamiento de Firebase

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

// Obtiene una instancia de Storage
const storage = getStorage(appFirebase); // Corrige la obtención de la instancia de Storage

// Exporta la instancia de la aplicación, Firestore y Storage para usarlas en otros archivos
export { appFirebase, db, auth, storage };
