import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMtFe0M69-puSlL2UMbPsbleTnxS7uBsU",
  authDomain: "test-6059a.firebaseapp.com",
  projectId: "test-6059a",
  storageBucket: "test-6059a.firebasestorage.app",
  messagingSenderId: "260946442221",
  appId: "1:260946442221:web:66c83a539fd263550859e4",
  measurementId: "G-M3HT40EJP5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
