// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1tT2AGuPSrFVcQZECwTn-3fceR0yfY3M",
  authDomain: "pantryapp-6955e.firebaseapp.com",
  projectId: "pantryapp-6955e",
  storageBucket: "pantryapp-6955e.appspot.com",
  messagingSenderId: "867661313322",
  appId: "1:867661313322:web:2411ba659125a0e68f9a53",
  measurementId: "G-X243DLFCJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}