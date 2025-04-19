// Pusat Data page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Update data summary
    updateDataSummary();
    
    // Load saved calculations
    loadSavedCalculations();
    
    // Load filter options
    loadFilterOptions();
    
    // Add event listeners
    document.getElementById('filterDate').addEventListener('change', filterCalculations);
    document.getElementById('filterProject').addEventListener('change', filterCalculations);
    document.getElementById('removeAllBtn').addEventListener('click', showRemoveAllConfirmation);
});

// Update data summary
function updateDataSummary() {
    document.getElementById('totalWorkers').textContent = formatNumber(getTotalWorkers());
    document.getElementById('totalWorkDays').textContent = formatNumber(getTotalWorkDays());
    document.getElementById('totalProjects').textContent = formatNumber(getTotalProjects());
    document.getElementById('totalSalary').textContent = formatRupiah(getTotalSalary());
}

// Show confirmation dialog for removing all data
function showRemoveAllConfirmation() {
    // Create modal for confirmation
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm w-full">
            <div class="text-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Peringatan!</h3>
                <p class="text-gray-600">Ini akan menghapus semua data</p>
            </div>
            <div class="flex justify-center space-x-4">
                <button id="cancelRemoveAll" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300 font-medium">
                    Jangan
                </button>
                <button id="confirmRemoveAll" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 font-medium">
                    Gass
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    document.getElementById('cancelRemoveAll').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.getElementById('confirmRemoveAll').addEventListener('click', () => {
        removeAllData();
        document.body.removeChild(modal);
    });
}

// Remove all data
function removeAllData() {
    // Clear all data
    localStorage.setItem('hitungyuk_projects', JSON.stringify([]));
    localStorage.setItem('hitungyuk_workers', JSON.stringify([]));
    localStorage.setItem('hitungyuk_calculations', JSON.stringify([]));
    
    // Reload calculations and update summary
    loadSavedCalculations();
    updateDataSummary();
    loadFilterOptions();
    
    // Show success message
    const successModal = document.createElement('div');
    successModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    successModal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm w-full">
            <div class="text-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Berhasil!</h3>
                <p class="text-gray-600">Semua data telah dihapus</p>
            </div>
            <div class="flex justify-center">
                <button id="closeSuccessModal" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 font-medium">
                    OK
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(successModal);
    
    // Add event listener
    document.getElementById('closeSuccessModal').addEventListener('click', () => {
        document.body.removeChild(successModal);
    });
}

// Load saved calculations
function loadSavedCalculations(dateFilter = 'all', projectFilter = 'all') {
    const calculationsElement = document.getElementById('savedCalculations');
    const calculations = getCalculations();
    
    // Clear existing calculations
    calculationsElement.innerHTML = '';
    
    // Filter calculations if needed
    let filteredCalculations = calculations;
    
    if (dateFilter !== 'all') {
        const filterDate = new Date(dateFilter);
        filteredCalculations = filteredCalculations.filter(calc => {
            const calcDate = new Date(calc.date);
            return calcDate.toDateString() === filterDate.toDateString();
        });
    }
    
    if (projectFilter !== 'all') {
        filteredCalculations = filteredCalculations.filter(calc => calc.projectId === projectFilter);
    }
    
    // Sort calculations by date (newest first)
    filteredCalculations.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // If no calculations, show message
    if (filteredCalculations.length === 0) {
        calculationsElement.innerHTML = '<p class="text-gray-500 text-center py-4">Belum ada perhitungan tersimpan</p>';
        return;
    }
    
    // Add calculations to list
    filteredCalculations.forEach(calculation => {
        const calcDate = new Date(calculation.date);
        const formattedDate = formatDate(calcDate);
        
        const calculationElement = document.createElement('div');
        calculationElement.className = 'bg-white rounded-lg p-4 border shadow-sm';
        calculationElement.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div>
                    <h3 class="font-medium">${calculation.projectName}</h3>
                    <p class="text-sm text-gray-500">${formattedDate}</p>
                </div>
                <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">${formatRupiah(calculation.grandTotal)}</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">${calculation.projectAddress}</p>
            <div class="flex justify-between items-center">
                <div class="flex space-x-2">
                    <span class="text-xs text-gray-500">${calculation.totalsByPosition && Object.keys(calculation.totalsByPosition).length || 0} posisi</span>
                    <span class="text-xs text-gray-500">${calculation.workers && calculation.workers.length || 0} pekerja</span>
                </div>
                <div class="flex space-x-2">
                    <button class="text-blue-500 text-sm" onclick="viewCalculation('${calculation.id}')">Lihat</button>
                    <button class="text-red-500 text-sm" onclick="deleteCalculation('${calculation.id}')">Hapus</button>
                </div>
            </div>
        `;
        
        calculationsElement.appendChild(calculationElement);
    });
}

// Load filter options
function loadFilterOptions() {
    const calculations = getCalculations();
    const dateFilter = document.getElementById('filterDate');
    const projectFilter = document.getElementById('filterProject');
    
    // Clear existing options except the first one
    while (dateFilter.options.length > 1) {
        dateFilter.remove(1);
    }
    
    while (projectFilter.options.length > 1) {
        projectFilter.remove(1);
    }
    
    // Get unique dates
    const dates = new Set();
    calculations.forEach(calc => {
        const date = new Date(calc.date);
        dates.add(date.toISOString().split('T')[0]);
    });
    
    // Add date options
    Array.from(dates).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
        const option = document.createElement('option');
        option.value = date;
        option.textContent = formatDate(new Date(date));
        dateFilter.appendChild(option);
    });
    
    // Get unique projects
    const projects = getProjects();
    
    // Add project options
    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        projectFilter.appendChild(option);
    });
}

// Filter calculations
function filterCalculations() {
    const dateFilter = document.getElementById('filterDate').value;
    const projectFilter = document.getElementById('filterProject').value;
    
    loadSavedCalculations(dateFilter, projectFilter);
}

// Format calculation result text
function formatCalculationResult(resultText) {
    // Parse the result text
    const lines = resultText.split('\n');
    let formattedResult = '';
    
    // Extract header information (first 4 lines typically)
    const headerLines = lines.slice(0, 4);
    
    // Create header with orange border
    formattedResult += '<div class="bg-white border-2 border-orange-400 p-3 mb-4 text-center">\n';
    formattedResult += headerLines.map(line => line.trim()).join('\n');
    formattedResult += '\n</div>\n\n';
    
    // Process the rest of the content with position separators
    let currentSection = '';
    let inSection = false;
    
    for (let i = 4; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check for section headers (like "TUKANG:", "BURUH:", "RINGKASAN:")
        if (line.endsWith(':')) {
            if (inSection) {
                formattedResult += currentSection + '\n</div>\n\n';
            }
            
            inSection = true;
            currentSection = '<div class="mb-3">\n<div class="text-center font-bold mb-2">' + line + '</div>\n';
        } 
        // Check for total lines
        else if (line.startsWith('Total')) {
            if (line.includes('Keseluruhan')) {
                currentSection += '<div class="font-bold text-lg border-t-2 border-gray-300 pt-2 mt-2">' + line + '</div>\n';
            } else {
                currentSection += '<div class="font-bold">' + line + '</div>\n';
            }
        }
        // Regular content
        else if (line.trim() !== '') {
            currentSection += '<div>' + line + '</div>\n';
        }
    }
    
    if (inSection) {
        formattedResult += currentSection + '</div>\n';
    }
    
    // Add footer
    formattedResult += '<div class="text-center text-sm text-gray-500 mt-4 pt-3 border-t border-gray-300">Dibuat dengan Hitungyuk.my.id</div>';
    
    return formattedResult;
}

// Copy text to clipboard
function copyToClipboard(text) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    
    // Select and copy the text
    textarea.select();
    document.execCommand('copy');
    
    // Remove the temporary textarea
    document.body.removeChild(textarea);
    
    // Show success message
    const copyBtn = document.getElementById('copyBtn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Tersalin!';
    copyBtn.classList.remove('bg-gray-500');
    copyBtn.classList.add('bg-green-500');
    
    // Reset button after 2 seconds
    setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('bg-green-500');
        copyBtn.classList.add('bg-gray-500');
    }, 2000);
}

// View calculation details
function viewCalculation(calculationId) {
    const calculations = getCalculations();
    const calculation = calculations.find(calc => calc.id === calculationId);
    
    if (!calculation) {
        alert('Perhitungan tidak ditemukan');
        return;
    }
    
    // Create modal for viewing calculation
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    // Format the calculation result
    const formattedResult = formatCalculationResult(calculation.resultText);
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium">Detail Perhitungan</h3>
                <button id="closeModal" class="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div id="calculationContent" class="border rounded-md p-4 bg-gray-50 font-mono text-sm mb-4 relative overflow-hidden">
                <div class="relative z-10">
                    ${formattedResult}
                </div>
                <div class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
                    <div class="text-6xl font-bold text-gray-500 transform rotate-45 select-none">HitungYuk</div>
                </div>
            </div>
            <div class="flex justify-center space-x-3 mt-3">
                <button id="copyBtn" class="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 transition duration-300">Salin</button>
                <button id="exportPNG" class="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition duration-300">PNG</button>
                <button id="exportPDF" class="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition duration-300">PDF</button>
                <button id="exportTXT" class="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition duration-300">TXT</button>
                <button id="exportDOCS" class="px-3 py-1 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600 transition duration-300">DOCS</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    document.getElementById('closeModal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.getElementById('copyBtn').addEventListener('click', () => {
        copyToClipboard(calculation.resultText);
    });
    
    document.getElementById('exportPNG').addEventListener('click', () => {
        const resultElement = document.getElementById('calculationContent');
        html2canvas(resultElement).then(canvas => {
            const link = document.createElement('a');
            link.download = `${calculation.projectName}_gaji.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
    
    document.getElementById('exportPDF').addEventListener('click', () => {
        const resultElement = document.getElementById('calculationContent');
        html2canvas(resultElement).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${calculation.projectName}_gaji.pdf`);
        });
    });
    
    document.getElementById('exportTXT').addEventListener('click', () => {
        const blob = new Blob([calculation.resultText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.download = `${calculation.projectName}_gaji.txt`;
        link.href = URL.createObjectURL(blob);
        link.click();
    });
    
    document.getElementById('exportDOCS').addEventListener('click', () => {
        const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>`;
        const postHtml = "</body></html>";
        const html = preHtml + calculation.resultText.replace(/\n/g, '<br>') + postHtml;
        
        const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
        const link = document.createElement('a');
        link.download = `${calculation.projectName}_gaji.doc`;
        link.href = URL.createObjectURL(blob);
        link.click();
    });
}

// Delete calculation
function deleteCalculation(calculationId) {
    // Confirm deletion
    if (!confirm('Apakah Anda yakin ingin menghapus perhitungan ini?')) {
        return;
    }
    
    // Get calculations
    const calculations = getCalculations();
    
    // Find index of calculation to delete
    const index = calculations.findIndex(calc => calc.id === calculationId);
    
    if (index === -1) {
        alert('Perhitungan tidak ditemukan');
        return;
    }
    
    // Remove calculation
    calculations.splice(index, 1);
    
    // Save updated calculations
    localStorage.setItem('hitungyuk_calculations', JSON.stringify(calculations));
    
    // Reload calculations and update summary
    loadSavedCalculations();
    updateDataSummary();
}

// Helper functions
function getCalculations() {
    return JSON.parse(localStorage.getItem('hitungyuk_calculations')) || [];
}

function getProjects() {
    return JSON.parse(localStorage.getItem('hitungyuk_projects')) || [];
}

function getTotalWorkers() {
    const workers = JSON.parse(localStorage.getItem('hitungyuk_workers')) || [];
    return workers.length;
}

function getTotalWorkDays() {
    const calculations = getCalculations();
    let totalDays = 0;
    
    calculations.forEach(calc => {
        if (calc.days) {
            totalDays += parseInt(calc.days);
        }
    });
    
    return totalDays;
}

function getTotalProjects() {
    const projects = getProjects();
    return projects.length;
}

function getTotalSalary() {
    const calculations = getCalculations();
    let totalSalary = 0;
    
    calculations.forEach(calc => {
        if (calc.grandTotal) {
            totalSalary += parseInt(calc.grandTotal);
        }
    });
    
    return totalSalary;
}

function formatDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatRupiah(number) {
    return 'Rp ' + formatNumber(number);
}
