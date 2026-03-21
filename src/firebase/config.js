// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrycdXZ4ADHoCl5Wch7FYXB4p5c4EZX3U",
  authDomain: "nfc-worship-app.firebaseapp.com",
  projectId: "nfc-worship-app",
  storageBucket: "nfc-worship-app.firebasestorage.app",
  messagingSenderId: "766869568873",
  appId: "1:766869568873:web:2f61a59ff5cf87f2dd91f8",
  measurementId: "G-TKCE2J1CQ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
let messaging = null;

// Check if messaging is supported before initializing
isSupported().then(supported => {
  if (supported) {
    messaging = getMessaging(app);
    console.log('Firebase Messaging is supported and initialized');
  } else {
    console.log('Firebase Messaging is not supported in this browser');
  }
}).catch(err => {
  console.error('Error checking Firebase Messaging support:', err);
});

export { messaging, getToken, onMessage, isSupported };