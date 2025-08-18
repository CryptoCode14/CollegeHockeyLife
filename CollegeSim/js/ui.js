import { gameState, addPlayerMessage } from './main.js';
import { eventLibrary } from './events.js';

const elements = {
    playerName: document.getElementById('player-name'),
    playerStress: document.getElementById('player-stress'),
    playerReputation: document.getElementById('player-reputation'),
    gameDate: document.getElementById('game-date'),
    menuOverlay: document.getElementById('menu-overlay'),
    eventModal: document.getElementById('event-modal'),
    eventTitle: document.getElementById('event-title'),
    eventText: document.getElementById('event-text'),
    eventChoices: document.getElementById('event-choices'),
    phoneModal: document.getElementById('phone-modal'),
    phoneScreen: document.getElementById('phone-screen'),
};

let currentPhoneScreen = 'home';
let currentChat = null;

const phoneTemplates = {
    home: `
        <div class="phone-app-view app-home-screen">
            <div class="app-header"><div class="header-title">Home</div></div>
            <div class="app-content">
                <div class="app-grid">
                    <div class="app-icon" data-app="messages"><i class="fa-solid fa-comments"></i><span>Messages</span></div>
                </div>
            </div>
        </div>`,
    messages: () => `
        <div class="phone-app-view app-messages">
            <div class="app-header"><div class="header-title">Messages</div></div>
            <div class="app-content contact-list">
                ${Object.entries(gameState.conversations).map(([id, data]) => `
                    <div class="contact-item" data-contact-id="${id}">
                        <div class="contact-avatar" style="background-color:${data.avatarColor};">${data.name.charAt(0)}</div>
                        <div>
                            <div class="contact-name">${data.name}</div>
                            <div class="contact-preview">${data.messages[data.messages.length - 1].text}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`,
    chat: (contactId) => {
        const contact = gameState.conversations[contactId];
        return `
        <div class="phone-app-view chat-view">
            <div class="app-header">
                <div class="back-button" data-app="messages">&lt;</div>
                <div class="header-title">${contact.name}</div>
                <div class="placeholder"></div>
            </div>
            <div class="app-content chat-messages">
                ${contact.messages.map(msg => `<div class="chat-bubble ${msg.sender === 'player' ? 'sent' : 'received'}">${msg.text}</div>`).join('')}
            </div>
            <div class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Message...">
                <button id="send-chat-button"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>`;
    }
};

function renderPhone() {
    let content = '';
    switch (currentPhoneScreen) {
        case 'home': content = phoneTemplates.home; break;
        case 'messages': content = phoneTemplates.messages(); break;
        case 'chat': content = phoneTemplates.chat(currentChat); break;
    }
    elements.phoneScreen.innerHTML = content + `<button id="phone-home-button"><i class="fa-solid fa-circle"></i></button>`;
    addPhoneEventListeners();
    if (currentPhoneScreen === 'chat') {
        const chatMessages = elements.phoneScreen.querySelector('.chat-messages');
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function handleSendMessage() {
    const input = document.getElementById('chat-input');
    if (input && input.value.trim()) {
        addPlayerMessage(currentChat, input.value.trim());
        renderPhone();
    }
}

function addPhoneEventListeners() {
    const homeButton = elements.phoneScreen.querySelector('#phone-home-button');
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            currentPhoneScreen = 'home';
            renderPhone();
        });
    }

    elements.phoneScreen.querySelectorAll('.app-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            currentPhoneScreen = icon.dataset.app;
            renderPhone();
        });
    });

    elements.phoneScreen.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('click', () => {
            currentPhoneScreen = 'chat';
            currentChat = item.dataset.contactId;
            renderPhone();
        });
    });

    elements.phoneScreen.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', () => {
            currentPhoneScreen = button.dataset.app;
            renderPhone();
        });
    });
    
    const sendButton = document.getElementById('send-chat-button');
    if (sendButton) sendButton.addEventListener('click', handleSendMessage);
    
    const chatInput = document.getElementById('chat-input');
    if (chatInput) chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });
}

export function updateHeaderUI() {
    elements.playerName.textContent = gameState.player.name;
    elements.playerStress.textContent = gameState.player.status.stress;
    elements.playerReputation.textContent = gameState.player.status.reputation;
    elements.gameDate.textContent = gameState.gameDate.toLocaleDateString();
}

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
            elements.eventModal.classList.add('hidden');
            updateHeaderUI();
        };
        elements.eventChoices.appendChild(button);
    });
}

export function initializeUIListeners() {
    document.getElementById('main-menu-button').addEventListener('click', () => elements.menuOverlay.classList.remove('hidden'));
    document.getElementById('close-menu-button').addEventListener('click', () => elements.menuOverlay.classList.add('hidden'));

    document.querySelectorAll('.menu-tab-link').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelector('.menu-tab-link.active')?.classList.remove('active');
            document.querySelector('.menu-tab.active')?.classList.remove('active');
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    document.getElementById('phone-icon').addEventListener('click', () => {
        elements.phoneModal.classList.remove('hidden');
        currentPhoneScreen = 'home';
        renderPhone();
    });

    elements.phoneModal.addEventListener('click', (e) => {
        if (e.target === elements.phoneModal) elements.phoneModal.classList.add('hidden');
    });
}