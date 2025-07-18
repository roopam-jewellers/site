// Dynamic Content Injector
// Injects configuration data into HTML elements

class ContentInjector {
    constructor() {
        this.configManager = window.configManager;
    }

    // Inject all dynamic content
    async injectContent() {
        try {
            await this.injectBusinessInfo();
            await this.injectHeroSection();
            await this.injectProductsSection();
            await this.injectServicesSection();
            await this.injectAboutSection();
            await this.injectFAQSection();
            await this.injectContactSection();
            await this.injectFooter();
            await this.injectImages();
            
            console.log('All content injected successfully');
        } catch (error) {
            console.error('Content injection error:', error);
        }
    }

    // Inject business information
    async injectBusinessInfo() {
        const business = this.configManager.getBusinessConfig();
        
        // Update page title
        document.title = `${business.name} - ${business.tagline}`;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = business.description;
        }

        // Update business name in navigation
        const navLogo = document.querySelector('.nav-logo h2');
        if (navLogo) {
            navLogo.textContent = business.name;
        }
    }

    // Inject hero section content
    async injectHeroSection() {
        const hero = this.configManager.getHeroConfig();
        
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const primaryBtn = document.querySelector('.hero-buttons .btn-primary');
        const secondaryBtn = document.querySelector('.hero-buttons .btn-secondary');

        if (heroTitle) heroTitle.textContent = hero.title;
        if (heroSubtitle) heroSubtitle.textContent = hero.subtitle;
        if (primaryBtn) primaryBtn.textContent = hero.primaryButton;
        if (secondaryBtn) secondaryBtn.textContent = hero.secondaryButton;
    }

    // Inject products section
    async injectProductsSection() {
        const products = this.configManager.getProductsConfig();
        const imagesConfig = this.configManager.imagesConfig;
        
        // Update section header
        const sectionTitle = document.querySelector('.products .section-title');
        const sectionSubtitle = document.querySelector('.products .section-subtitle');
        
        if (sectionTitle) sectionTitle.textContent = products.title;
        if (sectionSubtitle) sectionSubtitle.textContent = products.subtitle;

        // Update product cards
        const carouselTrack = document.querySelector('#products-carousel .carousel-track');
        if (carouselTrack && products.categories) {
            carouselTrack.innerHTML = '';
            
            for (let i = 0; i < products.categories.length; i++) {
                const category = products.categories[i];
                const imageConfig = imagesConfig.images.products[i] || imagesConfig.images.products[0];
                
                const imageUrl = await this.configManager.getImageUrl(imageConfig.filename, 'product');
                
                const productCard = this.createProductCard(category, imageConfig, imageUrl);
                carouselTrack.appendChild(productCard);
            }
        }
    }

    // Create product card element
    createProductCard(category, imageConfig, imageUrl) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'product-card';
        
        cardDiv.innerHTML = `
            <div class="product-image">
                <img src="${imageUrl}" alt="${imageConfig.alt}" loading="lazy">
                <div class="product-overlay">
                    <button class="btn btn-outline">View Details</button>
                </div>
            </div>
            <div class="product-info">
                <h3>${category.name}</h3>
                <p>${category.description}</p>
                <span class="product-price">${category.priceRange}</span>
            </div>
        `;
        
        return cardDiv;
    }

    // Inject services section
    async injectServicesSection() {
        const services = this.configManager.getServicesConfig();
        
        // Update section header
        const sectionTitle = document.querySelector('.services .section-title');
        const sectionSubtitle = document.querySelector('.services .section-subtitle');
        
        if (sectionTitle) sectionTitle.textContent = services.title;
        if (sectionSubtitle) sectionSubtitle.textContent = services.subtitle;

        // Update service cards
        const carouselTrack = document.querySelector('#services-carousel .carousel-track');
        if (carouselTrack && services.offerings) {
            carouselTrack.innerHTML = '';
            
            for (const service of services.offerings) {
                const serviceCard = this.createServiceCard(service);
                carouselTrack.appendChild(serviceCard);
            }
        }
    }

    // Create service card element
    createServiceCard(service) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'service-card';
        
        cardDiv.innerHTML = `
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <a href="#contact" class="btn btn-outline">Learn More</a>
        `;
        
        return cardDiv;
    }

    // Inject about section
    async injectAboutSection() {
        const about = this.configManager.getAboutConfig();
        
        // Update section title
        const sectionTitle = document.querySelector('.about .section-title');
        if (sectionTitle) sectionTitle.textContent = about.title;

        // Update intro
        const aboutIntro = document.querySelector('.about-intro');
        if (aboutIntro) aboutIntro.textContent = about.intro;

        // Update story paragraphs
        const storyContainer = document.querySelector('.about-story');
        if (storyContainer && about.story) {
            storyContainer.innerHTML = '';
            about.story.forEach(paragraph => {
                const p = document.createElement('p');
                p.textContent = paragraph;
                storyContainer.appendChild(p);
            });
        }

        // Update values
        const valuesContainer = document.querySelector('.about-values ul');
        if (valuesContainer && about.values) {
            valuesContainer.innerHTML = '';
            about.values.forEach(value => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${value.title}:</strong> ${value.description}`;
                valuesContainer.appendChild(li);
            });
        }

        // Update stats
        const statsContainer = document.querySelector('.about-stats');
        if (statsContainer && about.stats) {
            statsContainer.innerHTML = '';
            about.stats.forEach(stat => {
                const statCard = document.createElement('div');
                statCard.className = 'stat-card';
                statCard.innerHTML = `
                    <div class="stat-number">${stat.number}</div>
                    <div class="stat-label">${stat.label}</div>
                `;
                statsContainer.appendChild(statCard);
            });
        }
    }

    // Inject FAQ section
    async injectFAQSection() {
        const faq = this.configManager.getFAQConfig();
        
        const faqContainer = document.querySelector('.faq-container');
        if (faqContainer && faq) {
            faqContainer.innerHTML = '';
            
            faq.forEach(item => {
                const faqItem = document.createElement('div');
                faqItem.className = 'faq-item';
                faqItem.innerHTML = `
                    <div class="faq-question">
                        <h3>${item.question}</h3>
                        <i class="fas fa-plus faq-icon"></i>
                    </div>
                    <div class="faq-answer">
                        <p>${item.answer}</p>
                    </div>
                `;
                faqContainer.appendChild(faqItem);
            });
        }
    }

    // Inject contact section
    async injectContactSection() {
        const business = this.configManager.getBusinessConfig();
        
        // Update address
        const addressElement = document.querySelector('.contact-info .contact-item:first-child .contact-details p');
        if (addressElement) {
            addressElement.innerHTML = `${this.configManager.formatAddress(business.address)}`;
        }

        // Update phone
        const phoneElement = document.querySelector('.contact-info .contact-item:nth-child(2) .contact-details p');
        if (phoneElement) {
            phoneElement.innerHTML = `${business.contact.phone}<br>${business.hours.weekdays}`;
        }

        // Update email
        const emailElement = document.querySelector('.contact-info .contact-item:nth-child(3) .contact-details p');
        if (emailElement) {
            emailElement.innerHTML = `${business.contact.email}<br>Quick response guaranteed`;
        }
    }

    // Inject footer content
    async injectFooter() {
        const business = this.configManager.getBusinessConfig();
        
        // Update footer business name
        const footerTitle = document.querySelector('.footer-section h3');
        if (footerTitle) footerTitle.textContent = business.name;

        // Update footer description
        const footerDesc = document.querySelector('.footer-section p');
        if (footerDesc) footerDesc.textContent = business.description;

        // Update contact info in footer
        const footerAddress = document.querySelector('.footer-section:last-child p:first-child');
        const footerPhone = document.querySelector('.footer-section:last-child p:nth-child(2)');
        const footerEmail = document.querySelector('.footer-section:last-child p:nth-child(3)');

        if (footerAddress) {
            footerAddress.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${this.configManager.formatAddress(business.address)}`;
        }
        if (footerPhone) {
            footerPhone.innerHTML = `<i class="fas fa-phone"></i> ${business.contact.phone}`;
        }
        if (footerEmail) {
            footerEmail.innerHTML = `<i class="fas fa-envelope"></i> ${business.contact.email}`;
        }

        // Update social links
        const socialLinks = this.configManager.getSocialLinks();
        const socialContainer = document.querySelector('.social-links');
        if (socialContainer && Object.keys(socialLinks).length > 0) {
            socialContainer.innerHTML = '';
            Object.entries(socialLinks).forEach(([platform, url]) => {
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('aria-label', platform);
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                
                const iconClass = this.getSocialIconClass(platform);
                link.innerHTML = `<i class="${iconClass}"></i>`;
                socialContainer.appendChild(link);
            });
        }
    }

    // Get social media icon class
    getSocialIconClass(platform) {
        const iconMap = {
            facebook: 'fab fa-facebook-f',
            instagram: 'fab fa-instagram', 
            twitter: 'fab fa-twitter',
            youtube: 'fab fa-youtube',
            linkedin: 'fab fa-linkedin-in',
            whatsapp: 'fab fa-whatsapp'
        };
        return iconMap[platform.toLowerCase()] || 'fas fa-link';
    }

    // Inject images
    async injectImages() {
        // Update hero image
        const heroImage = document.querySelector('.hero-image img');
        if (heroImage) {
            const heroImageUrl = await this.configManager.getImageUrl(
                this.configManager.imagesConfig.images.hero.main, 
                'hero'
            );
            heroImage.src = heroImageUrl;
            heroImage.alt = this.configManager.imagesConfig.images.hero.alt;
        }
    }
}

// Create global instance
window.contentInjector = new ContentInjector();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentInjector;
}
