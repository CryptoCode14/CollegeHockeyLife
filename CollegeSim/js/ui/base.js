// js/ui/base.js
import { gameState } from '../main.js';

// Common UI elements used across multiple modules
export const elements = {
    // Header
    playerName: document.getElementById('player-name'),
    playerEnergy: document.getElementById('player-energy'),
    playerGpa: document.getElementById('player-gpa'),
    playerStress: document.getElementById('player-stress'),
    playerReputation: document.getElementById('player-reputation'),
    gameDate: document.getElementById('game-date'),
    
    // Menu
    menuOverlay: document.getElementById('menu-overlay'),
    playerAttributes: document.getElementById('player-attributes'),
    playerSeasonStats: document.getElementById('player-season-stats'),
    relationshipsContent: document.getElementById('relationships-content'),

    // Event Modal
    eventModal: document.getElementById('event-modal'),
    eventTitle: document.getElementById('event-title'),
    eventText: document.getElementById('event-text'),
    eventChoices: document.getElementById('event-choices'),

    // Phone
    phoneIcon: document.getElementById('phone-icon'),
    notificationBadge: document.getElementById('notification-badge'),
    phoneModal: document.getElementById('phone-modal'),
    phoneContainer: document.getElementById('phone-container'),
    phoneScreen: document.getElementById('phone-screen'),
};

// Utility functions
export function flashStat(element, newValue, oldValue) {
    if (newValue > oldValue) element.classList.add('stat-increase');
    else if (newValue < oldValue) element.classList.add('stat-decrease');
    setTimeout(() => element.classList.remove('stat-increase', 'stat-decrease'), 1500);
}

export function updateNotificationBadge() {
    if (gameState.notifications > 0) {
        elements.notificationBadge.textContent = gameState.notifications;
        elements.notificationBadge.classList.remove('hidden');
        elements.notificationBadge.classList.add('badge-enter');
        setTimeout(() => elements.notificationBadge.classList.remove('badge-enter'), 300);
    } else {
        elements.notificationBadge.classList.add('hidden');
    }
}