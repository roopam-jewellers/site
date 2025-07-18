// Configuration and Image Manager
// Handles loading site configuration and Firebase Storage images

class ConfigManager {
    constructor() {
        this.siteConfig = null;
        this.imagesConfig = null;
        this.storageRef = null;
        this.imageCache = new Map();
    }

    // Initialize configuration
    async init() {
        try {
            await Promise.all([
                this.loadSiteConfig(),
                this.loadImagesConfig(),
                this.initFirebaseStorage()
            ]);
            console.log('Configuration loaded successfully');
            return true;
        } catch (error) {
            console.error('Configuration loading failed:', error);
            return false;
        }
    }

    // Load site configuration
    async loadSiteConfig() {
        try {
            const response = await fetch('./config/site-config.json');
            if (!response.ok) throw new Error('Failed to load site config');
            this.siteConfig = await response.json();
        } catch (error) {
            console.error('Error loading site config:', error);
            // Fallback to default config
            this.siteConfig = this.getDefaultSiteConfig();
        }
    }

    // Load images configuration  
    async loadImagesConfig() {
        try {
            const response = await fetch('./config/images-config.json');
            if (!response.ok) throw new Error('Failed to load images config');
            this.imagesConfig = await response.json();
        } catch (error) {
            console.error('Error loading images config:', error);
            // Fallback to default config
            this.imagesConfig = this.getDefaultImagesConfig();
        }
    }

    // Initialize Firebase Storage
    async initFirebaseStorage() {
        try {
            // Wait for Firebase to be initialized
            let attempts = 0;
            const maxAttempts = 10;
            
            while (attempts < maxAttempts) {
                if (window.isFirebaseInitialized && window.isFirebaseInitialized()) {
                    const storage = window.getFirebaseStorage();
                    if (storage) {
                        this.storageRef = storage.ref();
                        console.log('Firebase Storage initialized successfully');
                        return;
                    }
                }
                
                // Wait 100ms before checking again
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            console.log('Firebase Storage not available - using placeholder images');
        } catch (error) {
            console.error('Firebase Storage initialization error:', error);
        }
    }

    // Get image URL from Firebase Storage or fallback to placeholder
    async getImageUrl(imagePath, category = 'product') {
        // Check cache first
        if (this.imageCache.has(imagePath)) {
            return this.imageCache.get(imagePath);
        }

        try {
            if (this.storageRef) {
                // Try to get image from Firebase Storage (gallery folder)
                const fullPath = `${this.imagesConfig.firebase.storage.folder}/${imagePath}`;
                const imageRef = this.storageRef.child(fullPath);
                const url = await imageRef.getDownloadURL();
                
                // Cache the URL
                this.imageCache.set(imagePath, url);
                console.log(`Successfully loaded image: ${imagePath}`);
                return url;
            }
        } catch (error) {
            console.warn(`Image not found in Firebase Storage: ${imagePath}`, error.message);
            
            // If it's a permission error, provide more specific guidance
            if (error.code === 'storage/unauthorized') {
                console.error(`🔒 Firebase Storage Permission Error: Please update your Firebase Storage security rules to allow public read access to the '${this.imagesConfig.firebase.storage.folder}' folder.`);
            }
        }

        // Fallback to placeholder
        const placeholderUrl = this.imagesConfig.images.placeholders[category] || 
                              this.imagesConfig.images.placeholders.product;
        console.log(`Using placeholder for ${imagePath}: ${category}`);
        return placeholderUrl;
    }

    // Preload critical images
    async preloadImages() {
        const criticalImages = [
            this.imagesConfig.images.hero.main,
            ...this.imagesConfig.images.products.slice(0, 2).map(p => p.filename)
        ];

        const preloadPromises = criticalImages.map(async (imagePath) => {
            try {
                const url = await this.getImageUrl(imagePath, 'hero');
                // Preload the image
                const img = new Image();
                img.src = url;
                return url;
            } catch (error) {
                console.warn(`Failed to preload image: ${imagePath}`);
            }
        });

        await Promise.allSettled(preloadPromises);
    }

    // Get business configuration
    getBusinessConfig() {
        return this.siteConfig?.business || this.getDefaultSiteConfig().business;
    }

    // Get products configuration
    getProductsConfig() {
        return this.siteConfig?.products || this.getDefaultSiteConfig().products;
    }

    // Get services configuration
    getServicesConfig() {
        return this.siteConfig?.services || this.getDefaultSiteConfig().services;
    }

    // Get FAQ configuration
    getFAQConfig() {
        return this.siteConfig?.faq || this.getDefaultSiteConfig().faq;
    }

    // Get about configuration
    getAboutConfig() {
        return this.siteConfig?.about || this.getDefaultSiteConfig().about;
    }

    // Get hero configuration
    getHeroConfig() {
        return this.siteConfig?.hero || this.getDefaultSiteConfig().hero;
    }

    // Default site configuration (fallback)
    getDefaultSiteConfig() {
        return {
            business: {
                name: "Golden Silver Jewellery",
                tagline: "Premium Gold & Silver Ornaments",
                address: {
                    street: "123 Jewellery Street",
                    city: "Mumbai",
                    state: "Maharashtra",
                    zipCode: "400001"
                },
                contact: {
                    phone: "+91 98765 43210",
                    email: "info@goldensilver.com"
                }
            },
            hero: {
                title: "Premium Gold & Silver Collection",
                subtitle: "Authentic ornaments with expert craftsmanship",
                primaryButton: "Explore Collection",
                secondaryButton: "Our Services"
            },
            products: {
                title: "Our Collection",
                subtitle: "Authentic precious metal ornaments",
                categories: []
            },
            services: {
                title: "Our Services", 
                subtitle: "Complete gold and silver solutions",
                offerings: []
            },
            about: {
                title: "About Us",
                story: ["We are a trusted jewellery store."],
                values: [],
                stats: []
            },
            faq: []
        };
    }

    // Default images configuration (fallback)
    getDefaultImagesConfig() {
        return {
            images: {
                hero: {
                    main: "hero/default.jpg",
                    alt: "Jewellery Collection"
                },
                products: [],
                services: [],
                placeholders: {
                    product: "https://via.placeholder.com/400x300/1a365d/ffffff?text=Product+Image",
                    service: "https://via.placeholder.com/300x200/2c5282/ffffff?text=Service+Image",
                    hero: "https://via.placeholder.com/1200x800/1a365d/ffffff?text=Hero+Image"
                }
            },
            firebase: {
                storage: {
                    bucket: "",
                    folder: "jewellery-website"
                }
            }
        };
    }

    // Utility method to format address
    formatAddress(address) {
        if (!address) return '';
        return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
    }

    // Utility method to format phone number
    formatPhone(phone) {
        if (!phone) return '';
        // Add any phone formatting logic here
        return phone;
    }

    // Utility method to get social media links
    getSocialLinks() {
        return this.siteConfig?.business?.social || {};
    }
}

// Create global instance
window.configManager = new ConfigManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigManager;
}
