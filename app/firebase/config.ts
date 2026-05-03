// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHdZRhsoDrCPkIPni-cxSWKbaboE6VLGw",
  authDomain: "techcoderio.firebaseapp.com",
  projectId: "techcoderio",
  storageBucket: "techcoderio.firebasestorage.app",
  messagingSenderId: "50918114363",
  appId: "1:50918114363:web:65afa486936f071a2a881e",
  measurementId: "G-VV5T1ZNPV7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);