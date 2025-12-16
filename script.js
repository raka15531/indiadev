/**
 * NextGen Web Solutions - Main JavaScript
 * Performance-optimized, SEO-safe, AdSense-safe
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('NextGen Web Solutions - Script loaded');
    
    // ==========================================================================
    // Performance & Loading Optimization
    // ==========================================================================
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Mark body as loaded for CSS transitions
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // ==========================================================================
    // Mobile Navigation
    // ==========================================================================
    
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('show');
            
            // Update icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = isExpanded ? 'fas fa-bars' : 'fas fa-times';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navLinks.contains(event.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('show');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
        
        // Close menu when clicking a link
        const navItems = navLinks.querySelectorAll('.nav-link');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('show');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });
    }
    
    // ==========================================================================
    // Header Scroll Behavior
    // ==========================================================================
    
    const header = document.getElementById('mainHeader');
    let lastScrollTop = 0;
    
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    // Scrolling down
                    header.classList.add('hidden');
                } else {
                    // Scrolling up
                    header.classList.remove('hidden');
                }
            } else {
                header.classList.remove('hidden');
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // ==========================================================================
    // Theme Switcher
    // ==========================================================================
    
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (themeToggle) {
        // Check for saved theme or prefer color scheme
        const savedTheme = localStorage.getItem('theme');
        const currentTheme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');
        
        // Set initial theme
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Dispatch event for other components
            document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
        });
    }
    
    // ==========================================================================
    // Contact Form with Validation & Spam Protection
    // ==========================================================================
    
    const quoteForm = document.getElementById('quoteForm');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    
    if (quoteForm) {
        // Create honeypot field (spam protection)
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website';
        honeypot.style.display = 'none';
        honeypot.style.position = 'absolute';
        honeypot.style.left = '-9999px';
        honeypot.autocomplete = 'off';
        honeypot.tabIndex = -1;
        quoteForm.appendChild(honeypot);
        
        // Input validation patterns
        const patterns = {
            name: /^[a-zA-Z\s]{2,50}$/,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[\+]?[0-9\s\-\(\)]{10,15}$/
        };
        
        // Real-time validation
        const inputs = quoteForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
        
        function validateField(field) {
            const value = field.value.trim();
            const fieldName = field.name;
            
            // Remove previous error
            field.classList.remove('error');
            const existingError = field.parentElement.querySelector('.error-message');
            if (existingError) existingError.remove();
            
            // Skip if field is empty and not required
            if (!value && !field.required) return true;
            
            // Required field validation
            if (field.required && !value) {
                showError(field, 'This field is required');
                return false;
            }
            
            // Pattern validation
            if (patterns[fieldName] && value) {
                if (!patterns[fieldName].test(value)) {
                    let message = '';
                    switch (fieldName) {
                        case 'name':
                            message = 'Please enter a valid name (2-50 characters)';
                            break;
                        case 'email':
                            message = 'Please enter a valid email address';
                            break;
                        case 'phone':
                            message = 'Please enter a valid phone number';
                            break;
                    }
                    showError(field, message);
                    return false;
                }
            }
            
            return true;
        }
        
        function showError(field, message) {
            field.classList.add('error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#ef4444';
            errorDiv.style.fontSize = '0.75rem';
            errorDiv.style.marginTop = '0.25rem';
            errorDiv.textContent = message;
            
            field.parentElement.appendChild(errorDiv);
        }
        
        // Form submission
        quoteForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Check honeypot
            if (honeypot.value) {
                console.log('Spam detected');
                return;
            }
            
            // Validate all fields
            let isValid = true;
            const requiredFields = quoteForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                // Scroll to first error
                const firstError = quoteForm.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
            
            // Show loading state
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Collect form data
                const formData = {
                    name: document.getElementById('name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    service: document.getElementById('service').value,
                    budget: document.getElementById('budget').value,
                    message: document.getElementById('message').value.trim(),
                    timestamp: new Date().toISOString(),
                    page: window.location.href
                };
                
                // Method 1: Use FormSubmit (no backend needed)
                await submitToFormSubmit(formData);
                
                // Show success modal
                if (successModal) {
                    successModal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }
                
                // Reset form
                quoteForm.reset();
                
                // Send to Google Analytics/GTM if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'Contact',
                        'event_label': 'Quote Request'
                    });
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                alert('There was an error sending your message. Please try again or contact us via WhatsApp.');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
        
        async function submitToFormSubmit(data) {
            // FormSubmit.co endpoint (free form submission service)
            const endpoint = 'https://formsubmit.co/ajax/akashsing1553@gmail.com';
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    service: data.service,
                    budget: data.budget,
                    message: data.message,
                    _subject: `New Quote Request from ${data.name}`,
                    _template: 'table',
                    _captcha: 'false'
                })
            });
            
            if (!response.ok) {
                throw new Error('Form submission failed');
            }
            
            return await response.json();
        }
    }
    
    // Modal handling
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            if (successModal) {
                successModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
    
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
    
    // ==========================================================================
    // Chatbot Implementation (AdSense Safe)
    // ==========================================================================
    
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const optionButtons = document.querySelectorAll('.option-btn');
    const whatsappRedirect = document.querySelector('.whatsapp-redirect');
    
    if (chatbotToggle && chatbotWindow) {
        // Only initialize chatbot if not on low-end mobile
        if (!isLowEndMobile()) {
            // Add welcome message
            addBotMessage("Hello! I'm NextGen Assistant. How can I help you today?");
            
            chatbotToggle.addEventListener('click', function() {
                chatbotWindow.classList.toggle('show');
                this.setAttribute('aria-expanded', chatbotWindow.classList.contains('show'));
                
                // Dispatch event for analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'chatbot_open', {
                        'event_category': 'Engagement'
                    });
                }
            });
            
            if (chatbotClose) {
                chatbotClose.addEventListener('click', function() {
                    chatbotWindow.classList.remove('show');
                    chatbotToggle.setAttribute('aria-expanded', 'false');
                });
            }
            
            // Option button click handlers
            optionButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const option = this.dataset.option || this.textContent;
                    addUserMessage(option);
                    
                    // Simulate typing delay
                    setTimeout(() => {
                        handleUserChoice(option);
                    }, 500);
                });
            });
            
            // WhatsApp redirect
            if (whatsappRedirect) {
                whatsappRedirect.addEventListener('click', function() {
                    window.open('https://wa.me/919599372553?text=Hi%20NextGen%20Web%20Solutions,%20I%20need%20to%20talk%20to%20a%20human%20representative.', '_blank');
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'whatsapp_redirect', {
                            'event_category': 'Contact',
                            'event_label': 'Chatbot'
                        });
                    }
                });
            }
        } else {
            // Hide chatbot on low-end mobile
            document.querySelector('.chatbot-container').style.display = 'none';
        }
    }
    
    function addBotMessage(text) {
        if (!chatbotMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);
        scrollChatToBottom();
    }
    
    function addUserMessage(text) {
        if (!chatbotMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);
        scrollChatToBottom();
    }
    
    function handleUserChoice(choice) {
        let response = '';
        
        switch (choice.toLowerCase()) {
            case 'services':
            case 'our services':
                response = "We offer:\n• Business Website Development (₹4,999+)\n• E-commerce Solutions (₹19,999+)\n• Custom Web Applications (₹45,000+)\n• SEO Optimization\n• Website Maintenance\n\nWhich service are you interested in?";
                break;
                
            case 'pricing':
            case 'pricing details':
                response = "Our transparent pricing:\n\n📌 Basic Website: ₹4,999 (5 pages)\n📌 Website + Admin: ₹12,500 (most popular)\n📌 E-commerce: ₹19,999 (full store)\n📌 Custom App: ₹45,000+\n\nAdditional pages: ₹800/page\n50% advance to start work";
                break;
                
            case 'contact':
            case 'contact info':
                response = "📱 WhatsApp: +91 95993 72553\n📞 Phone: +91 95993 72553\n📧 Email: akashsing1553@gmail.com\n📍 Location: Faridabad, Haryana\n\nWe're available 9 AM - 9 PM, 7 days a week!";
                break;
                
            case 'portfolio':
            case 'see work':
                response = "Check our portfolio section for recent projects in Delhi, Mumbai, and Bangalore. We've delivered 500+ projects across India with 98% client satisfaction.";
                break;
                
            case 'timeline':
            case 'delivery time':
                response = "🚀 Our delivery times:\n• Business Website: 5-7 days\n• E-commerce Store: 10-15 days\n• Custom Application: 3-4 weeks\n\nWe provide exact timeline during free consultation.";
                break;
                
            default:
                response = "I can help you with:\n1. Services & Pricing\n2. Portfolio & Past Work\n3. Contact Information\n4. Project Timeline\n\nOr click 'Talk to Human' to chat directly with our team on WhatsApp.";
        }
        
        addBotMessage(response);
    }
    
    function scrollChatToBottom() {
        if (chatbotMessages) {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    }
    
    // ==========================================================================
    // Performance Optimizations
    // ==========================================================================
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page load time:', perfData.loadEventEnd - perfData.startTime, 'ms');
            }
        });
    }
    
    // ==========================================================================
    // Utility Functions
    // ==========================================================================
    
    function isLowEndMobile() {
        // Check for low-end mobile devices
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        const hasSlowConnection = navigator.connection && 
            (navigator.connection.saveData || 
             navigator.connection.effectiveType === 'slow-2g' || 
             navigator.connection.effectiveType === '2g');
        
        return (isMobile && (hasLowMemory || hasSlowConnection));
    }
    
    // ==========================================================================
    // Smooth Scrolling for Anchor Links
    // ==========================================================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('show')) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navLinks.classList.remove('show');
                    const icon = menuToggle.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars';
                }
                
                // Smooth scroll
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, href);
            }
        });
    });
    
    // ==========================================================================
    // Form Input Enhancements
    // ==========================================================================
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            
            if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d{1,3})/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
    
    // Auto-resize textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        messageTextarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
    
    // ==========================================================================
    // Error Boundary & Fallbacks
    // ==========================================================================
    
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // Don't break the page for non-critical errors
        e.preventDefault();
    });
    
    // Service worker registration (optional)
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    }
    
    // ==========================================================================
    // Analytics Events (AdSense Safe)
    // ==========================================================================
    
    // Track CTA clicks
    document.querySelectorAll('.btn-primary, .whatsapp-float').forEach(btn => {
        btn.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    'event_category': 'Engagement',
                    'event_label': this.textContent || 'CTA Button'
                });
            }
        });
    });
    
    // Track form interactions
    if (quoteForm) {
        quoteForm.addEventListener('focusin', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_interaction', {
                        'event_category': 'Engagement',
                        'event_label': e.target.name
                    });
                }
            }
        }, true);
    }
    
    console.log('NextGen Web Solutions - Script initialization complete');
});

// ==========================================================================
// Performance Polyfills & Fallbacks
// ==========================================================================

// RequestAnimationFrame fallback
window.requestAnimationFrame = window.requestAnimationFrame || 
                               window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||
                               window.msRequestAnimationFrame ||
                               function(callback) { return setTimeout(callback, 1000/60); };

// IntersectionObserver polyfill if needed
if (!('IntersectionObserver' in window)) {
    console.log('IntersectionObserver not supported - loading polyfill');
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    script.async = true;
    document.head.appendChild(script);
}