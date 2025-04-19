// Function to toggle custom position field visibility
function toggleCustomPosition() {
    const positionSelect = document.getElementById('workerPosition');
    const customPositionField = document.getElementById('customPositionField');
    
    if (positionSelect.value === 'custom') {
        customPositionField.classList.remove('hidden');
    } else {
        customPositionField.classList.add('hidden');
    }
}

// Function to format number input with thousand separators
function formatNumberInput(input) {
    // Remove non-numeric characters
    let value = input.value.replace(/\D/g, '');
    
    // Format with thousand separators
    if (value) {
        value = parseInt(value).toLocaleString('id-ID');
    }
    
    // Update input value
    input.value = value;
    
    return value;
}

// Function to get raw number from formatted input
function getRawNumber(formattedValue) {
    return parseInt(formattedValue.replace(/\D/g, '')) || 0;
}

// Function to save project
function saveProject() {
    const projectName = document.getElementById('projectName').value.trim();
    const projectAddress = document.getElementById('projectAddress').value.trim();
    
    if (!projectName || !projectAddress) {
        alert('Silakan isi semua field yang diperlukan');
        return;
    }
    
    const projects = getProjects();
    const newProject = {
        id: generateId(),
        name: projectName,
        address: projectAddress,
        createdAt: new Date().toISOString()
    };
    
    projects.push(newProject);
    saveProjects(projects);
    
    // Reset form
    document.getElementById('projectName').value = '';
    document.getElementById('projectAddress').value = '';
    
    // Reload projects in select elements
    loadProjectsInSelect();
    
    alert('Proyek berhasil disimpan!');
}

// Modified saveWorker function to handle custom position
function saveWorker() {
    const projectId = document.getElementById('selectProject').value;
    const workerName = document.getElementById('workerName').value.trim();
    let workerPosition = document.getElementById('workerPosition').value;
    const dailySalaryInput = document.getElementById('dailySalary');
    const workDaysInput = document.getElementById('workDays');
    
    // Get raw numbers from formatted inputs
    const dailySalary = getRawNumber(dailySalaryInput.value);
    const workDays = parseInt(workDaysInput.value) || 0;
    
    // Handle custom position
    if (workerPosition === 'custom') {
        const customPosition = document.getElementById('customPosition').value.trim();
        if (!customPosition) {
            alert('Silakan isi posisi kerja kustom');
            return;
        }
        workerPosition = customPosition;
    }
    
    if (!projectId || !workerName || !workerPosition || dailySalary <= 0 || workDays <= 0) {
        alert('Silakan isi semua field yang diperlukan');
        return;
    }
    
    const workers = getWorkers();
    const newWorker = {
        id: generateId(),
        projectId: projectId,
        name: workerName,
        position: workerPosition,
        dailySalary: dailySalary,
        workDays: workDays,
        createdAt: new Date().toISOString()
    };
    
    workers.push(newWorker);
    saveWorkers(workers);
    
    // Reset form
    document.getElementById('workerName').value = '';
    document.getElementById('workerPosition').value = '';
    document.getElementById('customPosition').value = '';
    document.getElementById('customPositionField').classList.add('hidden');
    dailySalaryInput.value = '';
    workDaysInput.value = '';
    
    // Reload workers list
    loadWorkersList();
    
    alert('Pekerja berhasil ditambahkan!');
}

// Modified updateWorker function to handle custom position
function updateWorker(workerId) {
    const projectId = document.getElementById('selectProject').value;
    const workerName = document.getElementById('workerName').value.trim();
    let workerPosition = document.getElementById('workerPosition').value;
    const dailySalaryInput = document.getElementById('dailySalary');
    const workDaysInput = document.getElementById('workDays');
    
    // Get raw numbers from formatted inputs
    const dailySalary = getRawNumber(dailySalaryInput.value);
    const workDays = parseInt(workDaysInput.value) || 0;
    
    // Handle custom position
    if (workerPosition === 'custom') {
        const customPosition = document.getElementById('customPosition').value.trim();
        if (!customPosition) {
            alert('Silakan isi posisi kerja kustom');
            return;
        }
        workerPosition = customPosition;
    }
    
    if (!projectId || !workerName || !workerPosition || dailySalary <= 0 || workDays <= 0) {
        alert('Silakan isi semua field yang diperlukan');
        return;
    }
    
    const workers = getWorkers();
    const workerIndex = workers.findIndex(w => w.id === workerId);
    
    if (workerIndex === -1) {
        alert('Pekerja tidak ditemukan');
        return;
    }
    
    workers[workerIndex] = {
        ...workers[workerIndex],
        projectId: projectId,
        name: workerName,
        position: workerPosition,
        dailySalary: dailySalary,
        workDays: workDays,
        updatedAt: new Date().toISOString()
    };
    
    saveWorkers(workers);
    
    // Reset form
    document.getElementById('workerName').value = '';
    document.getElementById('workerPosition').value = '';
    document.getElementById('customPosition').value = '';
    document.getElementById('customPositionField').classList.add('hidden');
    dailySalaryInput.value = '';
    workDaysInput.value = '';
    
    // Reset save button
    const saveButton = document.getElementById('saveWorkerBtn');
    saveButton.textContent = 'Tambah Pekerja';
    saveButton.onclick = saveWorker;
    
    // Reload workers list
    loadWorkersList();
    
    alert('Pekerja berhasil diupdate!');
}

// Modified editWorker function to handle custom position
function editWorker(workerId) {
    const workers = getWorkers();
    const worker = workers.find(w => w.id === workerId);
    
    if (!worker) {
        alert('Pekerja tidak ditemukan');
        return;
    }
    
    // Fill form with worker data
    document.getElementById('selectProject').value = worker.projectId;
    document.getElementById('workerName').value = worker.name;
    
    // Handle position (check if it's a standard position or custom)
    const standardPositions = ['tukang', 'buruh', 'mandor', 'manager'];
    if (standardPositions.includes(worker.position)) {
        document.getElementById('workerPosition').value = worker.position;
        document.getElementById('customPositionField').classList.add('hidden');
    } else {
        document.getElementById('workerPosition').value = 'custom';
        document.getElementById('customPosition').value = worker.position;
        document.getElementById('customPositionField').classList.remove('hidden');
    }
    
    // Format and set salary and work days
    document.getElementById('dailySalary').value = worker.dailySalary.toLocaleString('id-ID');
    document.getElementById('workDays').value = worker.workDays;
    
    // Change save button to update
    const saveButton = document.getElementById('saveWorkerBtn');
    saveButton.textContent = 'Update Pekerja';
    saveButton.onclick = function() {
        updateWorker(workerId);
    };
    
    // Scroll to form
    document.getElementById('workerForm').scrollIntoView({ behavior: 'smooth' });
}

// Function to delete worker
function deleteWorker(workerId) {
    if (confirm('Apakah Anda yakin ingin menghapus pekerja ini?')) {
        const workers = getWorkers();
        const updatedWorkers = workers.filter(w => w.id !== workerId);
        saveWorkers(updatedWorkers);
        loadWorkersList();
        alert('Pekerja berhasil dihapus!');
    }
}

// Function to load projects in select elements
function loadProjectsInSelect() {
    const projects = getProjects();
    const selectProject = document.getElementById('selectProject');
    const filterProject = document.getElementById('filterProject');
    
    // Clear previous options except the first one
    while (selectProject.options.length > 1) {
        selectProject.remove(1);
    }
    
    while (filterProject.options.length > 1) {
        filterProject.remove(1);
    }
    
    // Add project options
    projects.forEach(project => {
        const option1 = document.createElement('option');
        option1.value = project.id;
        option1.textContent = project.name;
        selectProject.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = project.id;
        option2.textContent = project.name;
        filterProject.appendChild(option2);
    });
}

// Function to load workers list
function loadWorkersList() {
    const workers = getWorkers();
    const projects = getProjects();
    const workersListElement = document.getElementById('workersList');
    const filterProject = document.getElementById('filterProject').value;
    
    // Clear previous list
    workersListElement.innerHTML = '';
    
    // Filter workers by project if needed
    const filteredWorkers = filterProject === 'all' 
        ? workers 
        : workers.filter(w => w.projectId === filterProject);
    
    if (filteredWorkers.length === 0) {
        workersListElement.innerHTML = '<p class="text-gray-500 text-center py-4">Belum ada data pekerja</p>';
        return;
    }
    
    // Group workers by project
    const workersByProject = {};
    filteredWorkers.forEach(worker => {
        if (!workersByProject[worker.projectId]) {
            workersByProject[worker.projectId] = [];
        }
        workersByProject[worker.projectId].push(worker);
    });
    
    // Create workers list by project
    Object.keys(workersByProject).forEach(projectId => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;
        
        const projectElement = document.createElement('div');
        projectElement.className = 'mb-4';
        
        const projectHeader = document.createElement('h3');
        projectHeader.className = 'font-medium text-purple-600 mb-2';
        projectHeader.textContent = project.name;
        projectElement.appendChild(projectHeader);
        
        const workersList = document.createElement('div');
        workersList.className = 'space-y-2';
        
        workersByProject[projectId].forEach(worker => {
            const workerItem = document.createElement('div');
            workerItem.className = 'bg-gray-50 p-3 rounded-md';
            
            const workerHeader = document.createElement('div');
            workerHeader.className = 'flex justify-between items-center mb-1';
            
            const workerName = document.createElement('h4');
            workerName.className = 'font-medium';
            workerName.textContent = worker.name;
            workerHeader.appendChild(workerName);
            
            const actionButtons = document.createElement('div');
            actionButtons.className = 'space-x-2';
            
            const editButton = document.createElement('button');
            editButton.className = 'text-blue-500 text-sm';
            editButton.textContent = 'Edit';
            editButton.onclick = () => editWorker(worker.id);
            actionButtons.appendChild(editButton);
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'text-red-500 text-sm';
            deleteButton.textContent = 'Hapus';
            deleteButton.onclick = () => deleteWorker(worker.id);
            actionButtons.appendChild(deleteButton);
            
            workerHeader.appendChild(actionButtons);
            workerItem.appendChild(workerHeader);
            
            const workerDetails = document.createElement('div');
            workerDetails.className = 'text-sm text-gray-600';
            workerDetails.innerHTML = `
                <p>Posisi: ${worker.position}</p>
                <p>Gaji Harian: ${formatRupiah(worker.dailySalary)}</p>
                <p>Hari Kerja: ${worker.workDays} hari</p>
                <p>Total: ${formatRupiah(worker.dailySalary * worker.workDays)}</p>
            `;
            workerItem.appendChild(workerDetails);
            
            workersList.appendChild(workerItem);
        });
        
        projectElement.appendChild(workersList);
        workersListElement.appendChild(projectElement);
    });
}

// Helper function to get projects from local storage
function getProjects() {
    const projectsJSON = localStorage.getItem('hitungyuk_projects');
    return projectsJSON ? JSON.parse(projectsJSON) : [];
}

// Helper function to save projects to local storage
function saveProjects(projects) {
    localStorage.setItem('hitungyuk_projects', JSON.stringify(projects));
}

// Helper function to get workers from local storage
function getWorkers() {
    const workersJSON = localStorage.getItem('hitungyuk_workers');
    return workersJSON ? JSON.parse(workersJSON) : [];
}

// Helper function to save workers to local storage
function saveWorkers(workers) {
    localStorage.setItem('hitungyuk_workers', JSON.stringify(workers));
}

// Helper function to generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners
    document.getElementById('saveProjectBtn').addEventListener('click', saveProject);
    document.getElementById('saveWorkerBtn').addEventListener('click', saveWorker);
    document.getElementById('filterProject').addEventListener('change', loadWorkersList);
    
    // Add input event listeners for number formatting
    const dailySalaryInput = document.getElementById('dailySalary');
    if (dailySalaryInput) {
        dailySalaryInput.addEventListener('input', function() {
            formatNumberInput(this);
        });
        dailySalaryInput.addEventListener('blur', function() {
            formatNumberInput(this);
        });
    }
    
    const workDaysInput = document.getElementById('workDays');
    if (workDaysInput) {
        workDaysInput.addEventListener('input', function() {
            // For work days, we don't need thousand separators, but we ensure it's a valid number
            this.value = this.value.replace(/\D/g, '');
        });
    }
    
    // Load projects in select elements
    loadProjectsInSelect();
    
    // Load workers list
    loadWorkersList();
});
