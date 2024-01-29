// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJihEBwP5V8X9xl8amSD1CnJlU_jSfkY4",
  authDomain: "fahitos-b1e00.firebaseapp.com",
  projectId: "fahitos-b1e00",
  storageBucket: "fahitos-b1e00.appspot.com",
  messagingSenderId: "678513268022",
  appId: "1:678513268022:web:31565eaa3cfabe99460f97",
  measurementId: "G-SZEVGK3ZXW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
