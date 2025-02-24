// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTYO2ONBj8jMSk3eoAyhJhRQn3OyNKdNg",
  authDomain: "zvertexai.firebaseapp.com",
  projectId: "zvertexai",
  storageBucket: "zvertexai.firebasestorage.app",
  messagingSenderId: "318652417482",
  appId: "1:318652417482:web:b3adb0a19e6da80070bb33"
};

// Initialize Firebase


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, uploadBytes };