
//Firebase is a product of Google which helps developers to build, manage, and grow their apps easily. It helps developers to build their apps faster and in a more secure way. 


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use -- and they are authentication and firebase database
// https://firebase.google.com/docs/web/setup#available-libraries
import { GoogleAuthProvider , getAuth } from "firebase/auth";         //this is used for authentication using google.
import { getFirestore , doc , setDoc } from "firebase/firestore";     // this is for authentication using email and password


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsLoSIDbPO6IeHqk57l_qIKv3jVow1uHI",
  authDomain: "expense-tracker-91b78.firebaseapp.com",
  projectId: "expense-tracker-91b78",
  storageBucket: "expense-tracker-91b78.firebasestorage.app",
  messagingSenderId: "60872678389",
  appId: "1:60872678389:web:b9392a7accf83e8d9edebc",
  measurementId: "G-TW6BQY5RCZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig );
const analytics = getAnalytics(app);
const db = getFirestore(app) ;
const auth = getAuth(app) ;
const provider = new GoogleAuthProvider() ;

export {db , auth , provider , doc , setDoc} ;