import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getDatabase} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAVysMLJO-ALOCqPsIfv1klWzFEwTqTlRE",
  authDomain: "skillupplus2030.firebaseapp.com",
  projectId: "skillupplus2030",
  storageBucket: "skillupplus2030.firebasestorage.app",
  messagingSenderId: "1070802324144",
  appId: "1:1070802324144:web:16fb212bb55c6315ff8975",
  databaseURL: "https://skillupplus2030-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);

