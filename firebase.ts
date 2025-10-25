// Fix: Use firebase/compat/app to support v8 namespaced API and fix import errors.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Your web app's Firebase configuration
// IMPORTANT: You MUST replace these placeholder values with your own Firebase project configuration for the app to work.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Safely initialize Firebase to prevent re-initialization errors
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get the auth service for the specific app instance
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
