import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "@firebase/auth";

/**
 * Configuration object for Firebase initialization.
 * Uses environment variables for security.
 */
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

/**
 * Initialize or retrieve the Firebase app instance.
 * Checks if an app has already been initialized to avoid duplicate instances.
 */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/**
 * Retrieve the authentication instance associated with the Firebase app.
 */
const auth = getAuth(app);

/**
 * Provider for Google authentication.
 */
const provider = new GoogleAuthProvider();

export {
    auth,
    provider
}