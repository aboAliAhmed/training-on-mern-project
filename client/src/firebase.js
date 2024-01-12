// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mern-estate-a27.firebaseapp.com',
  projectId: 'mern-estate-a27',
  storageBucket: 'mern-estate-a27.appspot.com',
  messagingSenderId: '235739532141',
  appId: '1:235739532141:web:ef3ded720df41f3821e864',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
