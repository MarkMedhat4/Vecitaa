// ============================================
// Vezeeta-like Medical Website - Mobile Optimized
// ============================================

'use strict';

// ============================================
// DOM READY AND INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main app initialization
function initializeApp() {
    setupTabSwitching();
    setupSearchForm();
    setupMobileMenu();
    setupTouchOptimization();
}

// ============================================
// TAB SWITCHING FUNCTIONALITY
// ============================================

function setupTabSwitching() {
    const tabs = document.querySelectorAll('.tab');
    
    if (!tabs.length) {
        console.warn('No tabs found');
        return;
    }

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function(event) {
            event.preventDefault();
            handleTabClick(this);
        });
        
        // Touch support for mobile
        tab.addEventListener('touchend', function(event) {
            event.preventDefault();
            handleTabClick(this);
        });
    });
}

function handleTabClick(tabElement) {
    const allTabs = document.querySelectorAll('.tab');
    
    // Remove active class from all tabs
    allTabs.forEach(function(tab) {
        tab.classList.remove('active');
    });
    
    // Add active class to clicked tab
    tabElement.classList.add('active');
    
    // Optional: Update search form based on selected tab
    updateSearchFormContent(tabElement);
}

function updateSearchFormContent(tabElement) {
    const tabIndex = Array.from(document.querySelectorAll('.tab')).indexOf(tabElement);
    
    // You can add logic here to update form content based on tab
    // For example: show different search options for booking vs. telehealth
}

// ============================================
// SEARCH FORM HANDLING
// ============================================

function setupSearchForm() {
    const searchBtn = document.querySelector('.search-btn');
    const form = document.querySelector('.inputs-box');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            handleSearch();
        });
        
        // Allow Enter key to trigger search
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(function(input) {
            input.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSearch();
                }
            });
        });
    }
}

function handleSearch() {
    const specialty = document.querySelector('[name="specialty"]');
    const city = document.querySelector('[name="city"]');
    const area = document.querySelector('[name="area"]');
    const doctorName = document.querySelector('[name="doctor-name"]');
    
    // Validate that at least one field is filled
    if (!specialty?.value && !city?.value && !area?.value && !doctorName?.value) {
        showMessage('Please fill in at least one search field', 'error');
        return;
    }
    
    // Log search parameters (replace with actual API call)
    const searchParams = {
        specialty: specialty?.value || '',
        city: city?.value || '',
        area: area?.value || '',
        doctorName: doctorName?.value || '',
        timestamp: new Date().toISOString()
    };
    
    console.log('Search initiated:', searchParams);
    
    // TODO: Replace with actual API call
    // performSearch(searchParams);
    
    showMessage('Searching for doctors...', 'info');
}

// ============================================
// MOBILE MENU HANDLING
// ============================================

function setupMobileMenu() {
    const topbar = document.querySelector('.topbar');
    
    if (!topbar) return;
    
    // Add hamburger menu for very small screens
    if (window.innerWidth < 768) {
        makeTopbarMobileOptimized();
    }
    
    window.addEventListener('resize', debounce(function() {
        if (window.innerWidth < 768) {
            makeTopbarMobileOptimized();
        }
    }, 250));
}

function makeTopbarMobileOptimized() {
    const rightMenu = document.querySelector('.right');
    
    if (!rightMenu) return;
    
    // Hide less important items on very small screens
    const items = rightMenu.querySelectorAll('a:not(.signup)');
    
    items.forEach(function(item) {
        // Only show essential items on mobile
        if (item.textContent.includes('Sign Up') || item.textContent.includes('Login')) {
            item.style.display = 'block';
        }
    });
}

// ============================================
// TOUCH OPTIMIZATION FOR MOBILE
// ============================================

function setupTouchOptimization() {
    // Increase touch target size for buttons
    const buttons = document.querySelectorAll('button, a, .tab, .input-block');
    
    buttons.forEach(function(button) {
        // Ensure minimum touch target of 44x44px (recommended for accessibility)
        const style = window.getComputedStyle(button);
        const height = parseInt(style.height);
        
        if (height < 44) {
            button.style.padding = '12px 16px';
        }
    });
    
    // Add touch feedback
    addTouchFeedback();
}

function addTouchFeedback() {
    const clickableElements = document.querySelectorAll('button, a, .tab');
    
    clickableElements.forEach(function(element) {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        });
        
        element.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
        
        element.addEventListener('touchcancel', function() {
            this.style.opacity = '1';
        });
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show user message (toast notification)
function showMessage(message, type = 'info') {
    // Create toast container if not exists
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
        
        // Add styling
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            pointer-events: none;
        `;
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    toast.style.cssText = `
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease-out;
        pointer-events: auto;
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(function() {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

// ============================================
// ANIMATIONS (CSS in style tag)
// ============================================

// Add animation styles if not already present
function addAnimationStyles() {
    let style = document.querySelector('style[data-animations]');
    
    if (!style) {
        style = document.createElement('style');
        style.setAttribute('data-animations', 'true');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Call this on load
addAnimationStyles();

// ============================================
// FORM VALIDATION HELPERS
// ============================================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

// Log page load time
window.addEventListener('load', function() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page load time: ' + pageLoadTime + 'ms');
    }
});

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.error);
    // You can send error logs to your server here
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    // You can send error logs to your server here
});

// ============================================
// EXPORT FOR MODULE SYSTEMS (if needed)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleSearch,
        handleTabClick,
        showMessage,
        validateEmail,
        validatePhone
    };
}
