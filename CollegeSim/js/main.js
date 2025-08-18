import { initializeMap } from './map.js';
import { updateHeaderUI, initializeUIListeners, showEvent } from './ui.js';

export let gameState = {
    player: {
        name: "Alex Johnson",
        position: "Forward",
        attributes: { skating: 65, shooting: 70, puckHandling: 68 },
        status: { stress: 10, reputation: 50 },
    },
    gameDate: new Date('2025-08-18T16:29:24'),
    notifications: 0,
    mapInitialized: false,
    conversations: {
        coach: { name: "Coach Davis", avatarColor: "#34495e", messages: [ { sender: "coach", text: "Welcome to Penn State. See you at camp." }, { sender: "player", text: "Thanks Coach! Looking forward to it." } ] },
        mom: { name: "Mom", avatarColor: "#e74c3c", messages: [ { sender: "mom", text: "Did you finish unpacking? Don't forget to eat!" } ] }
    }
};

export function addPlayerMessage(contactId, messageText) {
    if (!gameState.conversations[contactId] || !messageText) return;
    gameState.conversations[contactId].messages.push({
        sender: 'player',
        text: messageText
    });
}

function initializeGame() {
    updateHeaderUI();
    initializeUIListeners();
    initializeMap(gameState);
    showEvent('event_welcome');
}

document.addEventListener('DOMContentLoaded', initializeGame);