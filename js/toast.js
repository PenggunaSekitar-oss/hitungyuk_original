// Toast notification system

// Create a self-contained toast system
window.toastSystem = (function() {
    // Create toast container if it doesn't exist
    function createToastContainer() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed inset-0 flex items-center justify-center z-50 pointer-events-none hidden';
            document.body.appendChild(container);
        }
    }

    // Get time-based greeting
    function getTimeBasedGreeting() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            return 'pagi';
        } else if (hour >= 12 && hour < 15) {
            return 'siang';
        } else if (hour >= 15 && hour < 19) {
            return 'sore';
        } else {
            return 'malam';
        }
    }

    // Show welcome toast with user's name
    function showWelcomeToast() {
        const currentUser = JSON.parse(sessionStorage.getItem('hitungyuk_current_user'));
        
        // Only show toast if this is the first login (not on refresh)
        if (!currentUser || currentUser.isFirstLogin === false) {
            return;
        }
        
        // Mark that we've shown the toast
        currentUser.isFirstLogin = false;
        sessionStorage.setItem('hitungyuk_current_user', JSON.stringify(currentUser));
        
        const greeting = getTimeBasedGreeting();
        const message = `Selamat ${greeting} ${currentUser.username}! Selamat bekerja.`;
        
        showToast(message, 7000); // Show for 7 seconds
    }

    // Show a toast notification
    function showToast(message, duration = 7000) {
        createToastContainer();
        
        const container = document.getElementById('toast-container');
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto pointer-events-auto toast-enter';
        toast.innerHTML = `
            <div class="flex items-center">
                <div class="flex-shrink-0 text-indigo-500">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="ml-3 text-gray-800 font-medium">${message}</div>
                <div class="ml-auto pl-3">
                    <button class="text-gray-400 hover:text-gray-500 focus:outline-none" id="close-toast">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        // Add blur effect to main content
        const pageContent = document.querySelector('.page-content');
        if (pageContent) {
            pageContent.classList.add('blur-effect');
        }
        
        // Prevent scrolling
        document.body.classList.add('toast-active');
        
        // Show container
        container.classList.remove('hidden');
        container.appendChild(toast);
        
        // Add close button functionality
        const closeButton = document.getElementById('close-toast');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                closeToast(toast);
            });
        }
        
        // Auto close after duration
        setTimeout(function() {
            if (document.body.contains(toast)) {
                closeToast(toast);
            }
        }, duration);
    }

    // Close toast notification
    function closeToast(toast) {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-exit');
        
        // Remove blur effect
        const pageContent = document.querySelector('.page-content');
        if (pageContent) {
            pageContent.classList.remove('blur-effect');
        }
        
        // Allow scrolling again
        document.body.classList.remove('toast-active');
        
        // Remove toast after animation
        setTimeout(function() {
            if (document.body.contains(toast)) {
                toast.remove();
                
                // Hide container if no more toasts
                const container = document.getElementById('toast-container');
                if (container && container.children.length === 0) {
                    container.classList.add('hidden');
                }
            }
        }, 500);
    }

    // Public API
    return {
        showWelcomeToast: showWelcomeToast,
        showToast: showToast
    };
})();
