import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCw4RCLmLVOzFspUas7Dns6hJz_9_VotKg",
  authDomain: "meetflow-7bc82.firebaseapp.com",
  projectId: "meetflow-7bc82",
  storageBucket: "meetflow-7bc82.firebasestorage.app",
  messagingSenderId: "696376085426",
  appId: "1:696376085426:web:62b42d7ddf22abfd36f2ab"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();