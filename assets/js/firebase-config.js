// Firebase Configuration - SECURE VERSION
// This file uses environment variables that are injected during build/deployment
// Never commit actual API keys to version control!

const firebaseConfig = {
    apiKey: window.FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
    authDomain: window.FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
    projectId: window.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
    storageBucket: window.FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: window.FIREBASE_APP_ID || process.env.FIREBASE_APP_ID
};

// Initialize Firebase only if config is properly set
let db = null;
const isConfigValid = firebaseConfig.apiKey && 
                     firebaseConfig.authDomain && 
                     firebaseConfig.projectId;

if (isConfigValid) {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log("Firebase initialized successfully");
    } catch (error) {
        console.error("Firebase initialization error:", error);
        // Fallback to demo mode
        console.log("Falling back to demo mode");
    }
} else {
    console.log("Firebase not configured - using demo mode");
    console.log("To enable Firebase, set environment variables or configure in deployment");
}

// Export for use in main.js
window.firebaseDB = db;
