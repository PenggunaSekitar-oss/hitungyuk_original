// Profil page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load profile data
    loadProfileData();
    
    // Load settings
    loadSettings();
    
    // Add event listeners
    document.getElementById('profilePicture').addEventListener('change', handleProfileImageUpload);
    document.getElementById('saveProfileBtn').addEventListener('click', saveProfileData);
    document.getElementById('notificationToggle').addEventListener('change', saveSettings);
    document.getElementById('autoSaveToggle').addEventListener('change', saveSettings);
    document.getElementById('dataSaverToggle').addEventListener('change', saveSettings);
});

// Load profile data from local storage
function loadProfileData() {
    const profile = getProfile();
    
    // Fill form with profile data
    document.getElementById('username').value = profile.username || '';
    document.getElementById('email').value = profile.email || '';
    document.getElementById('phone').value = profile.phone || '';
    document.getElementById('bio').value = profile.bio || '';
    
    // Display profile image if exists
    if (profile.profileImage) {
        // Check if profileImage element exists, if not create it
        let profileImage = document.querySelector('.w-24.h-24 img');
        if (!profileImage) {
            profileImage = document.createElement('img');
            profileImage.className = 'w-full h-full object-cover rounded-full';
            profileImage.alt = 'Profile Picture';
            
            const container = document.querySelector('.w-24.h-24');
            // Hide the SVG icon
            const svgIcon = container.querySelector('svg');
            if (svgIcon) {
                svgIcon.style.display = 'none';
            }
            
            // Append the image to the container
            container.appendChild(profileImage);
        }
        
        // Set the image source
        profileImage.src = profile.profileImage;
    }
}

// Handle profile image upload
function handleProfileImageUpload(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
        alert('Silakan pilih file gambar');
        return;
    }
    
    // Read file as data URL
    const reader = new FileReader();
    reader.onload = function(e) {
        const container = document.querySelector('.w-24.h-24');
        
        // Hide the SVG icon
        const svgIcon = container.querySelector('svg');
        if (svgIcon) {
            svgIcon.style.display = 'none';
        }
        
        // Check if profileImage element exists, if not create it
        let profileImage = container.querySelector('img');
        if (!profileImage) {
            profileImage = document.createElement('img');
            profileImage.className = 'w-full h-full object-cover rounded-full';
            profileImage.alt = 'Profile Picture';
            container.appendChild(profileImage);
        }
        
        // Set the image source
        profileImage.src = e.target.result;
        
        // Save image to profile
        const profile = getProfile();
        profile.profileImage = e.target.result;
        saveProfile(profile);
    };
    reader.readAsDataURL(file);
}

// Save profile data to local storage
function saveProfileData() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const bio = document.getElementById('bio').value.trim();
    
    // Validate email format
    if (email && !isValidEmail(email)) {
        alert('Format email tidak valid');
        return;
    }
    
    // Get existing profile
    const profile = getProfile();
    
    // Update profile data
    profile.username = username;
    profile.email = email;
    profile.phone = phone;
    profile.bio = bio;
    profile.updatedAt = new Date().toISOString();
    
    // Save profile
    saveProfile(profile);
    
    alert('Profil berhasil disimpan!');
}

// Load settings from local storage
function loadSettings() {
    const settings = getSettings();
    
    document.getElementById('notificationToggle').checked = settings.notifications || false;
    document.getElementById('autoSaveToggle').checked = settings.autoSave !== false; // Default to true
    document.getElementById('dataSaverToggle').checked = settings.dataSaver || false;
}

// Save settings to local storage
function saveSettings() {
    const notifications = document.getElementById('notificationToggle').checked;
    const autoSave = document.getElementById('autoSaveToggle').checked;
    const dataSaver = document.getElementById('dataSaverToggle').checked;
    
    const settings = {
        notifications: notifications,
        autoSave: autoSave,
        dataSaver: dataSaver,
        updatedAt: new Date().toISOString()
    };
    
    saveSettings(settings);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
