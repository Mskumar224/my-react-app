// src/firebaseConfig.js

import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Firebase configuration (replace these with your actual Firebase project details)
const firebaseConfig = {
    apiKey: "AIzaSyA2CGsNHwclRPoyEAfQmuLKt8XEkX-V858",
    authDomain: "my-react-app-df542.firebaseapp.com",
    projectId: "my-react-app-df542",
    storageBucket: "my-react-app-df542.firebasestorage.app",
    messagingSenderId: "97547575971",
    appId: "1:97547575971:web:38dedd95dd209527da9516"
  };

// Check if Firebase app is already initialized, if not, initialize it
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase services
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };
