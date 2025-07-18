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

console.log('Initializing Firebase...')
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
console.log('Firebase app initialized:', app.name)

const auth = getAuth(app);
console.log('Firebase auth initialized')

const db = getFirestore(app);
console.log('Firestore initialized')

const storage = getStorage(app);
console.log('Storage initialized')

export { app, auth, db, storage }; 