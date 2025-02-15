// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
 
    apiKey: "AIzaSyA_e983VtxfgBl7uNCTcYd3C1B_8Us0MV8",
    authDomain: "sky-hire.firebaseapp.com",
    projectId: "sky-hire",
    storageBucket: "sky-hire.firebasestorage.app",
    messagingSenderId: "308333462828",
    appId: "1:308333462828:web:5213d30a13f05876735889",
    measurementId: "G-6H47DBRGPQ"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;