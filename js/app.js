// Format currency to simplified Indonesian format (K for thousands, juta for millions)
function formatRupiahSimplified(number) {
    if (number >= 1000000) {
        // Convert to millions (juta)
        const millions = number / 1000000;
        if (millions % 1 === 0) {
            // If it's a whole number
            return `${millions} juta`;
        } else {
            // If it has decimal places, show one decimal place
            return `${millions.toFixed(1)} juta`;
        }
    } else if (number >= 1000) {
        // Convert to thousands (K)
        const thousands = number / 1000;
        if (thousands % 1 === 0) {
            // If it's a whole number
            return `${thousands}K`;
        } else {
            // If it has decimal places, show one decimal place
            return `${thousands.toFixed(1)}K`;
        }
    } else {
        // For numbers less than 1000, just format normally
        return new Intl.NumberFormat('id-ID').format(number);
    }
}

// Main application JavaScript
// Handles common functionality across all pages

// Initialize local storage if not already set up
function initializeLocalStorage() {
    if (!localStorage.getItem('hitungyuk_projects')) {
        localStorage.setItem('hitungyuk_projects', JSON.stringify([]));
    }
    if (!localStorage.getItem('hitungyuk_workers')) {
        localStorage.setItem('hitungyuk_workers', JSON.stringify([]));
    }
    if (!localStorage.getItem('hitungyuk_calculations')) {
        localStorage.setItem('hitungyuk_calculations', JSON.stringify([]));
    }
    if (!localStorage.getItem('hitungyuk_profile')) {
        localStorage.setItem('hitungyuk_profile', JSON.stringify({
            username: '',
            email: '',
            phone: '',
            bio: '',
            profileImage: null
        }));
    }
    if (!localStorage.getItem('hitungyuk_settings')) {
        localStorage.setItem('hitungyuk_settings', JSON.stringify({
            notifications: false,
            autoSave: true
        }));
    }
}

// Format currency to Indonesian Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

// Format number with thousand separator
function formatNumber(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}

// Format date to Indonesian format
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('id-ID', options);
}

// Format time to Indonesian format
function formatTime(date) {
    return new Date(date).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Get current date and time
function getCurrentDateTime() {
    return new Date();
}

// Get projects from local storage
function getProjects() {
    return JSON.parse(localStorage.getItem('hitungyuk_projects') || '[]');
}

// Save projects to local storage
function saveProjects(projects) {
    localStorage.setItem('hitungyuk_projects', JSON.stringify(projects));
}

// Get workers from local storage
function getWorkers() {
    return JSON.parse(localStorage.getItem('hitungyuk_workers') || '[]');
}

// Save workers to local storage
function saveWorkers(workers) {
    localStorage.setItem('hitungyuk_workers', JSON.stringify(workers));
}

// Get calculations from local storage
function getCalculations() {
    return JSON.parse(localStorage.getItem('hitungyuk_calculations') || '[]');
}

// Save calculations to local storage
function saveCalculations(calculations) {
    localStorage.setItem('hitungyuk_calculations', JSON.stringify(calculations));
}

// Get profile from local storage
function getProfile() {
    return JSON.parse(localStorage.getItem('hitungyuk_profile') || '{}');
}

// Save profile to local storage
function saveProfile(profile) {
    localStorage.setItem('hitungyuk_profile', JSON.stringify(profile));
}

// Get settings from local storage
function getSettings() {
    return JSON.parse(localStorage.getItem('hitungyuk_settings') || '{}');
}

// Save settings to local storage
function saveSettings(settings) {
    localStorage.setItem('hitungyuk_settings', JSON.stringify(settings));
}

// Get workers for a specific project
function getWorkersForProject(projectId) {
    const workers = getWorkers();
    return workers.filter(worker => worker.projectId === projectId);
}

// Calculate total salary for a worker
function calculateWorkerSalary(worker) {
    return worker.dailySalary * worker.workDays;
}

// Calculate total salary for all workers in a project
function calculateProjectTotalSalary(projectId) {
    const workers = getWorkersForProject(projectId);
    return workers.reduce((total, worker) => total + calculateWorkerSalary(worker), 0);
}

// Get total number of workers across all projects
function getTotalWorkers() {
    // First check if we have calculations
    const calculations = getCalculations();
    if (calculations && calculations.length > 0) {
        // Get the latest calculation
        const latestCalculation = calculations[calculations.length - 1];
        
        // Return the number of workers from the calculation if available
        if (latestCalculation.workers) {
            return latestCalculation.workers.length;
        }
    }
    
    // Fallback to raw data if no calculations
    return getWorkers().length;
}

// Get total number of work days across all projects
function getTotalWorkDays() {
    // First check if we have calculations
    const calculations = getCalculations();
    if (calculations && calculations.length > 0) {
        // Get the latest calculation
        const latestCalculation = calculations[calculations.length - 1];
        
        // Return the total work days from the calculation if available
        if (latestCalculation.workers) {
            return latestCalculation.workers.reduce((total, worker) => total + worker.workDays, 0);
        }
    }
    
    // Fallback to raw data if no calculations
    const workers = getWorkers();
    return workers.reduce((total, worker) => total + worker.workDays, 0);
}

// Get total number of projects
function getTotalProjects() {
    // First check if we have calculations
    const calculations = getCalculations();
    if (calculations && calculations.length > 0) {
        // Count unique projects in calculations
        const projectIds = new Set(calculations.map(calc => calc.projectId));
        return projectIds.size;
    }
    
    // Fallback to raw data if no calculations
    return getProjects().length;
}

// Get total salary across all projects
function getTotalSalary() {
    // First check if we have calculations
    const calculations = getCalculations();
    if (calculations && calculations.length > 0) {
        // Get the latest calculation
        const latestCalculation = calculations[calculations.length - 1];
        
        // Return the total amount from the calculation if available
        if (latestCalculation.totalAmount) {
            return latestCalculation.totalAmount;
        }
    }
    
    // Fallback to raw data if no calculations
    const workers = getWorkers();
    return workers.reduce((total, worker) => total + calculateWorkerSalary(worker), 0);
}

// Generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Add page transition effect
function addPageTransitionEffect() {
    const content = document.querySelector('.page-content');
    if (content) {
        content.classList.add('fade-in');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeLocalStorage();
    
    // Add page transition effect
    addPageTransitionEffect();
    
    // Set active navigation link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage) {
            link.classList.add('active');
        }
    });
});
