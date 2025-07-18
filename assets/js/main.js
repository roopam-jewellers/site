// =========================================
//   Main JavaScript for Roopam Jewellery Website
// =========================================

(function() {
    'use strict';

    // =========================================
    //   Navigation Functionality
    // =========================================
    
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    function handleNavbarScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Mobile menu toggle
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    // Smooth scrolling for navigation links
    function handleNavLinkClick(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
            
            // Smooth scroll to section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update active nav link
            updateActiveNavLink(targetId);
        }
    }

    // Update active navigation link
    function updateActiveNavLink(targetId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // Highlight current section in navigation
    function highlightCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                updateActiveNavLink(`#${sectionId}`);
            }
        });
    }

    // =========================================
    //   Carousel Functionality
    // =========================================
    
    class Carousel {
        constructor(carouselId, prevBtnId, nextBtnId) {
            this.carousel = document.getElementById(carouselId);
            this.track = this.carousel.querySelector('.carousel-track');
            this.prevBtn = document.getElementById(prevBtnId);
            this.nextBtn = document.getElementById(nextBtnId);
            this.cards = this.track.querySelectorAll('.product-card, .service-card');
            this.currentIndex = 0;
            this.cardsPerView = this.getCardsPerView();
            this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
            
            this.init();
        }

        init() {
            if (this.prevBtn && this.nextBtn) {
                this.prevBtn.addEventListener('click', () => this.prevSlide());
                this.nextBtn.addEventListener('click', () => this.nextSlide());
            }
            
            // Auto-play for product carousel
            if (this.carousel.id === 'products-carousel') {
                this.startAutoPlay();
            }
            
            // Handle window resize
            window.addEventListener('resize', () => {
                this.cardsPerView = this.getCardsPerView();
                this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
                this.updateCarousel();
            });

            // Touch/swipe support
            this.addTouchSupport();
        }

        getCardsPerView() {
            const containerWidth = this.carousel.offsetWidth;
            const cardWidth = 320; // Approximate card width including gap
            return Math.floor(containerWidth / cardWidth) || 1;
        }

        updateCarousel() {
            const cardWidth = this.cards[0].offsetWidth + 32; // Card width + gap
            const translateX = -this.currentIndex * cardWidth;
            this.track.style.transform = `translateX(${translateX}px)`;
            
            // Update button states
            if (this.prevBtn && this.nextBtn) {
                this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
                this.nextBtn.style.opacity = this.currentIndex === this.maxIndex ? '0.5' : '1';
            }
        }

        nextSlide() {
            if (this.currentIndex < this.maxIndex) {
                this.currentIndex++;
            } else {
                this.currentIndex = 0; // Loop back to start
            }
            this.updateCarousel();
        }

        prevSlide() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            } else {
                this.currentIndex = this.maxIndex; // Loop to end
            }
            this.updateCarousel();
        }

        startAutoPlay() {
            setInterval(() => {
                this.nextSlide();
            }, 5000); // Change slide every 5 seconds
        }

        addTouchSupport() {
            let startX = 0;
            let isDragging = false;

            this.track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            });

            this.track.addEventListener('touchmove', (e) => {
                e.preventDefault();
            });

            this.track.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                
                const endX = e.changedTouches[0].clientX;
                const diffX = startX - endX;
                
                if (Math.abs(diffX) > 50) { // Minimum swipe distance
                    if (diffX > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
                
                isDragging = false;
            });
        }
    }

    // =========================================
    //   FAQ Functionality
    // =========================================
    
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                    const faqAnswer = faqItem.querySelector('.faq-answer');
                    faqAnswer.style.maxHeight = '0';
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    // =========================================
    //   Contact Form Functionality
    // =========================================
    
    function initContactForm() {
        const form = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');
        
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone') || '',
                service: formData.get('service') || '',
                message: formData.get('message'),
                timestamp: new Date().toISOString(),
                read: false, // Default to false, will be updated by server
                userAgent: navigator.userAgent
            };
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Try to submit to Firebase if available
                const db = window.getFirebaseDB ? window.getFirebaseDB() : null;
                if (db && !window.FIREBASE_OFFLINE_MODE) {
                    await submitToFirebase(data, db);
                    showFormStatus('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
                } else {
                    // Fallback: simulate submission (for demo purposes)
                    await simulateFormSubmission(data);
                    showFormStatus('Thank you! Your message has been received. (Demo mode - Firebase not configured)', 'success');
                }
                
                form.reset();
            } catch (error) {
                console.error('Form submission error:', error);
                showFormStatus('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    async function submitToFirebase(data, db) {
        if (!db) {
            throw new Error('Firebase not initialized');
        }
        
        await db.collection('contact-messages').add(data);
    }

    async function simulateFormSubmission(data) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Log form data for demo purposes
        console.log('Form submission (demo):', data);
        
        // In a real application, you would send this to your server
        // Example:
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Failed to submit form');
        // }
    }

    function showFormStatus(message, type) {
        const formStatus = document.getElementById('form-status');
        if (!formStatus) return;
        
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        
        // Hide status after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }

    // =========================================
    //   Form Validation
    // =========================================
    
    function initFormValidation() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error styling
        clearFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation (basic)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }

    function showFieldError(field, message) {
        field.style.borderColor = '#f56565';
        
        // Create error message element if it doesn't exist
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            errorElement.style.cssText = 'color: #fed7d7; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    function clearFieldError(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // =========================================
    //   Intersection Observer for Animations
    // =========================================
    
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.product-card, .service-card, .stat-card, .faq-item');
        animateElements.forEach(el => observer.observe(el));
    }

    // =========================================
    //   Performance Optimizations
    // =========================================
    
    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Debounce function for resize events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // =========================================
    //   Utility Functions
    // =========================================
    
    // Lazy loading for images
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // Preload critical images
    function preloadImages() {
        const criticalImages = [
            'assets/images/hero-jewellery.jpg',
            'assets/images/diamond-ring.jpg',
            'assets/images/gold-necklace.jpg'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // =========================================
    //   Error Handling
    // =========================================
    
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
        // You could send this to an error tracking service
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        // You could send this to an error tracking service
    });

    // =========================================
    //   Initialization
    // =========================================
    
    async function init() {
        try {
            // Initialize configuration manager first
            console.log('Initializing configuration...');
            const configLoaded = await window.configManager.init();
            
            if (configLoaded) {
                // Inject dynamic content
                console.log('Injecting dynamic content...');
                await window.contentInjector.injectContent();
                
                // Preload critical images
                await window.configManager.preloadImages();
            }
            
            // Navigation
            if (mobileMenu) {
                mobileMenu.addEventListener('click', toggleMobileMenu);
            }
            
            navLinks.forEach(link => {
                link.addEventListener('click', handleNavLinkClick);
            });
            
            // Scroll events
            window.addEventListener('scroll', throttle(handleNavbarScroll, 10));
            window.addEventListener('scroll', throttle(highlightCurrentSection, 100));
            
            // Initialize carousels (after content injection)
            setTimeout(() => {
                if (document.getElementById('products-carousel')) {
                    new Carousel('products-carousel', 'products-prev', 'products-next');
                }
                
                if (document.getElementById('services-carousel')) {
                    new Carousel('services-carousel', 'services-prev', 'services-next');
                }
            }, 500);
            
            // Initialize other components
            initFAQ();
            initContactForm();
            initFormValidation();
            initScrollAnimations();
            initLazyLoading();
            
            // Performance optimizations
            preloadImages();
            
            // Set initial navbar state
            handleNavbarScroll();
            highlightCurrentSection();
            
            console.log('Gold & Silver Jewellery website initialized successfully');
        } catch (error) {
            console.error('Website initialization error:', error);
            // Continue with basic initialization even if config fails
            basicInit();
        }
    }

    function basicInit() {
        // Basic initialization without configuration
        if (mobileMenu) {
            mobileMenu.addEventListener('click', toggleMobileMenu);
        }
        
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
        });
        
        window.addEventListener('scroll', throttle(handleNavbarScroll, 10));
        window.addEventListener('scroll', throttle(highlightCurrentSection, 100));
        
        initFAQ();
        initContactForm();
        initFormValidation();
        
        console.log('Basic website initialization completed');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // =========================================
    //   Service Worker Registration (PWA)
    // =========================================
    
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('ServiceWorker registration successful');
                })
                .catch((error) => {
                    console.log('ServiceWorker registration failed');
                });
        });
    }

})();
