// Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in with persistent session
    checkPersistentSession();
    
    // Tab switching functionality
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');

    // Switch to signup tab
    function showSignupForm() {
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    }

    // Switch to login tab
    function showLoginForm() {
        signupTab.classList.remove('active');
        loginTab.classList.add('active');
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
    }

    // Add event listeners for tab switching
    loginTab.addEventListener('click', showLoginForm);
    signupTab.addEventListener('click', showSignupForm);
    switchToSignup.addEventListener('click', showSignupForm);
    switchToLogin.addEventListener('click', showLoginForm);

    // Initialize local storage for users if not exists
    if (!localStorage.getItem('hitungyuk_users')) {
        localStorage.setItem('hitungyuk_users', JSON.stringify([]));
    }

    // Handle signup form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('signupUsername').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        // Validate inputs
        if (!username || !email || !password || !confirmPassword) {
            alert('Semua field harus diisi');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Format email tidak valid');
            return;
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Password dan konfirmasi password tidak cocok');
            return;
        }
        
        // Check if username already exists
        const users = JSON.parse(localStorage.getItem('hitungyuk_users'));
        if (users.some(user => user.username === username)) {
            alert('Username sudah digunakan, silakan pilih username lain');
            return;
        }
        
        // Check if email already exists
        if (users.some(user => user.email === email)) {
            alert('Email sudah terdaftar, silakan gunakan email lain');
            return;
        }
        
        // Add new user
        const newUser = {
            username,
            email,
            password, // In a real app, this should be hashed
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('hitungyuk_users', JSON.stringify(users));
        
        // Show success message and switch to login
        alert('Pendaftaran berhasil! Silakan login dengan akun baru Anda.');
        showLoginForm();
        
        // Clear signup form
        signupForm.reset();
    });

    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Validate inputs
        if (!username || !password) {
            alert('Username dan password harus diisi');
            return;
        }
        
        // Check credentials
        const users = JSON.parse(localStorage.getItem('hitungyuk_users'));
        const user = users.find(user => user.username === username && user.password === password);
        
        if (!user) {
            alert('Username atau password salah');
            return;
        }
        
        // Login successful
        // Save current user to session storage
        const userData = {
            username: user.username,
            email: user.email,
            loginTime: new Date().toISOString(),
            isFirstLogin: true // Flag to show welcome toast only on first login
        };
        
        sessionStorage.setItem('hitungyuk_current_user', JSON.stringify(userData));
        
        // If remember me is checked, save to localStorage for persistent login
        if (rememberMe) {
            localStorage.setItem('hitungyuk_persistent_user', JSON.stringify({
                username: user.username,
                loginTime: new Date().toISOString()
            }));
        } else {
            // Clear any existing persistent login
            localStorage.removeItem('hitungyuk_persistent_user');
        }
        
        // Redirect to dashboard
        window.location.href = 'index.html';
    });
});

// Check for persistent login session
function checkPersistentSession() {
    // If user is already logged in via session storage, redirect to dashboard
    if (sessionStorage.getItem('hitungyuk_current_user')) {
        window.location.href = 'index.html';
        return;
    }
    
    // Check for persistent login in local storage
    const persistentUser = localStorage.getItem('hitungyuk_persistent_user');
    if (persistentUser) {
        const userData = JSON.parse(persistentUser);
        const users = JSON.parse(localStorage.getItem('hitungyuk_users'));
        const user = users.find(user => user.username === userData.username);
        
        if (user) {
            // Create session for the user
            sessionStorage.setItem('hitungyuk_current_user', JSON.stringify({
                username: user.username,
                email: user.email,
                loginTime: new Date().toISOString(),
                isFirstLogin: false // Not first login, don't show welcome toast
            }));
            
            // Redirect to dashboard
            window.location.href = 'index.html';
        }
    }
}
