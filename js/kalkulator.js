// Kalkulator page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load projects into select element
    loadProjectsIntoSelect();
    
    // Add event listeners
    document.getElementById('calculateBtn').addEventListener('click', calculateSalary);
    document.getElementById('saveResultBtn').addEventListener('click', saveCalculationResult);
    document.getElementById('exportBtn').addEventListener('click', toggleExportOptions);
    
    // Export options event listeners
    document.getElementById('exportPNG').addEventListener('click', () => exportCalculation('png'));
    document.getElementById('exportPDF').addEventListener('click', () => exportCalculation('pdf'));
    document.getElementById('exportTXT').addEventListener('click', () => exportCalculation('txt'));
    document.getElementById('exportDOCS').addEventListener('click', () => exportCalculation('docs'));
    
    // Close export options when clicking outside
    document.addEventListener('click', function(event) {
        const exportOptions = document.getElementById('exportOptions');
        const exportBtn = document.getElementById('exportBtn');
        
        if (!exportBtn.contains(event.target) && !exportOptions.contains(event.target)) {
            exportOptions.classList.add('hidden');
        }
    });
});

// Load projects into select element
function loadProjectsIntoSelect() {
    const projects = getProjects();
    const projectSelect = document.getElementById('projectSelect');
    
    // Clear existing options except the first one
    while (projectSelect.options.length > 1) {
        projectSelect.remove(1);
    }
    
    // Add project options
    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        projectSelect.appendChild(option);
    });
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

// Calculate salary for selected project
function calculateSalary() {
    const projectId = document.getElementById('projectSelect').value;
    
    if (!projectId) {
        alert('Silakan pilih proyek terlebih dahulu');
        return;
    }
    
    // Get project and workers data
    const projects = getProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
        alert('Proyek tidak ditemukan');
        return;
    }
    
    const workers = getWorkersForProject(projectId);
    
    if (workers.length === 0) {
        alert('Tidak ada pekerja dalam proyek ini');
        return;
    }
    
    // Group workers by position
    const workersByPosition = {};
    workers.forEach(worker => {
        if (!workersByPosition[worker.position]) {
            workersByPosition[worker.position] = [];
        }
        workersByPosition[worker.position].push(worker);
    });
    
    // Calculate totals by position
    const totalsByPosition = {};
    Object.keys(workersByPosition).forEach(position => {
        totalsByPosition[position] = workersByPosition[position].reduce(
            (total, worker) => total + calculateWorkerSalary(worker), 0
        );
    });
    
    // Calculate grand total
    const grandTotal = Object.values(totalsByPosition).reduce((total, positionTotal) => total + positionTotal, 0);
    
    // Format the calculation result
    const now = new Date();
    const formattedDate = formatDate(now);
    const formattedTime = formatTime(now);
    
    let resultText = `RINCIAN GAJI\n`;
    resultText += `Tanggal: ${formattedDate}\n`;
    resultText += `Lokasi: ${project.address}\n`;
    resultText += `Waktu: ${formattedTime}\n\n`;
    
    // Add workers by position
    Object.keys(workersByPosition).forEach(position => {
        const positionName = position.toUpperCase();
        resultText += `${positionName}:\n`;
        
        workersByPosition[position].forEach(worker => {
            const salary = calculateWorkerSalary(worker);
            resultText += `${worker.name} (${worker.position}): ${worker.workDays} hari = ${formatRupiah(salary)}\n`;
        });
        
        resultText += '\n';
    });
    
    // Add summary
    resultText += `RINGKASAN:\n`;
    Object.keys(totalsByPosition).forEach(position => {
        resultText += `Total Gaji ${position.charAt(0).toUpperCase() + position.slice(1)}: ${formatRupiah(totalsByPosition[position])}\n`;
    });
    resultText += `Total Keseluruhan: ${formatRupiah(grandTotal)}\n`;
    
    // Format the result with HTML
    const formattedResult = formatCalculationResult(resultText);
    
    // Display the result
    const resultElement = document.getElementById('calculationResult');
    resultElement.innerHTML = formattedResult;
    
    // Add watermark
    const watermarkDiv = document.createElement('div');
    watermarkDiv.className = 'absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0';
    watermarkDiv.innerHTML = '<div class="text-6xl font-bold text-gray-500 transform rotate-45 select-none">HitungYuk</div>';
    resultElement.appendChild(watermarkDiv);
    
    // Make sure the result container has relative positioning for the watermark
    resultElement.classList.add('relative');
    
    // Enable save and export buttons
    document.getElementById('saveResultBtn').disabled = false;
    document.getElementById('exportBtn').disabled = false;
    
    // Store current calculation in session storage for export
    sessionStorage.setItem('currentCalculation', JSON.stringify({
        projectId: project.id,
        projectName: project.name,
        projectAddress: project.address,
        date: now.toISOString(),
        workers: workers,
        totalsByPosition: totalsByPosition,
        grandTotal: grandTotal,
        resultText: resultText
    }));
}

// Save calculation result to local storage
function saveCalculationResult() {
    const currentCalculation = JSON.parse(sessionStorage.getItem('currentCalculation'));
    
    if (!currentCalculation) {
        alert('Tidak ada hasil perhitungan untuk disimpan');
        return;
    }
    
    const calculations = getCalculations();
    const newCalculation = {
        id: generateId(),
        ...currentCalculation,
        savedAt: new Date().toISOString()
    };
    
    calculations.push(newCalculation);
    saveCalculations(calculations);
    
    alert('Hasil perhitungan berhasil disimpan!');
    
    // Disable save button to prevent duplicate saves
    document.getElementById('saveResultBtn').disabled = true;
}

// Toggle export options dropdown
function toggleExportOptions() {
    const exportOptions = document.getElementById('exportOptions');
    exportOptions.classList.toggle('hidden');
}

// Export calculation to different formats
function exportCalculation(format) {
    const currentCalculation = JSON.parse(sessionStorage.getItem('currentCalculation'));
    
    if (!currentCalculation) {
        alert('Tidak ada hasil perhitungan untuk diekspor');
        return;
    }
    
    const resultElement = document.getElementById('calculationResult');
    
    switch (format) {
        case 'png':
            exportAsPNG(resultElement, currentCalculation.projectName);
            break;
        case 'pdf':
            exportAsPDF(resultElement, currentCalculation.projectName);
            break;
        case 'txt':
            exportAsTXT(currentCalculation.resultText, currentCalculation.projectName);
            break;
        case 'docs':
            exportAsDOCS(currentCalculation.resultText, currentCalculation.projectName);
            break;
        default:
            alert('Format ekspor tidak valid');
    }
    
    // Hide export options
    document.getElementById('exportOptions').classList.add('hidden');
}

// Export as PNG
function exportAsPNG(element, filename) {
    // Create a clone of the element to avoid modifying the original
    const clone = element.cloneNode(true);
    clone.style.width = element.offsetWidth + 'px';
    clone.style.padding = '20px';
    clone.style.background = 'white';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '-9999px';
    document.body.appendChild(clone);
    
    html2canvas(clone, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'white'
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${filename}_gaji.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Remove the clone after export
        document.body.removeChild(clone);
    }).catch(error => {
        console.error('Error exporting as PNG:', error);
        alert('Gagal mengekspor sebagai PNG. Silakan coba lagi.');
        document.body.removeChild(clone);
    });
}

// Export as PDF
function exportAsPDF(element, filename) {
    // Create a clone of the element to avoid modifying the original
    const clone = element.cloneNode(true);
    clone.style.width = element.offsetWidth + 'px';
    clone.style.padding = '20px';
    clone.style.background = 'white';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '-9999px';
    document.body.appendChild(clone);
    
    html2canvas(clone, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'white'
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        
        // Initialize jsPDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${filename}_gaji.pdf`);
        
        // Remove the clone after export
        document.body.removeChild(clone);
    }).catch(error => {
        console.error('Error exporting as PDF:', error);
        alert('Gagal mengekspor sebagai PDF. Silakan coba lagi.');
        document.body.removeChild(clone);
    });
}

// Export as TXT
function exportAsTXT(text, filename) {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `${filename}_gaji.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
}

// Export as DOCS (simplified as docx)
function exportAsDOCS(text, filename) {
    // For simplicity, we'll just create a text file with .docx extension
    // In a real app, you would use a library like docx.js
    const blob = new Blob([text], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const link = document.createElement('a');
    link.download = `${filename}_gaji.docx`;
    link.href = URL.createObjectURL(blob);
    link.click();
}
