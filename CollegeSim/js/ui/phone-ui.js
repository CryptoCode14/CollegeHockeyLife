// js/ui/phone-ui.js
import { gameState, addMessage } from '../main.js';
import { elements } from './base.js';
import { generateNpcReply } from '../npc-logic.js';

// Track current phone state
let currentPhoneScreen = 'home';
let currentChat = null;

// App icon definitions
export const appIcons = {
    messages: { name: 'Messages', icon: 'fa-comments' },
    settings: { name: 'Settings', icon: 'fa-gear' },
    appstore: { name: 'App Store', icon: 'fa-store' },
    chirper: { name: 'Chirper', icon: 'fa-dove' },
    rinkrater: { name: 'Rink Rater', icon: 'fa-fire' },
    calendar: { name: 'Calendar', icon: 'fa-calendar-days' },
    camera: { name: 'Camera', icon: 'fa-camera' },
    notes: { name: 'Notes', icon: 'fa-note-sticky' },
    maps: { name: 'Maps', icon: 'fa-map-location-dot' },
    weather: { name: 'Weather', icon: 'fa-cloud-sun' },
    fitness: { name: 'Fitness', icon: 'fa-dumbbell' },
};

// Initialize phone UI
export function initializePhoneUI() {
    // Listen for the openPhone event from the main UI
    window.addEventListener('openPhone', () => {
        currentPhoneScreen = 'home';
        renderPhone();
    });
}

// Phone screen templates
const phoneTemplates = {
    // Home screen with app grid
    home: () => `
        <div class="phone-app-view app-home-screen">
            <div class="app-content">
                <div class="phone-status-bar">
                    <div class="status-time">${new Date().toLocaleTimeString('en-US', {hour: 'numeric', minute:'2-digit'})}</div>
                    <div class="status-icons">
                        <i class="fa-solid fa-signal"></i>
                        <i class="fa-solid fa-wifi"></i>
                        <i class="fa-solid fa-battery-three-quarters"></i>
                    </div>
                </div>
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

    // Messages app with contact list
    messages: () => `
        <div class="phone-app-view app-messages">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Messages</div>
                <div class="header-action"><i class="fa-solid fa-pen-to-square"></i></div>
            </div>
            <div class="app-content contact-list">
                ${Object.entries(gameState.relationships).map(([id, data]) => {
                    const lastMessage = gameState.conversations[id].messages.slice(-1)[0];
                    const timestamp = lastMessage.timestamp ? formatMessageTime(lastMessage.timestamp) : '';
                    return `
                    <div class="contact-item" data-contact-id="${id}">
                        <div class="contact-avatar" style="background-color:${data.avatarColor};">${data.name.charAt(0)}</div>
                        <div class="contact-info">
                            <div class="contact-name">${data.name}</div>
                            <div class="contact-preview">${lastMessage.text}</div>
                        </div>
                        <div class="message-time">${timestamp}</div>
                    </div>
                `}).join('')}
            </div>
        </div>`,

    // Individual chat view
    chat: (contactId) => {
        const contact = gameState.relationships[contactId];
        const conversation = gameState.conversations[contactId];
        return `
        <div class="phone-app-view chat-view">
            <div class="app-header">
                <div class="back-button" data-app="messages">&lt;</div>
                <div class="header-title">${contact.name}</div>
                <div class="header-action"><i class="fa-solid fa-info-circle"></i></div>
            </div>
            <div class="app-content chat-messages">
                ${conversation.messages.map(msg => {
                    const timestamp = msg.timestamp ? formatMessageTime(msg.timestamp) : '';
                    return `
                    <div class="chat-bubble-container ${msg.sender === 'player' ? 'sent' : 'received'}">
                        <div class="chat-bubble ${msg.sender === 'player' ? 'sent' : 'received'}">
                            ${msg.text}
                            <div class="message-timestamp">${timestamp}</div>
                        </div>
                    </div>`;
                }).join('')}
            </div>
            <div class="chat-input-area">
                <button class="chat-emoji-button"><i class="fa-regular fa-face-smile"></i></button>
                <input type="text" id="chat-input" placeholder="Message...">
                <button id="send-chat-button"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>`;
    },

    // Settings app
    settings: () => `
        <div class="phone-app-view">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Settings</div>
                <div class="placeholder"></div>
            </div>
            <div class="app-content settings-list">
                <div class="settings-item" data-setting="theme">
                    <span>Theme</span> 
                    <span class="setting-value">${gameState.phone.theme === 'dark' ? 'Dark' : 'Light'} &gt;</span>
                </div>
                <div class="settings-item" data-setting="wallpaper">
                    <span>Wallpaper</span> 
                    <span class="setting-value">&gt;</span>
                </div>
                <div class="settings-item" data-setting="notifications">
                    <span>Notifications</span> 
                    <span class="setting-value">On &gt;</span>
                </div>
                <div class="settings-item" data-setting="about">
                    <span>About</span> 
                    <span class="setting-value">&gt;</span>
                </div>
            </div>
        </div>`,

    // App Store
    appstore: () => `
        <div class="phone-app-view">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">App Store</div>
                <div class="placeholder"></div>
            </div>
            <div class="app-content app-list">
                <div class="app-store-featured">
                    <h3>Featured Apps</h3>
                </div>
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
                ${gameState.phone.installedApps.filter(app => ['calendar', 'camera', 'notes', 'maps', 'weather', 'fitness'].includes(app)).map(appId => `
                    <div class="app-list-item">
                        <i class="fa-solid ${appIcons[appId].icon} app-list-icon"></i>
                        <div class="app-list-info">
                            <strong>${appIcons[appId].name}</strong>
                            <span>Productivity</span>
                        </div>
                        <button class="app-download-button installed">INSTALLED</button>
                    </div>
                `).join('')}
            </div>
        </div>`,

    // Social media app (Chirper)
    chirper: () => `
        <div class="phone-app-view">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Chirper</div>
                <div class="header-action"><i class="fa-solid fa-feather"></i></div>
            </div>
            <div class="app-content social-feed">
                <div class="chirper-tabs">
                    <div class="chirper-tab active">For You</div>
                    <div class="chirper-tab">Following</div>
                    <div class="chirper-tab">Hockey</div>
                </div>
                ${gameState.phone.social.posts.map(post => `
                    <div class="social-post">
                        <div class="post-avatar" style="background-color:${post.avatarColor};">${post.user.charAt(0)}</div>
                        <div class="post-content">
                            <div class="post-header">
                                <strong>${post.user}</strong> 
                                <span class="post-handle">@${post.handle}</span>
                                <span class="post-time">${post.time || '2h'}</span>
                            </div>
                            <div class="post-text">${post.text}</div>
                            <div class="post-actions">
                                <span class="post-action"><i class="fa-regular fa-comment"></i> ${post.comments || 0}</span>
                                <span class="post-action"><i class="fa-solid fa-retweet"></i> ${post.retweets || 0}</span>
                                <span class="post-action"><i class="fa-regular fa-heart"></i> ${post.likes || 0}</span>
                                <span class="post-action"><i class="fa-solid fa-share-nodes"></i></span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`,

    // Dating app (Rink Rater)
    rinkrater: () => {
        const { profiles, currentIndex } = gameState.phone.dating;
        const profile = profiles[currentIndex];
        return `
        <div class="phone-app-view dating-app">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Rink Rater</div>
                <div class="header-action"><i class="fa-solid fa-sliders"></i></div>
            </div>
            <div class="app-content">
                ${profile ? `
                <div class="dating-card">
                    <img src="${profile.img}" class="dating-img" alt="${profile.name}" />
                    <div class="dating-info">
                        <h3>${profile.name}</h3>
                        <p>${profile.bio}</p>
                        <div class="profile-details">
                            <span><i class="fa-solid fa-graduation-cap"></i> ${profile.school || 'Penn State'}</span>
                            <span><i class="fa-solid fa-location-dot"></i> ${profile.distance || '1 mile away'}</span>
                        </div>
                    </div>
                </div>
                <div class="dating-controls">
                    <button class="swipe-button" data-swipe="left"><i class="fa-solid fa-xmark"></i></button>
                    <button class="swipe-button" data-swipe="right"><i class="fa-solid fa-heart"></i></button>
                </div>
                ` : `
                <div class="dating-card-empty">
                    <i class="fa-solid fa-face-frown"></i>
                    <p>No more profiles in your area</p>
                    <button class="refresh-profiles-button">Refresh</button>
                </div>`}
                ${gameState.phone.dating.matches.length > 0 ? `
                <div class="dating-matches">
                    <h3>Your Matches</h3>
                    <div class="matches-grid">
                        ${gameState.phone.dating.matches.map(match => `
                            <div class="match-item" data-match-id="${match.id}">
                                <div class="match-avatar" style="background-image: url('${match.img}')"></div>
                                <div class="match-name">${match.name.split(',')[0]}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>` : ''}
            </div>
        </div>`;
    },

    // Calendar app
    calendar: () => {
        const today = new Date(gameState.gameDate);
        const dayOfWeek = today.getDay();
        const month = today.getMonth();
        const date = today.getDate();
        
        // Generate calendar grid
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        
        // Get events for today
        const todayStr = today.toISOString().split('T')[0];
        const todayEvents = gameState.phone.calendar.events.filter(event => event.date === todayStr);
        
        return `
        <div class="phone-app-view">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Calendar</div>
                <div class="header-action"><i class="fa-solid fa-plus"></i></div>
            </div>
            <div class="app-content calendar-view">
                <div class="calendar-header">
                    <h3>${monthNames[month]} ${today.getFullYear()}</h3>
                </div>
                <div class="calendar-days">
                    ${daysOfWeek.map(day => `<div class="day-name">${day}</div>`).join('')}
                    ${Array.from({length: 7}, (_, i) => {
                        const dayDate = new Date(today);
                        dayDate.setDate(date - dayOfWeek + i);
                        const isToday = dayDate.getDate() === date;
                        const hasEvents = gameState.phone.calendar.events.some(
                            event => event.date === dayDate.toISOString().split('T')[0]
                        );
                        return `
                            <div class="calendar-day ${isToday ? 'today' : ''} ${hasEvents ? 'has-events' : ''}">
                                ${dayDate.getDate()}
                            </div>`;
                    }).join('')}
                </div>
                
                <div class="today-events">
                    <h3>Today's Schedule</h3>
                    ${todayEvents.length > 0 ? todayEvents.map(event => `
                        <div class="calendar-event">
                            <div class="event-time">${event.time}</div>
                            <div class="event-details">
                                <div class="event-title">${event.title}</div>
                                <div class="event-location">${event.location || ''}</div>
                            </div>
                        </div>
                    `).join('') : '<div class="no-events">No events scheduled</div>'}
                </div>
            </div>
        </div>`;
    },
    
    // Camera app
    camera: () => `
        <div class="phone-app-view camera-app">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Camera</div>
                <div class="placeholder"></div>
            </div>
            <div class="app-content">
                <div class="camera-viewfinder">
                    <div class="camera-overlay">
                        <div class="camera-focus-box"></div>
                    </div>
                </div>
                <div class="camera-controls">
                    <button class="camera-mode-button"><i class="fa-solid fa-camera-rotate"></i></button>
                    <button class="camera-shutter-button"></button>
                    <button class="camera-gallery-button"><i class="fa-solid fa-images"></i></button>
                </div>
            </div>
        </div>`,
        
    // Notes app
    notes: () => `
        <div class="phone-app-view">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Notes</div>
                <div class="header-action"><i class="fa-solid fa-plus"></i></div>
            </div>
            <div class="app-content notes-list">
                <div class="notes-search">
                    <input type="text" placeholder="Search" />
                </div>
                ${(gameState.phone.notes || []).map((note, index) => `
                    <div class="note-item" data-note-id="${index}">
                        <div class="note-title">${note.title}</div>
                        <div class="note-preview">${note.content.substring(0, 40)}${note.content.length > 40 ? '...' : ''}</div>
                        <div class="note-date">${formatNoteDate(note.date)}</div>
                    </div>
                `).join('') || `
                    <div class="empty-notes">
                        <i class="fa-regular fa-note-sticky"></i>
                        <p>No Notes</p>
                        <p>Tap + to create a new note</p>
                    </div>
                `}
            </div>
        </div>`,
        
    // Maps app
    maps: () => `
        <div class="phone-app-view maps-app">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Maps</div>
                <div class="placeholder"></div>
            </div>
            <div class="app-content">
                <div class="maps-search-bar">
                    <input type="text" placeholder="Search for places" />
                </div>
                <div class="maps-view">
                    <div class="maps-placeholder">
                        <i class="fa-solid fa-map-location-dot"></i>
                        <p>Campus Map</p>
                    </div>
                </div>
                <div class="maps-locations">
                    <div class="location-item" data-location="pegula">
                        <i class="fa-solid fa-hockey-puck"></i>
                        <span>Pegula Ice Arena</span>
                    </div>
                    <div class="location-item" data-location="library">
                        <i class="fa-solid fa-book"></i>
                        <span>Pattee Library</span>
                    </div>
                    <div class="location-item" data-location="dorm">
                        <i class="fa-solid fa-bed"></i>
                        <span>East Halls</span>
                    </div>
                </div>
            </div>
        </div>`,
        
    // Weather app
    weather: () => `
        <div class="phone-app-view weather-app">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Weather</div>
                <div class="placeholder"></div>
            </div>
            <div class="app-content">
                <div class="weather-location">State College, PA</div>
                <div class="current-weather">
                    <div class="weather-icon">
                        <i class="fa-solid fa-sun"></i>
                    </div>
                    <div class="weather-temp">28°</div>
                    <div class="weather-desc">Sunny</div>
                </div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <span>Feels like</span>
                        <span>26°</span>
                    </div>
                    <div class="weather-detail">
                        <span>Humidity</span>
                        <span>45%</span>
                    </div>
                    <div class="weather-detail">
                        <span>Wind</span>
                        <span>8 mph</span>
                    </div>
                </div>
                <div class="weather-forecast">
                    <h3>5-Day Forecast</h3>
                    <div class="forecast-days">
                        <div class="forecast-day">
                            <div>Mon</div>
                            <i class="fa-solid fa-sun"></i>
                            <div>30°</div>
                        </div>
                        <div class="forecast-day">
                            <div>Tue</div>
                            <i class="fa-solid fa-cloud-sun"></i>
                            <div>28°</div>
                        </div>
                        <div class="forecast-day">
                            <div>Wed</div>
                            <i class="fa-solid fa-cloud"></i>
                            <div>25°</div>
                        </div>
                        <div class="forecast-day">
                            <div>Thu</div>
                            <i class="fa-solid fa-cloud-rain"></i>
                            <div>22°</div>
                        </div>
                        <div class="forecast-day">
                            <div>Fri</div>
                            <i class="fa-solid fa-snowflake"></i>
                            <div>20°</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
        
    // Fitness app
    fitness: () => `
        <div class="phone-app-view fitness-app">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Fitness</div>
                <div class="header-action"><i class="fa-solid fa-plus"></i></div>
            </div>
            <div class="app-content">
                <div class="fitness-summary">
                    <div class="fitness-rings">
                        <svg width="120" height="120" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="50" fill="none" stroke="#333" stroke-width="10" />
                            <circle cx="60" cy="60" r="50" fill="none" stroke="#ff5733" stroke-width="10" 
                                    stroke-dasharray="314" stroke-dashoffset="78" />
                        </svg>
                        <div class="fitness-stats">
                            <div>75%</div>
                            <div>Daily Goal</div>
                        </div>
                    </div>
                    <div class="fitness-metrics">
                        <div class="fitness-metric">
                            <i class="fa-solid fa-person-walking"></i>
                            <div>
                                <div class="metric-value">7,245</div>
                                <div class="metric-label">Steps</div>
                            </div>
                        </div>
                        <div class="fitness-metric">
                            <i class="fa-solid fa-fire"></i>
                            <div>
                                <div class="metric-value">320</div>
                                <div class="metric-label">Calories</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="fitness-workouts">
                    <h3>Recent Workouts</h3>
                    <div class="workout-item">
                        <div class="workout-icon"><i class="fa-solid fa-hockey-puck"></i></div>
                        <div class="workout-details">
                            <div class="workout-title">Hockey Practice</div>
                            <div class="workout-stats">90 min · 650 cal</div>
                        </div>
                        <div class="workout-time">Today</div>
                    </div>
                    <div class="workout-item">
                        <div class="workout-icon"><i class="fa-solid fa-dumbbell"></i></div>
                        <div class="workout-details">
                            <div class="workout-title">Weight Training</div>
                            <div class="workout-stats">45 min · 320 cal</div>
                        </div>
                        <div class="workout-time">Yesterday</div>
                    </div>
                </div>
            </div>
        </div>`,
};

// Helper function to format message timestamps
function formatMessageTime(timestamp) {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return date.toLocaleTimeString('en-US', {hour: 'numeric', minute:'2-digit'});
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return date.toLocaleDateString('en-US', {weekday: 'short'});
    } else {
        return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
    }
}

// Helper function to format note dates
function formatNoteDate(timestamp) {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
    }
}

// Render the phone UI based on current screen
export function renderPhone() {
    let content = '';
    const screenTemplate = phoneTemplates[currentPhoneScreen];
    
    if (typeof screenTemplate === 'function') {
        content = screenTemplate(currentChat);
    } else {
        content = phoneTemplates.home();
    }

    elements.phoneScreen.innerHTML = content + `<div id="phone-home-button-area"><button id="phone-home-button"></button></div>`;
    
    // Apply theme and wallpaper
    elements.phoneContainer.className = ''; // Reset
    elements.phoneContainer.classList.add('phone-container', `${gameState.phone.theme}-theme`);
    elements.phoneScreen.classList.remove('wallpaper-default', 'wallpaper-1', 'wallpaper-2');
    elements.phoneScreen.classList.add(`wallpaper-${gameState.phone.wallpaper}`);

    addPhoneEventListeners();
    
    // Scroll to bottom of chat if in chat view
    if (currentPhoneScreen === 'chat') {
        const chatMessages = elements.phoneScreen.querySelector('.chat-messages');
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Handle sending a message in chat
function handleSendMessage() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim() || !currentChat) return;

    const messageText = input.value.trim();
    input.value = ''; // Clear input field
    
    // Add player's message with timestamp
    addMessage(currentChat, 'player', messageText, new Date());
    renderPhone(); // Re-render immediately with player's message

    // Generate and add NPC reply with a delay
    setTimeout(() => {
        const npcReply = generateNpcReply(currentChat, messageText);
        addMessage(currentChat, currentChat, npcReply, new Date());
        gameState.notifications++;
        
        // Update UI if chat is still open
        if (currentPhoneScreen === 'chat' && currentChat) {
            renderPhone();
        }
    }, 1500 + Math.random() * 1500); // Random delay between 1.5-3 seconds
}

// Add event listeners to phone UI elements
function addPhoneEventListeners() {
    // Home button
    const homeButtonArea = elements.phoneScreen.querySelector('#phone-home-button-area');
    if (homeButtonArea) {
        homeButtonArea.addEventListener('click', () => {
            currentPhoneScreen = 'home';
            renderPhone();
        });
    }

    // App icons and back buttons
    elements.phoneScreen.querySelectorAll('.app-icon, .back-button').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            if (el.dataset.app) {
                currentPhoneScreen = el.dataset.app;
                currentChat = null; // Reset current chat when changing screens
                renderPhone();
            }
        });
    });
    
    // Contact items in messages app
    elements.phoneScreen.querySelectorAll('.contact-item').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            if (el.dataset.contactId) {
                currentPhoneScreen = 'chat';
                currentChat = el.dataset.contactId;
                renderPhone();
            }
        });
    });

    // Settings items
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

    // App Store download buttons
    elements.phoneScreen.querySelectorAll('.app-download-button:not(.installed)').forEach(button => {
        button.addEventListener('click', () => {
            const appId = button.dataset.appId;
            if (appId && !gameState.phone.installedApps.includes(appId)) {
                gameState.phone.installedApps.push(appId);
                gameState.phone.appStore.available = gameState.phone.appStore.available.filter(id => id !== appId);
                renderPhone();
            }
        });
    });

    // Dating app swipe buttons
    elements.phoneScreen.querySelectorAll('.swipe-button').forEach(button => {
        button.addEventListener('click', () => {
            const swipeDirection = button.dataset.swipe;
            const currentProfile = gameState.phone.dating.profiles[gameState.phone.dating.currentIndex];
            
            // If swiping right, add to matches with 50% chance
            if (swipeDirection === 'right' && Math.random() > 0.5 && currentProfile) {
                if (!gameState.phone.dating.matches.some(match => match.id === currentProfile.id)) {
                    gameState.phone.dating.matches.push({
                        ...currentProfile,
                        id: `match_${Date.now()}`
                    });
                    gameState.notifications++;
                }
            }
            
            // Move to next profile
            gameState.phone.dating.currentIndex++;
            renderPhone();
        });
    });
    
    // Refresh dating profiles button
    const refreshButton = elements.phoneScreen.querySelector('.refresh-profiles-button');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            gameState.phone.dating.currentIndex = 0;
            renderPhone();
        });
    }
    
    // Chat send button
    const sendButton = document.getElementById('send-chat-button');
    if (sendButton) {
        sendButton.addEventListener('click', handleSendMessage);
    }
    
    // Chat input enter key
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendMessage();
        });
        chatInput.focus(); // Auto-focus the input field
    }
    
    // Maps location items
    elements.phoneScreen.querySelectorAll('.location-item').forEach(item => {
        item.addEventListener('click', () => {
            // In a real implementation, this would show the location on the map
            const locationId = item.dataset.location;
            console.log(`Showing location: ${locationId}`);
            // For now, just highlight the selected item
            elements.phoneScreen.querySelectorAll('.location-item').forEach(el => {
                el.classList.remove('selected');
            });
            item.classList.add('selected');
        });
    });
}