import { gameState, addMessage } from './main.js';
import { eventLibrary } from './events.js';
import { generateNpcReply } from './npc-logic.js';

const elements = {
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

let currentPhoneScreen = 'home';
let currentChat = null;

const appIcons = {
    messages: { name: 'Messages', icon: 'fa-comments' },
    settings: { name: 'Settings', icon: 'fa-gear' },
    appstore: { name: 'App Store', icon: 'fa-store' },
    chirper: { name: 'Chirper', icon: 'fa-dove' },
    rinkrater: { name: 'Rink Rater', icon: 'fa-fire' },
    calendar: { name: 'Calendar', icon: 'fa-calendar-days' },
};

const phoneTemplates = {
    home: () => `
        <div class="phone-app-view app-home-screen">
            <div class="app-content">
                <div class="app-grid">
                    ${gameState.phone.installedApps.map(appId => `
                        <div class="app-icon" data-app="${appId}">
                            <i class="fa-solid ${appIcons[appId].icon}"></i>
                            <span>${appIcons[appId].name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`,
    messages: () => `
        <div class="phone-app-view app-messages">
            <div class="app-header"><div class="back-button" data-app="home">&lt;</div><div class="header-title">Messages</div><div class="placeholder"></div></div>
            <div class="app-content contact-list">
                ${Object.entries(gameState.relationships).map(([id, data]) => `
                    <div class="contact-item" data-contact-id="${id}">
                        <div class="contact-avatar" style="background-color:${data.avatarColor};">${data.name.charAt(0)}</div>
                        <div>
                            <div class="contact-name">${data.name}</div>
                            <div class="contact-preview">${gameState.conversations[id].messages.slice(-1)[0].text}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`,
    chat: (contactId) => {
        const contact = gameState.relationships[contactId];
        const conversation = gameState.conversations[contactId];
        return `
        <div class="phone-app-view chat-view">
            <div class="app-header">
                <div class="back-button" data-app="messages">&lt;</div>
                <div class="header-title">${contact.name}</div>
                <div class="placeholder"></div>
            </div>
            <div class="app-content chat-messages">
                ${conversation.messages.map(msg => `<div class="chat-bubble ${msg.sender === 'player' ? 'sent' : 'received'}">${msg.text}</div>`).join('')}
            </div>
            <div class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Message...">
                <button id="send-chat-button"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>`;
    },
    settings: () => `
        <div class="phone-app-view">
            <div class="app-header"><div class="back-button" data-app="home">&lt;</div><div class="header-title">Settings</div><div class="placeholder"></div></div>
            <div class="app-content settings-list">
                <div class="settings-item" data-setting="theme"><span>Theme</span> <span class="setting-value">${gameState.phone.theme === 'dark' ? 'Dark' : 'Light'} &gt;</span></div>
                <div class="settings-item" data-setting="wallpaper"><span>Wallpaper</span> <span class="setting-value">&gt;</span></div>
            </div>
        </div>`,
    appstore: () => `
        <div class="phone-app-view">
            <div class="app-header"><div class="back-button" data-app="home">&lt;</div><div class="header-title">App Store</div><div class="placeholder"></div></div>
            <div class="app-content app-list">
                ${gameState.phone.appStore.available.map(appId => `
                    <div class="app-list-item">
                        <i class="fa-solid ${appIcons[appId].icon} app-list-icon"></i>
                        <div class="app-list-info">
                            <strong>${appIcons[appId].name}</strong>
                            <span>Productivity</span>
                        </div>
                        <button class="app-download-button" data-app-id="${appId}">GET</button>
                    </div>
                `).join('')}
                ${gameState.phone.installedApps.includes('calendar') ? `<div class="app-list-item"><i class="fa-solid fa-calendar-days app-list-icon"></i><div class="app-list-info"><strong>Calendar</strong><span>Productivity</span></div><button class="app-download-button installed">INSTALLED</button></div>` : ''}
            </div>
        </div>`,
    chirper: () => `
        <div class="phone-app-view">
            <div class="app-header"><div class="back-button" data-app="home">&lt;</div><div class="header-title">Chirper</div><div class="placeholder"></div></div>
            <div class="app-content social-feed">
                ${gameState.phone.social.posts.map(post => `
                    <div class="social-post">
                        <div class="post-avatar" style="background-color:${post.avatarColor};">${post.user.charAt(0)}</div>
                        <div class="post-content">
                            <div class="post-header"><strong>${post.user}</strong> <span class="post-handle">@${post.handle}</span></div>
                            <div class="post-text">${post.text}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`,
    rinkrater: () => {
        const { profiles, currentIndex } = gameState.phone.dating;
        const profile = profiles[currentIndex];
        return `
        <div class="phone-app-view dating-app">
            <div class="app-header"><div class="back-button" data-app="home">&lt;</div><div class="header-title">Rink Rater</div><div class="placeholder"></div></div>
            <div class="app-content">
                ${profile ? `
                <div class="dating-card">
                    <img src="${profile.img}" class="dating-img" />
                    <div class="dating-info">
                        <h3>${profile.name}</h3>
                        <p>${profile.bio}</p>
                    </div>
                </div>
                <div class="dating-controls">
                    <button class="swipe-button" data-swipe="left"><i class="fa-solid fa-xmark"></i></button>
                    <button class="swipe-button" data-swipe="right"><i class="fa-solid fa-heart"></i></button>
                </div>
                ` : `<div class="dating-card-empty"><p>No more profiles.</p></div>`}
            </div>
        </div>`;
    },
    calendar: () => `
        <div class="phone-app-view">
            <div class="app-header"><div class="back-button" data-app="home">&lt;</div><div class="header-title">Calendar</div><div class="placeholder"></div></div>
            <div class="app-content calendar-view">
                <h3>This Week</h3>
                ${gameState.phone.calendar.events.map(event => `
                    <div class="calendar-event">
                        <div class="event-time">${event.time}</div>
                        <div class="event-title">${event.title}</div>
                    </div>
                `).join('')}
            </div>
        </div>`,
};

function renderPhone() {
    let content = '';
    const screenTemplate = phoneTemplates[currentPhoneScreen];
    if (typeof screenTemplate === 'function') {
        content = screenTemplate(currentChat);
    } else {
        content = phoneTemplates.home();
    }

    elements.phoneScreen.innerHTML = content + `<div id="phone-home-button-area"><button id="phone-home-button"></button></div>`;
    
    // Apply theme and wallpaper
    elements.phoneContainer.className = 'phone-container'; // Reset
    elements.phoneContainer.classList.add(`${gameState.phone.theme}-theme`);
    elements.phoneScreen.classList.remove('wallpaper-default', 'wallpaper-1', 'wallpaper-2');
    elements.phoneScreen.classList.add(`wallpaper-${gameState.phone.wallpaper}`);

    addPhoneEventListeners();
    if (currentPhoneScreen === 'chat') {
        const chatMessages = elements.phoneScreen.querySelector('.chat-messages');
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function handleSendMessage() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim() || !currentChat) return;

    const messageText = input.value.trim();
    addMessage(currentChat, 'player', messageText);

    const npcReply = generateNpcReply(currentChat, messageText);
    renderPhone(); // Re-render immediately with player's message

    // Simulate NPC replying
    setTimeout(() => {
        addMessage(currentChat, 'received', npcReply);
        gameState.notifications++;
        updateNotificationBadge();
        if (currentPhoneScreen === 'chat') {
            renderPhone(); // Re-render again with NPC's reply
        }
    }, 2000 + Math.random() * 1500); // Wait 2-3.5 seconds
}

function addPhoneEventListeners() {
    const homeButtonArea = elements.phoneScreen.querySelector('#phone-home-button-area');
    if (homeButtonArea) {
        homeButtonArea.addEventListener('click', () => {
            currentPhoneScreen = 'home';
            renderPhone();
        });
    }

    elements.phoneScreen.querySelectorAll('.app-icon, .contact-item, .back-button').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            if (el.dataset.app) currentPhoneScreen = el.dataset.app;
            if (el.dataset.contactId) {
                currentPhoneScreen = 'chat';
                currentChat = el.dataset.contactId;
            }
            renderPhone();
        });
    });

    // Event Listeners for new apps
    elements.phoneScreen.querySelectorAll('.settings-item').forEach(item => {
        item.addEventListener('click', () => {
            const setting = item.dataset.setting;
            if (setting === 'theme') {
                gameState.phone.theme = gameState.phone.theme === 'dark' ? 'light' : 'dark';
            }
            if (setting === 'wallpaper') {
                const wallpapers = ['default', '1', '2'];
                const currentIndex = wallpapers.indexOf(gameState.phone.wallpaper);
                gameState.phone.wallpaper = wallpapers[(currentIndex + 1) % wallpapers.length];
            }
            renderPhone();
        });
    });

    elements.phoneScreen.querySelectorAll('.app-download-button:not(.installed)').forEach(button => {
        button.addEventListener('click', () => {
            const appId = button.dataset.appId;
            gameState.phone.installedApps.push(appId);
            gameState.phone.appStore.available = gameState.phone.appStore.available.filter(id => id !== appId);
            renderPhone();
        });
    });

    elements.phoneScreen.querySelectorAll('.swipe-button').forEach(button => {
        button.addEventListener('click', () => {
            gameState.phone.dating.currentIndex++;
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

// All other existing functions (updateHeaderUI, showEvent, initializeUIListeners, etc.)
// should remain here as they were in the previous steps. I'm omitting them for brevity,
// but they are still required.
// ...
// ...
// --- Function Stubs for brevity ---
function flashStat(element, newValue, oldValue) {
    if (newValue > oldValue) element.classList.add('stat-increase');
    else if (newValue < oldValue) element.classList.add('stat-decrease');
    setTimeout(() => element.classList.remove('stat-increase', 'stat-decrease'), 1500);
}
function updateHeaderUI() {
    const player = gameState.player;
    elements.playerName.textContent = player.name;
    const oldStatus = { energy: parseInt(elements.playerEnergy.textContent), gpa: parseFloat(elements.playerGpa.textContent), stress: parseInt(elements.playerStress.textContent), reputation: parseInt(elements.playerReputation.textContent) };
    elements.playerEnergy.textContent = player.status.energy;
    elements.playerGpa.textContent = player.status.gpa.toFixed(2);
    elements.playerStress.textContent = player.status.stress;
    elements.playerReputation.textContent = player.status.reputation;
    flashStat(elements.playerEnergy, player.status.energy, oldStatus.energy);
    flashStat(elements.playerGpa, player.status.gpa, oldStatus.gpa);
    flashStat(elements.playerStress, player.status.stress, oldStatus.stress);
    flashStat(elements.playerReputation, player.status.reputation, oldStatus.reputation);
    elements.gameDate.textContent = gameState.gameDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    updateNotificationBadge();
}
function updateDashboardUI() {
    const { attributes, seasonStats } = gameState.player;
    elements.playerAttributes.innerHTML = Object.entries(attributes).map(([key, value]) => `<div class="stat-item"><div class="label">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div><div class="value">${value}</div></div>`).join('');
    elements.playerSeasonStats.innerHTML = Object.entries(seasonStats).map(([key, value]) => `<div class="stat-item"><div class="label">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div><div class="value">${value}</div></div>`).join('');
    elements.relationshipsContent.innerHTML = Object.entries(gameState.relationships).map(([id, data]) => `<div class="relationship-item"><strong>${data.name}</strong><div class="relationship-bar"><div class="relationship-level" style="width: ${data.level}%;"></div></div></div>`).join('');
}
function updateNotificationBadge() {
    if (gameState.notifications > 0) {
        elements.notificationBadge.textContent = gameState.notifications;
        elements.notificationBadge.classList.remove('hidden');
        elements.notificationBadge.classList.add('badge-enter');
        setTimeout(() => elements.notificationBadge.classList.remove('badge-enter'), 300);
    } else {
        elements.notificationBadge.classList.add('hidden');
    }
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
            if (choice.nextEvent) showEvent(choice.nextEvent);
            else elements.eventModal.classList.add('hidden');
            updateUI();
        };
        elements.eventChoices.appendChild(button);
    });
}
export function initializeUIListeners() {
    document.getElementById('main-menu-button').addEventListener('click', () => { updateDashboardUI(); elements.menuOverlay.classList.remove('hidden'); });
    document.getElementById('close-menu-button').addEventListener('click', () => elements.menuOverlay.classList.add('hidden'));
    document.querySelectorAll('.menu-tab-link').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelector('.menu-tab-link.active')?.classList.remove('active');
            document.querySelector('.menu-tab.active')?.classList.remove('active');
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });
    elements.phoneIcon.addEventListener('click', () => {
        elements.phoneModal.classList.remove('hidden');
        currentPhoneScreen = 'home';
        renderPhone();
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