/* Page Transition JavaScript */
document.addEventListener('DOMContentLoaded', function() {
    // Create transition elements
    const transitionElement = document.createElement('div');
    transitionElement.className = 'page-transition';
    document.body.appendChild(transitionElement);
    
    // Create loading spinner with text
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'loading-container';
    
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    
    const loadingText = document.createElement('div');
    loadingText.className = 'loading-text';
    loadingText.textContent = 'Memuat halaman...';
    
    loadingContainer.appendChild(loadingSpinner);
    loadingContainer.appendChild(loadingText);
    document.body.appendChild(loadingContainer);
    
    // Handle navigation links
    document.querySelectorAll('a').forEach(link => {
        // Only handle internal links
        if (link.href && link.href.startsWith(window.location.origin)) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetUrl = this.href;
                const targetPage = this.textContent.trim();
                
                // Update loading text based on target page
                loadingText.textContent = `Memuat ${targetPage}...`;
                
                // Show loading spinner
                loadingContainer.classList.add('active');
                
                // Trigger transition animation
                transitionElement.classList.add('active');
                
                // Navigate after animation completes
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 500);
            });
        }
    });
    
    // Hide loading spinner when page is fully loaded
    window.addEventListener('load', function() {
        loadingContainer.classList.remove('active');
    });
});
