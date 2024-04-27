import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQZVL3bFE9ObKfIjbHcmgV_JGvnoo14XA",
  authDomain: "healthcare-77225.firebaseapp.com",
  databaseURL: "https://healthcare-77225-default-rtdb.firebaseio.com/",
  projectId: "healthcare-77225",
  storageBucket: "healthcare-77225.appspot.com",
  messagingSenderId: "718428462129",
  appId: "1:718428462129:web:dad83caa6b29af7b110910",
  measurementId: "G-JFSB56V33M"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // if already initialized, use that one
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };