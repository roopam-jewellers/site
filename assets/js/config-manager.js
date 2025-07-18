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

    // Get image URL from Firebase Storage with token or fallback to placeholder
    async getImageUrl(imageData, category = 'product') {
        // Handle both old string format and new object format
        let imagePath, token;
        
        if (typeof imageData === 'string') {
            imagePath = imageData;
            token = null;
        } else if (imageData && typeof imageData === 'object') {
            imagePath = imageData.filename || imageData.main;
            token = imageData.token;
        } else {
            imagePath = imageData;
            token = null;
        }

        // Create cache key
        const cacheKey = token ? `${imagePath}_${token}` : imagePath;
        
        // Check cache first
        if (this.imageCache.has(cacheKey)) {
            return this.imageCache.get(cacheKey);
        }

        try {
            // If we have both filename and token, construct direct Firebase URL
            if (imagePath && token && this.imagesConfig?.firebase?.storage) {
                const bucket = this.imagesConfig.firebase.storage.bucket;
                const folder = this.imagesConfig.firebase.storage.folder;
                
                // Construct the direct Firebase Storage URL
                const directUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(folder)}%2F${imagePath}?alt=media&token=${token}`;
                
                // Cache the URL
                this.imageCache.set(cacheKey, directUrl);
                console.log(`Using direct Firebase URL for: ${imagePath}`);
                return directUrl;
            }

            // Fallback to Firebase SDK method if no token
            if (this.storageRef && imagePath) {
                const fullPath = `${this.imagesConfig.firebase.storage.folder}/${imagePath}`;
                const imageRef = this.storageRef.child(fullPath);
                const url = await imageRef.getDownloadURL();
                
                // Cache the URL
                this.imageCache.set(cacheKey, url);
                console.log(`Successfully loaded image from Firebase SDK: ${imagePath}`);
                return url;
            }
        } catch (error) {
            console.warn(`Error loading image: ${imagePath}`, error.message);
            
            // If it's a permission error, provide more specific guidance
            if (error.code === 'storage/unauthorized') {
                console.error(`🔒 Firebase Storage Permission Error: Please update your Firebase Storage security rules to allow public read access to the '${this.imagesConfig.firebase.storage.folder}' folder.`);
            }
        }

        // Fallback to placeholder
        const placeholderUrl = this.imagesConfig?.images?.placeholders?.[category] || 
                              this.imagesConfig?.images?.placeholders?.product ||
                              `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23ccc'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='%23666'%3EImage%3C/text%3E%3C/svg%3E`;
        console.log(`Using placeholder for ${imagePath}: ${category}`);
        return placeholderUrl;
    }

    // Preload critical images
    async preloadImages() {
        if (!this.imagesConfig || !this.imagesConfig.images) {
            console.log('Images config not loaded, skipping preload');
            return;
        }

        const criticalImages = [];
        
        // Add hero image
        if (this.imagesConfig.images.hero) {
            criticalImages.push({
                data: this.imagesConfig.images.hero,
                category: 'hero'
            });
        }
        
        // Add first 2 product images
        if (this.imagesConfig.images.products && this.imagesConfig.images.products.length > 0) {
            this.imagesConfig.images.products.slice(0, 2).forEach(product => {
                criticalImages.push({
                    data: product,
                    category: 'product'
                });
            });
        }

        const preloadPromises = criticalImages.map(async (imageItem) => {
            try {
                const url = await this.getImageUrl(imageItem.data, imageItem.category);
                // Preload the image
                const img = new Image();
                img.src = url;
                return url;
            } catch (error) {
                console.warn(`Failed to preload image:`, imageItem.data);
            }
        });

        await Promise.allSettled(preloadPromises);
        console.log(`Preloaded ${criticalImages.length} critical images`);
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
