// js/ui/index.js - Main UI module that exports all UI functions

// Import from UI modules
import { elements, updateNotificationBadge } from './base.js';
import { 
    updateHeaderUI, 
    updateDashboardUI, 
    showEvent, 
    initializeUIListeners, 
    updateUI 
} from './game-ui.js';
import { 
    initializePhoneUI, 
    renderPhone 
} from './phone-ui.js';

// Initialize all UI components
export function initializeAllUI() {
    initializeUIListeners();
    initializePhoneUI();
}

// Re-export functions needed by other modules
export {
    elements,
    updateNotificationBadge,
    updateHeaderUI,
    updateDashboardUI,
    showEvent,
    initializeUIListeners,
    updateUI,
    renderPhone
};