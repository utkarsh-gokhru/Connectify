// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// import {getStorage} from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAQlmQaTnC2uK0DiYB55gQchSIojT6wMhQ",
  authDomain: "connectify-7ec8b.firebaseapp.com",
  projectId: "connectify-7ec8b",
  storageBucket: "connectify-7ec8b.appspot.com",
  messagingSenderId: "364222400079",
  appId: "1:364222400079:web:79635f6b238b4687c1cc3a",
  measurementId: "G-64B26Z4PBM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export { auth, signInWithGoogle };