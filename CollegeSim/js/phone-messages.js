import { gameState } from './main.js';

export function renderMessages() {
    // Threaded convos (example for all contacts)
    return Object.entries(gameState.conversations).map(([id, conv]) => {
        return conv.messages.map(m => `<div>${m.sender}: ${m.text}</div>`).join('');
    }).join('');
    // Integrate with events: If low GPA, prof message
    if (gameState.player.status.gpa < 2.5) {
        addMessage('professor_miller', 'professor_miller', 'Your grades are low. See me.');
    }
}