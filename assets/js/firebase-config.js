// Firebase Configuration with Domain Validation and Environment Detection
// This provides additional security through domain validation and environment checks

class FirebaseManager {
    constructor() {
        this.config = null;
        this.db = null;
        this.initialized = false;
        this.allowedDomains = [
            'roopam-jewellery.github.io',
            'localhost',
            '127.0.0.1'
        ];
    }

    // Validate if the current domain is allowed
    isDomainAllowed() {
        const currentDomain = window.location.hostname;
        return this.allowedDomains.some(domain => 
            currentDomain === domain || currentDomain.endsWith('.' + domain)
        );
    }

    // Check if we're in a development environment
    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.protocol === 'file:';
    }

    // Get Firebase configuration with security checks
    getConfig() {
        if (this.config) return this.config;

        // Domain validation
        if (!this.isDomainAllowed() && !this.isDevelopment()) {
            console.error('Unauthorized domain access attempted');
            return null;
        }

        // Try environment variables (injected during deployment)
        if (window.FIREBASE_API_KEY && !this.isDevelopment()) {
            this.config = {
                apiKey: window.FIREBASE_API_KEY,
                authDomain: window.FIREBASE_AUTH_DOMAIN,
                projectId: window.FIREBASE_PROJECT_ID,
                storageBucket: window.FIREBASE_STORAGE_BUCKET,
                messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID,
                appId: window.FIREBASE_APP_ID
            };
        } else if (this.isDevelopment()) {
            // Development/demo configuration
            console.warn('Development mode: Using demo Firebase configuration');
            this.config = {
                apiKey: 'demo-key-for-development',
                authDomain: 'roopam-demo.firebaseapp.com',
                projectId: 'roopam-demo',
                storageBucket: 'roopam-demo.appspot.com',
                messagingSenderId: '123456789',
                appId: 'demo-app-id'
            };
        }

        return this.config;
    }

    // Initialize Firebase with enhanced security
    async initialize() {
        if (this.initialized) return this.db;

        try {
            const config = this.getConfig();
            
            if (!config) {
                throw new Error('Firebase configuration not available for this domain');
            }

            // Additional security: Check if config looks legitimate
            if (!this.isValidConfig(config)) {
                throw new Error('Invalid Firebase configuration detected');
            }

            // Initialize Firebase
            firebase.initializeApp(config);
            this.db = firebase.firestore();
            
            // Test connection and validate setup
            await this.validateSetup();
            
            this.initialized = true;
            console.log('Firebase initialized successfully');
            
            return this.db;
            
        } catch (error) {
            console.error('Firebase initialization error:', error);
            return this.initializeFallbackMode();
        }
    }

    isValidConfig(config) {
        // Check if configuration has required fields and doesn't look like demo data
        const required = ['apiKey', 'authDomain', 'projectId'];
        const hasRequired = required.every(key => config[key] && config[key].length > 0);
        const notDemo = !config.apiKey.includes('demo') || this.isDevelopment();
        
        return hasRequired && notDemo;
    }

    async validateSetup() {
        if (this.isDevelopment()) {
            console.log('Development mode: Skipping Firebase validation');
            return;
        }

        try {
            // Test Firestore connection
            const testDoc = this.db.collection('_test').doc('connection');
            await testDoc.get();
        } catch (error) {
            if (error.code === 'permission-denied') {
                console.log('Firebase security rules are properly configured');
            } else {
                throw new Error(`Firebase connection test failed: ${error.message}`);
            }
        }
    }

    initializeFallbackMode() {
        console.log('Initializing offline/demo mode');
        window.FIREBASE_OFFLINE_MODE = true;
        
        // Return a mock database interface
        return {
            collection: (name) => ({
                add: (data) => {
                    console.log('Demo mode: Would save to collection', name, data);
                    return Promise.resolve({ id: 'demo-id-' + Date.now() });
                },
                doc: (id) => ({
                    get: () => Promise.resolve({ exists: false, data: () => null })
                })
            })
        };
    }

    // Get Firestore instance
    getFirestore() {
        if (!this.initialized) {
            console.warn('Firebase not initialized, returning demo instance');
            return this.initializeFallbackMode();
        }
        return this.db;
    }

    // Clean up sensitive data (call this on page unload if needed)
    cleanup() {
        if (window.FIREBASE_API_KEY) {
            delete window.FIREBASE_API_KEY;
            delete window.FIREBASE_AUTH_DOMAIN;
            delete window.FIREBASE_PROJECT_ID;
            delete window.FIREBASE_STORAGE_BUCKET;
            delete window.FIREBASE_MESSAGING_SENDER_ID;
            delete window.FIREBASE_APP_ID;
        }
    }
}

// Initialize the manager
const firebaseManager = new FirebaseManager();

// Initialize Firebase when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await firebaseManager.initialize();
});

// Optional: Clean up on page unload
window.addEventListener('beforeunload', () => {
    firebaseManager.cleanup();
});

// Export for backward compatibility
window.firebaseDB = null;
window.getFirebaseDB = () => firebaseManager.getFirestore();
