// Importa los métodos necesarios de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase con las credenciales del proyecto
const firebaseConfig = {
  apiKey: "AIzaSyC-fo6bMF1sDefJasnWHuztj32xl38gzlo",
  authDomain: "incidencias-a2746.firebaseapp.com",
  projectId: "incidencias-a2746",
  storageBucket: "incidencias-a2746.appspot.com",
  messagingSenderId: "704021114823",
  appId: "1:704021114823:web:7ed6325585ab6a8763b3e2"
};

// Inicializa la aplicación de Firebase con la configuración proporcionada
const appFirebase = initializeApp(firebaseConfig);

// Obtén una instancia de Firestore para la base de datos
const db = getFirestore(appFirebase);

// Obtén una instancia de Auth para la autenticación
const auth = getAuth(appFirebase);

// Obtén una instancia de Storage para el almacenamiento de archivos
const storage = getStorage(appFirebase);

// Exporta las instancias de Firebase para usarlas en otras partes de la aplicación
export { appFirebase, db, auth, storage };
