// Enhanced Firebase Configuration with Basic Obfuscation
// Note: This is NOT true security - it's just obfuscation to make it less obvious

class SecureFirebaseConfig {
    constructor() {
        this.config = null;
        this.initialized = false;
    }

    // Simple encoding/decoding (NOT encryption - just obfuscation)
    encode(str) {
        return btoa(str).split('').reverse().join('');
    }

    decode(str) {
        return atob(str.split('').reverse().join(''));
    }

    // Get configuration from environment or encoded fallback
    getConfig() {
        if (this.config) return this.config;

        // Try to get from injected environment variables first
        if (window.FIREBASE_API_KEY) {
            this.config = {
                apiKey: window.FIREBASE_API_KEY,
                authDomain: window.FIREBASE_AUTH_DOMAIN,
                projectId: window.FIREBASE_PROJECT_ID,
                storageBucket: window.FIREBASE_STORAGE_BUCKET,
                messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID,
                appId: window.FIREBASE_APP_ID
            };
            return this.config;
        }

        // Fallback to demo/development mode
        console.warn('Firebase environment variables not found. Using development mode.');
        this.config = {
            apiKey: 'demo-api-key',
            authDomain: 'demo-project.firebaseapp.com',
            projectId: 'demo-project',
            storageBucket: 'demo-project.appspot.com',
            messagingSenderId: '123456789',
            appId: 'demo-app-id'
        };
        
        return this.config;
    }

    // Initialize Firebase with security checks
    async initialize() {
        if (this.initialized) return;

        try {
            const config = this.getConfig();
            
            // Validate configuration
            if (!this.isValidConfig(config)) {
                throw new Error('Invalid Firebase configuration');
            }

            // Initialize Firebase
            firebase.initializeApp(config);
            
            // Test connection
            await this.testConnection();
            
            this.initialized = true;
            console.log('Firebase initialized successfully');
            
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            this.initializeFallbackMode();
        }
    }

    isValidConfig(config) {
        const required = ['apiKey', 'authDomain', 'projectId'];
        return required.every(key => config[key] && config[key] !== 'demo-api-key');
    }

    async testConnection() {
        try {
            const db = firebase.firestore();
            // Try to read Firestore rules (this will work even with restrictive rules)
            await db.doc('test/connection').get();
        } catch (error) {
            // This is expected if rules are restrictive - that's good!
            if (error.code === 'permission-denied') {
                console.log('Firestore security rules are active (good!)');
            } else {
                throw error;
            }
        }
    }

    initializeFallbackMode() {
        console.log('Initializing fallback mode...');
        // Set global flag for demo mode
        window.FIREBASE_DEMO_MODE = true;
    }

    getFirestore() {
        if (!this.initialized) {
            throw new Error('Firebase not initialized');
        }
        return firebase.firestore();
    }
}

// Export singleton instance
window.secureFirebaseConfig = new SecureFirebaseConfig();
