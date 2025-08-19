// js/ui/game-ui.js
import { gameState } from '../main.js';
import { elements, flashStat, updateNotificationBadge } from './base.js';
import { eventLibrary } from '../events.js';

// Header UI functions
export function updateHeaderUI() {
    const player = gameState.player;
    elements.playerName.textContent = player.name;
    
    const oldStatus = { 
        energy: parseInt(elements.playerEnergy.textContent), 
        gpa: parseFloat(elements.playerGpa.textContent), 
        stress: parseInt(elements.playerStress.textContent), 
        reputation: parseInt(elements.playerReputation.textContent) 
    };
    
    elements.playerEnergy.textContent = player.status.energy;
    elements.playerGpa.textContent = player.status.gpa.toFixed(2);
    elements.playerStress.textContent = player.status.stress;
    elements.playerReputation.textContent = player.status.reputation;
    
    flashStat(elements.playerEnergy, player.status.energy, oldStatus.energy);
    flashStat(elements.playerGpa, player.status.gpa, oldStatus.gpa);
    flashStat(elements.playerStress, player.status.stress, oldStatus.stress);
    flashStat(elements.playerReputation, player.status.reputation, oldStatus.reputation);
    
    elements.gameDate.textContent = gameState.gameDate.toLocaleString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit' 
    });
    
    updateNotificationBadge();
}

// Dashboard UI functions
export function updateDashboardUI() {
    const { attributes, seasonStats } = gameState.player;
    
    // Format attribute names and display values
    elements.playerAttributes.innerHTML = Object.entries(attributes)
        .map(([key, value]) => `
            <div class="stat-item">
                <div class="label">${formatAttributeName(key)}</div>
                <div class="value">${value}</div>
            </div>
        `).join('');
    
    // Format season stats names and display values
    elements.playerSeasonStats.innerHTML = Object.entries(seasonStats)
        .map(([key, value]) => `
            <div class="stat-item">
                <div class="label">${formatAttributeName(key)}</div>
                <div class="value">${value}</div>
            </div>
        `).join('');
    
    // Display relationships with progress bars
    elements.relationshipsContent.innerHTML = Object.entries(gameState.relationships)
        .map(([id, data]) => `
            <div class="relationship-item">
                <strong>${data.name}</strong>
                <div class="relationship-bar">
                    <div class="relationship-level" style="width: ${data.level}%;"></div>
                </div>
            </div>
        `).join('');

    // New: Update stat chart
    updateStatChart();
}

// Helper function to format attribute names (e.g., "puckHandling" -> "Puck Handling")
function formatAttributeName(name) {
    return name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
}

// Event system functions
export function showEvent(eventId) {
    const event = eventLibrary[eventId];
    if (!event) return;
    
    elements.eventModal.classList.remove('hidden');
    elements.eventTitle.textContent = event.title;
    elements.eventText.textContent = event.text;
    elements.eventChoices.innerHTML = '';
    
    event.choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice.text;
        button.onclick = () => {
            if (choice.action) choice.action(gameState);
            if (choice.nextEvent) showEvent(choice.nextEvent);
            else elements.eventModal.classList.add('hidden');
            updateUI();
        };
        elements.eventChoices.appendChild(button);
    });
}

// New: Update stat chart
function updateStatChart() {
    const ctx = elements.statChart.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], // Dynamic based on gameWeek
            datasets: [
                { label: 'GPA', data: [3.0, gameState.player.status.gpa, gameState.player.status.gpa - 0.1, gameState.player.status.gpa + 0.2] },
                { label: 'Points', data: [0, gameState.player.seasonStats.points, gameState.player.seasonStats.points + 2, gameState.player.seasonStats.points + 5] },
                { label: 'Energy', data: [100, gameState.player.status.energy, gameState.player.status.energy - 10, gameState.player.status.energy + 5] }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize UI event listeners
export function initializeUIListeners() {
    // Menu button listeners
    const mainMenuButton = document.getElementById('main-menu-button');
    if (mainMenuButton) {
        mainMenuButton.addEventListener('click', () => { 
            updateDashboardUI(); 
            elements.menuOverlay.classList.remove('hidden'); 
        });
    }
    
    const closeMenuButton = document.getElementById('close-menu-button');
    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', () => 
            elements.menuOverlay.classList.add('hidden')
        );
    }
    
    // Menu tab navigation
    document.querySelectorAll('.menu-tab-link').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelector('.menu-tab-link.active')?.classList.remove('active');
            document.querySelector('.menu-tab.active')?.classList.remove('active');
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });
    
    // Phone icon click handler
    elements.phoneIcon.addEventListener('click', () => {
        elements.phoneModal.classList.remove('hidden');
        // This will be handled by the phone module
        window.dispatchEvent(new CustomEvent('openPhone'));
        gameState.notifications = 0;
        updateNotificationBadge();
    });
    
    // Close phone modal when clicking outside
    elements.phoneModal.addEventListener('click', (e) => {
        if (e.target === elements.phoneModal) elements.phoneModal.classList.add('hidden');
    });
}

// Main UI update function that will be called by the game loop
export function updateUI() {
    updateHeaderUI();
}