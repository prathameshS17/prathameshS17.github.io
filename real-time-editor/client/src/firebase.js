// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxxc2CEHj3zUOiPo2SLnLZzMBFfpozd58",
  authDomain: "real-time-editor-c4cbd.firebaseapp.com",
  projectId: "real-time-editor-c4cbd",
  storageBucket: "real-time-editor-c4cbd.firebasestorage.app",
  messagingSenderId: "483389772359",
  appId: "1:483389772359:web:cda6eb01fdfb0aff051762"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
