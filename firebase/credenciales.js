// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import 'firebase/storage';
import 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-fo6bMF1sDefJasnWHuztj32xl38gzlo",
  authDomain: "incidencias-a2746.firebaseapp.com",
  projectId: "incidencias-a2746",
  storageBucket: "incidencias-a2746.appspot.com",
  messagingSenderId: "704021114823",
  appId: "1:704021114823:web:7ed6325585ab6a8763b3e2"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);
export default appFirebase;