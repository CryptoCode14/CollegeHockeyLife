// js/ui/game-ui.js
import { gameState } from '../main.js';
import { elements, flashStat, updateNotificationBadge } from './base.js';
import { eventLibrary } from '../events.js';

// Header UI functions
export function updateHeaderUI() {
    const player = gameState.player;
    elements.playerName.textContent = player.name;
    
    const oldStatus = { 
        energy: parseInt(elements.playerEnergy.textContent) || player.status.energy, 
        gpa: parseFloat(elements.playerGpa.textContent) || player.status.gpa, 
        stress: parseInt(elements.playerStress.textContent) || player.status.stress, 
        reputation: parseInt(elements.playerReputation.textContent) || player.status.reputation
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
    
    elements.playerAttributes.innerHTML = Object.entries(attributes)
        .map(([key, value]) => `
            <div class="stat-item readable-text">
                <div class="label">${formatAttributeName(key)}</div>
                <div class="value">${value}</div>
            </div>
        `).join('');
    
    elements.playerSeasonStats.innerHTML = Object.entries(seasonStats)
        .map(([key, value]) => `
            <div class="stat-item readable-text">
                <div class="label">${formatAttributeName(key)}</div>
                <div class="value">${value}</div>
            </div>
        `).join('');
    
    elements.relationshipsContent.innerHTML = Object.entries(gameState.relationships)
        .map(([id, data]) => `
            <div class="relationship-item readable-text">
                <strong>${data.name}</strong>
                <div class="relationship-bar">
                    <div class="relationship-level" style="width: ${data.level}%;"></div>
                </div>
            </div>
        `).join('');
}

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
    elements.eventModal.classList.add('liquid-glass'); // Apply glass style
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

// Initialize UI event listeners
export function initializeUIListeners() {
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
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.menu-tab-link.active')?.classList.remove('active');
            document.querySelector('.menu-tab.active')?.classList.remove('active');
            tab.classList.add('active');
            const targetTab = document.getElementById(tab.dataset.tab);
            if(targetTab) targetTab.classList.add('active');
        });
    });
    
    elements.phoneIcon.addEventListener('click', () => {
        elements.phoneModal.classList.remove('hidden');
        window.dispatchEvent(new CustomEvent('openPhone'));
        gameState.notifications = 0;
        updateNotificationBadge();
    });
    
    elements.phoneModal.addEventListener('click', (e) => {
        if (e.target === elements.phoneModal) elements.phoneModal.classList.add('hidden');
    });
}

export function updateUI() {
    updateHeaderUI();
}
