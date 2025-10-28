// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBb4rsRpuusF68VYyaxB--QRRGq4URuI-A",
  authDomain: "lumigram-1bb69.firebaseapp.com",
  projectId: "lumigram-1bb69",
  storageBucket: "lumigram-1bb69.firebasestorage.app",
  messagingSenderId: "149378604263",
  appId: "1:149378604263:web:77fb423917104ae84a9642"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});