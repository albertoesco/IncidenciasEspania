import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC-fo6bMF1sDefJasnWHuztj32xl38gzlo",
  authDomain: "incidencias-a2746.firebaseapp.com",
  projectId: "incidencias-a2746",
  storageBucket: "incidencias-a2746.appspot.com",
  messagingSenderId: "704021114823",
  appId: "1:704021114823:web:7ed6325585ab6a8763b3e2"
};

const appFirebase = initializeApp(firebaseConfig);

const db = getFirestore(appFirebase);

const auth = getAuth(appFirebase);

const storage = getStorage(appFirebase);

export { appFirebase, db, auth, storage };
