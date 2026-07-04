
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-6ada5.firebaseapp.com",
  projectId: "interviewiq-6ada5",
  storageBucket: "interviewiq-6ada5.firebasestorage.app",
  messagingSenderId: "651885163400",
  appId: "1:651885163400:web:d84f70b2d1ffe0427c803d"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}