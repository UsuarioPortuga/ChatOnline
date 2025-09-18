// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1GSyO1dhOI33tDtQgG3iW4RbYJOIkRpc",
  authDomain: "meu-chat-online-231ba.firebaseapp.com",
  projectId: "meu-chat-online-231ba",
  storageBucket: "meu-chat-online-231ba.appspot.com",
  messagingSenderId: "857546069238",
  appId: "1:857546069238:web:a3aa95aa64cd50ab6588d7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
