import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCN80VJw2wPKZpZnMdkKu4JuKw9dqwsfhk",
  authDomain: "mu-komik.firebaseapp.com",
  projectId: "mu-komik",
  storageBucket: "mu-komik.firebasestorage.app",
  messagingSenderId: "880724806230",
  appId: "1:880724806230:web:94c478a14f473ee61889f7",
  measurementId: "G-XG2L641N1P"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

export { app, auth, db, storage }; 