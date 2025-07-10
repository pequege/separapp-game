import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Reemplaza estos valores con los de tu proyecto Firebase
const firebaseConfig = {

  apiKey: "AIzaSyCuajz1xBx-eziO886ECtGXV9f24oGYPp8",

  authDomain: "separapp-juego.firebaseapp.com",

  projectId: "separapp-juego",

  storageBucket: "separapp-juego.firebasestorage.app",

  messagingSenderId: "691625944139",

  appId: "1:691625944139:web:0350b1ca70b9bc5e38d9ce"

};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };