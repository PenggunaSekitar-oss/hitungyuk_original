// Dashboard page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Update dashboard statistics
    updateDashboardStats();
    
    // Initialize chart
    initializeStatisticsChart();
    
    // Set up auto-refresh for dashboard data
    setInterval(updateDashboardStats, 5000); // Refresh every 5 seconds
});

// Update dashboard statistics from local storage data
function updateDashboardStats() {
    // Get statistics from local storage
    const totalWorkers = getTotalWorkers();
    const totalWorkDays = getTotalWorkDays();
    const totalProjects = getTotalProjects();
    const totalSalary = getTotalSalary();
    
    // Update the UI using more direct and reliable selectors
    // Get all project cards in the grid
    const projectCards = document.querySelectorAll('.project-card');
    
    if (projectCards && projectCards.length >= 4) {
        // Update worker count (first card)
        const workerCountElement = projectCards[0].querySelector('h3');
        if (workerCountElement) {
            workerCountElement.textContent = formatNumber(totalWorkers);
        }
        
        // Update work days (second card)
        const workDaysElement = projectCards[1].querySelector('h3');
        if (workDaysElement) {
            workDaysElement.textContent = formatNumber(totalWorkDays);
        }
        
        // Update project count (third card)
        const projectCountElement = projectCards[2].querySelector('h3');
        if (projectCountElement) {
            projectCountElement.textContent = formatNumber(totalProjects);
        }
        
        // Update total salary (fourth card)
        const salaryElement = projectCards[3].querySelector('h3');
        if (salaryElement) {
            salaryElement.textContent = formatRupiahSimplified(totalSalary);
        }
    }
    
    // Update summary cards
    const calculations = getCalculations();
    if (calculations.length > 0) {
        // Calculate total working hours based on work days
        const totalHours = totalWorkDays * 8; // Assuming 8 hours per day
        const hours = Math.floor(totalHours);
        const minutes = Math.floor((totalHours - hours) * 60);
        const seconds = 0;
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Update working hours
        const workingHoursElement = document.querySelector('.summary-card:first-of-type p');
        if (workingHoursElement) {
            workingHoursElement.textContent = formattedTime;
        }
        
        // Update task count
        const taskCountElement = document.querySelector('.summary-card:last-of-type p');
        if (taskCountElement) {
            taskCountElement.textContent = `${formatNumber(calculations.length)} Task`;
        }
    }
}

// Initialize statistics chart with real data from Pusat Data
function initializeStatisticsChart() {
    const ctx = document.getElementById('statisticsChart');
    if (!ctx) return; // Exit if chart element doesn't exist
    
    // Get calculations data
    const calculations = getCalculations();
    
    if (calculations.length === 0) {
        // If no data, show empty chart with message
        renderEmptyChart(ctx);
        return;
    }
    
    // Process data from calculations
    const chartData = processCalculationsForChart(calculations);
    
    // Create chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: 'Pekerja',
                    data: chartData.workersData,
                    backgroundColor: '#818cf8', // indigo-400
                    borderRadius: 4
                },
                {
                    label: 'Hari Kerja',
                    data: chartData.workDaysData,
                    backgroundColor: '#c084fc', // purple-400
                    borderRadius: 4
                },
                {
                    label: 'Proyek',
                    data: chartData.projectsData,
                    backgroundColor: '#fbbf24', // yellow-400
                    borderRadius: 4
                },
                {
                    label: 'Gaji (dalam juta)',
                    data: chartData.salaryData,
                    backgroundColor: '#34d399', // green-400
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 10,
                        font: {
                            size: 10
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.dataset.label === 'Gaji (dalam juta)') {
                                label += 'Rp ' + context.raw.toFixed(1) + ' juta';
                            } else {
                                label += context.raw;
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        borderDash: [2, 4],
                        color: '#e5e7eb' // gray-200
                    },
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

// Process calculations data for chart
function processCalculationsForChart(calculations) {
    // Sort calculations by date
    calculations.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Limit to last 7 calculations or less
    const recentCalculations = calculations.slice(-7);
    
    // Prepare data arrays
    const labels = [];
    const workersData = [];
    const workDaysData = [];
    const projectsData = [];
    const salaryData = [];
    
    // Process each calculation
    recentCalculations.forEach(calc => {
        // Format date for label (e.g., "19/04")
        const date = new Date(calc.date);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
        labels.push(formattedDate);
        
        // Get worker count
        const workerCount = calc.workers ? calc.workers.length : 0;
        workersData.push(workerCount);
        
        // Get total work days
        const totalWorkDays = calc.workers ? 
            calc.workers.reduce((total, worker) => total + worker.workDays, 0) : 0;
        workDaysData.push(totalWorkDays);
        
        // Each calculation represents one project
        projectsData.push(1);
        
        // Get total salary (in millions for better scale)
        const totalSalary = calc.grandTotal ? calc.grandTotal / 1000000 : 0;
        salaryData.push(totalSalary);
    });
    
    return {
        labels,
        workersData,
        workDaysData,
        projectsData,
        salaryData
    };
}

// Render empty chart with message
function renderEmptyChart(ctx) {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Belum ada data'],
            datasets: [
                {
                    label: 'Data',
                    data: [0],
                    backgroundColor: '#e5e7eb',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        display: false
                    }
                }
            }
        }
    });
}
